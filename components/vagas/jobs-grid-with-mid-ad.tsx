import type { ComponentProps, ReactNode } from "react";

import { PublicAdSlot } from "@/components/ads/public-ad-slot";
import { JobCard } from "@/components/job-card";

type JobCardItem = ComponentProps<typeof JobCard>["job"];

export async function JobsGridWithMidAd({ jobs }: { jobs: JobCardItem[] }) {
  const nodes: ReactNode[] = [];

  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    nodes.push(<JobCard key={job.slug} job={job} />);

    if (i === 5 && jobs.length > 6) {
      nodes.push(
        <div key="vagas-mid-ad" className="col-span-full my-2 sm:my-4">
          <PublicAdSlot slotSlug="vagas-grid-mid" format="auto" fullWidthResponsive />
        </div>
      );
    }
  }

  return <div className="grid gap-4 sm:gap-5 lg:grid-cols-2 xl:grid-cols-3">{nodes}</div>;
}
