"use client";

import { useState } from "react";
import Link from "next/link";

import { useStorefrontSession } from "@/lib/storefront/browser-session";
import {
  formatOrderDate,
  getCurrentTrackingEvent,
  getPaymentMethodLabel,
} from "@/lib/storefront/order-display";
import { OrderItemSkeleton } from "@/components/storefront/shared/StorefrontSkeletons";
import { ProductImage } from "@/components/storefront/shared/ProductImage";

const orderDetailSkeletonKeys = [
  "order-detail-skeleton-1",
  "order-detail-skeleton-2",
  "order-detail-skeleton-3",
] as const;

const orderSummarySkeletonKeys = [
  "order-summary-skeleton-1",
  "order-summary-skeleton-2",
  "order-summary-skeleton-3",
  "order-summary-skeleton-4",
  "order-summary-skeleton-5",
  "order-summary-skeleton-6",
] as const;

export function OrderDetailClient({ orderId }: Readonly<{ orderId: string }>) {
  const { loaded, orders, reorderOrder } = useStorefrontSession();
  const [reorderMessage, setReorderMessage] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);

  if (!loaded) {
    return (
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-[30px] border border-[var(--freshco-border)] bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="h-3 w-28 animate-pulse rounded-full bg-[var(--freshco-surface-soft)]" />
              <div className="mt-3 h-8 w-56 animate-pulse rounded-full bg-[var(--freshco-surface-soft)]" />
              <div className="mt-3 h-4 w-32 animate-pulse rounded-full bg-[var(--freshco-surface-soft)]" />
            </div>
            <div className="h-9 w-24 animate-pulse rounded-full bg-[var(--freshco-surface-soft)]" />
          </div>
          <div className="mt-6 grid gap-4">
            {orderDetailSkeletonKeys.map((key) => (
              <OrderItemSkeleton key={key} />
            ))}
          </div>
        </section>

        <aside className="rounded-[30px] border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] p-6">
          <div className="h-7 w-40 animate-pulse rounded-full bg-white" />
          <div className="mt-5 space-y-3">
            {orderSummarySkeletonKeys.map((key) => (
              <div
                className="h-4 animate-pulse rounded-full bg-white"
                key={key}
              />
            ))}
          </div>
        </aside>
      </div>
    );
  }

  const order = orders.find((entry) => entry.id === orderId);

  if (!order) {
    return (
      <div className="rounded-[30px] border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] p-6">
        <h2 className="text-[1.8rem] font-extrabold tracking-[-0.05em] text-[var(--freshco-text)]">
          Order not found.
        </h2>
        <p className="mt-3 text-[1rem] leading-7 text-[var(--freshco-text-soft)]">
          We could not find an order matching that reference.
        </p>
        <Link
          className="mt-5 inline-flex text-[0.9rem] font-bold text-[var(--freshco-brand-dark)]"
          href="/account/orders"
        >
          Back to orders
        </Link>
      </div>
    );
  }

  const currentStep = getCurrentTrackingEvent(order);
  const currentOrderId = order.id;

  async function handleReorder() {
    setReordering(true);
    setReorderMessage(null);

    try {
      const result = await reorderOrder(currentOrderId);
      const parts =
        result.addedItems > 0
          ? [`Added ${result.addedItems} item${result.addedItems === 1 ? "" : "s"} back to your cart.`]
          : ["No items could be added back to your cart."];

      if (result.limitedItems.length > 0) {
        parts.push(`Limited by stock: ${result.limitedItems.join(", ")}.`);
      }

      if (result.unavailableItems.length > 0) {
        parts.push(`Unavailable right now: ${result.unavailableItems.join(", ")}.`);
      }

      setReorderMessage(parts.join(" "));
    } catch (error) {
      setReorderMessage(
        error instanceof Error ? error.message : "Unable to reorder these items.",
      );
    } finally {
      setReordering(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="rounded-[30px] border border-[var(--freshco-border)] bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.16em] text-[var(--freshco-brand-dark)]">
              Order reference
            </p>
            <h2 className="mt-2 text-[1.8rem] font-extrabold tracking-[-0.05em] text-[var(--freshco-text)]">
              {order.id}
            </h2>
            <p className="mt-2 text-[0.96rem] text-[var(--freshco-text-soft)]">
              {formatOrderDate(order.createdAt)}
            </p>
          </div>
          <span className="inline-flex rounded-full bg-[var(--freshco-surface-soft)] px-4 py-2 text-[0.74rem] font-extrabold uppercase tracking-[0.14em] text-[var(--freshco-brand-dark)]">
            {currentStep.label}
          </span>
        </div>

        <div className="mt-6 grid gap-4">
          {order.items.map((item) => (
            <article
              className="rounded-[22px] border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] p-4"
              key={`${order.id}-${item.productId}`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[16px] border border-[var(--freshco-border)] bg-white">
                    <ProductImage
                      alt={item.productName}
                      className="object-contain p-2"
                      fallbackClassName="flex h-full w-full items-center justify-center px-2 text-center text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-[var(--freshco-brand-dark)]"
                      fallbackLabel={item.productName}
                      sizes="64px"
                      src={item.image}
                      wrapperClassName="absolute inset-0"
                    />
                  </div>
                  <div>
                    <h3 className="text-[1.02rem] font-extrabold text-[var(--freshco-text)]">
                      {item.productName}
                    </h3>
                    <p className="mt-1 text-[0.9rem] text-[var(--freshco-text-soft)]">
                      Qty {item.quantity}
                      {item.unit ? ` · ${item.unit}` : ""}
                    </p>
                  </div>
                </div>
                <strong className="text-[1rem] text-[var(--freshco-text)]">
                  ${(item.price * item.quantity).toFixed(2)}
                </strong>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 rounded-[24px] border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] p-5">
          <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.16em] text-[var(--freshco-text-soft)]">
            Tracking timeline
          </p>
          <ol className="mt-4 grid gap-4">
            {order.trackingTimeline.map((event) => (
              <li className="flex gap-3" key={`${order.id}-${event.status}`}>
                <span
                  aria-hidden="true"
                  className={`mt-1 h-3 w-3 shrink-0 rounded-full ${
                    event.completed ? "bg-[var(--freshco-brand)]" : "bg-[#D7E7D5]"
                  }`}
                />
                <div>
                  <p className="text-[0.94rem] font-bold text-[var(--freshco-text)]">
                    {event.label}
                  </p>
                  <p className="mt-1 text-[0.88rem] text-[var(--freshco-text-soft)]">
                    {event.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <aside className="rounded-[30px] border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] p-6">
        <h2 className="text-[1.45rem] font-extrabold tracking-[-0.05em] text-[var(--freshco-text)]">
          Order summary
        </h2>
        <div className="mt-5 space-y-3 text-[0.98rem] text-[var(--freshco-text-soft)]">
          <div className="flex items-center justify-between">
            <span>Fulfillment</span>
            <strong className="text-[var(--freshco-text)]">{order.fulfillmentLabel}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span>ETA</span>
            <strong className="text-[var(--freshco-text)]">{order.etaLabel}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span>Payment</span>
            <strong className="text-right text-[var(--freshco-text)]">
              {getPaymentMethodLabel(order.paymentMethod)}
            </strong>
          </div>
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <strong className="text-[var(--freshco-text)]">${order.subtotal.toFixed(2)}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span>Delivery</span>
            <strong className="text-[var(--freshco-text)]">${order.deliveryFee.toFixed(2)}</strong>
          </div>
          <div className="flex items-center justify-between border-t border-[var(--freshco-border)] pt-3 text-[1.08rem]">
            <span>Total</span>
            <strong className="text-[var(--freshco-text)]">${order.total.toFixed(2)}</strong>
          </div>
        </div>
        <div className="mt-5 rounded-[20px] bg-white p-4">
          <p className="text-[0.76rem] font-extrabold uppercase tracking-[0.14em] text-[var(--freshco-text-soft)]">
            {order.fulfillmentMethod === "pickup" ? "Pickup details" : "Delivery details"}
          </p>
          <p className="mt-2 text-[0.94rem] leading-7 text-[var(--freshco-text-soft)]">
            <strong className="text-[var(--freshco-text)]">
              {order.fulfillmentMethod === "pickup"
                ? order.pickupLocation ?? order.deliveryAddress
                : order.deliveryAddress}
            </strong>
          </p>
          {order.address?.instructions ? (
            <p className="mt-2 text-[0.92rem] leading-7 text-[var(--freshco-text-soft)]">
              Delivery notes: {order.address.instructions}
            </p>
          ) : null}
          {order.orderNotes ? (
            <p className="mt-2 text-[0.92rem] leading-7 text-[var(--freshco-text-soft)]">
              Order notes: {order.orderNotes}
            </p>
          ) : null}
        </div>
        {reorderMessage ? (
          <p className="mt-4 text-[0.9rem] leading-7 text-[var(--freshco-text-soft)]">
            {reorderMessage}{" "}
            <Link className="font-bold text-[var(--freshco-brand-dark)]" href="/cart">
              View cart
            </Link>
          </p>
        ) : null}
        <div className="mt-6 grid gap-3">
          <button
            className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--freshco-brand)] px-5 text-[0.82rem] font-extrabold uppercase tracking-[0.14em] text-white disabled:cursor-not-allowed disabled:bg-[#8DAE8A]"
            disabled={reordering}
            onClick={() => void handleReorder()}
            type="button"
          >
            {reordering ? "Reordering..." : "Reorder items"}
          </button>
          <Link
            className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--freshco-border)] bg-white px-5 text-[0.82rem] font-extrabold uppercase tracking-[0.14em] text-[var(--freshco-text)]"
            href="/account/orders"
          >
            Back to orders
          </Link>
          <Link
            className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--freshco-border)] bg-white px-5 text-[0.82rem] font-extrabold uppercase tracking-[0.14em] text-[var(--freshco-text)]"
            href="/shop"
          >
            Shop again
          </Link>
        </div>
      </aside>
    </div>
  );
}
