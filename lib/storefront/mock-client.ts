import type { StorefrontClient } from "@/lib/storefront/client";
import { categories } from "@/lib/storefront/mock-data/categories";
import { products } from "@/lib/storefront/mock-data/products";
import {
  buildTrackingTimeline,
  defaultCheckoutDraft,
  defaultCustomerProfile,
  getDeliverySlot,
  getFulfillmentOption,
  pickupLocationLabel,
} from "@/lib/storefront/mock-data/orders";
import {
  getResolvedProduct,
  getResolvedProducts,
  getStoredCart,
  getStoredCheckoutDraft,
  getStoredCustomerProfile,
  getStoredOrders,
  saveStoredCart,
  saveStoredCheckoutDraft,
  saveStoredCustomerProfile,
  saveStoredOrders,
  updateStockAfterOrder,
} from "@/lib/storefront/storage";
import type {
  Cart,
  CheckoutPreview,
  Order,
  Product,
  ReorderResult,
  SearchFilters,
} from "@/lib/storefront/types";

const DEFAULT_PAGE_SIZE = 12;
const BAKERY_TAG_MATCHERS = ["bakery", "cookie", "shortbread", "biscuit", "truffle"];

function createOrderId() {
  if (typeof globalThis.crypto !== "undefined" && "randomUUID" in globalThis.crypto) {
    return globalThis.crypto.randomUUID();
  }

  return `mock-order-${Date.now()}`;
}

function isBakeryAliasProduct(product: Product) {
  const haystack = [
    product.name,
    product.shortDescription,
    ...product.tags,
    ...product.badges,
    ...Object.values(product.attributes).map(String),
  ]
    .join(" ")
    .toLowerCase();

  return BAKERY_TAG_MATCHERS.some((matcher) => haystack.includes(matcher));
}

function getSearchScore(product: Product, query: string) {
  const normalizedQuery = query.toLowerCase();
  const categoryName =
    categories.find((category) => category.slug === product.category)?.name.toLowerCase() ?? "";
  let score = 0;

  if (product.name.toLowerCase().includes(normalizedQuery)) {
    score += 6;
  }

  if (product.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))) {
    score += 4;
  }

  if (product.shortDescription.toLowerCase().includes(normalizedQuery)) {
    score += 3;
  }

  if (product.category.toLowerCase().includes(normalizedQuery) || categoryName.includes(normalizedQuery)) {
    score += 2;
  }

  if (product.badges.some((badge) => badge.toLowerCase().includes(normalizedQuery))) {
    score += 1;
  }

  return score;
}

function sortProducts(list: Product[], query?: string) {
  const next = [...list];

  if (query) {
    return next.sort((a, b) => {
      const difference = getSearchScore(b, query) - getSearchScore(a, query);
      if (difference !== 0) {
        return difference;
      }

      return Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name);
    });
  }

  return next.sort(
    (a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name),
  );
}

