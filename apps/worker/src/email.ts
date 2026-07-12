import { Resend } from "resend";
export interface EmailMessage { to: string; subject: string; html: string }
export interface EmailProvider { send(message: EmailMessage): Promise<{ id: string }> }
export function createEmailProvider(): EmailProvider { const key = process.env.RESEND_API_KEY; const from = process.env.EMAIL_FROM; if (!key || !from) throw new Error("RESEND_API_KEY e EMAIL_FROM não configurados."); const resend = new Resend(key); return { async send(message) { const { data, error } = await resend.emails.send({ from, ...message }); if (error || !data) throw new Error(error?.message ?? "Falha no envio de e-mail."); return { id: data.id }; } }; }
