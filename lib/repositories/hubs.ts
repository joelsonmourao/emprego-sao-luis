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

export async function getHubProfiles(type?: HubType) {
  return prisma.hubProfile.findMany({
    where: type ? { type } : undefined,
    orderBy: [{ updatedAt: "desc" }]
  });
}
