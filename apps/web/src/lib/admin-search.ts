import {
  articles,
  commercialOrders,
  commercialPayments,
  companies,
  contactSubmissions,
  createDatabase,
  jobs,
  users
} from "@es/db";
import { desc, eq, ilike, or } from "drizzle-orm";

export type SearchResult = { type: string; label: string; href: string };

export async function adminGlobalSearch(q: string): Promise<SearchResult[]> {
  if (!process.env.DATABASE_URL || !q.trim()) return [];
  const term = `%${q.trim()}%`;
  const connection = createDatabase(process.env.DATABASE_URL);
  const results: SearchResult[] = [];
  try {
    const jobRows = await connection.db
      .select({ code: jobs.publicCode, title: jobs.normalizedTitle, slug: jobs.slug })
      .from(jobs)
      .where(or(ilike(jobs.publicCode, term), ilike(jobs.normalizedTitle, term)))
      .orderBy(desc(jobs.updatedAt))
      .limit(5);
    for (const row of jobRows) results.push({ type: "Vaga", label: `${row.code} — ${row.title}`, href: `/admin/vagas/${row.slug}/editar` });

    const companyRows = await connection.db.select({ name: companies.name, slug: companies.slug }).from(companies).where(ilike(companies.name, term)).limit(5);
    for (const row of companyRows) results.push({ type: "Empresa", label: row.name, href: `/admin/empresas?slug=${row.slug}` });

    const orderRows = await connection.db.select({ code: commercialOrders.orderCode, company: commercialOrders.companyName }).from(commercialOrders).where(or(ilike(commercialOrders.orderCode, term), ilike(commercialOrders.companyName, term))).limit(5);
    for (const row of orderRows) results.push({ type: "Pedido", label: `${row.code} — ${row.company}`, href: `/admin/comercial/pedidos/${row.code}` });

    const paymentRows = await connection.db.select({ id: commercialPayments.id, status: commercialPayments.status }).from(commercialPayments).where(ilike(commercialPayments.externalId, term)).limit(3);
    for (const row of paymentRows) results.push({ type: "Pagamento", label: `${row.id.slice(0, 8)}… (${row.status})`, href: `/admin/comercial/pagamentos?id=${row.id}` });

    const userRows = await connection.db.select({ email: users.email, name: users.name }).from(users).where(or(ilike(users.email, term), ilike(users.name, term))).limit(5);
    for (const row of userRows) results.push({ type: "Usuário", label: `${row.name} (${row.email})`, href: `/admin/usuarios` });

    const articleRows = await connection.db.select({ title: articles.title, slug: articles.slug }).from(articles).where(ilike(articles.title, term)).limit(5);
    for (const row of articleRows) results.push({ type: "Notícia", label: row.title, href: `/admin/conteudo/${row.slug}/editar` });

    const contactRows = await connection.db.select({ protocol: contactSubmissions.protocol, subject: contactSubmissions.subject }).from(contactSubmissions).where(or(ilike(contactSubmissions.protocol, term), ilike(contactSubmissions.subject, term))).limit(5);
    for (const row of contactRows) results.push({ type: "Contato", label: `${row.protocol} — ${row.subject}`, href: `/admin/contatos` });

    if (/^ES-\d{6}$/i.test(q.trim())) {
      const code = q.trim().toUpperCase();
      const [job] = await connection.db.select({ slug: jobs.slug, title: jobs.normalizedTitle }).from(jobs).where(eq(jobs.publicCode, code)).limit(1);
      if (job) results.unshift({ type: "Código ES", label: `${code} — ${job.title}`, href: `/admin/vagas/${job.slug}/editar` });
    }
    return results.slice(0, 20);
  } finally {
    await connection.close();
  }
}
