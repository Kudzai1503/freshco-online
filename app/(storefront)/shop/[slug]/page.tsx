import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductDetailActions } from "@/components/storefront/product/ProductDetailActions";
import { AgeRestrictedNotice } from "@/components/storefront/shared/AgeRestrictedNotice";
import { ProductImage } from "@/components/storefront/shared/ProductImage";
import { StoreProductCard } from "@/components/storefront/shared/ProductCard";
import { StockBadge } from "@/components/storefront/shared/StockBadge";
import { getProductPageData } from "@/lib/storefront/queries";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getProductPageData(slug);

  if (!data) {
    notFound();
  }

  const { product, relatedProducts } = data;

  return (
    <main className="bg-white px-4 py-8 sm:px-6 lg:px-8 xl:px-10 2xl:px-14">
      <div className="rounded-[38px] border border-[var(--freshco-border)] bg-white p-5 sm:p-7 lg:p-10">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_420px]">
          <section className="rounded-[34px] bg-[var(--freshco-surface-soft)] p-6">
            <div className="relative h-[420px] overflow-hidden rounded-[28px] bg-white">
              <ProductImage
                alt={product.name}
                className="object-contain p-8"
                fallbackClassName="flex h-full w-full items-center justify-center text-[1.2rem] font-bold uppercase tracking-[0.16em] text-[var(--freshco-text-soft)]"
                fallbackLabel={product.name}
                priority
                sizes="(max-width: 1280px) 100vw, 720px"
                src={product.image}
                wrapperClassName="absolute inset-0"
              />
            </div>
          </section>

          <section className="flex flex-col gap-5">
            <div>
              <p className="text-[0.8rem] font-extrabold uppercase tracking-[0.16em] text-[var(--freshco-brand-dark)]">
                {product.department.replace("-", " ")}
              </p>
              <h1 className="mt-3 text-[2.8rem] font-extrabold leading-[0.92] tracking-[-0.06em] text-[var(--freshco-text)]">
                {product.name}
              </h1>
              <p className="mt-4 text-[1rem] leading-8 text-[var(--freshco-text-soft)]">
                {product.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <StockBadge quantity={product.stockQuantity} stockState={product.stockState} />
              <span className="rounded-full bg-[var(--freshco-surface-soft)] px-4 py-2 text-[0.78rem] font-bold uppercase tracking-[0.14em] text-[var(--freshco-text-soft)]">
                SKU {product.sku}
              </span>
            </div>

            {product.ageRestricted ? <AgeRestrictedNotice /> : null}

            <div className="rounded-[30px] border border-[var(--freshco-border)] bg-white p-5">
              <p className="text-[2rem] font-extrabold tracking-[-0.05em] text-[var(--freshco-text)]">
                ${product.price.toFixed(2)}
              </p>
              <p className="mt-2 text-[0.96rem] text-[var(--freshco-text-soft)]">
                Searchable tags: {product.tags.join(", ")}
              </p>
            </div>

            <ProductDetailActions product={product} />

            <Link
              className="inline-flex text-[0.9rem] font-bold text-[var(--freshco-brand-dark)]"
              href={`/shop?department=${product.department}`}
            >
              Back to {product.department.replace("-", " ")}
            </Link>
          </section>
        </div>
      </div>

      {relatedProducts.length > 0 ? (
        <section className="mt-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.16em] text-[var(--freshco-brand-dark)]">
                Related products
              </p>
              <h2 className="mt-2 text-[2rem] font-extrabold tracking-[-0.05em] text-[var(--freshco-text)]">
                More from this department
              </h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
            {relatedProducts.map((entry) => (
              <StoreProductCard key={entry.id} product={entry} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
