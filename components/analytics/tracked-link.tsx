"use client";

import type { ReactNode } from "react";
import Link from "next/link";

import { trackPortalEvent } from "@/lib/analytics/client";

type TrackedLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  eventName: string;
  entityType?: string;
  entitySlug?: string;
  metadata?: Record<string, unknown>;
};

export function TrackedLink({ href, children, className, eventName, entityType, entitySlug, metadata }: TrackedLinkProps) {
  return (
    <Link
      href={href as never}
      className={className}
      onClick={() => {
        void trackPortalEvent({
          eventName,
          path: href,
          entityType,
          entitySlug,
          metadata
        });
      }}
    >
      {children}
    </Link>
  );
}

