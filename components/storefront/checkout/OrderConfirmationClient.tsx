"use client";

import Link from "next/link";

import { useStorefrontSession } from "@/lib/storefront/browser-session";

export function OrderConfirmationClient({ orderId }: Readonly<{ orderId?: string }>) {
  const { loaded, orders } = useStorefrontSession();

  if (!loaded) {
    return <p className="text-[var(--freshco-text-soft)]">Loading confirmation…</p>;
  }

  const order = orders.find((entry) => entry.id === orderId) ?? orders[0];

  if (!order) {
    return <p className="text-[var(--freshco-text-soft)]">No mock order found for this browser session.</p>;
  }

  return (
    <div className="rounded-[30px] border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] p-8">
      <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.18em] text-[var(--freshco-brand-dark)]">
        Order confirmed
      </p>
      <h1 className="mt-3 text-[2.6rem] font-extrabold tracking-[-0.06em] text-[var(--freshco-text)]">
        FreshCo order placed successfully.
      </h1>
      <p className="mt-4 max-w-[620px] text-[1rem] leading-7 text-[var(--freshco-text-soft)]">
        This is a mock checkout confirmation. Stock has been reduced locally in this browser and the order is now visible in the account orders area.
      </p>
      <div className="mt-6 rounded-[24px] bg-white p-5">
        <p className="text-[0.82rem] font-bold uppercase tracking-[0.14em] text-[var(--freshco-text-soft)]">
          Order ID
        </p>
        <p className="mt-2 text-[1.2rem] font-extrabold text-[var(--freshco-text)]">{order.id}</p>
        <p className="mt-4 text-[0.98rem] text-[var(--freshco-text-soft)]">
          Total: <strong className="text-[var(--freshco-text)]">${order.total.toFixed(2)}</strong>
        </p>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--freshco-brand)] px-5 text-[0.82rem] font-extrabold uppercase tracking-[0.14em] text-white" href="/account/orders">
          View orders
        </Link>
        <Link className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--freshco-border)] bg-white px-5 text-[0.82rem] font-extrabold uppercase tracking-[0.14em] text-[var(--freshco-text)]" href="/shop">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
