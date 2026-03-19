"use client";

import Link from "next/link";

import { useStorefrontSession } from "@/lib/storefront/browser-session";
import { products } from "@/lib/storefront/mock/data";

import { AgeRestrictedNotice } from "@/components/storefront/shared/AgeRestrictedNotice";
import { ProductImage } from "@/components/storefront/shared/ProductImage";
import { StoreProductCard } from "@/components/storefront/shared/ProductCard";
import { StockBadge } from "@/components/storefront/shared/StockBadge";

export function CartClient() {
  const { preview, loaded, setCartItem, removeCartItem, clearCart } = useStorefrontSession();
  const hasWineryItems = preview.items.some((item) => item.product.ageRestricted);
  const cartProductIds = new Set(preview.items.map((item) => item.product.id));
  const cartCategories = new Set(preview.items.map((item) => item.product.category));
  const recommendations = products
    .filter(
      (product) => cartCategories.has(product.category) && !cartProductIds.has(product.id),
    )
    .slice(0, 4);

  if (!loaded) {
    return <p className="text-[var(--freshco-text-soft)]">Loading cart…</p>;
  }

  if (preview.items.length === 0) {
    return (
      <div className="rounded-[30px] border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] p-8">
        <h2 className="text-[2rem] font-extrabold tracking-[-0.05em] text-[var(--freshco-text)]">
          Your cart is empty.
        </h2>
        <p className="mt-3 max-w-[480px] text-[1rem] leading-7 text-[var(--freshco-text-soft)]">
          Browse the full FreshCo catalog and add fresh produce, deli picks, household essentials, and more.
        </p>
        <Link
          className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[var(--freshco-brand)] px-5 text-[0.82rem] font-extrabold uppercase tracking-[0.14em] text-white"
          href="/shop"
        >
          Go to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      {hasWineryItems ? (
        <div className="rounded-[24px] border border-[#A66A00]/18 bg-[#FFF6D8] p-5 text-[#6E4C05]">
          <AgeRestrictedNotice compact />
          <p className="mt-3 text-[0.92rem] leading-7">
            Your cart includes winery items. Please make sure an adult shopper is available for handoff.
          </p>
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-4">
          {preview.items.map((item) => (
            <article
              key={item.product.id}
              className="rounded-[30px] border border-[var(--freshco-border)] bg-white p-5"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-4">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[20px] border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)]">
                    <ProductImage
                      alt={item.product.name}
                      className="object-contain p-3"
                      fallbackClassName="flex h-full w-full items-center justify-center px-2 text-center text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-[var(--freshco-brand-dark)]"
                      fallbackLabel={item.product.name}
                      sizes="96px"
                      src={item.product.image}
                      wrapperClassName="absolute inset-0"
                    />
                  </div>
                  <div className="max-w-[520px]">
                    <p className="text-[0.78rem] font-bold uppercase tracking-[0.14em] text-[var(--freshco-brand-dark)]">
                      {item.product.department.replace("-", " ")}
                    </p>
                    <h3 className="mt-2 text-[1.45rem] font-extrabold tracking-[-0.04em] text-[var(--freshco-text)]">
                      {item.product.name}
                    </h3>
                    <p className="mt-2 text-[0.98rem] leading-7 text-[var(--freshco-text-soft)]">
                      {item.product.shortDescription}
                    </p>
                    <p className="mt-2 text-[0.92rem] font-bold text-[var(--freshco-text-soft)]">
                      ${item.product.price.toFixed(2)} each · {item.product.unit}
                    </p>
                    <div className="mt-4">
                      <StockBadge
                        quantity={item.product.stockQuantity}
                        stockState={item.product.stockState}
                      />
                    </div>
                    {item.product.stockState === "low_stock" ? (
                      <p className="mt-3 text-[0.88rem] font-bold text-[#A66A00]">
                        Friendly heads-up: only a few of these are left in stock.
                      </p>
                    ) : null}
                    {item.product.stockState === "out_of_stock" ? (
                      <p className="mt-3 text-[0.88rem] font-bold text-[#A33A3A]">
                        This item is out of stock. Reduce quantity or remove it before checkout.
                      </p>
                    ) : null}
                    {item.product.ageRestricted ? (
                      <div className="mt-4">
                        <AgeRestrictedNotice compact />
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex min-w-[180px] flex-col gap-4 sm:items-end">
                  <div className="inline-flex items-center rounded-full border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)]">
                    <button
                      className="h-10 w-10 disabled:opacity-40"
                      disabled={item.quantity <= 1}
                      onClick={() => void setCartItem(item.product.id, item.quantity - 1)}
                      type="button"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold">{item.quantity}</span>
                    <button
                      className="h-10 w-10 disabled:opacity-40"
                      disabled={
                        item.product.stockState === "out_of_stock" ||
                        item.quantity >= item.product.stockQuantity
                      }
                      onClick={() => void setCartItem(item.product.id, item.quantity + 1)}
                      type="button"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-[1.25rem] font-extrabold tracking-[-0.04em] text-[var(--freshco-text)]">
                    ${item.lineTotal.toFixed(2)}
                  </p>
                  <button
                    className="text-[0.82rem] font-bold uppercase tracking-[0.14em] text-[#A33A3A]"
                    onClick={() => void removeCartItem(item.product.id)}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="rounded-[30px] border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[1.6rem] font-extrabold tracking-[-0.05em] text-[var(--freshco-text)]">
              Cart summary
            </h2>
            <button
              className="text-[0.76rem] font-extrabold uppercase tracking-[0.14em] text-[#A33A3A]"
              onClick={() => void clearCart()}
              type="button"
            >
              Clear cart
            </button>
          </div>
          <div className="mt-5 space-y-3 text-[1rem] text-[var(--freshco-text-soft)]">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <strong className="text-[var(--freshco-text)]">${preview.subtotal.toFixed(2)}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Delivery</span>
              <strong className="text-[var(--freshco-text)]">${preview.deliveryFee.toFixed(2)}</strong>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--freshco-border)] pt-3 text-[1.1rem]">
              <span>Estimated total</span>
              <strong className="text-[var(--freshco-text)]">${preview.total.toFixed(2)}</strong>
            </div>
          </div>
          <Link
            className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-[var(--freshco-brand)] px-5 text-[0.82rem] font-extrabold uppercase tracking-[0.14em] text-white"
            href="/checkout"
          >
            Continue to checkout
          </Link>
        </aside>
      </div>

      {recommendations.length > 0 ? (
        <section>
          <div className="mb-5">
            <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.16em] text-[var(--freshco-brand-dark)]">
              You may also like
            </p>
            <h2 className="mt-2 text-[2rem] font-extrabold tracking-[-0.05em] text-[var(--freshco-text)]">
              Add a few category-matched extras before checkout.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
            {recommendations.map((product) => (
              <StoreProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
