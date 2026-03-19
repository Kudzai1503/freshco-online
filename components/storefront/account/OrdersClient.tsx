"use client";

import Link from "next/link";

import { useStorefrontSession } from "@/lib/storefront/browser-session";
import {
  formatOrderDate,
  getCurrentTrackingEvent,
  getItemCount,
} from "@/lib/storefront/order-display";

export function OrdersClient() {
  const { loaded, orders } = useStorefrontSession();

  if (!loaded) {
    return <p className="text-[var(--freshco-text-soft)]">Loading orders…</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-[30px] border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] p-6">
        <h2 className="text-[1.8rem] font-extrabold tracking-[-0.05em] text-[var(--freshco-text)]">
          No orders yet.
        </h2>
        <p className="mt-3 text-[1rem] leading-7 text-[var(--freshco-text-soft)]">
          Place an order through checkout and it will appear here.
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
                {formatOrderDate(order.createdAt)}
              </p>
              <p className="mt-2 text-[0.92rem] text-[var(--freshco-text-soft)]">
                {order.fulfillmentLabel} · {order.etaLabel}
              </p>
            </div>
            <div className="text-right">
              <p className="inline-flex rounded-full bg-[var(--freshco-surface-soft)] px-3 py-1.5 text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-[var(--freshco-brand-dark)]">
                {getCurrentTrackingEvent(order).label}
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 border-t border-[var(--freshco-border)] pt-4 sm:grid-cols-4">
            <div>
              <p className="text-[0.74rem] font-extrabold uppercase tracking-[0.14em] text-[var(--freshco-text-soft)]">
                Total
              </p>
              <p className="mt-2 text-[1.35rem] font-extrabold tracking-[-0.04em] text-[var(--freshco-text)]">
                ${order.total.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-[0.74rem] font-extrabold uppercase tracking-[0.14em] text-[var(--freshco-text-soft)]">
                Items
              </p>
              <p className="mt-2 text-[0.98rem] font-bold text-[var(--freshco-text)]">
                {getItemCount(order)} item{getItemCount(order) === 1 ? "" : "s"}
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-[0.74rem] font-extrabold uppercase tracking-[0.14em] text-[var(--freshco-text-soft)]">
                Basket preview
              </p>
              <p className="mt-2 text-[0.94rem] leading-7 text-[var(--freshco-text-soft)]">
                {order.items
                  .slice(0, 3)
                  .map((item) => `${item.productName} × ${item.quantity}`)
                  .join(" · ")}
                {order.items.length > 3 ? " · More items" : ""}
              </p>
            </div>
          </div>
          <Link
            className="mt-5 inline-flex text-[0.9rem] font-bold text-[var(--freshco-brand-dark)]"
            href={`/account/orders/${order.id}`}
          >
            View order detail
          </Link>
        </article>
      ))}
    </div>
  );
}
