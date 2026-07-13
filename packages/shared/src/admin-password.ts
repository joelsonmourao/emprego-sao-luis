import { z } from "zod";

export const ADMIN_PASSWORD_MIN_LENGTH = 9;
export const ADMIN_PASSWORD_MIN_MESSAGE = "A senha deve ter pelo menos 9 caracteres.";

export function isAdminPasswordLongEnough(password: string): boolean {
  return password.length >= ADMIN_PASSWORD_MIN_LENGTH;
}

export function adminPasswordSchema() {
  return z.string().min(ADMIN_PASSWORD_MIN_LENGTH, ADMIN_PASSWORD_MIN_MESSAGE);
}

export function assertAdminPasswordLength(password: string): void {
  if (!isAdminPasswordLongEnough(password)) {
    throw new Error(ADMIN_PASSWORD_MIN_MESSAGE);
  }
}
