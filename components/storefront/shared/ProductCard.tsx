import Link from "next/link";

import type { Product } from "@/lib/storefront/types";

import { AddToCartButton } from "@/components/storefront/shared/AddToCartButton";
import { AgeRestrictedNotice } from "@/components/storefront/shared/AgeRestrictedNotice";
import { ProductImage } from "@/components/storefront/shared/ProductImage";
import { StockBadge } from "@/components/storefront/shared/StockBadge";

export function StoreProductCard({ product }: Readonly<{ product: Product }>) {
  return (
    <article className="group overflow-hidden rounded-[18px] border border-[var(--freshco-border)] bg-white p-2 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(23,53,52,0.08)] sm:rounded-[26px] sm:p-4">
      <Link
        className="block rounded-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-2 sm:rounded-[20px]"
        href={`/product/${product.slug}`}
      >
        <div className="relative h-[112px] overflow-hidden rounded-[14px] bg-[var(--freshco-surface-soft)] sm:h-[180px] sm:rounded-[20px]">
          <ProductImage
            alt={product.name}
            className="object-contain p-2.5 transition duration-300 group-hover:scale-[1.03] sm:p-4"
            fallbackClassName="flex h-full w-full items-center justify-center px-2 text-center text-[0.62rem] font-bold uppercase tracking-[0.1em] text-[var(--freshco-text-soft)] sm:px-4 sm:text-[0.84rem] sm:tracking-[0.14em]"
            fallbackLabel={product.name}
            sizes="(max-width: 640px) 33vw, (max-width: 768px) 50vw, 360px"
            src={product.image}
            wrapperClassName="absolute inset-0"
          />
          <div className="absolute left-2 top-2 flex flex-wrap gap-1 sm:left-3 sm:top-3 sm:gap-2">
            {product.compareAtPrice ? (
              <span className="inline-flex rounded-full bg-[#173534] px-2 py-1 text-[0.5rem] font-extrabold uppercase tracking-[0.08em] text-white sm:px-3 sm:text-[0.64rem] sm:tracking-[0.12em]">
                Promo
              </span>
            ) : null}
            {product.organic ? (
              <span className="inline-flex rounded-full bg-white/92 px-2 py-1 text-[0.5rem] font-extrabold uppercase tracking-[0.08em] text-[var(--freshco-brand-dark)] sm:px-3 sm:text-[0.64rem] sm:tracking-[0.12em]">
                Organic
              </span>
            ) : null}
          </div>
        </div>
      </Link>
      <div className="mt-2.5 sm:mt-4">
        <p className="text-[0.48rem] font-extrabold uppercase tracking-[0.08em] text-[var(--freshco-brand-dark)] sm:text-[0.68rem] sm:tracking-[0.13em]">
          {product.department.replace("-", " ")}
        </p>
        <Link
          className="rounded-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-2 sm:rounded-[12px]"
          href={`/product/${product.slug}`}
        >
          <h3 className="mt-1 line-clamp-2 min-h-[2.35rem] text-[0.74rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-[var(--freshco-text)] sm:mt-1.5 sm:min-h-0 sm:text-[1.08rem] sm:leading-[1.06] sm:tracking-[-0.035em]">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1.5 line-clamp-2 text-[0.62rem] leading-4 text-[var(--freshco-text-soft)] sm:mt-2 sm:text-[0.88rem] sm:leading-6">
          {product.shortDescription}
        </p>
        <div className="mt-2 sm:mt-3">
          <StockBadge quantity={product.stockQuantity} stockState={product.stockState} />
        </div>
        <div className="mt-2 hidden flex-wrap gap-1.5 sm:mt-3 sm:flex">
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
          <div className="mt-2 sm:mt-3">
            <AgeRestrictedNotice compact />
          </div>
        ) : null}
        <div className="mt-2.5 flex flex-col gap-2 border-t border-[var(--freshco-border)] pt-2.5 sm:mt-4 sm:gap-3 sm:pt-4">
          <div>
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              <p className="text-[0.82rem] font-extrabold tracking-[-0.03em] text-[var(--freshco-text)] sm:text-[1.2rem] sm:tracking-[-0.035em]">
                ${product.price.toFixed(2)}
              </p>
              {product.compareAtPrice ? (
                <span className="text-[0.56rem] font-bold text-[var(--freshco-text-soft)] line-through sm:text-[0.78rem]">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              ) : null}
            </div>
            <p className="mt-0.5 line-clamp-1 text-[0.52rem] font-semibold text-[var(--freshco-text-soft)] sm:text-[0.74rem]">
              {product.unit} · SKU {product.sku}
            </p>
          </div>
          <div className="scale-[0.88] origin-left sm:scale-100">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </article>
  );
}
