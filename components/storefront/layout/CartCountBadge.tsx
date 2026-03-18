"use client";

import Link from "next/link";

import { useStorefrontSession } from "@/lib/storefront/browser-session";

export function CartCountBadge() {
  const { cart, loaded } = useStorefrontSession();
  const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link
      className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--freshco-border)] bg-white text-[var(--freshco-text)] transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--freshco-surface-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-2"
      href="/cart"
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
      <span className="sr-only">Cart</span>
      <span className="absolute -right-1 -top-1 inline-flex min-w-6 items-center justify-center rounded-full bg-[var(--freshco-brand)] px-1.5 py-1 text-[0.68rem] font-extrabold leading-none text-white">
        {loaded ? count : 0}
      </span>
    </Link>
  );
}

