import Link from "next/link";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="min-w-0 text-xs text-slate-500 sm:text-sm">
      <ol className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1 sm:flex-wrap">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex min-w-0 shrink-0 items-center gap-2 sm:shrink">
            {item.href ? (
              <Link href={item.href as never} className="break-words whitespace-nowrap sm:whitespace-normal">
                {item.label}
              </Link>
            ) : (
              <span className="break-words whitespace-nowrap text-slate-700 sm:whitespace-normal">{item.label}</span>
            )}
            {index < items.length - 1 ? <ChevronRight className="h-4 w-4" /> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
