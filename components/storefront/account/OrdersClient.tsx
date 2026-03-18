"use client";

import Link from "next/link";

import { useStorefrontSession } from "@/lib/storefront/browser-session";

export function OrdersClient() {
  const { loaded, orders } = useStorefrontSession();

  if (!loaded) {
    return <p className="text-[var(--freshco-text-soft)]">Loading orders…</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-[30px] border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] p-6">
        <h2 className="text-[1.8rem] font-extrabold tracking-[-0.05em] text-[var(--freshco-text)]">
          No mock orders yet.
        </h2>
        <p className="mt-3 text-[1rem] leading-7 text-[var(--freshco-text-soft)]">
          Place a test order through checkout and it will appear here in this browser session.
        </p>
        <Link className="mt-5 inline-flex text-[0.9rem] font-bold text-[var(--freshco-brand-dark)]" href="/shop">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {orders.map((order) => (
        <article key={order.id} className="rounded-[30px] border border-[var(--freshco-border)] bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.16em] text-[var(--freshco-brand-dark)]">
                Order
              </p>
              <h2 className="mt-2 text-[1.45rem] font-extrabold tracking-[-0.04em] text-[var(--freshco-text)]">
                {order.id}
              </h2>
              <p className="mt-2 text-[0.98rem] text-[var(--freshco-text-soft)]">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.16em] text-[var(--freshco-text-soft)]">
                Total
              </p>
              <p className="mt-2 text-[1.5rem] font-extrabold tracking-[-0.04em] text-[var(--freshco-text)]">
                ${order.total.toFixed(2)}
              </p>
            </div>
          </div>
          <ul className="mt-5 space-y-2 text-[0.96rem] text-[var(--freshco-text-soft)]">
            {order.items.map((item) => (
              <li key={`${order.id}-${item.productId}`}>
                {item.productName} × {item.quantity}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

