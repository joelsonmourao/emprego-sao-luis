import type { APIRoute } from "astro";
import { can } from "../../../../lib/auth";
import { getPaymentSettings, savePaymentSettings } from "../../../../lib/commercial/payment-settings";

export const GET: APIRoute = async ({ locals }) => {
  if (!locals.auth || !can(locals.auth, "commercial.manage")) return Response.json({ ok: false }, { status: 403 });
  const settings = await getPaymentSettings();
  return Response.json({
    ok: true,
    settings: {
      ...settings,
      manualPixKey: settings.manualPixKey ? "••••••••" : ""
    }
  });
};

export const PUT: APIRoute = async ({ request, locals }) => {
  if (!locals.auth || !can(locals.auth, "settings.manage")) return Response.json({ ok: false, error: "Sem permissão." }, { status: 403 });
  const body = await request.json();
  const patch: Record<string, unknown> = {};
  if (body.manualPixEnabled !== undefined) patch.manualPixEnabled = Boolean(body.manualPixEnabled);
  if (body.manualPixHolder !== undefined) patch.manualPixHolder = String(body.manualPixHolder);
  if (body.manualPixQrUrl !== undefined) patch.manualPixQrUrl = String(body.manualPixQrUrl);
  if (body.manualPixInstructions !== undefined) patch.manualPixInstructions = String(body.manualPixInstructions);
  if (body.manualPixKey && !String(body.manualPixKey).startsWith("••")) patch.manualPixKey = String(body.manualPixKey);
  const settings = await savePaymentSettings(patch);
  return Response.json({ ok: true, settings: { ...settings, manualPixKey: settings.manualPixKey ? "••••••••" : "" } });
};
