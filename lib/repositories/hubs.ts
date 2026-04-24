import { cache } from "react";
import { HubType } from "@prisma/client";

import { prisma } from "@/lib/db";

export async function getHubProfile(type: HubType, slug: string) {
  return prisma.hubProfile.findUnique({
    where: {
      type_slug: {
        type,
        slug
      }
    }
  });
}

const getHubProfilesCached = cache(async (typeKey: string) => {
  const type = typeKey === "__all__" ? undefined : (typeKey as HubType);
  return prisma.hubProfile.findMany({
    where: type ? { type } : undefined,
    orderBy: [{ updatedAt: "desc" }]
  });
});

export async function getHubProfiles(type?: HubType) {
  return getHubProfilesCached(type ?? "__all__");
}
