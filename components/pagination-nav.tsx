import Link from "next/link";

type PaginationNavProps = {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
};

export function PaginationNav({ page, totalPages, buildHref }: PaginationNavProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).slice(Math.max(0, page - 3), Math.min(totalPages, page + 2));

  return (
    <nav aria-label="Paginacao" className="flex flex-wrap items-center justify-center gap-3">
      {page > 1 ? (
      <Link href={buildHref(page - 1) as never} className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 text-sm font-medium text-[var(--brand-text-secondary)] transition hover:border-[color:rgba(255,109,0,0.22)] hover:text-[var(--brand-orange)]">
          Anterior
        </Link>
      ) : null}

      {pages.map((pageNumber) => (
        <Link
          key={pageNumber}
          href={buildHref(pageNumber) as never}
          aria-current={pageNumber === page ? "page" : undefined}
          className={
            pageNumber === page
            ? "rounded-full bg-[var(--brand-navy)] px-4 py-2 text-sm font-semibold text-white"
            : "rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 text-sm font-medium text-[var(--brand-text-secondary)] transition hover:border-[color:rgba(255,109,0,0.22)] hover:text-[var(--brand-orange)]"
          }
        >
          {pageNumber}
        </Link>
      ))}

      {page < totalPages ? (
      <Link href={buildHref(page + 1) as never} className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 text-sm font-medium text-[var(--brand-text-secondary)] transition hover:border-[color:rgba(255,109,0,0.22)] hover:text-[var(--brand-orange)]">
          Próxima
        </Link>
      ) : null}
    </nav>
  );
}
