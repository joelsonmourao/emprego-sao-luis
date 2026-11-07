#!/usr/bin/env node
import fs from "node:fs";

const failures = [];
const required = (file, patterns) => {
  const source = fs.readFileSync(file, "utf8");
  for (const [label, pattern] of patterns) if (!pattern.test(source)) failures.push(`${file}: ${label}`);
};

required("apps/web/src/layouts/BaseLayout.astro", [
  ["grafo central", /"@graph"/],
  ["Organization", /organizationNode/],
  ["WebSite", /websiteNode/],
  ["WebPage", /pageNode/],
  ["SearchAction", /SearchAction/]
]);
required("packages/seo/src/index.ts", [
  ["JobPosting", /"JobPosting"/],
  ["sem empresa confidencial", /input\.confidentialCompany/],
  ["sem contratante não identificada", /input\.unidentifiedCompany/],
  ["directApply explícito", /input\.directApply === true/]
]);
required("apps/web/src/pages/noticias/[slug].astro", [
  ["NewsArticle", /"NewsArticle"/],
  ["imagens 16:9, 4:3 e 1:1", /variants\.hero[\s\S]*variants\.landscape43[\s\S]*variants\.square/]
]);
required("apps/web/src/pages/vagas/[slug].astro", [
  ["schema condicional", /schemas=\{jsonLd \? \[jsonLd\] : \[\]\}/],
  ["candidatura condicional", /acceptingApplications/]
]);
required("apps/web/src/pages/404.astro", [
  ["404 sem grafo", /disableSeoGraph/],
  ["noindex", /noindex/]
]);

console.log(JSON.stringify({ ok: failures.length === 0, failures }, null, 2));
if (failures.length) process.exit(1);
