import { prisma } from "@/lib/db";

const THIRTY_DAYS_AGO = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);

function trimTop<T extends { _count?: { _all?: number } }>(items: T[], limit = 8) {
  return items.slice(0, limit);
}

export async function getAnalyticsOverview() {
  const where = {
    createdAt: {
      gte: THIRTY_DAYS_AGO
    }
  };

  const [totals, eventCounts, topPages, topSources, topReferrers, topMediums, topDevices, topBrowsers, topSystems, topJobs, topPosts, topSearches, recentEvents] = await Promise.all([
    prisma.analyticsEvent.count({ where }),
    prisma.analyticsEvent.groupBy({
      by: ["eventName"],
      where,
      _count: { _all: true },
      orderBy: { _count: { eventName: "desc" } }
    }),
    prisma.analyticsEvent.groupBy({
      by: ["path"],
      where: { ...where, eventName: "page_view" },
      _count: { _all: true },
      orderBy: { _count: { path: "desc" } }
    }),
    prisma.analyticsEvent.groupBy({
      by: ["source"],
      where,
      _count: { _all: true },
      orderBy: { _count: { source: "desc" } }
    }),
    prisma.analyticsEvent.groupBy({
      by: ["referrerHost"],
      where,
      _count: { _all: true },
      orderBy: { _count: { referrerHost: "desc" } }
    }),
    prisma.analyticsEvent.groupBy({
      by: ["medium"],
      where,
      _count: { _all: true },
      orderBy: { _count: { medium: "desc" } }
    }),
    prisma.analyticsEvent.groupBy({
      by: ["deviceType"],
      where,
      _count: { _all: true },
      orderBy: { _count: { deviceType: "desc" } }
    }),
    prisma.analyticsEvent.groupBy({
      by: ["browser"],
      where,
      _count: { _all: true },
      orderBy: { _count: { browser: "desc" } }
    }),
    prisma.analyticsEvent.groupBy({
      by: ["os"],
      where,
      _count: { _all: true },
      orderBy: { _count: { os: "desc" } }
    }),
    prisma.analyticsEvent.groupBy({
      by: ["entitySlug"],
      where: { ...where, entityType: "job", eventName: "page_view" },
      _count: { _all: true },
      orderBy: { _count: { entitySlug: "desc" } }
    }),
    prisma.analyticsEvent.groupBy({
      by: ["entitySlug"],
      where: { ...where, entityType: "post", eventName: "page_view" },
      _count: { _all: true },
      orderBy: { _count: { entitySlug: "desc" } }
    }),
    prisma.analyticsEvent.findMany({
      where: { ...where, eventName: "search_submit" },
      select: {
        metadata: true,
        createdAt: true
      },
      orderBy: { createdAt: "desc" },
      take: 20
    }),
    prisma.analyticsEvent.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 20
    })
  ]);

  return {
    totals,
    pageViews: eventCounts.find((item) => item.eventName === "page_view")?._count._all ?? 0,
    searches: eventCounts.find((item) => item.eventName === "search_submit")?._count._all ?? 0,
    jobClicks: eventCounts.find((item) => item.eventName === "job_click")?._count._all ?? 0,
    blogClicks: eventCounts.find((item) => item.eventName === "blog_click")?._count._all ?? 0,
    applyClicks: eventCounts.find((item) => item.eventName === "apply_click")?._count._all ?? 0,
    eventCounts: trimTop(eventCounts),
    topPages: trimTop(topPages),
    topSources: trimTop(topSources.filter((item) => item.source)),
    topReferrers: trimTop(topReferrers.filter((item) => item.referrerHost)),
    topMediums: trimTop(topMediums.filter((item) => item.medium)),
    topDevices: trimTop(topDevices.filter((item) => item.deviceType)),
    topBrowsers: trimTop(topBrowsers.filter((item) => item.browser)),
    topSystems: trimTop(topSystems.filter((item) => item.os)),
    topJobs: trimTop(topJobs.filter((item) => item.entitySlug)),
    topPosts: trimTop(topPosts.filter((item) => item.entitySlug)),
    topSearches: topSearches
      .map((entry) => ({
        query:
          typeof entry.metadata === "object" &&
          entry.metadata !== null &&
          "query" in entry.metadata &&
          typeof (entry.metadata as { query?: unknown }).query === "string"
            ? ((entry.metadata as { query?: string }).query ?? "").trim()
            : "",
        createdAt: entry.createdAt
      }))
      .filter((entry) => entry.query),
    recentEvents,
    applyRate:
      (eventCounts.find((item) => item.eventName === "job_click")?._count._all ?? 0) > 0
        ? Number(
            (
              ((eventCounts.find((item) => item.eventName === "apply_click")?._count._all ?? 0) /
                (eventCounts.find((item) => item.eventName === "job_click")?._count._all ?? 1)) *
              100
            ).toFixed(1)
          )
        : 0
  };
}
