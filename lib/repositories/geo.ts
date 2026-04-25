import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/db";
import { PUBLIC_GEO_CACHE_TAG } from "@/lib/public-revalidate";

async function fetchStates() {
  return prisma.state.findMany({
    orderBy: [{ name: "asc" }],
    include: {
      _count: {
        select: { jobs: true }
      }
    }
  });
}

export const getStates = unstable_cache(fetchStates, ["states-v1"], {
  revalidate: 3600,
  tags: [PUBLIC_GEO_CACHE_TAG]
});

export const getStateBySlug = unstable_cache(async (slug: string) => {
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
}, ["state-by-slug-v1"], {
  revalidate: 3600,
  tags: [PUBLIC_GEO_CACHE_TAG]
});

export const getCityByStateAndSlug = unstable_cache(async (stateSlug: string, citySlug: string) => {
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
}, ["city-by-state-and-slug-v1"], {
  revalidate: 3600,
  tags: [PUBLIC_GEO_CACHE_TAG]
});

export const getCityBySlug = unstable_cache(async (slug: string) => {
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
}, ["city-by-slug-v1"], {
  revalidate: 3600,
  tags: [PUBLIC_GEO_CACHE_TAG]
});

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

export const getSearchGeoData = unstable_cache(fetchSearchGeoData, ["search-geo-data-v1"], {
  revalidate: 3600,
  tags: [PUBLIC_GEO_CACHE_TAG]
});

async function fetchCities() {
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

export const getCities = unstable_cache(fetchCities, ["cities-v1"], {
  revalidate: 3600,
  tags: [PUBLIC_GEO_CACHE_TAG]
});

const getStatesBySlugsCached = unstable_cache(async (slugKey: string) => {
  const slugs = JSON.parse(slugKey) as string[];
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
}, ["states-by-slugs-v1"], {
  revalidate: 3600,
  tags: [PUBLIC_GEO_CACHE_TAG]
});

export async function getStatesBySlugs(slugs: string[]) {
  return getStatesBySlugsCached(JSON.stringify(slugs));
}

const getCitiesBySlugsCached = unstable_cache(async (slugKey: string) => {
  const slugs = JSON.parse(slugKey) as string[];
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
}, ["cities-by-slugs-v1"], {
  revalidate: 3600,
  tags: [PUBLIC_GEO_CACHE_TAG]
});

export async function getCitiesBySlugs(slugs: string[]) {
  return getCitiesBySlugsCached(JSON.stringify(slugs));
}
