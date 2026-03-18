import Link from "next/link";

import type { Product } from "@/lib/storefront/types";

import { AddToCartButton } from "@/components/storefront/shared/AddToCartButton";
import { AgeRestrictedNotice } from "@/components/storefront/shared/AgeRestrictedNotice";
import { ProductImage } from "@/components/storefront/shared/ProductImage";

export function StoreProductCard({ product }: Readonly<{ product: Product }>) {
  return (
    <article className="group overflow-hidden rounded-[26px] border border-[var(--freshco-border)] bg-white p-3 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(23,53,52,0.08)] sm:p-4">
      <Link href={`/shop/${product.slug}`}>
        <div className="relative h-[180px] overflow-hidden rounded-[20px] bg-[var(--freshco-surface-soft)]">
          <ProductImage
            alt={product.name}
            className="object-contain p-4 transition duration-300 group-hover:scale-[1.03]"
            fallbackClassName="flex h-full w-full items-center justify-center px-4 text-center text-[0.84rem] font-bold uppercase tracking-[0.14em] text-[var(--freshco-text-soft)]"
            fallbackLabel={product.name}
            sizes="(max-width: 768px) 100vw, 360px"
            src={product.image}
            wrapperClassName="absolute inset-0"
          />
        </div>
      </Link>
      <div className="mt-4">
        <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.13em] text-[var(--freshco-brand-dark)]">
          {product.department.replace("-", " ")}
        </p>
        <Link href={`/shop/${product.slug}`}>
          <h3 className="mt-1.5 text-[1.08rem] font-extrabold leading-[1.06] tracking-[-0.035em] text-[var(--freshco-text)]">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 text-[0.88rem] leading-6 text-[var(--freshco-text-soft)]">
          {product.shortDescription}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex rounded-full bg-[var(--freshco-surface-soft)] px-2.5 py-1 text-[0.66rem] font-bold uppercase tracking-[0.1em] text-[var(--freshco-text-soft)]"
            >
              {tag}
            </span>
          ))}
        </div>
        {product.ageRestricted ? (
          <div className="mt-3">
            <AgeRestrictedNotice compact />
          </div>
        ) : null}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[1.2rem] font-extrabold tracking-[-0.035em] text-[var(--freshco-text)]">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-[0.74rem] font-semibold text-[var(--freshco-text-soft)]">
              SKU {product.sku}
            </p>
          </div>
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  );
}
