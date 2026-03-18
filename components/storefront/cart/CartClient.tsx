"use client";

import Link from "next/link";

import { useStorefrontSession } from "@/lib/storefront/browser-session";

import { AgeRestrictedNotice } from "@/components/storefront/shared/AgeRestrictedNotice";
import { StockBadge } from "@/components/storefront/shared/StockBadge";

export function CartClient() {
  const { preview, loaded, setCartItem, removeCartItem } = useStorefrontSession();

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
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="grid gap-4">
        {preview.items.map((item) => (
          <article
            key={item.product.id}
            className="rounded-[30px] border border-[var(--freshco-border)] bg-white p-5"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
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
                <div className="mt-4">
                  <StockBadge quantity={item.product.stockQuantity} stockState={item.product.stockState} />
                </div>
                {item.product.ageRestricted ? (
                  <div className="mt-4">
                    <AgeRestrictedNotice compact />
                  </div>
                ) : null}
              </div>

              <div className="flex min-w-[180px] flex-col gap-4 sm:items-end">
                <div className="inline-flex items-center rounded-full border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)]">
                  <button
                    className="h-10 w-10"
                    onClick={() => void setCartItem(item.product.id, item.quantity - 1)}
                    type="button"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold">{item.quantity}</span>
                  <button
                    className="h-10 w-10"
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
        <h2 className="text-[1.6rem] font-extrabold tracking-[-0.05em] text-[var(--freshco-text)]">
          Cart summary
        </h2>
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
            <span>Total</span>
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
  );
}

