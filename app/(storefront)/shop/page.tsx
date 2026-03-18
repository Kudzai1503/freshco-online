import { CatalogFilters } from "@/components/storefront/catalog/CatalogFilters";
import { ProductGrid } from "@/components/storefront/catalog/ProductGrid";
import { getCatalogPageData } from "@/lib/storefront/queries";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const { departments, filters, result } = await getCatalogPageData(resolvedSearchParams);

  return (
    <main className="bg-white px-4 py-8 sm:px-6 lg:px-8 xl:px-10 2xl:px-14">
      <section className="rounded-[38px] border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] px-5 py-8 sm:px-7 lg:px-10">
        <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.18em] text-[var(--freshco-brand-dark)]">
          FreshCo Shop
        </p>
        <div className="mt-3 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-end">
          <div>
            <h1 className="text-[2.6rem] font-extrabold leading-[0.94] tracking-[-0.06em] text-[var(--freshco-text)] sm:text-[3.3rem]">
              Browse every department from fresh fruit to winery and household essentials.
            </h1>
          </div>
          <p className="max-w-[360px] text-[1rem] leading-7 text-[var(--freshco-text-soft)]">
            Search across product names, departments, tags, and short descriptions with stock-aware product browsing.
          </p>
        </div>
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
                Category filters prominently include Deli, Confectionery, Butchery, and Winery.
              </p>
            </div>
          </div>
          <ProductGrid products={result.products} />
        </section>
      </div>
    </main>
  );
}
