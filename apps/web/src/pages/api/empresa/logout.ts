import type { APIRoute } from "astro";
import { COMPANY_COOKIE, revokeCompanySession } from "../../../lib/company-auth";

export const POST: APIRoute = async ({ cookies, redirect }) => {
  const token = cookies.get(COMPANY_COOKIE)?.value;
  if (token) await revokeCompanySession(token);
  cookies.delete(COMPANY_COOKIE, { path: "/" });
  return redirect("/empresa/login", 303);
};
