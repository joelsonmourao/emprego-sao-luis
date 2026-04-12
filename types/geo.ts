export type StateSummary = {
  id: string;
  code: string;
  name: string;
  slug: string;
  seoTitle: string | null;
  seoIntro: string | null;
  jobsCount: number;
};

export type CitySummary = {
  id: string;
  name: string;
  slug: string;
  stateCode: string;
  stateSlug: string;
  jobsCount: number;
};
