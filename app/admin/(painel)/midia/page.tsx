import { prisma } from "@/lib/db";
import { AdminMediaManager } from "@/components/admin/admin-media-manager";

export default async function AdminMediaPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const pickerMode = raw.picker === "1";
  const assets = await prisma.mediaAsset.findMany({
    orderBy: [{ createdAt: "desc" }]
  });

  return <AdminMediaManager pickerMode={pickerMode} initialAssets={assets.map((asset) => ({ ...asset, createdAt: asset.createdAt.toISOString() }))} />;
}
