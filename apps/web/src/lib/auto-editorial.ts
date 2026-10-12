import manifest from "../data/auto-editorial-manifest.json";
export type AutoEditorialItem = {
  slug: string;type:"GUIDE";title:string;excerpt:string;contentHtml:string;
  sources:string[];publishedAt:string;primaryKeyword:string;authorName:string;
  category:string;coverImageUrl:string;coverImageAlt:string;coverImageCredit:string;
  coverImageWidth:number;coverImageHeight:number;editorialCheck:string;
};
const all = manifest as AutoEditorialItem[];
const valid = (x:AutoEditorialItem) =>
  x.type === "GUIDE" &&
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(x.slug) &&
  x.editorialCheck === "QA_AUTOMATIZADO_SEM_VERIFICACAO_HUMANA" &&
  Number.isFinite(Date.parse(x.publishedAt)) &&
  /^\/covers\/auto-editorial\/[a-z0-9-]+\.webp$/.test(x.coverImageUrl) &&
  x.coverImageUrl === "/covers/auto-editorial/" + x.slug + ".webp" &&
  x.contentHtml.length > 2300;

export function listAutoEditorialArticles(limit?:number,now=new Date()) {
  const visible=all.filter(x=>valid(x) && Date.parse(x.publishedAt)<=now.getTime())
    .sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
  return limit == null ? visible : visible.slice(0,limit);
}
export function findAutoEditorialArticle(slug:string,now=new Date()) {
  const x=listAutoEditorialArticles(undefined,now).find(x=>x.slug===slug);
  if(!x)return null;
  const publishedAt=new Date(x.publishedAt);
  return {
    article: {
      slug:x.slug,title:x.title,excerpt:x.excerpt,type:x.type,contentHtml:x.contentHtml,
      publishedAt,updatedAt:publishedAt,subtitle:null as string|null,
      seoTitle:x.title,metaDescription:x.excerpt,canonicalUrl:null as string|null,
      coverImageUrl:x.coverImageUrl,coverImageAlt:x.coverImageAlt,coverImageCaption:"Ilustração editorial original, não é uma fotografia de pessoas reais.",
      coverImageCredit:x.coverImageCredit,coverImageWidth:x.coverImageWidth,coverImageHeight:x.coverImageHeight,
      ogImageUrl:x.coverImageUrl,sponsoredContent:false,sponsorshipDisclosure:null as string|null,
      sourceName:null as string|null,sourceUrl:null as string|null
    },
    authorName:x.authorName
  };
}
