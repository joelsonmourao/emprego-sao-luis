import bcrypt from "bcryptjs";
import { describe, expect, it } from "vitest";
import { upsertInitialAdmin, type InitialAdminRecord, type InitialAdminStore } from "./seed-rbac-admin";

function memoryStore() {
  const users = new Map<string, InitialAdminRecord>();
  const superAdmins = new Set<string>();
  const store: InitialAdminStore = {
    async findByEmail(email) {
      return users.get(email);
    },
    async create(input) {
      const user = { id: `user-${users.size + 1}`, active: true, ...input };
      users.set(input.email, user);
      return user;
    },
    async update(id, input) {
      const current = [...users.values()].find((user) => user.id === id)!;
      const user = { ...current, ...input };
      users.set(user.email, user);
      return user;
    },
    async ensureSuperAdminRole(userId) {
      superAdmins.add(userId);
    }
  };
  return { store, users, superAdmins };
}

describe("upsert do administrador inicial", () => {
  it("executa duas vezes sem duplicar e atualiza nome, senha e papel", async () => {
    const memory = memoryStore();
    const first = await upsertInitialAdmin(memory.store, {
      email: "admin@example.com",
      name: "Admin inicial",
      password: "senha0001"
    });
    const second = await upsertInitialAdmin(memory.store, {
      email: "admin@example.com",
      name: "Admin atualizado",
      password: "senha0002"
    });

    expect(first.action).toBe("created");
    expect(second.action).toBe("updated");
    expect(memory.users).toHaveLength(1);
    expect(memory.superAdmins).toHaveLength(1);
    expect(second.user.name).toBe("Admin atualizado");
    await expect(bcrypt.compare("senha0002", second.user.passwordHash!)).resolves.toBe(true);
    await expect(bcrypt.compare("senha0001", second.user.passwordHash!)).resolves.toBe(false);
  });
});
