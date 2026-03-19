"use client";

import Link from "next/link";

import {
  getDeliverySlot,
  getSubstitutionOption,
} from "@/lib/storefront/mock-data/orders";
import {
  formatOrderDate,
  getCurrentTrackingEvent,
  getItemCount,
  getPaymentMethodLabel,
} from "@/lib/storefront/order-display";
import { useStorefrontSession } from "@/lib/storefront/browser-session";
import { ProductImage } from "@/components/storefront/shared/ProductImage";
import { OrderItemSkeleton } from "@/components/storefront/shared/StorefrontSkeletons";

const confirmationSkeletonKeys = [
  "confirmation-skeleton-1",
  "confirmation-skeleton-2",
  "confirmation-skeleton-3",
] as const;

const confirmationSideSkeletonKeys = [
  "confirmation-side-skeleton-1",
  "confirmation-side-skeleton-2",
  "confirmation-side-skeleton-3",
] as const;

export function OrderConfirmationClient({ orderId }: Readonly<{ orderId?: string }>) {
  const { loaded, orders } = useStorefrontSession();

  if (!loaded) {
    return (
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-[30px] border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] p-8">
          <div className="h-3 w-24 animate-pulse rounded-full bg-white" />
          <div className="mt-4 h-10 w-2/3 animate-pulse rounded-full bg-white" />
          <div className="mt-4 h-4 w-full animate-pulse rounded-full bg-white" />
          <div className="mt-2 h-4 w-4/5 animate-pulse rounded-full bg-white" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="h-32 animate-pulse rounded-[24px] bg-white" />
            <div className="h-32 animate-pulse rounded-[24px] bg-white" />
          </div>
          <div className="mt-6 grid gap-3">
            {confirmationSkeletonKeys.map((key) => (
              <OrderItemSkeleton key={key} />
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          {confirmationSideSkeletonKeys.map((key) => (
            <div
              className="h-40 animate-pulse rounded-[24px] border border-[var(--freshco-border)] bg-white"
              key={key}
            />
          ))}
        </aside>
      </div>
    );
  }

  const order = orders.find((entry) => entry.id === orderId) ?? orders[0];

  if (!order) {
    return <p className="text-[var(--freshco-text-soft)]">No order was found for this session.</p>;
  }

  const deliverySlot = getDeliverySlot(order.deliverySlot);
  const substitution = getSubstitutionOption(order.substitutionPreference);
  const currentStep = getCurrentTrackingEvent(order);
  const itemCount = getItemCount(order);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="rounded-[30px] border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] p-8">
        <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.18em] text-[var(--freshco-brand-dark)]">
          Thank you
        </p>
        <h1 className="mt-3 text-[2.6rem] font-extrabold tracking-[-0.06em] text-[var(--freshco-text)]">
          Your FreshCo order is in.
        </h1>
        <p className="mt-4 max-w-[620px] text-[1rem] leading-7 text-[var(--freshco-text-soft)]">
          Your order has been placed and added to your order history.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[24px] bg-white p-5">
            <p className="text-[0.82rem] font-bold uppercase tracking-[0.14em] text-[var(--freshco-text-soft)]">
              Order number
            </p>
            <p className="mt-2 text-[1.2rem] font-extrabold text-[var(--freshco-text)]">
              {order.id}
            </p>
            <p className="mt-2 text-[0.92rem] text-[var(--freshco-text-soft)]">
              {formatOrderDate(order.createdAt)}
            </p>
            <p className="mt-4 text-[0.92rem] text-[var(--freshco-text-soft)]">
              {itemCount} item{itemCount === 1 ? "" : "s"} ·{" "}
              <strong className="text-[var(--freshco-text)]">${order.total.toFixed(2)}</strong>
            </p>
          </div>
          <div className="rounded-[24px] bg-white p-5">
            <p className="text-[0.82rem] font-bold uppercase tracking-[0.14em] text-[var(--freshco-text-soft)]">
              Next step
            </p>
            <p className="mt-2 text-[1rem] font-extrabold text-[var(--freshco-text)]">
              {currentStep.label}
            </p>
            <p className="mt-2 text-[0.92rem] leading-7 text-[var(--freshco-text-soft)]">
              {currentStep.description}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-[24px] bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[0.82rem] font-bold uppercase tracking-[0.14em] text-[var(--freshco-text-soft)]">
              Items purchased
            </p>
            <p className="text-[0.92rem] text-[var(--freshco-text-soft)]">
              {itemCount} item{itemCount === 1 ? "" : "s"}
            </p>
          </div>
          <div className="mt-4 grid gap-3">
            {order.items.map((item) => (
              <article
                className="flex items-center justify-between gap-4 rounded-[20px] border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] p-4"
                key={`${order.id}-${item.productId}`}
              >
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
                    <p className="text-[0.98rem] font-extrabold text-[var(--freshco-text)]">
                      {item.productName}
                    </p>
                    <p className="mt-1 text-[0.9rem] text-[var(--freshco-text-soft)]">
                      Qty {item.quantity}
                      {item.unit ? ` · ${item.unit}` : ""}
                    </p>
                  </div>
                </div>
                <strong className="text-[var(--freshco-text)]">
                  ${(item.price * item.quantity).toFixed(2)}
                </strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <aside className="space-y-6">
        <div className="rounded-[24px] border border-[var(--freshco-border)] bg-white p-5">
          <p className="text-[0.82rem] font-bold uppercase tracking-[0.14em] text-[var(--freshco-text-soft)]">
            Delivery or pickup
          </p>
          <p className="mt-3 text-[1rem] font-extrabold text-[var(--freshco-text)]">
            {order.fulfillmentLabel}
          </p>
          <p className="mt-2 text-[0.92rem] leading-7 text-[var(--freshco-text-soft)]">
            {order.fulfillmentMethod === "pickup" ? order.pickupLocation : order.deliveryAddress}
          </p>
          <p className="mt-2 text-[0.92rem] text-[var(--freshco-text-soft)]">
            {order.fulfillmentMethod === "pickup" ? "Pickup timing" : "Delivery slot"}:{" "}
            <strong className="text-[var(--freshco-text)]">
              {order.fulfillmentMethod === "pickup" ? order.etaLabel : deliverySlot.label}
            </strong>
          </p>
          <p className="mt-2 text-[0.92rem] text-[var(--freshco-text-soft)]">
            ETA: <strong className="text-[var(--freshco-text)]">{order.etaLabel}</strong>
          </p>
        </div>

        <div className="rounded-[24px] border border-[var(--freshco-border)] bg-white p-5">
          <p className="text-[0.82rem] font-bold uppercase tracking-[0.14em] text-[var(--freshco-text-soft)]">
            Payment and totals
          </p>
          <div className="mt-4 space-y-3 text-[0.96rem] text-[var(--freshco-text-soft)]">
            <div className="flex items-center justify-between">
              <span>Payment</span>
              <strong className="text-[var(--freshco-text)]">
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
            <div className="flex items-center justify-between border-t border-[var(--freshco-border)] pt-3 text-[1.04rem]">
              <span>Total</span>
              <strong className="text-[var(--freshco-text)]">${order.total.toFixed(2)}</strong>
            </div>
          </div>
          <p className="mt-4 text-[0.9rem] leading-7 text-[var(--freshco-text-soft)]">
            Substitutions: <strong className="text-[var(--freshco-text)]">{substitution.label}</strong>
          </p>
          {order.orderNotes ? (
            <p className="mt-2 text-[0.9rem] leading-7 text-[var(--freshco-text-soft)]">
              Notes: <strong className="text-[var(--freshco-text)]">{order.orderNotes}</strong>
            </p>
          ) : null}
        </div>

        <div className="rounded-[24px] border border-[var(--freshco-border)] bg-white p-5">
          <p className="text-[0.82rem] font-bold uppercase tracking-[0.14em] text-[var(--freshco-text-soft)]">
            Next steps
          </p>
          <ul className="mt-4 grid gap-3 text-[0.92rem] leading-7 text-[var(--freshco-text-soft)]">
            <li>Track this order any time from your account orders page.</li>
            <li>Check the latest status updates from your order detail page.</li>
            <li>Use reorder later to send the same basket back into your cart.</li>
          </ul>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--freshco-brand)] px-5 text-[0.82rem] font-extrabold uppercase tracking-[0.14em] text-white" href="/account/orders">
            View orders
          </Link>
          <Link
            className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--freshco-border)] bg-white px-5 text-[0.82rem] font-extrabold uppercase tracking-[0.14em] text-[var(--freshco-text)]"
            href={`/account/orders/${order.id}`}
          >
            Track this order
          </Link>
          <Link className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--freshco-border)] bg-white px-5 text-[0.82rem] font-extrabold uppercase tracking-[0.14em] text-[var(--freshco-text)]" href="/shop">
            Continue shopping
          </Link>
        </div>
      </aside>
    </div>
  );
}
