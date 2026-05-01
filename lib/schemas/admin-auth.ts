import { z } from "zod";

export const adminLoginSchema = z.object({
  login_user: z.string().trim().min(3, "Informe seu usuário ou e-mail."),
  secret_key: z.string().min(8, "Informe a senha.")
});

export type AdminLoginValues = z.infer<typeof adminLoginSchema>;

