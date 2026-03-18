import Link from "next/link";

import type { Department, ProductQuery, SortOption, StockState } from "@/lib/storefront/types";

const prominentDepartments = ["deli", "confectionery", "butchery", "winery"];

type SearchParamsMap = Record<string, string | string[] | undefined>;

function createHref(
  current: SearchParamsMap,
  updates: Record<string, string | undefined>,
) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(current)) {
    const normalized = Array.isArray(value) ? value[0] : value;
    if (normalized) {
      params.set(key, normalized);
    }
  }

  for (const [key, value] of Object.entries(updates)) {
    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  }

  const query = params.toString();
  return query ? `/shop?${query}` : "/shop";
}

export function CatalogFilters({
  departments,
  filters,
  searchParams,
}: {
  departments: Department[];
  filters: ProductQuery;
  searchParams: SearchParamsMap;
}) {
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "featured", label: "Featured" },
    { value: "price-asc", label: "Price ↑" },
    { value: "price-desc", label: "Price ↓" },
    { value: "name-asc", label: "Name" },
    { value: "stock-desc", label: "Stock" },
  ];

  const stockOptions: { value: "all" | StockState; label: string }[] = [
    { value: "all", label: "All stock" },
    { value: "in_stock", label: "In stock" },
    { value: "low_stock", label: "Low stock" },
    { value: "out_of_stock", label: "Out of stock" },
  ];

  return (
    <aside className="rounded-[32px] border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] p-5 xl:sticky xl:top-24">
      <div className="flex flex-wrap gap-2">
        {departments.map((department) => (
          <Link
            key={department.slug}
            className={`inline-flex rounded-full px-4 py-2 text-[0.76rem] font-bold uppercase tracking-[0.12em] transition ${
              filters.department === department.slug
                ? "bg-[var(--freshco-brand)] text-white"
                : "border border-[var(--freshco-border)] bg-white text-[var(--freshco-text-soft)] hover:border-[var(--freshco-brand)] hover:text-[var(--freshco-text)]"
            } ${prominentDepartments.includes(department.slug) ? "ring-1 ring-[var(--freshco-brand)]/25" : ""}`}
            href={createHref(searchParams, { department: department.slug })}
          >
            {department.name}
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
        <div>
          <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.16em] text-[var(--freshco-text-soft)]">
            Stock
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {stockOptions.map((option) => (
              <Link
                key={option.value}
                className={`inline-flex rounded-full px-4 py-2 text-[0.76rem] font-bold uppercase tracking-[0.12em] transition ${
                  (filters.stock ?? "all") === option.value
                    ? "bg-[var(--freshco-text)] text-white"
                    : "border border-[var(--freshco-border)] bg-white text-[var(--freshco-text-soft)]"
                }`}
                href={createHref(searchParams, { stock: option.value })}
              >
                {option.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.16em] text-[var(--freshco-text-soft)]">
            Sort
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {sortOptions.map((option) => (
              <Link
                key={option.value}
                className={`inline-flex rounded-full px-4 py-2 text-[0.76rem] font-bold uppercase tracking-[0.12em] transition ${
                  (filters.sort ?? "featured") === option.value
                    ? "bg-[var(--freshco-brand-dark)] text-white"
                    : "border border-[var(--freshco-border)] bg-white text-[var(--freshco-text-soft)]"
                }`}
                href={createHref(searchParams, { sort: option.value })}
              >
                {option.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
