import { cache } from "react";

import { prisma } from "@/lib/db";

export async function getStates() {
  return prisma.state.findMany({
    orderBy: [{ name: "asc" }],
    include: {
      _count: {
        select: { jobs: true }
      }
    }
  });
}

export async function getStateBySlug(slug: string) {
  return prisma.state.findUnique({
    where: { slug },
    include: {
      cities: {
        orderBy: [{ name: "asc" }],
        include: {
          _count: {
            select: { jobs: true }
          }
        }
      },
      _count: {
        select: { jobs: true }
      }
    }
  });
}

export async function getCityByStateAndSlug(stateSlug: string, citySlug: string) {
  return prisma.city.findFirst({
    where: {
      slug: citySlug,
      state: {
        slug: stateSlug
      }
    },
    include: {
      state: true,
      _count: {
        select: { jobs: true }
      }
    }
  });
}

export async function getCityBySlug(slug: string) {
  const cities = await prisma.city.findMany({
    where: { slug },
    include: {
      state: true,
      _count: {
        select: {
          jobs: {
            where: { isActive: true }
          }
        }
      }
    }
  });

  return cities.sort((left, right) => right._count.jobs - left._count.jobs)[0] ?? null;
}

async function fetchSearchGeoData() {
  return prisma.state.findMany({
    orderBy: [{ name: "asc" }],
    include: {
      cities: {
        orderBy: [{ name: "asc" }]
      }
    }
  });
}

export const getSearchGeoData = cache(fetchSearchGeoData);

export async function getCities() {
  return prisma.city.findMany({
    include: {
      state: true,
      _count: {
        select: { jobs: true }
      }
    },
    orderBy: [{ name: "asc" }]
  });
}

export async function getStatesBySlugs(slugs: string[]) {
  if (!slugs.length) return [];

  const items = await prisma.state.findMany({
    where: { slug: { in: slugs } },
    include: {
      _count: {
        select: { jobs: true }
      }
    }
  });

  const map = new Map(items.map((item) => [item.slug, item]));
  return slugs
    .map((slug) => map.get(slug))
    .filter((item): item is (typeof items)[number] => Boolean(item));
}

export async function getCitiesBySlugs(slugs: string[]) {
  if (!slugs.length) return [];

  const items = await prisma.city.findMany({
    where: { slug: { in: slugs } },
    include: {
      state: true,
      _count: {
        select: { jobs: true }
      }
    }
  });

  const map = new Map(items.map((item) => [item.slug, item]));
  return slugs
    .map((slug) => map.get(slug))
    .filter((item): item is (typeof items)[number] => Boolean(item));
}
