import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const contentType = request.headers.get("content-type") ?? "";
  let choice: "yes" | "no" = "no";

  if (contentType.includes("application/json")) {
    const body = (await request.json()) as { choice?: string };
    choice = body.choice === "yes" ? "yes" : "no";
  } else {
    const form = await request.formData();
    choice = form.get("choice") === "yes" ? "yes" : "no";
  }

  cookies.set("es_consent_ads", choice, {
    path: "/",
    sameSite: "lax",
    secure: import.meta.env.PROD,
    maxAge: 60 * 60 * 24 * 180
  });

  if (contentType.includes("application/json") || request.headers.get("accept")?.includes("application/json")) {
    return Response.json({ ok: true, choice });
  }

  return redirect(request.headers.get("referer") ?? "/", 303);
};
