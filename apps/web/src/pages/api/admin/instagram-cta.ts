import type { APIRoute } from "astro";
import { saveInstagramCtaSettings } from "../../../lib/instagram-cta";

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = Object.fromEntries(await request.formData());
  await saveInstagramCtaSettings({
    title: String(form.title ?? ""),
    description: String(form.description ?? ""),
    profileUrl: String(form.profileUrl ?? ""),
    storiesNote: String(form.storiesNote ?? ""),
    showQrCode: form.showQrCode === "1",
    qrCodeUrl: String(form.qrCodeUrl ?? "") || undefined,
    followerCount: String(form.followerCount ?? "") || undefined,
    followerCountUpdatedAt: form.followerCount ? new Date().toISOString() : undefined
  });
  return redirect("/admin/instagram?saved=1", 303);
};
