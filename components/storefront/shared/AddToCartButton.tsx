"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/storefront/types";
import { useStorefrontSession } from "@/lib/storefront/browser-session";

import { StockBadge } from "@/components/storefront/shared/StockBadge";

export function AddToCartButton({
  product,
  fullWidth = false,
}: {
  product: Product;
  fullWidth?: boolean;
}) {
  const { setCartItem, cart, loaded, stockSnapshot } = useStorefrontSession();
  const [submitting, setSubmitting] = useState(false);
  const liveProduct = useMemo(() => {
    const live = stockSnapshot[product.id];
    return live
      ? {
          ...product,
          stockQuantity: live.quantity,
          stockState: live.state,
        }
      : product;
  }, [product, stockSnapshot]);

  const cartQuantity = cart.items.find((item) => item.productId === product.id)?.quantity ?? 0;
  const canAdd = liveProduct.stockState !== "out_of_stock" && cartQuantity < liveProduct.stockQuantity;

  async function handleAdd() {
    if (!canAdd) {
      return;
    }

    setSubmitting(true);
    await setCartItem(product.id, cartQuantity + 1);
    setSubmitting(false);
  }

  return (
    <div className={`flex ${fullWidth ? "w-full flex-col items-start gap-3" : "flex-col gap-3"}`}>
      <StockBadge quantity={liveProduct.stockQuantity} stockState={liveProduct.stockState} />
      <button
        className={`inline-flex h-11 items-center justify-center rounded-full bg-[var(--freshco-brand)] px-5 text-[0.82rem] font-extrabold uppercase tracking-[0.14em] text-white transition duration-200 hover:-translate-y-0.5 hover:brightness-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#B9DDB7] ${fullWidth ? "w-full" : ""}`}
        disabled={!canAdd || submitting || !loaded}
        onClick={() => void handleAdd()}
        type="button"
      >
        {liveProduct.stockState === "out_of_stock"
          ? "Out of stock"
          : submitting
            ? "Adding..."
            : cartQuantity > 0
              ? `Add another (${cartQuantity} in cart)`
              : "Add to cart"}
      </button>
    </div>
  );
}