function applySearchFilters(source: Product[], params: SearchFilters = {}) {
  const query = params.query?.trim().toLowerCase();
  const category = params.category ?? params.department;
  let next = [...source];

  if (query) {
    next = next.filter((product) => {
      const categoryName =
        categories.find((category) => category.slug === product.category)?.name ?? product.category;
      const haystack = [
        product.name,
        product.category,
        categoryName,
        product.shortDescription,
        product.longDescription,
        ...product.tags,
        ...product.badges,
        ...Object.values(product.attributes).map(String),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }

  if (category && category !== "all") {
    next = next.filter((product) =>
      category === "bakery" ? isBakeryAliasProduct(product) : product.category === category,
    );
  }

  const sorted = sortProducts(next, query);

  return {
    products: sorted,
  };
}

function buildCheckoutPreview(cart: Cart): CheckoutPreview {
  const resolvedProducts = getResolvedProducts();
  const draft = getStoredCheckoutDraft();
  const items = cart.items
    .map((item) => {
      const product = resolvedProducts.find((entry) => entry.id === item.productId);
      if (!product) {
        return null;
      }

      return {
        product,
        quantity: item.quantity,
        lineTotal: Number((product.price * item.quantity).toFixed(2)),
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const subtotal = Number(items.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2));
  const fulfillment = getFulfillmentOption(draft.fulfillmentMethod);
  const deliveryFee = subtotal > 0 ? fulfillment.fee : 0;

  return {
    cart,
    items,
    subtotal,
    deliveryFee,
    total: Number((subtotal + deliveryFee).toFixed(2)),
    fulfillmentMethod: draft.fulfillmentMethod,
    fulfillmentLabel: fulfillment.label,
    etaLabel: fulfillment.etaLabel,
  };
}

export const mockStorefrontClient: StorefrontClient = {
  async getCategories() {
    return categories;
  },

  async getFeaturedProducts() {
    return getResolvedProducts().filter((product) => product.featured).slice(0, 12);
  },

  async searchProducts(filters = {}) {
    const page = Math.max(1, filters.page ?? 1);
    const pageSize = Math.max(1, Math.min(filters.pageSize ?? DEFAULT_PAGE_SIZE, 24));
    const result = applySearchFilters(getResolvedProducts(), filters);
    const total = result.products.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(page, totalPages);
    const startIndex = (safePage - 1) * pageSize;

    return {
      products: result.products.slice(startIndex, startIndex + pageSize),
      total,
      page: safePage,
      pageSize,
      totalPages,
    };
  },

  async getProductBySlug(slug) {
    const product = products.find((entry) => entry.slug === slug);
    return product ? getResolvedProduct(product) : null;
  },

  async getRelatedProducts(productId) {
    const product = products.find((entry) => entry.id === productId);
    if (!product) {
      return [];
    }

    return getResolvedProducts()
      .filter((entry) => entry.category === product.category && entry.id !== productId)
      .slice(0, 4);
  },

  async getCart() {
    return getStoredCart();
  },

  async addToCart(productId, quantity = 1) {
    const cart = getStoredCart();
    const current = cart.items.find((item) => item.productId === productId)?.quantity ?? 0;
    return mockStorefrontClient.updateCartItemQty(productId, current + quantity);
  },

  async updateCartItemQty(productId, quantity) {
    const product = getResolvedProducts().find((entry) => entry.id === productId);
    if (!product) {
      return getStoredCart();
    }

    const nextQuantity = Math.max(0, Math.min(quantity, product.stockQty));
    const cart = getStoredCart();
    const items = cart.items.filter((item) => item.productId !== productId);

    if (nextQuantity > 0) {
      items.push({ productId, quantity: nextQuantity });
    }

    const nextCart = {
      items,
      updatedAt: new Date().toISOString(),
    };

    saveStoredCart(nextCart);
    return nextCart;
  },

  async removeCartItem(productId) {
    const cart = getStoredCart();
    const nextCart = {
      items: cart.items.filter((item) => item.productId !== productId),
      updatedAt: new Date().toISOString(),
    };

    saveStoredCart(nextCart);
    return nextCart;
  },

  async clearCart() {
    const nextCart = { items: [], updatedAt: new Date().toISOString() };
    saveStoredCart(nextCart);
    return nextCart;
  },

  async getCheckoutDraft() {
    return getStoredCheckoutDraft();
  },

  async saveCheckoutDraft(draft) {
    saveStoredCheckoutDraft(draft);
    return draft;
  },

  async getCheckoutPreview() {
    return buildCheckoutPreview(getStoredCart());
  },

  async placeMockOrder() {
    const cart = getStoredCart();
    const preview = buildCheckoutPreview(cart);
    const profile = getStoredCustomerProfile();
    const draft = getStoredCheckoutDraft();
    const hasWineryItems = preview.items.some((item) => item.product.ageRestricted);

    if (preview.items.length === 0) {
      throw new Error("Your cart is empty.");
    }

    for (const item of preview.items) {
      if (item.quantity > item.product.stockQty) {
        throw new Error(`Only ${item.product.stockQty} left for ${item.product.name}.`);
      }
    }

    if (hasWineryItems && !draft.ageConfirmation) {
      throw new Error("Please confirm that the shopper is 18+ for winery items.");
    }

    updateStockAfterOrder(cart.items);
    const createdAt = new Date().toISOString();
    const fulfillment = getFulfillmentOption(draft.fulfillmentMethod);
    const deliverySlot = getDeliverySlot(draft.deliverySlot);
    const addressLabel =
      draft.fulfillmentMethod === "pickup"
        ? draft.pickupLocation || pickupLocationLabel
        : [draft.addressLine1, draft.addressLine2, draft.city].filter(Boolean).join(", ");

    const order: Order = {
      id: createOrderId(),
      createdAt,
      status: "placed",
      items: preview.items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
        unit: item.product.unit,
      })),
      subtotal: preview.subtotal,
      deliveryFee: preview.deliveryFee,
      total: preview.total,
      customer: {
        ...profile,
        email: draft.email || profile.email,
        phone: draft.phone || profile.phone,
      },
      deliveryAddress: addressLabel,
      address:
        draft.fulfillmentMethod === "pickup"
          ? undefined
          : {
              line1: draft.addressLine1,
              line2: draft.addressLine2,
              city: draft.city,
              instructions: draft.deliveryNotes,
      },
      fulfillmentMethod: draft.fulfillmentMethod,
      fulfillmentLabel: fulfillment.label,
      etaLabel:
        draft.fulfillmentMethod === "pickup"
          ? fulfillment.etaLabel
          : `${deliverySlot.label} · ${fulfillment.etaLabel}`,
      paymentMethod: draft.paymentMethod,
      deliverySlot: draft.deliverySlot,
      substitutionPreference: draft.substitutionPreference,
      orderNotes: draft.orderNotes,
      ageConfirmation: draft.ageConfirmation,
      pickupLocation:
        draft.fulfillmentMethod === "pickup"
          ? draft.pickupLocation || pickupLocationLabel
          : undefined,
      trackingTimeline: buildTrackingTimeline(createdAt, draft.fulfillmentMethod),
    };

    const orders = getStoredOrders();
    saveStoredOrders([order, ...orders]);
    saveStoredCart({ items: [], updatedAt: new Date().toISOString() });
    saveStoredCheckoutDraft(defaultCheckoutDraft);
    return order;
  },

  async getOrders() {
    return getStoredOrders();
  },

  async getOrderById(orderId) {
    return getStoredOrders().find((order) => order.id === orderId) ?? null;
  },

  async reorderOrder(orderId): Promise<ReorderResult> {
    const order = getStoredOrders().find((entry) => entry.id === orderId);

    if (!order) {
      throw new Error("This mock order could not be found.");
    }

    const currentCart = getStoredCart();
    const nextQuantities = new Map(currentCart.items.map((item) => [item.productId, item.quantity]));
    const limitedItems: string[] = [];
    const unavailableItems: string[] = [];
    let addedItems = 0;

    for (const item of order.items) {
      const product = products.find((entry) => entry.id === item.productId);

      if (!product) {
        unavailableItems.push(item.productName);
        continue;
      }

      const resolved = getResolvedProduct(product);
      const existingQuantity = nextQuantities.get(item.productId) ?? 0;

      if (resolved.stockQty <= existingQuantity) {
        unavailableItems.push(resolved.name);
        continue;
      }

      const nextQuantity = Math.min(existingQuantity + item.quantity, resolved.stockQty);
      const actualAdded = nextQuantity - existingQuantity;

      if (actualAdded <= 0) {
        unavailableItems.push(resolved.name);
        continue;
      }

      nextQuantities.set(item.productId, nextQuantity);
      addedItems += actualAdded;

      if (actualAdded < item.quantity) {
        limitedItems.push(resolved.name);
      }
    }

    const cart: Cart = {
      items: Array.from(nextQuantities.entries()).map(([productId, quantity]) => ({
        productId,
        quantity,
      })),
      updatedAt: new Date().toISOString(),
    };

    saveStoredCart(cart);

    return {
      cart,
      addedItems,
      limitedItems,
      unavailableItems,
    };
  },

  async getMockProfile() {
    return getStoredCustomerProfile() ?? defaultCustomerProfile;
  },

  async saveMockProfile(profile) {
    saveStoredCustomerProfile(profile);
    return profile;
  },

  // Compatibility surface
  async getDepartments() {
    return mockStorefrontClient.getCategories();
  },

  async getProducts(params: SearchFilters = {}) {
    return mockStorefrontClient.searchProducts(params);
  },

  async setCartItem(productId, quantity) {
    return mockStorefrontClient.updateCartItemQty(productId, quantity);
  },

  async getCustomerProfile() {
    return mockStorefrontClient.getMockProfile();
  },

  async saveCustomerProfile(profile) {
    return mockStorefrontClient.saveMockProfile(profile);
  },
};
