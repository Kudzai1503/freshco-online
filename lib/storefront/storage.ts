import { products, defaultStockSnapshot } from "@/lib/storefront/mock-data/products";
import {
  buildTrackingTimeline,
  defaultCheckoutDraft,
  defaultCustomerProfile,
  getFulfillmentOption,
  pickupLocationLabel,
  seedOrders,
} from "@/lib/storefront/mock-data/orders";
import type {
  Cart,
  CheckoutDraft,
  CustomerProfile,
  Order,
  Product,
  StockSnapshot,
  StockState,
} from "@/lib/storefront/types";

const storageKeys = {
  cart: "freshco.mock.cart",
  checkout: "freshco.mock.checkout",
  profile: "freshco.mock.profile",
  orders: "freshco.mock.orders",
  stock: "freshco.mock.stock",
} as const;

export const storefrontStorageEvent = "freshco:storefront-updated";

function isBrowser() {
  return typeof globalThis.localStorage !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!isBrowser()) {
    return fallback;
  }

  const raw = globalThis.localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!isBrowser()) {
    return;
  }

  globalThis.localStorage.setItem(key, JSON.stringify(value));
  globalThis.dispatchEvent(
    new globalThis.CustomEvent(storefrontStorageEvent, { detail: { key } }),
  );
}

function deriveStockState(quantity: number): StockState {
  if (quantity <= 0) {
    return "out_of_stock";
  }

  if (quantity <= 5) {
    return "low_stock";
  }

  return "in_stock";
}

function normalizeCheckoutDraft(draft: Partial<CheckoutDraft> | null | undefined): CheckoutDraft {
  return {
    ...defaultCheckoutDraft,
    ...draft,
    ageConfirmation: draft?.ageConfirmation ?? defaultCheckoutDraft.ageConfirmation,
    pickupLocation: draft?.pickupLocation || pickupLocationLabel,
  };
}

function normalizeOrder(order: Order): Order {
  const fulfillmentMethod = order.fulfillmentMethod ?? defaultCheckoutDraft.fulfillmentMethod;
  const fulfillment = getFulfillmentOption(fulfillmentMethod);

  return {
    ...order,
    status: order.status ?? "placed",
    deliveryAddress:
      order.deliveryAddress ||
      (fulfillmentMethod === "pickup"
        ? pickupLocationLabel
        : [defaultCheckoutDraft.addressLine1, defaultCheckoutDraft.city].filter(Boolean).join(", ")),
    fulfillmentMethod,
    fulfillmentLabel: order.fulfillmentLabel ?? fulfillment.label,
    etaLabel: order.etaLabel ?? fulfillment.etaLabel,
    paymentMethod: order.paymentMethod ?? defaultCheckoutDraft.paymentMethod,
    deliverySlot: order.deliverySlot ?? defaultCheckoutDraft.deliverySlot,
    substitutionPreference:
      order.substitutionPreference ?? defaultCheckoutDraft.substitutionPreference,
    orderNotes: order.orderNotes ?? "",
    ageConfirmation: order.ageConfirmation ?? false,
    pickupLocation:
      fulfillmentMethod === "pickup"
        ? order.pickupLocation || pickupLocationLabel
        : order.pickupLocation,
    trackingTimeline:
      order.trackingTimeline?.length
        ? order.trackingTimeline
        : buildTrackingTimeline(order.createdAt, fulfillmentMethod),
  };
}

export function getStoredCart(): Cart {
  return readJson<Cart>(storageKeys.cart, { items: [], updatedAt: new Date(0).toISOString() });
}

export function saveStoredCart(cart: Cart) {
  writeJson(storageKeys.cart, cart);
}

export function getStoredCheckoutDraft(): CheckoutDraft {
  return normalizeCheckoutDraft(
    readJson<Partial<CheckoutDraft>>(storageKeys.checkout, defaultCheckoutDraft),
  );
}

export function saveStoredCheckoutDraft(draft: CheckoutDraft) {
  writeJson(storageKeys.checkout, normalizeCheckoutDraft(draft));
}

export function getStoredCustomerProfile(): CustomerProfile {
  return readJson<CustomerProfile>(storageKeys.profile, defaultCustomerProfile);
}

export function saveStoredCustomerProfile(profile: CustomerProfile) {
  writeJson(storageKeys.profile, profile);
}

export function getStoredOrders(): Order[] {
  return readJson<Order[]>(storageKeys.orders, seedOrders).map(normalizeOrder);
}

export function saveStoredOrders(orders: Order[]) {
  writeJson(storageKeys.orders, orders.map(normalizeOrder));
}

export function getStoredStockSnapshot(): StockSnapshot {
  return readJson<StockSnapshot>(storageKeys.stock, defaultStockSnapshot);
}

export function saveStoredStockSnapshot(snapshot: StockSnapshot) {
  writeJson(storageKeys.stock, snapshot);
}

export function getResolvedProduct(product: Product): Product {
  const snapshot = getStoredStockSnapshot();
  const live = snapshot[product.id];

  if (!live) {
    return product;
  }

  return {
    ...product,
    stockQty: live.quantity,
    stockQuantity: live.quantity,
    stockState: live.state,
  };
}

export function getResolvedProducts() {
  return products.map(getResolvedProduct);
}

export function updateStockAfterOrder(
  items: Array<{ productId: string; quantity: number }>,
): StockSnapshot {
  const snapshot = getStoredStockSnapshot();
  const next: Record<string, { quantity: number; state: StockState }> = { ...snapshot };

  for (const item of items) {
    const current = next[item.productId];
    if (!current) {
      continue;
    }

    const quantity = Math.max(0, current.quantity - item.quantity);
    next[item.productId] = {
      quantity,
      state: deriveStockState(quantity),
    };
  }

  saveStoredStockSnapshot(next);
  return next;
}
