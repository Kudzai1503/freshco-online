import Link from "next/link";

import { createCatalogHref, type SearchParamsMap } from "@/lib/storefront/catalog-url";
import type { Department, SearchFilters } from "@/lib/storefront/types";

const departmentOptions = [
  { slug: "fruits", name: "Fruits" },
  { slug: "vegetables", name: "Vegetables" },
  { slug: "groceries", name: "Groceries" },
  { slug: "deli", name: "Deli" },
  { slug: "confectionery", name: "Confectionery" },
  { slug: "butchery", name: "Butchery" },
  { slug: "winery", name: "Winery" },
  { slug: "dairy-eggs", name: "Dairy & Eggs" },
  { slug: "bakery", name: "Bakery" },
  { slug: "beverages", name: "Beverages" },
  { slug: "household", name: "Household" },
] as const;

type CatalogFiltersProps = Readonly<{
  departments: Department[];
  filters: SearchFilters;
  searchParams: SearchParamsMap;
}>;

function FilterPanel({ departments, filters, searchParams }: CatalogFiltersProps) {
  void departments;

  return (
    <div className="flex flex-wrap gap-2">
      {departmentOptions.map((department) => (
        <Link
          key={department.slug}
          className={`inline-flex rounded-full px-4 py-2 text-[0.76rem] font-bold uppercase tracking-[0.12em] transition ${
            filters.department === department.slug
              ? "bg-[var(--freshco-brand)] text-white"
              : "border border-[var(--freshco-border)] bg-white text-[var(--freshco-text-soft)] hover:border-[var(--freshco-brand)] hover:text-[var(--freshco-text)]"
          } ${["deli", "confectionery", "butchery", "winery"].includes(department.slug) ? "ring-1 ring-[var(--freshco-brand)]/25" : ""}`}
          aria-current={filters.department === department.slug ? "page" : undefined}
          href={createCatalogHref(searchParams, { department: department.slug })}
        >
          {department.name}
        </Link>
      ))}
    </div>
  );
}

export function CatalogFilters(props: CatalogFiltersProps) {
  return (
    <>
      <details className="rounded-[32px] border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] p-5 xl:hidden">
        <div className="mb-5 flex justify-center">
          <p className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#173534] px-5 text-[0.84rem] font-extrabold uppercase tracking-[0.18em] text-white shadow-[0_14px_30px_rgba(23,53,52,0.18)]">
            Filters
          </p>
        </div>
        <summary className="cursor-pointer list-none rounded-full text-[0.82rem] font-extrabold uppercase tracking-[0.14em] text-[var(--freshco-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-2">
          Departments
        </summary>
        <div className="mt-5">
          <FilterPanel {...props} />
        </div>
      </details>

      <aside className="hidden rounded-[32px] border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] p-5 xl:sticky xl:top-24 xl:block">
        <div className="mb-5 flex justify-center">
          <p className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#173534] px-5 text-[0.84rem] font-extrabold uppercase tracking-[0.18em] text-white shadow-[0_14px_30px_rgba(23,53,52,0.18)]">
            Filters
          </p>
        </div>
        <FilterPanel {...props} />
      </aside>
    </>
  );
}
