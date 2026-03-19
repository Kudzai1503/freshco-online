"use client";

import { useMemo, useState } from "react";

import { useStorefrontSession } from "@/lib/storefront/browser-session";
import type { Product } from "@/lib/storefront/types";

import { AgeRestrictedNotice } from "@/components/storefront/shared/AgeRestrictedNotice";
import { StockBadge } from "@/components/storefront/shared/StockBadge";

export function ProductDetailActions({ product }: Readonly<{ product: Product }>) {
  const { setCartItem, cart, stockSnapshot } = useStorefrontSession();
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const liveProduct = useMemo(() => {
    const live = stockSnapshot[product.id];
    return live
      ? {
          ...product,
          stockQty: live.quantity,
          stockQuantity: live.quantity,
          stockState: live.state,
        }
      : product;
  }, [product, stockSnapshot]);

  const inCart = cart.items.find((item) => item.productId === product.id)?.quantity ?? 0;
  const availableQuantity = Math.max(0, liveProduct.stockQuantity - inCart);
  const maxQuantity = Math.max(1, availableQuantity);
  const isOutOfStock = liveProduct.stockState === "out_of_stock" || availableQuantity === 0;
  const isLowStock = liveProduct.stockState === "low_stock" || availableQuantity <= 5;

  async function handleAdd() {
    if (isOutOfStock) {
      return;
    }

    setSubmitting(true);
    await setCartItem(product.id, inCart + quantity);
    setSubmitting(false);
  }

  return (
    <div className="rounded-[30px] border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] p-6">
      <StockBadge quantity={liveProduct.stockQuantity} stockState={liveProduct.stockState} />
      {liveProduct.ageRestricted ? (
        <div className="mt-4">
          <AgeRestrictedNotice />
        </div>
      ) : null}
      {isLowStock && !isOutOfStock ? (
        <p className="mt-4 text-[0.88rem] font-bold text-[#A66A00]">
          Limited stock available. You can add up to {availableQuantity} more
          {availableQuantity === 1 ? " unit" : " units"} right now.
        </p>
      ) : null}
      <div className="mt-5 flex items-center gap-3">
        <label className="text-[0.82rem] font-bold uppercase tracking-[0.14em] text-[var(--freshco-text-soft)]" htmlFor="qty">
          Quantity
        </label>
        <div className="inline-flex items-center rounded-full border border-[var(--freshco-border)] bg-white">
          <button
            aria-label="Decrease quantity"
            className="h-10 w-10 text-[var(--freshco-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-inset"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            disabled={isOutOfStock}
            type="button"
          >
            -
          </button>
          <input
            className="h-10 w-12 bg-transparent text-center text-[var(--freshco-text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--freshco-brand)]"
            disabled={isOutOfStock}
            id="qty"
            max={maxQuantity}
            min={1}
            onChange={(event) => setQuantity(Math.max(1, Math.min(maxQuantity, Number(event.target.value) || 1)))}
            type="number"
            value={quantity}
          />
          <button
            aria-label="Increase quantity"
            className="h-10 w-10 text-[var(--freshco-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-inset"
            onClick={() => setQuantity((current) => Math.min(maxQuantity, current + 1))}
            disabled={isOutOfStock}
            type="button"
          >
            +
          </button>
        </div>
      </div>
      <button
        className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-[var(--freshco-brand)] px-5 text-[0.82rem] font-extrabold uppercase tracking-[0.14em] text-white transition duration-200 hover:-translate-y-0.5 hover:brightness-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#B9DDB7]"
        disabled={isOutOfStock || submitting}
        onClick={() => void handleAdd()}
        type="button"
      >
        {isOutOfStock
          ? "Out of stock"
          : submitting
            ? "Adding..."
            : isLowStock
              ? `Add ${quantity} before it sells out`
              : `Add ${quantity} to cart`}
      </button>
    </div>
  );
}
