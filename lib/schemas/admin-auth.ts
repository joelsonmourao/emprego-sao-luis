import { z } from "zod";

export const adminLoginSchema = z.object({
  login_user: z.string().email("Informe um e-mail valido."),
  secret_key: z.string().min(8, "Informe a senha.")
});

export type AdminLoginValues = z.infer<typeof adminLoginSchema>;

