import Link from "next/link";

import { AssetImage } from "@/components/home/shared/AssetImage";
import type { ProductCardData } from "@/components/home/data/content";

type ProductCardProps = Readonly<{
  product: ProductCardData;
  large?: boolean;
}>;

export function ProductCard({
  product,
  large = false,
}: ProductCardProps) {
  return (
    <article
      className="group rounded-[30px] border border-[var(--freshco-border)] bg-white p-4 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(23,53,52,0.08)] sm:p-5"
    >
      <div
        className={`relative overflow-hidden rounded-[24px] ${product.bgClassName} ${
          large ? "h-[300px]" : "h-[240px]"
        }`}
      >
        {product.badge ? (
          <span className="absolute left-4 top-4 z-10 inline-flex rounded-full bg-white/92 px-3 py-1.5 text-[0.72rem] font-bold tracking-[0.12em] text-[var(--freshco-text)]">
            {product.badge}
          </span>
        ) : null}
        <AssetImage
          alt={product.title}
          className="object-contain p-6 transition duration-300 group-hover:scale-[1.03]"
          fallbackClassName="flex h-full w-full items-center justify-center text-[1rem] font-bold uppercase tracking-[0.16em] text-[#355654]"
          fallbackLabel={product.fallbackLabel}
          fill
          sizes="(max-width: 768px) 100vw, 380px"
          src={product.src}
          wrapperClassName="absolute inset-0"
        />
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.78rem] font-bold uppercase tracking-[0.14em] text-[var(--freshco-brand-dark)]">
            {product.category}
          </p>
          <h3 className="mt-2 text-[1.22rem] font-extrabold leading-[1.04] tracking-[-0.04em] text-[var(--freshco-text)]">
            {product.title}
          </h3>
        </div>
        <Link
          aria-label={`Add ${product.title} to cart`}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--freshco-text)] text-white transition duration-200 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-2"
          href="/shop"
        >
          <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 20 20">
            <path d="M10 4V16M4 10H16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          </svg>
        </Link>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-[1.22rem] font-extrabold tracking-[-0.03em] text-[var(--freshco-text)]">
          {product.price}
        </p>
        <p className="text-[0.86rem] font-semibold text-[var(--freshco-text-soft)]">
          {product.rating} / 5
        </p>
      </div>
    </article>
  );
}
