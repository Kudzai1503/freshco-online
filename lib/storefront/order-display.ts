import type { Order, OrderTrackingEvent } from "@/lib/storefront/types";

export function formatOrderDate(createdAt: string) {
  return new Date(createdAt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function getPaymentMethodLabel(method: Order["paymentMethod"]) {
  return method === "card" ? "Mock card payment" : "Cash on delivery";
}

export function getCurrentTrackingEvent(order: Order): OrderTrackingEvent {
  return (
    order.trackingTimeline.find((event) => event.status === order.status) ??
    order.trackingTimeline.find((event) => event.completed) ??
    order.trackingTimeline[0]
  );
}

export function getItemCount(order: Order) {
  return order.items.reduce((sum, item) => sum + item.quantity, 0);
}
