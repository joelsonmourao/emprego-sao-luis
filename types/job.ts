export type JobCard = {
  id: string;
  slug: string;
  title: string;
  companyName: string;
  cityName: string;
  stateCode: string;
  summary: string;
  locationType: "ONSITE" | "REMOTE" | "HYBRID";
  publishedAt: string;
  featured: boolean;
  applyUrl: string;
};

export type JobDetail = JobCard & {
  descriptionHtml: string;
  requirements: string[];
  benefits: string[];
  salaryMin: number | null;
  salaryMax: number | null;
  employmentType:
    | "APPRENTICESHIP"
    | "INTERNSHIP"
    | "TEMPORARY"
    | "PART_TIME"
    | "FULL_TIME"
    | "CONTRACTOR"
    | "VOLUNTEER"
    | "PER_DIEM"
    | "OTHER";
  workHours: string | null;
  expiresAt: string | null;
  seoTitle: string;
  seoDescription: string;
};
