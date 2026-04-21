export type IndexablePageKind =
  | "jobs-root"
  | "job"
  | "state-listing"
  | "city-listing"
  | "company-listing"
  | "blog-post"
  | "technical-query";

export type ShouldIndexPageInput = {
  kind: IndexablePageKind;
  totalJobs?: number;
  isActive?: boolean;
  hasSpecificMetadata?: boolean;
  hasOwnContent?: boolean;
  internalLinkCount?: number;
  hasBetterCanonical?: boolean;
  isTechnicalQuery?: boolean;
  isDuplicateLike?: boolean;
};

const INDEX_THRESHOLDS = {
  "jobs-root": 0,
  job: 1,
  "state-listing": 3,
  "city-listing": 2,
  "company-listing": 2,
  "blog-post": 1,
  "technical-query": Number.POSITIVE_INFINITY
} satisfies Record<IndexablePageKind, number>;

export function shouldIndexPage(input: ShouldIndexPageInput) {
  const totalJobs = input.totalJobs ?? 0;
  const hasSpecificMetadata = input.hasSpecificMetadata ?? true;
  const hasOwnContent = input.hasOwnContent ?? true;
  const internalLinkCount = input.internalLinkCount ?? 0;
  const isActive = input.isActive ?? true;

  if (input.kind === "technical-query") {
    return false;
  }

  if (input.isTechnicalQuery || input.hasBetterCanonical || input.isDuplicateLike) {
    return false;
  }

  if (!hasSpecificMetadata) {
    return false;
  }

  if (input.kind === "job") {
    return isActive;
  }

  if (input.kind === "jobs-root") {
    return true;
  }

  if (!hasOwnContent) {
    return false;
  }

  if (internalLinkCount < 3) {
    return false;
  }

  return totalJobs >= INDEX_THRESHOLDS[input.kind];
}

export function toRobotsIndexFlag(shouldIndex: boolean) {
  return !shouldIndex;
}
