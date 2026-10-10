import { Resend } from "resend";

export interface EmailMessage { to: string; subject: string; html: string }
export interface EmailProvider { send(message: EmailMessage): Promise<{ id: string }> }

export function createEmailProvider(): EmailProvider {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) {
    return {
      async send(message) {
        console.warn(`[email-fallback] RESEND não configurado. E-mail não enviado para ${message.to}: ${message.subject}`);
        return { id: `fallback-${Date.now()}` };
      }
    };
  }
  const resend = new Resend(key);
  return {
    async send(message) {
      const { data, error } = await resend.emails.send({ from, ...message });
      if (error || !data) throw new Error(error?.message ?? "Falha no envio de e-mail.");
      return { id: data.id };
    }
  };
}

export function emailProviderStatus() {
  return { configured: Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM) };
}
