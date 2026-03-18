import type { StorefrontClient } from "@/lib/storefront/client";
import { categories } from "@/lib/storefront/mock-data/categories";
import { products } from "@/lib/storefront/mock-data/products";
import {
  buildTrackingTimeline,
  defaultCheckoutDraft,
  defaultCustomerProfile,
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
  ProductQuery,
  SearchFilters,
  SortOption,
} from "@/lib/storefront/types";

function createOrderId() {
  if (typeof globalThis.crypto !== "undefined" && "randomUUID" in globalThis.crypto) {
    return globalThis.crypto.randomUUID();
  }

  return `mock-order-${Date.now()}`;
}

function sortProducts(list: Product[], sort: SortOption = "featured") {
  const next = [...list];

  switch (sort) {
    case "price-asc":
      return next.sort((a, b) => a.price - b.price);
    case "price-desc":
      return next.sort((a, b) => b.price - a.price);
    case "name-asc":
      return next.sort((a, b) => a.name.localeCompare(b.name));
    case "stock-desc":
      return next.sort((a, b) => b.stockQty - a.stockQty);
    case "featured":
    default:
      return next.sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name));
  }
}

function applySearchFilters(source: Product[], params: SearchFilters = {}): Product[] {
  const query = params.query?.trim().toLowerCase();
  const category = params.category ?? params.department;
  let next = [...source];

  if (query) {
    next = next.filter((product) => {
      const haystack = [
        product.name,
        product.category,
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
    next = next.filter((product) => product.category === category);
  }

  if (params.stock && params.stock !== "all") {
    next = next.filter((product) => product.stockState === params.stock);
  }

  return sortProducts(next, params.sort);
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
    const result = applySearchFilters(getResolvedProducts(), filters);
    return {
      products: result,
      total: result.length,
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

    if (preview.items.length === 0) {
      throw new Error("Your cart is empty.");
    }

    for (const item of preview.items) {
      if (item.quantity > item.product.stockQty) {
        throw new Error(`Only ${item.product.stockQty} left for ${item.product.name}.`);
      }
    }

    updateStockAfterOrder(cart.items);
    const createdAt = new Date().toISOString();
    const fulfillment = getFulfillmentOption(draft.fulfillmentMethod);
    const addressLabel =
      draft.fulfillmentMethod === "pickup"
        ? draft.pickupLocation || pickupLocationLabel
        : [draft.addressLine1, draft.addressLine2, draft.city].filter(Boolean).join(", ");

    const order: Order = {
      id: createOrderId(),
      createdAt,
      status: "confirmed",
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
      etaLabel: fulfillment.etaLabel,
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

  async getProducts(params: ProductQuery = {}) {
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
