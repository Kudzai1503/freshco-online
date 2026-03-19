import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductDetailActions } from "@/components/storefront/product/ProductDetailActions";
import { AgeRestrictedNotice } from "@/components/storefront/shared/AgeRestrictedNotice";
import { ProductImage } from "@/components/storefront/shared/ProductImage";
import { StoreProductCard } from "@/components/storefront/shared/ProductCard";
import { StockBadge } from "@/components/storefront/shared/StockBadge";
import { getProductPageData } from "@/lib/storefront/queries";
import type { Product } from "@/lib/storefront/types";

type ProductAttributeHighlight = Readonly<{
  key: string;
  label: string;
  value: string;
}>;

const categoryHighlightKeys: Partial<
  Readonly<Record<Product["category"], readonly string[]>>
> = {
  butchery: ["cut", "weight", "grassFed", "halal", "freeRange", "seasoning"],
  confectionery: ["flavor", "treatType", "texture", "count", "cocoa", "packStyle"],
  deli: ["packSize", "sliced", "readyToEat", "cheeseType", "protein", "style"],
  winery: ["variety", "bottleSize", "style", "vintage", "serving"],
};

function formatAttributeLabel(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (character) => character.toUpperCase())
    .trim();
}

function buildAttributeHighlights(product: Product): ProductAttributeHighlight[] {
  const entries = Object.entries(product.attributes).map(([key, value]) => ({
    key,
    label: formatAttributeLabel(key),
    value: String(value),
  }));
  const preferredKeys = categoryHighlightKeys[product.category];

  if (!preferredKeys) {
    return entries.slice(0, 4);
  }

  return entries.filter((entry) => preferredKeys.includes(entry.key));
}

export default async function ProductDetailPage({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;
  const data = await getProductPageData(slug);

  if (!data) {
    notFound();
  }

  const { product, relatedProducts } = data;
  const highlights = buildAttributeHighlights(product);

  return (
    <main className="bg-white px-4 py-8 sm:px-6 lg:px-8 xl:px-10 2xl:px-14">
      <div className="rounded-[38px] border border-[var(--freshco-border)] bg-white p-5 shadow-[0_12px_36px_rgba(23,53,52,0.04)] sm:p-7 lg:p-10">
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
            <div className="mt-5 flex flex-wrap gap-2">
              {product.badges.map((badge) => (
                <span
                  className="inline-flex rounded-full bg-white px-4 py-2 text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-[var(--freshco-brand-dark)]"
                  key={badge}
                >
                  {badge}
                </span>
              ))}
              {product.organic ? (
                <span className="inline-flex rounded-full border border-[#173534]/12 bg-[#F4FBF3] px-4 py-2 text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-[var(--freshco-brand-dark)]">
                  Organic
                </span>
              ) : null}
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
                {product.shortDescription}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <StockBadge quantity={product.stockQuantity} stockState={product.stockState} />
              <span className="rounded-full bg-[var(--freshco-surface-soft)] px-4 py-2 text-[0.78rem] font-bold uppercase tracking-[0.14em] text-[var(--freshco-text-soft)]">
                {product.unit}
              </span>
              <span className="rounded-full bg-[var(--freshco-surface-soft)] px-4 py-2 text-[0.78rem] font-bold uppercase tracking-[0.14em] text-[var(--freshco-text-soft)]">
                SKU {product.sku}
              </span>
            </div>

            {product.ageRestricted ? (
              <div className="rounded-[24px] border border-[#A66A00]/18 bg-[#FFF6D8] p-4">
                <AgeRestrictedNotice compact />
                <p className="mt-3 text-[0.92rem] leading-7 text-[#6E4C05]">
                  Winery items require an adult shopper and may need age confirmation when the order is handed over.
                </p>
              </div>
            ) : null}

            <div className="rounded-[30px] border border-[var(--freshco-border)] bg-white p-5">
              <div className="flex flex-wrap items-end gap-3">
                <p className="text-[2rem] font-extrabold tracking-[-0.05em] text-[var(--freshco-text)]">
                  ${product.price.toFixed(2)}
                </p>
                {product.compareAtPrice ? (
                  <span className="pb-1 text-[1rem] font-bold text-[var(--freshco-text-soft)] line-through">
                    ${product.compareAtPrice.toFixed(2)}
                  </span>
                ) : null}
              </div>
              <p className="mt-3 text-[0.96rem] text-[var(--freshco-text-soft)]">
                Highlights: {product.tags.join(", ")}
              </p>
            </div>

            {highlights.length > 0 ? (
              <div className="rounded-[30px] border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] p-5">
                <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.16em] text-[var(--freshco-text-soft)]">
                  Product details
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {highlights.map((attribute) => (
                    <div
                      className="rounded-[20px] border border-[var(--freshco-border)] bg-white px-4 py-3"
                      key={attribute.key}
                    >
                      <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-[var(--freshco-text-soft)]">
                        {attribute.label}
                      </p>
                      <p className="mt-2 text-[0.96rem] font-bold text-[var(--freshco-text)]">
                        {attribute.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <ProductDetailActions product={product} />
            <div className="rounded-[30px] border border-[var(--freshco-border)] bg-white p-5">
              <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.16em] text-[var(--freshco-text-soft)]">
                Full description
              </p>
              <p className="mt-4 text-[1rem] leading-8 text-[var(--freshco-text-soft)]">
                {product.description}
              </p>
            </div>

            <Link
              className="inline-flex rounded-full text-[0.9rem] font-bold text-[var(--freshco-brand-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-2"
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
