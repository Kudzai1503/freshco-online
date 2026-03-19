import Link from "next/link";

import { CatalogFilters } from "@/components/storefront/catalog/CatalogFilters";
import { ProductGrid } from "@/components/storefront/catalog/ProductGrid";
import { createCatalogHref } from "@/lib/storefront/catalog-url";
import { getCatalogPageData } from "@/lib/storefront/queries";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const { departments, filters, result } = await getCatalogPageData(resolvedSearchParams);
  const start = result.total === 0 ? 0 : (result.page - 1) * result.pageSize + 1;
  const end = Math.min(result.page * result.pageSize, result.total);
  const activeFilters = [
    filters.query ? { label: `Search: ${filters.query}`, href: createCatalogHref(resolvedSearchParams, { q: undefined }) } : null,
    filters.department && filters.department !== "all"
      ? {
          label:
            filters.department === "bakery"
              ? "Bakery"
              : departments.find((department) => department.slug === filters.department)?.name ??
                filters.department,
          href: createCatalogHref(resolvedSearchParams, { department: undefined }),
        }
      : null,
  ].filter((entry): entry is { label: string; href: string } => Boolean(entry));

  return (
    <main className="bg-white px-4 py-8 sm:px-6 lg:px-8 xl:px-10 2xl:px-14">
      <section className="rounded-[38px] border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] px-5 py-8 sm:px-7 lg:px-10">
        <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.18em] text-[var(--freshco-brand-dark)]">
          FreshCo Shop
        </p>
        <div className="mt-3 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-end">
          <div>
            <h1 className="text-[2.6rem] font-extrabold leading-[0.94] tracking-[-0.06em] text-[var(--freshco-text)] sm:text-[3.3rem]">
              Browse products and buy.
            </h1>
          </div>
          <p className="max-w-[360px] text-[1rem] leading-7 text-[var(--freshco-text-soft)]">
            Search across product names with a simpler FreshCo catalog.
          </p>
        </div>
        <form action="/shop" className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            className="h-12 flex-1 rounded-full border border-[var(--freshco-border)] bg-white px-5 text-[0.96rem] text-[var(--freshco-text)] outline-none transition focus:border-[var(--freshco-brand)] focus-visible:ring-2 focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-2"
            defaultValue={filters.query ?? ""}
            name="q"
            placeholder="Search deli, butchery, winery, pantry staples..."
            type="search"
          />
          <button
            className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--freshco-brand)] px-6 text-[0.82rem] font-extrabold uppercase tracking-[0.14em] text-white transition duration-200 hover:-translate-y-0.5 hover:brightness-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-2"
            type="submit"
          >
            Search catalog
          </button>
        </form>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)] xl:items-start">
        <CatalogFilters
          departments={departments}
          filters={filters}
          searchParams={resolvedSearchParams}
        />
        <section>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-[1.55rem] font-extrabold tracking-[-0.04em] text-[var(--freshco-text)]">
                {result.total} products
              </h2>
              <p className="text-[0.98rem] text-[var(--freshco-text-soft)]">
                Showing {start} to {end} with direct access to Deli, Confectionery, Butchery, and Winery.
              </p>
            </div>
            {activeFilters.length > 0 ? (
              <Link
                className="inline-flex rounded-full border border-[var(--freshco-border)] bg-white px-4 py-2 text-[0.76rem] font-bold uppercase tracking-[0.12em] text-[var(--freshco-text-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-2"
                href="/shop"
              >
                Clear all
              </Link>
            ) : null}
          </div>

          {activeFilters.length > 0 ? (
            <div className="mb-5 flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <Link
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--freshco-surface-soft)] px-4 py-2 text-[0.74rem] font-bold uppercase tracking-[0.12em] text-[var(--freshco-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-2"
                  href={filter.href}
                  key={filter.label}
                >
                  <span>{filter.label}</span>
                  <span aria-hidden="true">×</span>
                </Link>
              ))}
            </div>
          ) : null}

          <ProductGrid products={result.products} />

          {result.totalPages > 1 ? (
            <nav aria-label="Catalog pagination" className="mt-8 flex flex-wrap items-center gap-2">
              {result.page > 1 ? (
                <Link
                  className="inline-flex rounded-full border border-[var(--freshco-border)] bg-white px-4 py-2 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[var(--freshco-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-2"
                  href={createCatalogHref(resolvedSearchParams, { page: String(result.page - 1) })}
                >
                  Previous
                </Link>
              ) : null}
              {Array.from({ length: result.totalPages }, (_, index) => index + 1)
                .slice(Math.max(0, result.page - 3), Math.min(result.totalPages, result.page + 2))
                .map((page) => (
                  <Link
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-[0.78rem] font-extrabold uppercase tracking-[0.12em] ${
                      page === result.page
                        ? "bg-[var(--freshco-brand)] text-white"
                        : "border border-[var(--freshco-border)] bg-white text-[var(--freshco-text)]"
                    } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-2`}
                    href={createCatalogHref(resolvedSearchParams, { page: String(page) })}
                    key={page}
                  >
                    {page}
                  </Link>
                ))}
              {result.page < result.totalPages ? (
                <Link
                  className="inline-flex rounded-full border border-[var(--freshco-border)] bg-white px-4 py-2 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[var(--freshco-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-2"
                  href={createCatalogHref(resolvedSearchParams, { page: String(result.page + 1) })}
                >
                  Next
                </Link>
              ) : null}
            </nav>
          ) : null}
        </section>
      </div>
    </main>
  );
}
