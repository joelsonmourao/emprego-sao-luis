#!/usr/bin/env node
/**
 * Auditoria de conteúdo e UX PUBLICAMENTE ACESSÍVEIS.
 * Nunca acessa o painel, a DB, endpoints privados nem altera páginas.
 * Critérios são heurísticas editoriais, não uma pontuação do Google.
 */
import { mkdir, writeFile, appendFile } from "node:fs/promises";
import { dirname } from "node:path";

const ORIGIN = "https://empregossaoluis.com.br";
const MAX_PAGES = 320;
const FETCH_TIMEOUT_MS = 15000;
const REPORT = process.env.AUDIT_REPORT || "audit-results/adsense-public-audit.json";
const REPORT_MD = process.env.AUDIT_REPORT_MD || "audit-results/adsense-public-audit.md";
const offsite = (u) => {
  try { return new URL(u, ORIGIN).origin !== ORIGIN; } catch { return false; }
};
const permitted = (u) => {
  try { const url = new URL(u); return url.origin === ORIGIN && !/^\/(admin|api|empresa|entrar|acesso|minha-conta)(\/|$)/.test(url.pathname); }
  catch { return false; }
};
const decode = (v) => v
  .replace(/&nbsp;|&#160;/gi, " ")
  .replace(/&amp;/gi,"&").replace(/&lt;/gi,"<").replace(/&gt;/gi,">")
  .replace(/&quot;/gi,'"').replace(/&#39;|&#x27;/gi,"'")
  .replace(/&#(\d+);/g,(_,x)=>String.fromCodePoint(Number(x)))
  .replace(/&#x([0-9a-f]+);/gi,(_,x)=>String.fromCodePoint(parseInt(x,16)));
const textOnly = (html) => decode(html.replace(/<(script|style|nav|footer|header)\b[^>]*>[\s\S]*?<\/\1>/gi," ")
  .replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim());
const normalize = (v) => v.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\s+/g," ").trim();
const uniq = (items) => [...new Set(items)];
const extractAll = (raw,re) => [...raw.matchAll(re)].map((m)=>decode(m[1]?.trim()||"")).filter(Boolean);
async function fetchPage(url) {
  let error;
  for(let attempt=0;attempt<2;attempt++){
    try {
      const response=await fetch(url,{signal:AbortSignal.timeout(FETCH_TIMEOUT_MS),redirect:"follow",headers:{"User-Agent":"EmpregosSaoLuis-PublicQualityAudit/1.0"}});
      const contentType=response.headers.get("content-type")||"";
      const body=await response.text();
      return {url,status:response.status,finalUrl:response.url,contentType,body,headers:{
        cacheControl:response.headers.get("cache-control"),
        xRobots:response.headers.get("x-robots-tag"),
        contentLength:response.headers.get("content-length")
      }};
    }catch(e){error=e instanceof Error?e.message:String(e);}
  }
  return {url,status:0,error};
}
async function crawlSitemap(){
  const seen=new Set(), queue=[ORIGIN+"/sitemap.xml"], pages=new Set([ORIGIN+"/"]);
  const sitemapResults=[];
  while(queue.length && seen.size<20){
    const url=queue.shift();
    if(!permitted(url)||seen.has(url))continue;seen.add(url);
    const item=await fetchPage(url);
    sitemapResults.push({url,status:item.status,error:item.error});
    if(item.status!==200||!(item.body||"").includes("<loc>"))continue;
    const locs=extractAll(item.body,/<loc>\s*([^<]+)\s*<\/loc>/gi);
    for(const loc of locs){
      if(!permitted(loc))continue;
      if(/\.xml(?:$|\?)/.test(loc))queue.push(loc);
      else pages.add(loc.split("#")[0]);
    }
  }
  // O sitemap pode omitir artigos em revisão que ainda são acessíveis ao usuário.
  // Também inventariar o índice editorial paginado sem presumir que o sitemap é exaustivo.
  const collectionPages=[...Array.from({length:12},(_,n)=>ORIGIN+"/blog"+(n?"?pagina="+(n+1):"")),
    ...Array.from({length:3},(_,n)=>ORIGIN+"/noticias"+(n?"?pagina="+(n+1):""))];
  for(const indexUrl of collectionPages){
    const res=await fetchPage(indexUrl);
    if(res.status!==200)continue;
    const matches=[...(res.body||"").matchAll(/href="(\\/(?:blog|noticias)\\/[a-z0-9-_]+)(?:[?#][^"]*)?"/gi)];
    for(const m of matches)pages.add(ORIGIN+m[1]);
  }
  return {pages:[...pages].slice(0,MAX_PAGES),sitemaps:sitemapResults};
}
function auditHtml(page){
  const raw=page.body||"";
  const url=new URL(page.url);
  const article=/<article\b[^>]*>([\s\S]*?)<\/article>/i.exec(raw)?.[1]||"";
  const contentBlock=/<div\b[^>]*class="[^"]*es-prose[^"]*"[^>]*>([\s\S]*?)<\/div>/i.exec(article)?.[1]||article;
  const prose=textOnly(contentBlock);
  const title=extractAll(raw,/<title[^>]*>([\s\S]*?)<\/title>/gi)[0]||"";
  const h1=extractAll(raw,/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi).map(textOnly);
  const headings=extractAll(contentBlock,/<h[2-3]\b[^>]*>([\s\S]*?)<\/h[2-3]>/gi).map(textOnly);
  const metaDescription=/<meta\s+name="description"\s+content="([^"]*)"/i.exec(raw)?.[1]||"";
  const canonical=/<link\s+rel="canonical"\s+href="([^"]*)"/i.exec(raw)?.[1]||"";
  const robots=[...raw.matchAll(/<meta\s+name="robots"\s+content="([^"]*)"/gi)].map(m=>m[1]);
  const links=extractAll(contentBlock,/<a\b[^>]*href="([^"]+)"/gi);
  const imgs=[...raw.matchAll(/<img\b([^>]+)>/gi)].map(m=>{
    const s=m[1],attr=(name)=>new RegExp('\\b'+name+'="([^"]*)"','i').exec(s)?.[1]||"";
    return {src:attr("src"),alt:attr("alt"),width:attr("width"),height:attr("height"),loading:attr("loading")};
  }).filter(v=>v.src);
  const words=prose.split(/\s+/).filter(Boolean).length;
  const path=url.pathname, articlePage=/^\/(blog|noticias)\/[^/]+/.test(path);
  const issue=[];
  if(page.status!==200)issue.push("HTTP_"+page.status);
  if(!title)issue.push("TITLE_MISSING");
  if(h1.length!==1)issue.push("H1_COUNT_"+h1.length);
  if(!metaDescription)issue.push("META_DESCRIPTION_MISSING");
  if(!canonical)issue.push("CANONICAL_MISSING");
  if(canonical && !canonical.startsWith(ORIGIN))issue.push("CANONICAL_OFF_DOMAIN");
  if(robots.join(" ").includes("noindex") && articlePage) issue.push("ARTICLE_NOINDEX");
  if(articlePage){
    if(words<300)issue.push("ARTICLE_UNDER_300_WORDS");
    else if(words<550)issue.push("ARTICLE_UNDER_550_WORDS");
    const normalizedHeadings=headings.map(normalize);
    const generic=["uma situacao comum na pratica","roteiro aplicavel passo a passo","feche o ciclo com uma acao","como decidir o proximo passo","leitura util do cenario","o que esta em jogo agora","para nao perder o fio"];
    const repeatedGeneric=normalizedHeadings.filter(h=>generic.some(g=>h.includes(g)));
    if(repeatedGeneric.length)issue.push("GENERIC_TEMPLATE_HEADINGS_"+repeatedGeneric.length);
    const external=links.filter(offsite).filter(x=>!/(instagram.com|wa.me|api.whatsapp.com|facebook.com|google.com\/share)/i.test(x));
    const hasSourceText=/fonte\s*:/i.test(textOnly(article));
    if(external.length===0) issue.push("NO_OUTBOUND_EDITORIAL_SOURCE");
    if(!hasSourceText && url.pathname.startsWith("/noticias/"))issue.push("NEWS_SOURCE_NOT_EXPLICIT");
    if(!/\b(exemplo|passo a passo|planilha|modelo|checklist)\b/i.test(normalize(prose)))issue.push("FEW_PRACTICAL_SIGNALS");
    const img=imgs.filter(i=>/cover|article|uploads/.test(i.src));
    if(img.some(i=>!i.alt))issue.push("COVER_ALT_MISSING");
  }
  if(imgs.some(x=>!x.alt))issue.push("IMAGE_ALT_EMPTY");
  if(imgs.some(x=>!x.width||!x.height))issue.push("IMAGE_DIMENSIONS_MISSING");
  const phrases=uniq((normalize(prose).match(/\b(?:no tema em pauta|quando voce decide|uma situacao comum na pratica|roteiro aplicavel passo a passo|guarde este conteudo como referencia|na pratica o que importa)\b/g)||[]));
  return {url:page.url,status:page.status,finalUrl:page.finalUrl,ttfbExcluded:true,title,words,h1Count:h1.length,headings:headings.slice(0,24),imageCount:imgs.length,imageWithAlt:imgs.filter(i=>!!i.alt).length,externalEditorialLinks:links.filter(offsite).length,phrases,issues:uniq(issue),canonical,cacheControl:page.headers?.cacheControl,articlePage,proseSample:articlePage?prose.slice(0,210):undefined};
}
const before=Date.now();
const site=await crawlSitemap();
const urls=site.pages.filter(permitted);
const results=Array(urls.length);
let nextIndex=0;
async function worker(){
  while(nextIndex<urls.length){
    const idx=nextIndex++;
    const page=await fetchPage(urls[idx]);
    results[idx]=page.status?auditHtml(page):{url:urls[idx],status:0,issues:["REQUEST_FAILED"],error:page.error};
    await new Promise(resolve=>setTimeout(resolve,120));
  }
}
await Promise.all(Array.from({length:4},worker));
const counts={};
for(const r of results){for(const i of r.issues||[])counts[i]=(counts[i]||0)+1;}
const articles=results.filter(x=>x.articlePage);
const summary={
  date:new Date().toISOString(),
  origin:ORIGIN,
  durationSec:Math.round((Date.now()-before)/1000),
  pagesFromSitemap:urls.length,
  totalChecked:results.length,
  articles:articles.length,
  articleWordsMedian:articles.length?[...articles.map(x=>x.words||0)].sort((a,b)=>a-b)[Math.floor(articles.length/2)]:0,
  articlesWithProblems:articles.filter(x=>x.issues?.length).length,
  issues:counts,
  note:"Auditoria heurística pública. Não é avaliação do Google AdSense nem substitui revisão editorial humana."
};
await mkdir(dirname(REPORT),{recursive:true});
await writeFile(REPORT,JSON.stringify({summary,sitemaps:site.sitemaps,pages:results},null,2)+"\n","utf8");
const priority=articles.filter(r=>r.issues?.some(i=>/NO_OUTBOUND|GENERIC_TEMPLATE|UNDER_300|NEWS_SOURCE/.test(i))).sort((a,b)=>b.issues.length-a.issues.length);
const md=[
 "# Auditoria de conteúdo público — Empregos São Luís",
 "",
 "**Importante:** heurísticas de revisão editorial, não parecer do Google.",
 "",
 "| Métrica | Quantidade |","|---|---:|",
 ...Object.entries(summary).filter(([k,v])=>typeof v==="number").map(([k,v])=>`| ${k} | ${v} |`),
 "",
 "## Problemas por código",
 ...Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`- ${k}: ${v}`),
 "",
 "## Primeiros artigos a revisar (não apagar automaticamente)",
 "| URL | Palavras | Alertas |","|---|---:|---|",
 ...priority.slice(0,120).map(r=>`| ${r.url.replace(ORIGIN,"")} | ${r.words||0} | ${r.issues.join(", ")} |`),
 ""
].join("\n");
await writeFile(REPORT_MD,md,"utf8");
if(process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY,md.slice(0,45000),"utf8");
console.log("ADSENSE_AUDIT_SUMMARY",JSON.stringify(summary));
console.log("ADSENSE_AUDIT_REPORT",REPORT);
for(const r of priority.slice(0,25))console.log("ARTICLE_REVIEW_PRIORITY",r.url.replace(ORIGIN,""),r.words,r.issues.join("|"));
if(results.filter(x=>x.status===200).length===0){console.error("AUDIT_ERROR:no_public_pages");process.exitCode=1;}
