"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import { products } from "@/lib/storefront/mock/data";
import { mockStorefrontClient } from "@/lib/storefront/mock/mock-storefront-client";
import {
  getStoredCart,
  getStoredCheckoutDraft,
  getStoredCustomerProfile,
  getStoredOrders,
  getStoredStockSnapshot,
  storefrontStorageEvent,
} from "@/lib/storefront/mock/persistence";
import type {
  Cart,
  CheckoutDraft,
  CheckoutPreview,
  CustomerProfile,
  Order,
  Product,
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
  paymentMethod: "card",
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

function buildPreview(cart: Cart, stockSnapshot: StockSnapshot): CheckoutPreview {
  const items = cart.items
    .map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      const live = product ? stockSnapshot[product.id] : null;

      if (!product) {
        return null;
      }

      const resolvedProduct = {
        ...product,
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
  const deliveryFee = subtotal > 0 ? 4.5 : 0;

  return {
    cart,
    items,
    subtotal,
    deliveryFee,
    total: Number((subtotal + deliveryFee).toFixed(2)),
  };
}

function getServerSnapshot(): SessionState {
  return {
    cart: emptyCart,
    checkoutDraft: emptyDraft,
    profile: emptyProfile,
    orders: [],
    preview: emptyPreview,
    stockSnapshot: {},
    loaded: false,
  };
}

function getClientSnapshot(): SessionState {
  if (typeof window === "undefined") {
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
    preview: buildPreview(payload.cart, payload.stockSnapshot),
    loaded: true,
  };

  return cachedClientSnapshot;
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(storefrontStorageEvent, onStoreChange);
  return () => {
    window.removeEventListener(storefrontStorageEvent, onStoreChange);
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

  const saveCheckoutDraft = useCallback(async (draft: CheckoutDraft) => {
    await mockStorefrontClient.saveCheckoutDraft(draft);
  }, []);

  const saveProfile = useCallback(async (profile: CustomerProfile) => {
    await mockStorefrontClient.saveCustomerProfile(profile);
  }, []);

  const placeOrder = useCallback(async () => {
    return mockStorefrontClient.placeMockOrder();
  }, []);

  return useMemo(
    () => ({
      ...state,
      setCartItem,
      removeCartItem,
      saveCheckoutDraft,
      saveProfile,
      placeOrder,
    }),
    [placeOrder, removeCartItem, saveCheckoutDraft, saveProfile, setCartItem, state],
  );
}

export function useResolvedProduct(product: Product) {
  const session = useStorefrontSession();
  const live = session.stockSnapshot[product.id];

  return {
    ...product,
    stockQuantity: live?.quantity ?? product.stockQuantity,
    stockState: live?.state ?? product.stockState,
  };
}
