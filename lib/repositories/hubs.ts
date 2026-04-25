import { unstable_cache } from "next/cache";
import { HubType } from "@prisma/client";

import { prisma } from "@/lib/db";
import { PUBLIC_GEO_CACHE_TAG } from "@/lib/public-revalidate";

export const getHubProfile = unstable_cache(async (type: HubType, slug: string) => {
  return prisma.hubProfile.findUnique({
    where: {
      type_slug: {
        type,
        slug
      }
    }
  });
}, ["hub-profile-v1"], {
  revalidate: 3600,
  tags: [PUBLIC_GEO_CACHE_TAG]
});

const getHubProfilesCached = unstable_cache(async (typeKey: string) => {
  const type = typeKey === "__all__" ? undefined : (typeKey as HubType);
  return prisma.hubProfile.findMany({
    where: type ? { type } : undefined,
    orderBy: [{ updatedAt: "desc" }]
  });
}, ["hub-profiles-v1"], {
  revalidate: 3600,
  tags: [PUBLIC_GEO_CACHE_TAG]
});

export async function getHubProfiles(type?: HubType) {
  return getHubProfilesCached(type ?? "__all__");
}
