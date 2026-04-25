"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function PublicChrome({
  children,
  footer,
  header,
  integrations
}: {
  children: ReactNode;
  footer: ReactNode;
  header: ReactNode;
  integrations: ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {isAdmin ? null : header}
      <main>{children}</main>
      {isAdmin ? null : footer}
      {isAdmin ? null : integrations}
    </>
  );
}
