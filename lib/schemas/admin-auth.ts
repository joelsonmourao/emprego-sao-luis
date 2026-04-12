import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().email("Informe um e-mail valido."),
  password: z.string().min(8, "Informe a senha.")
});

export type AdminLoginValues = z.infer<typeof adminLoginSchema>;

