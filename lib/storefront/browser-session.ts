"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import {
  defaultCheckoutDraft,
  getFulfillmentOption,
  products,
} from "@/lib/storefront/mock/data";
import { mockStorefrontClient } from "@/lib/storefront/mock-client";
import {
  getStoredCart,
  getStoredCheckoutDraft,
  getStoredCustomerProfile,
  getStoredOrders,
  getStoredStockSnapshot,
  storefrontStorageEvent,
} from "@/lib/storefront/storage";
import type {
  Cart,
  CheckoutDraft,
  CheckoutPreview,
  CustomerProfile,
  Order,
  Product,
  ReorderResult,
  StockSnapshot,
} from "@/lib/storefront/types";

type SessionState = {
  cart: Cart;
  checkoutDraft: CheckoutDraft;
  profile: CustomerProfile;
  orders: Order[];
  preview: CheckoutPreview;
  stockSnapshot: StockSnapshot;
  loaded: boolean;
};

const emptyCart: Cart = {
  items: [],
  updatedAt: new Date(0).toISOString(),
};

const emptyDraft: CheckoutDraft = {
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  deliveryNotes: "",
  orderNotes: "",
  paymentMethod: "card",
  fulfillmentMethod: "standard_delivery",
  deliverySlot: defaultCheckoutDraft.deliverySlot,
  substitutionPreference: defaultCheckoutDraft.substitutionPreference,
  ageConfirmation: false,
  pickupLocation: defaultCheckoutDraft.pickupLocation,
};

const emptyProfile: CustomerProfile = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  preferredDepartment: "fruits",
};

const emptyPreview: CheckoutPreview = {
  cart: emptyCart,
  items: [],
  subtotal: 0,
  deliveryFee: 0,
  total: 0,
  fulfillmentMethod: "standard_delivery",
  fulfillmentLabel: getFulfillmentOption("standard_delivery").label,
  etaLabel: getFulfillmentOption("standard_delivery").etaLabel,
};

const serverSnapshot: SessionState = {
  cart: emptyCart,
  checkoutDraft: emptyDraft,
  profile: emptyProfile,
  orders: [],
  preview: emptyPreview,
  stockSnapshot: {},
  loaded: false,
};

type SnapshotPayload = {
  cart: Cart;
  checkoutDraft: CheckoutDraft;
  profile: CustomerProfile;
  orders: Order[];
  stockSnapshot: StockSnapshot;
};

let cachedPayloadKey: string | null = null;
let cachedClientSnapshot: SessionState | null = null;

function buildPreview(
  cart: Cart,
  stockSnapshot: StockSnapshot,
  checkoutDraft: CheckoutDraft,
): CheckoutPreview {
  const items = cart.items
    .map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      const live = product ? stockSnapshot[product.id] : null;

      if (!product) {
        return null;
      }

      const resolvedProduct = {
        ...product,
        stockQty: live?.quantity ?? product.stockQty,
        stockQuantity: live?.quantity ?? product.stockQuantity,
        stockState: live?.state ?? product.stockState,
      };

      return {
        product: resolvedProduct,
        quantity: item.quantity,
        lineTotal: Number((resolvedProduct.price * item.quantity).toFixed(2)),
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const subtotal = Number(items.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2));
  const fulfillment = getFulfillmentOption(checkoutDraft.fulfillmentMethod);
  const deliveryFee = subtotal > 0 ? fulfillment.fee : 0;

  return {
    cart,
    items,
    subtotal,
    deliveryFee,
    total: Number((subtotal + deliveryFee).toFixed(2)),
    fulfillmentMethod: checkoutDraft.fulfillmentMethod,
    fulfillmentLabel: fulfillment.label,
    etaLabel: fulfillment.etaLabel,
  };
}

function getServerSnapshot(): SessionState {
  return serverSnapshot;
}

function getClientSnapshot(): SessionState {
  if (typeof globalThis.localStorage === "undefined") {
    return getServerSnapshot();
  }

  const payload: SnapshotPayload = {
    cart: getStoredCart(),
    checkoutDraft: getStoredCheckoutDraft(),
    profile: getStoredCustomerProfile(),
    orders: getStoredOrders(),
    stockSnapshot: getStoredStockSnapshot(),
  };

  const payloadKey = JSON.stringify(payload);

  if (cachedClientSnapshot && cachedPayloadKey === payloadKey) {
    return cachedClientSnapshot;
  }

  cachedPayloadKey = payloadKey;
  cachedClientSnapshot = {
    ...payload,
    preview: buildPreview(payload.cart, payload.stockSnapshot, payload.checkoutDraft),
    loaded: true,
  };

  return cachedClientSnapshot;
}

function subscribe(onStoreChange: () => void) {
  if (typeof globalThis.addEventListener === "undefined") {
    return () => {};
  }

  globalThis.addEventListener(storefrontStorageEvent, onStoreChange);
  return () => {
    globalThis.removeEventListener(storefrontStorageEvent, onStoreChange);
  };
}

export function useStorefrontSession() {
  const state = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  const setCartItem = useCallback(async (productId: string, quantity: number) => {
    await mockStorefrontClient.setCartItem(productId, quantity);
  }, []);

  const removeCartItem = useCallback(async (productId: string) => {
    await mockStorefrontClient.removeCartItem(productId);
  }, []);

  const clearCart = useCallback(async () => {
    await mockStorefrontClient.clearCart();
  }, []);

  const saveCheckoutDraft = useCallback(async (draft: CheckoutDraft) => {
    await mockStorefrontClient.saveCheckoutDraft(draft);
  }, []);

  const saveProfile = useCallback(async (profile: CustomerProfile) => {
    await mockStorefrontClient.saveCustomerProfile(profile);
  }, []);

  const placeOrder = useCallback(async () => {
    return mockStorefrontClient.placeMockOrder();
  }, []);

  const reorderOrder = useCallback(async (orderId: string): Promise<ReorderResult> => {
    return mockStorefrontClient.reorderOrder(orderId);
  }, []);

  return useMemo(
    () => ({
      ...state,
      setCartItem,
      removeCartItem,
      clearCart,
      saveCheckoutDraft,
      saveProfile,
      placeOrder,
      reorderOrder,
    }),
    [
      clearCart,
      placeOrder,
      removeCartItem,
      reorderOrder,
      saveCheckoutDraft,
      saveProfile,
      setCartItem,
      state,
    ],
  );
}

export function useResolvedProduct(product: Product) {
  const session = useStorefrontSession();
  const live = session.stockSnapshot[product.id];

  return {
    ...product,
    stockQty: live?.quantity ?? product.stockQty,
    stockQuantity: live?.quantity ?? product.stockQuantity,
    stockState: live?.state ?? product.stockState,
  };
}
