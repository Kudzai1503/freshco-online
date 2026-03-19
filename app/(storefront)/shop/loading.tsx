import { ProductCardSkeleton } from "@/components/storefront/shared/StorefrontSkeletons";

const filterSkeletonKeys = [
  "filter-skeleton-1",
  "filter-skeleton-2",
  "filter-skeleton-3",
  "filter-skeleton-4",
  "filter-skeleton-5",
  "filter-skeleton-6",
  "filter-skeleton-7",
  "filter-skeleton-8",
] as const;

const productSkeletonKeys = [
  "product-skeleton-1",
  "product-skeleton-2",
  "product-skeleton-3",
  "product-skeleton-4",
  "product-skeleton-5",
  "product-skeleton-6",
  "product-skeleton-7",
  "product-skeleton-8",
] as const;

export default function ShopLoading() {
  return (
    <main className="bg-white px-4 py-8 sm:px-6 lg:px-8 xl:px-10 2xl:px-14">
      <section className="rounded-[38px] border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] px-5 py-8 sm:px-7 lg:px-10">
        <div className="h-3 w-28 animate-pulse rounded-full bg-white/80" />
        <div className="mt-4 h-10 w-3/4 animate-pulse rounded-full bg-white/80" />
        <div className="mt-6 h-12 w-full animate-pulse rounded-full bg-white/90" />
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="hidden rounded-[32px] border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] p-5 xl:block">
          <div className="mb-5 flex justify-center">
            <div className="h-11 w-32 animate-pulse rounded-full bg-[#173534]" />
          </div>
          <div className="grid gap-3">
            {filterSkeletonKeys.map((key) => (
              <div
                className="h-10 animate-pulse rounded-full bg-white"
                key={key}
              />
            ))}
          </div>
        </aside>

        <section>
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <div className="h-7 w-40 animate-pulse rounded-full bg-[var(--freshco-surface-soft)]" />
              <div className="mt-3 h-4 w-64 animate-pulse rounded-full bg-[var(--freshco-surface-soft)]" />
            </div>
            <div className="h-10 w-28 animate-pulse rounded-full bg-[var(--freshco-surface-soft)]" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {productSkeletonKeys.map((key) => (
              <ProductCardSkeleton key={key} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
