import Link from "next/link";

import type { Product } from "@/lib/storefront/types";

import { StoreProductCard } from "@/components/storefront/shared/ProductCard";

export function ProductGrid({ products }: Readonly<{ products: Product[] }>) {
  if (products.length === 0) {
    return (
      <div className="rounded-[30px] border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] p-8">
        <h3 className="text-[1.6rem] font-extrabold tracking-[-0.05em] text-[var(--freshco-text)]">
          No products match this view.
        </h3>
        <p className="mt-3 text-[1rem] leading-7 text-[var(--freshco-text-soft)]">
          Try a broader search or switch departments to explore more FreshCo items.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {["deli", "confectionery", "butchery", "winery"].map((department) => (
            <Link
              key={department}
              className="inline-flex rounded-full border border-[var(--freshco-border)] bg-white px-4 py-2 text-[0.76rem] font-bold uppercase tracking-[0.12em] text-[var(--freshco-text-soft)] transition hover:border-[var(--freshco-brand)] hover:text-[var(--freshco-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-2"
              href={`/shop?department=${department}`}
            >
              {department}
            </Link>
          ))}
        </div>
        <Link
          className="mt-5 inline-flex rounded-full bg-[var(--freshco-brand)] px-5 py-3 text-[0.78rem] font-extrabold uppercase tracking-[0.14em] text-white"
          href="/shop"
        >
          Reset catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3 2xl:grid-cols-4">
      {products.map((product) => (
        <StoreProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
