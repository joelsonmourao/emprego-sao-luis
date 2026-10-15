import bcrypt from "bcryptjs";
import { assertAdminPasswordLength } from "@es/shared";

export type InitialAdminRecord = {
  id: string;
  email: string;
  name: string;
  passwordHash: string | null;
  active: boolean;
};

export type InitialAdminStore = {
  findByEmail: (email: string) => Promise<InitialAdminRecord | undefined>;
  create: (input: { email: string; name: string; passwordHash: string }) => Promise<InitialAdminRecord>;
  update: (id: string, input: { name?: string; passwordHash: string; active: true }) => Promise<InitialAdminRecord>;
  ensureSuperAdminRole: (userId: string) => Promise<void>;
};

export async function upsertInitialAdmin(
  store: InitialAdminStore,
  input: { email: string; name?: string; password: string }
): Promise<{ action: "created" | "updated"; user: InitialAdminRecord }> {
  assertAdminPasswordLength(input.password);
  const existing = await store.findByEmail(input.email);
  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = existing
    ? await store.update(existing.id, {
        ...(input.name ? { name: input.name } : {}),
        passwordHash,
        active: true
      })
    : await store.create({
        email: input.email,
        name: input.name ?? "Administrador",
        passwordHash
      });
  await store.ensureSuperAdminRole(user.id);
  return { action: existing ? "updated" : "created", user };
}
