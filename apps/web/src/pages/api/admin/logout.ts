import type { APIRoute } from "astro";
import { ADMIN_COOKIE, revokeSession } from "../../../lib/auth";
export const POST: APIRoute = async ({ cookies, redirect }) => { const token = cookies.get(ADMIN_COOKIE)?.value; if (token) await revokeSession(token); cookies.delete(ADMIN_COOKIE, { path: "/" }); return redirect("/admin/login", 303); };
