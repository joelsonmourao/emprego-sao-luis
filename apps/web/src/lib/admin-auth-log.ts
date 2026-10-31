import { logServerError } from "./server-error";

export type AdminAuthFailureReason =
  | "user_not_found"
  | "password_invalid"
  | "inactive_user"
  | "no_admin_role"
  | "mfa_required"
  | "invalid_otp"
  | "rate_limited"
  | "database_unavailable"
  | "session_error"
  | "auth_secret_missing";

type AuthLogPayload = {
  emailHash?: string;
  userId?: string;
  ipHash?: string;
};

export function logAdminAuthFailure(reason: AdminAuthFailureReason, payload: AuthLogPayload = {}): void {
  logServerError(`admin-auth:${reason}`, {
    reason,
    ...payload
  });
}
