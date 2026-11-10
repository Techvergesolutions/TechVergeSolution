import{a as o}from"./query-C9gL8itW.js";import{_ as p,s as i,$ as l,a0 as u,a1 as y,l as g,a2 as h,v as q,a3 as S}from"./index-B1kdFpQu.js";function b(t,e=12){return Array.isArray(t)?t.flatMap(a=>typeof a?.question=="string"&&a.question.trim()&&typeof a?.answer=="string"&&a.answer.trim()?[{question:a.question.trim(),answer:a.answer.trim()}]:[]).slice(0,e):[]}async function I(t){if(!t||!i)return[];try{const e=await i.fetch('*[_type == "post" && slug.current == $slug][0]{ faqs[]{question, answer} }',{slug:t});return b(e?.faqs)}catch{return[]}}function A(t,e){return(t?.length?t:e??[]).slice(0,12)}const B=`*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  description,
  publishedAt,
  _updatedAt,
  readingTimeMinutes,
  tags,
  categories[]->{_id, title},
  mainImage {
    asset,
    alt,
    hotspot,
    crop
  },
  faqs[] {
    question,
    answer
  }
}`,c={src:h,alt:g,width:1200,height:630};function d(t){return t?t.slice(0,10):new Date().toISOString().slice(0,10)}function P(t){if(!t?.length)return 5;const a=t.flatMap(s=>s._type!=="block"||!Array.isArray(s.children)?[]:s.children.filter(n=>n._type==="span"&&typeof n.text=="string").map(n=>n.text)).join(" ").trim().split(/\s+/).filter(Boolean).length;return Math.max(1,Math.round(a/200))}function f(t){if(!t?.asset)return c;try{return{src:q(t).width(1400).quality(85).url(),alt:t.alt?.trim()||"Blog article image",width:1400,height:934}}catch{return c}}function m(t){const e=f(t.mainImage),a=d(t.publishedAt),s=d(t.updatedAt??t._updatedAt??t.publishedAt),n=t.excerpt?.trim()||t.description?.trim()||`Read the full article on the ${g} blog.`;return{slug:t.slug,title:t.title,description:t.description?.trim()||n.slice(0,160)||t.title,excerpt:n,datePublished:a,dateModified:s,readingTimeMinutes:t.readingTimeMinutes??P(t.body),tags:t.tags?.filter(Boolean),category:t.categories?.find(r=>r?.title?.trim())?.title?.trim()||void 0,featuredImage:e,ogImage:e.src.startsWith("http")?e.src:void 0,ogImageAlt:e.alt}}async function T(){if(!l()||!i)return null;try{return await i.fetch(B)}catch(t){return console.warn("[blog] Sanity post list fetch failed:",t),null}}function _(t){if(!t?.length)return[...u];const e=t.map(m),a=new Set(e.map(n=>n.slug)),s=u.filter(n=>!a.has(n.slug));return[...e,...s].sort((n,r)=>r.datePublished.localeCompare(n.datePublished))}async function v(){const t=await T();return _(t)}async function M(t){if(!l()||!i)return null;try{const e=await i.fetch(y,{slug:t});if(!e?.slug)return null;const a=m(e),s=e.seo?.ogImage?.asset?f(e.seo.ogImage):a.featuredImage;return{...a,source:"sanity",seoTitle:e.seo?.seoTitle?.trim()||e.title,seoDescription:e.seo?.seoDescription?.trim()||e.excerpt?.trim()||e.description?.trim()||a.description,customOgImage:e.seo?.ogImage?.asset?s.src:void 0,ogImage:s.src,ogImageAlt:s.alt,canonicalUrl:e.seo?.canonicalUrl||void 0,noIndex:e.seo?.noIndex??!1,publishedTime:e.publishedAt||void 0,modifiedTime:e.updatedAt||e.publishedAt||void 0,authors:e.author?.name?[e.author.name]:void 0,schemaImage:e.mainImage?.asset?a.featuredImage.src:void 0,categoryIds:(e.categories??[]).flatMap(n=>n?._id?[n._id]:[]),relatedPosts:(e.relatedPosts??[]).filter(n=>!!n),relatedService:e.relatedService?.slug&&e.relatedService.title?e.relatedService:(e.linkedFromServices??[]).find(n=>n?.slug&&n.title)??null,body:e.body??[],faqs:(e.faqs??[]).filter(n=>n.question?.trim()&&n.answer?.trim())}}catch(e){return console.warn(`[blog] Sanity post fetch failed for slug "${t}":`,e),null}}async function w(t){const e=await M(t);if(e)return{kind:"sanity",post:e};const a=p(t);return a?{kind:"static",meta:a}:null}function F(){return o({queryKey:["blog","list"],queryFn:v,placeholderData:S(),staleTime:5*60*1e3})}function U(t){return o({queryKey:["blog","post",t],enabled:!!t,queryFn:async()=>t?w(t):null,staleTime:5*60*1e3})}function L(t,e){const a=(e??[]).slice(0,12),s=o({queryKey:["blog","faqs",t],enabled:!!t&&l(),queryFn:()=>I(t),staleTime:6e4});return{faqs:A(s.data,a),isLoading:s.isLoading&&a.length===0,source:s.data&&s.data.length>0?"sanity":"markdown"}}function C(t){const[e,a,s]=t.split("-").map(Number);return!e||!a||!s?t:new Date(Date.UTC(e,a-1,s)).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric",timeZone:"UTC"})}export{U as a,L as b,C as f,F as u};
