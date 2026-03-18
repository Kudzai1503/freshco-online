import type { Product } from "@/lib/storefront/types";

import { StoreProductCard } from "@/components/storefront/shared/ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-[30px] border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] p-8">
        <h3 className="text-[1.6rem] font-extrabold tracking-[-0.05em] text-[var(--freshco-text)]">
          No products match these filters.
        </h3>
        <p className="mt-3 text-[1rem] leading-7 text-[var(--freshco-text-soft)]">
          Try a broader search, switch departments, or remove stock filters to explore more FreshCo items.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {products.map((product) => (
        <StoreProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
