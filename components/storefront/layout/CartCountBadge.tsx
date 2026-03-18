"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { useStorefrontSession } from "@/lib/storefront/browser-session";

export function CartCountBadge() {
  const { cart, loaded, preview } = useStorefrontSession();
  const [isOpen, setIsOpen] = useState(false);
  const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const hasItems = preview.items.length > 0;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const checkoutButtonClassName = useMemo(
    () =>
      `inline-flex h-12 w-full items-center justify-center rounded-full px-5 text-[0.82rem] font-extrabold uppercase tracking-[0.14em] transition duration-200 ${
        hasItems
          ? "bg-[var(--freshco-brand)] text-white hover:-translate-y-0.5 hover:brightness-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-2"
          : "cursor-not-allowed bg-[#D8E3D6] text-[#7A8C8A]"
      }`,
    [hasItems],
  );

  return (
    <>
      <button
        aria-controls="storefront-cart-drawer"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--freshco-border)] bg-white text-[var(--freshco-text)] transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--freshco-surface-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-2"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <svg aria-hidden="true" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24">
          <path
            d="M4 6H5.7C6.3 6 6.82 6.4 6.96 6.98L7.35 8.5H19.5L17.88 14.16C17.69 14.85 17.06 15.33 16.35 15.33H9.07C8.31 15.33 7.65 14.82 7.45 14.08L5.58 7.33"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
          />
          <circle cx="10" cy="18.3" r="1.25" fill="currentColor" />
          <circle cx="16.4" cy="18.3" r="1.25" fill="currentColor" />
        </svg>
        <span className="sr-only">Open cart</span>
        <span className="absolute -right-1 -top-1 inline-flex min-w-6 items-center justify-center rounded-full bg-[var(--freshco-brand)] px-1.5 py-1 text-[0.68rem] font-extrabold leading-none text-white">
          {loaded ? count : 0}
        </span>
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50">
          <button
            aria-label="Close cart drawer"
            className="absolute inset-0 bg-transparent"
            onClick={() => setIsOpen(false)}
            type="button"
          />
          <aside
            aria-label="Shopping cart"
            className="absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col border-l border-[#E7ECE4] bg-white"
            id="storefront-cart-drawer"
          >
            <div className="border-b border-[#EEF2EC] px-5 py-5 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-[1.65rem] font-extrabold tracking-[-0.05em] text-[var(--freshco-text)]">
                    My Cart ({loaded ? count : 0})
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    className="inline-flex h-10 items-center justify-center rounded-full px-3 text-[0.88rem] font-bold text-[#4C94E6] transition hover:bg-[#F6FAF4] hover:text-[#2C74C6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-2"
                    href="/cart"
                    onClick={() => setIsOpen(false)}
                  >
                    View all
                  </Link>
                  <button
                    aria-label="Close cart drawer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#6A7B78] transition hover:bg-[#F6FAF4] hover:text-[var(--freshco-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-2"
                    onClick={() => setIsOpen(false)}
                    type="button"
                  >
                    <span aria-hidden="true" className="text-[1.2rem] leading-none">×</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6">
              {!loaded ? (
                <p className="text-[var(--freshco-text-soft)]">Loading cart…</p>
              ) : !hasItems ? (
                <div className="rounded-[24px] border border-[#EEF2EC] bg-[#FBFDF9] p-6">
                  <h3 className="text-[1.35rem] font-extrabold tracking-[-0.04em] text-[var(--freshco-text)]">
                    Your cart is empty.
                  </h3>
                  <p className="mt-3 text-[0.96rem] leading-7 text-[var(--freshco-text-soft)]">
                    Add a few items while you shop and they will appear here instantly.
                  </p>
                </div>
              ) : (
                <div className="grid gap-0">
                  {preview.items.map((item) => (
                    <article
                      key={item.product.id}
                      className="border-b border-[#EEF2EC] py-4 last:border-b-0"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[18px] border border-[#EEF2EC] bg-[#F7FBF4] text-[0.78rem] font-extrabold uppercase tracking-[0.08em] text-[var(--freshco-brand-dark)]">
                          {item.product.name
                            .split(" ")
                            .slice(0, 2)
                            .map((part) => part[0])
                            .join("")}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[0.66rem] font-bold uppercase tracking-[0.14em] text-[#8A9B97]">
                            {item.product.department.replace("-", " ")}
                          </p>
                          <h3 className="mt-1 text-[1.06rem] font-extrabold leading-[1.08] text-[var(--freshco-text)]">
                            {item.product.name}
                          </h3>
                          <div className="mt-2 flex items-center gap-3 text-[0.84rem] text-[var(--freshco-text-soft)]">
                            <span>Qty {item.quantity}</span>
                            <span className="text-[#D4DDD1]">|</span>
                            <span>${(item.lineTotal / item.quantity).toFixed(2)} each</span>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="inline-flex items-center gap-4 rounded-full border border-[#EEF2EC] px-3 py-1.5 text-[0.84rem] text-[var(--freshco-text-soft)]">
                              <span aria-hidden="true">-</span>
                              <span className="min-w-4 text-center font-bold text-[var(--freshco-text)]">
                                {item.quantity}
                              </span>
                              <span aria-hidden="true">+</span>
                            </div>
                            <strong className="text-[1.02rem] font-extrabold tracking-[-0.03em] text-[var(--freshco-text)]">
                              ${item.lineTotal.toFixed(2)}
                            </strong>
                          </div>
                          <div className="mt-3 flex items-center justify-end gap-3 text-[0.8rem] text-[#97A6A1]">
                            <span>Move to favourites</span>
                            <span className="text-[#D4DDD1]">|</span>
                            <span>Remove</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-[#EEF2EC] bg-[#FBFDF9] px-5 py-5 sm:px-6">
              <div className="rounded-[24px] border border-[#EEF2EC] bg-white p-5">
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#8A9B97]">
                  Order summary
                </p>
                <div className="space-y-3 text-[0.96rem] text-[var(--freshco-text-soft)]">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <strong className="text-[var(--freshco-text)]">
                      ${loaded ? preview.subtotal.toFixed(2) : "0.00"}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Delivery</span>
                    <strong className="text-[var(--freshco-text)]">
                      ${loaded ? preview.deliveryFee.toFixed(2) : "0.00"}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#EEF2EC] pt-3 text-[1.08rem]">
                    <span>Total</span>
                    <strong className="text-[var(--freshco-text)]">
                      ${loaded ? preview.total.toFixed(2) : "0.00"}
                    </strong>
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  {hasItems ? (
                    <Link
                      className={checkoutButtonClassName}
                      href="/checkout"
                      onClick={() => setIsOpen(false)}
                    >
                      Proceed to checkout
                    </Link>
                  ) : (
                    <span aria-disabled="true" className={checkoutButtonClassName}>
                      Proceed to checkout
                    </span>
                  )}
                  <Link
                    className="inline-flex h-12 w-full items-center justify-center rounded-full border border-[#E3EBE0] bg-white px-5 text-[0.82rem] font-extrabold uppercase tracking-[0.14em] text-[var(--freshco-text)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#F7FBF4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-2"
                    href="/cart"
                    onClick={() => setIsOpen(false)}
                  >
                    View cart
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
