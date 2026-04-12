"use client";

import type { AnchorHTMLAttributes } from "react";

import { trackPortalEvent } from "@/lib/analytics/client";

type TrackedExternalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  eventName: string;
  entityType?: string;
  entitySlug?: string;
  metadata?: Record<string, unknown>;
};

export function TrackedExternalLink({
  eventName,
  entityType,
  entitySlug,
  metadata,
  onClick,
  href,
  ...props
}: TrackedExternalLinkProps) {
  return (
    <a
      {...props}
      href={href}
      onClick={(event) => {
        onClick?.(event);
        void trackPortalEvent({
          eventName,
          path: typeof href === "string" ? href : "",
          entityType,
          entitySlug,
          metadata
        });
      }}
    />
  );
}

