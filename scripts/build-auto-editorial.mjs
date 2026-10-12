#!/usr/bin/env node
/** Valida cada artigo do calendário, gera ilustração WebP própria e um manifesto SSR.
 * Conteúdo ausente/fraco fica bloqueado. Sem banco, API de IA paga ou seed destrutivo. */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { createHash } from "node:crypto";

const ROOT=process.cwd();
const plan=JSON.parse(fs.readFileSync("editorial/calendario-3-artigos-diarios-2026.json","utf8"));
const checkOnly=process.argv.includes("--check");
const output="apps/web/src/data/auto-editorial-manifest.json";
const coverDir="apps/web/public/covers/auto-editorial";
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const slugify=s=>String(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const words=s=>String(s).split(/\s+/).filter(Boolean).length;
function readDraft(filename){
  const text=fs.readFileSync(filename,"utf8");
  const m=/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]+)$/.exec(text);
  if(!m)throw new Error("frontmatter ausente");
  const meta={};let last="";
  for(const line of m[1].split(/\r?\n/)){
    const item=/^([a-z_]+):\s*(.*)$/.exec(line);
    if(item){last=item[1];const v=item[2].replace(/^"|"$/g,"").trim();meta[last]=v||[];}
    else if(/^\s+-\s+/.test(line)&&Array.isArray(meta[last]))meta[last].push(line.replace(/^\s+-\s+/,"").replace(/^"|"$/g,""));
  }
  return {meta,body:m[2]};
}
function inline(text){
  const links=[];let s=String(text).replace(/\[([^\]]+)\]\(([^)]+)\)/g,(_m,label,target)=>{
    if(!(/^(https:\/\/[a-z0-9.-]+(?:\/|$)|\/[a-z0-9/.-]+$)/i).test(target))return label;
    const marker="ZZMDLINK"+links.length+"ZZ";
    links.push('<a href="'+esc(target)+'"'+(target.startsWith("http")?' target="_blank" rel="noopener noreferrer"':'')+'>'+esc(label)+'</a>');
    return marker;
  });
  s=esc(s).replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/\*([^*]+)\*/g,"<em>$1</em>");
  links.forEach((v,i)=>{s=s.replace("ZZMDLINK"+i+"ZZ",v)});
  return s;
}
export function markdownToHtml(markdown){
  const chunks=[];let paragraph=[],list=null,quote=[];
  const flush=()=>{
    if(paragraph.length){chunks.push("<p>"+inline(paragraph.join(" "))+"</p>");paragraph=[];}
    if(list){chunks.push("</"+list+">");list=null;}
    if(quote.length){chunks.push("<blockquote><p>"+inline(quote.join(" "))+"</p></blockquote>");quote=[];}
  };
  for(const line of markdown.split(/\r?\n/)){
    const s=line.trim();
    if(!s){flush();continue;}
    const h=/^(#{1,4})\s+(.+)$/.exec(s);
    if(h){flush();let n=Math.min(h[1].length+1,5);chunks.push("<h"+n+">"+inline(h[2])+"</h"+n+">");continue;}
    const bullet=/^[-*]\s+(.+)$/.exec(s),ordered=/^\d+\.\s+(.+)$/.exec(s);
    if(bullet||ordered){
      if(paragraph.length||quote.length)flush();
      const kind=ordered?"ol":"ul";
      if(list!==kind){if(list)chunks.push("</"+list+">");list=kind;chunks.push("<"+kind+">");}
      chunks.push("<li>"+inline((bullet||ordered)[1])+"</li>");continue;
    }
    if(s.startsWith("> ")){if(paragraph.length||list)flush();quote.push(s.slice(2));continue;}
    if(list||quote.length)flush();paragraph.push(s);
  }
  flush();
  return chunks.join("\n");
}
const palette={
  seguranca_e_orientacao:["#15253f","#246c72","#bdede3"],
  setor_profissional:["#231e35","#995644","#ffe2b9"],
  carreira:["#111b30","#515fa2","#cce5ff"]
};
const titleLines=title=>{
  const lines=[];let current="";
  for(const word of title.split(/\s+/)){
    if((current+" "+word).trim().length>28&&current){lines.push(current);current=word;}
    else current=(current?current+" ":"")+word;
  }
  if(current)lines.push(current);
  return lines.slice(0,4);
};
async function cover(post,dest){
  const [a,b,c]=palette[post.category]||palette.carreira;
  const k=parseInt(createHash("sha256").update(post.slug).digest("hex").slice(0,2),16)%30;
  const lines=titleLines(post.workingTitle).map((s,i)=>'<text x="78" y="'+(215+i*77)+'" font-size="51" font-family="DejaVu Sans,Arial,sans-serif" font-weight="bold" fill="#fff">'+esc(s)+"</text>").join("");
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="'+a+'"/><stop offset="1" stop-color="'+b+'"/></linearGradient></defs><rect width="1200" height="675" fill="url(#g)"/><circle cx="1110" cy="310" r="'+(250+k)+'" stroke="'+c+'" stroke-width="17" stroke-opacity=".20" fill="none"/><rect x="906" y="164" width="215" height="304" rx="23" fill="'+c+'" fill-opacity=".12" stroke="'+c+'" stroke-width="3"/><path d="M950 270h120m-120 60h120m-120 60h90" stroke="'+c+'" stroke-width="12" stroke-linecap="round"/><text x="80" y="100" font-size="22" font-weight="bold" fill="'+c+'" font-family="DejaVu Sans,Arial,sans-serif">EMPREGOS SÃO LUÍS • GUIA</text>'+lines+'<text x="78" y="631" font-size="19" fill="#fff" font-family="DejaVu Sans,Arial,sans-serif">ILUSTRAÇÃO EDITORIAL ORIGINAL</text></svg>';
  await sharp(Buffer.from(svg)).webp({quality:84,effort:4}).toFile(dest);
}
const accepted=[],blocked=[],seen=new Set();
for(const day of plan.days){
  for(const post of day.posts){
    const fail=[];
    if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)||seen.has(post.slug)){blocked.push({slug:post.slug,reason:"slug inválido/repetido"});continue;}
    seen.add(post.slug);
    const file=path.resolve(ROOT,post.draftFile||"");
    if(!post.draftFile||!file.startsWith(path.resolve(ROOT,"editorial")+path.sep)||!fs.existsSync(file)){blocked.push({slug:post.slug,reason:"ainda sem texto completo"});continue;}
    try{
      const {meta,body}=readDraft(file);
      const plain=body.replace(/[#*>_()[\]]/g," ");
      const sources=Array.isArray(meta.sources)?meta.sources:[];
      if(meta.slug!==post.slug||meta.title!==post.workingTitle||meta.planned_date!==day.date||meta.planned_time!==post.time)fail.push("metadados divergentes do calendário");
      if(meta.type!=="GUIDE")fail.push("NEWS e dados recentes exigem verificação humana de fatos");
      if(words(plain)<460)fail.push("texto com menos de 460 palavras úteis");
      if((body.match(/^## /gm)||[]).length<3)fail.push("menos de 3 seções");
      if(!meta.excerpt||meta.excerpt.length<55)fail.push("resumo insuficiente");
      if(sources.length<1||sources.some(s=>!/^https:\/\/[a-z0-9.-]+(?:\/|$)/i.test(s)))fail.push("fontes ausentes ou inseguras");
      const paragraphs=body.split(/\r?\n\s*\r?\n/).filter(s=>s.length>100).map(s=>slugify(s.slice(0,200)));
      if(new Set(paragraphs).size!==paragraphs.length)fail.push("parágrafos repetidos");
      if(/Uma situação comum na prática|Roteiro aplicável passo a passo|No tema em pauta/i.test(body))fail.push("template repetido");
      if(/vaga garantida|contratação confirmada|está contratando hoje/i.test(body))fail.push("alegação de vaga atual sem evidência");
      if(fail.length){blocked.push({slug:post.slug,reason:fail.join("; ")});continue;}
      const [y,m,d]=day.date.split("-").map(Number);
      const hour=Number(post.time.slice(0,2));
      accepted.push({
        slug:post.slug,type:"GUIDE",title:meta.title,excerpt:meta.excerpt,primaryKeyword:meta.primary_keyword||"",
        contentHtml:markdownToHtml(body),sources,
        publishedAt:new Date(Date.UTC(y,m-1,d,hour+3)).toISOString(),
        coverImageUrl:"/covers/auto-editorial/"+post.slug+".webp",
        coverImageAlt:"Ilustração gráfica original do artigo: "+post.workingTitle,
        coverImageCredit:"Ilustração editorial original gerada pelo Empregos São Luís",
        authorName:"Redação Empregos São Luís",category:post.category,coverImageWidth:1200,coverImageHeight:675,
        editorialCheck:"QA_AUTOMATIZADO_SEM_VERIFICACAO_HUMANA"
      });
    }catch(e){blocked.push({slug:post.slug,reason:String(e.message||e)})}
  }
}
if(!checkOnly){
  fs.mkdirSync(coverDir,{recursive:true});
  for(const entry of accepted){
    const post=plan.days.flatMap(d=>d.posts).find(p=>p.slug===entry.slug);
    await cover(post,path.join(coverDir,entry.slug+".webp"));
  }
  fs.mkdirSync(path.dirname(output),{recursive:true});
  fs.writeFileSync(output,JSON.stringify(accepted,null,2)+"\n");
  fs.writeFileSync("editorial/automation-report.json",JSON.stringify({generatedAt:new Date().toISOString(),validated:accepted.length,blocked:blocked.length,details:blocked},null,2)+"\n");
}
console.log(JSON.stringify({validated:accepted.length,blocked:blocked.length,accepted:accepted.map(a=>a.slug).slice(-5),sampleBlocked:blocked.slice(0,5)}));
if(!accepted.length)process.exitCode=1;
