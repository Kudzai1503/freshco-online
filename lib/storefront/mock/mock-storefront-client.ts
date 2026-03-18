import type { StorefrontClient } from "@/lib/storefront/client";
import {
  defaultCheckoutDraft,
  defaultCustomerProfile,
  departments,
  products,
} from "@/lib/storefront/mock/data";
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
} from "@/lib/storefront/mock/persistence";
import type {
  Cart,
  CheckoutPreview,
  Order,
  Product,
  ProductQuery,
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
      return next.sort((a, b) => b.stockQuantity - a.stockQuantity);
    case "featured":
    default:
      return next.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
}

function applyProductQuery(source: Product[], params: ProductQuery = {}): Product[] {
  const query = params.query?.trim().toLowerCase();

  let next = [...source];

  if (query) {
    next = next.filter((product) => {
      const haystack = [
        product.name,
        product.department,
        product.shortDescription,
        ...product.tags,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }

  if (params.department && params.department !== "all") {
    next = next.filter((product) => product.department === params.department);
  }

  if (params.stock && params.stock !== "all") {
    next = next.filter((product) => product.stockState === params.stock);
  }

  return sortProducts(next, params.sort);
}

function buildCheckoutPreview(cart: Cart): CheckoutPreview {
  const resolvedProducts = getResolvedProducts();
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
  const deliveryFee = subtotal > 0 ? 4.5 : 0;
  const total = Number((subtotal + deliveryFee).toFixed(2));

  return {
    cart,
    items,
    subtotal,
    deliveryFee,
    total,
  };
}

export const mockStorefrontClient: StorefrontClient = {
  async getDepartments() {
    // TODO: Replace with Spring Boot catalog department endpoint.
    return departments;
  },

  async getProducts(params = {}) {
    // TODO: Replace with Spring Boot product listing endpoint.
    const result = applyProductQuery(getResolvedProducts(), params);
    return {
      products: result,
      total: result.length,
    };
  },

  async getProductBySlug(slug) {
    // TODO: Replace with Spring Boot product detail endpoint.
    const product = products.find((entry) => entry.slug === slug);
    return product ? getResolvedProduct(product) : null;
  },

  async searchProducts(query, params = {}) {
    // TODO: Replace with Spring Boot search endpoint.
    const result = applyProductQuery(getResolvedProducts(), { ...params, query });
    return {
      products: result,
      total: result.length,
    };
  },

  async getRelatedProducts(productId) {
    // TODO: Replace with Spring Boot related products endpoint.
    const product = products.find((entry) => entry.id === productId);
    if (!product) {
      return [];
    }

    return getResolvedProducts()
      .filter((entry) => entry.department === product.department && entry.id !== productId)
      .slice(0, 4);
  },

  async getCart() {
    // TODO: Replace with Spring Boot cart endpoint when shopper auth/session exists.
    return getStoredCart();
  },

  async setCartItem(productId, quantity) {
    // TODO: Replace with Spring Boot cart mutation endpoint.
    const product = getResolvedProducts().find((entry) => entry.id === productId);
    if (!product) {
      return getStoredCart();
    }

    const nextQuantity = Math.max(0, Math.min(quantity, product.stockQuantity));
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
    // TODO: Replace with Spring Boot cart deletion endpoint.
    const cart = getStoredCart();
    const nextCart = {
      items: cart.items.filter((item) => item.productId !== productId),
      updatedAt: new Date().toISOString(),
    };

    saveStoredCart(nextCart);
    return nextCart;
  },

  async getCheckoutDraft() {
    // TODO: Replace with Spring Boot checkout draft endpoint.
    return getStoredCheckoutDraft();
  },

  async saveCheckoutDraft(draft) {
    // TODO: Replace with Spring Boot checkout draft mutation endpoint.
    saveStoredCheckoutDraft(draft);
    return draft;
  },

  async getCheckoutPreview() {
    // TODO: Replace with Spring Boot pricing and checkout preview endpoint.
    return buildCheckoutPreview(getStoredCart());
  },

  async placeMockOrder() {
    // TODO: Replace with Spring Boot order placement endpoint.
    const cart = getStoredCart();
    const preview = buildCheckoutPreview(cart);
    const profile = getStoredCustomerProfile();
    const draft = getStoredCheckoutDraft();

    if (preview.items.length === 0) {
      throw new Error("Your cart is empty.");
    }

    for (const item of preview.items) {
      if (item.quantity > item.product.stockQuantity) {
        throw new Error(`Only ${item.product.stockQuantity} left for ${item.product.name}.`);
      }
    }

    updateStockAfterOrder(cart.items);

    const order: Order = {
      id: createOrderId(),
      createdAt: new Date().toISOString(),
      status: "confirmed",
      items: preview.items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      })),
      subtotal: preview.subtotal,
      deliveryFee: preview.deliveryFee,
      total: preview.total,
      customer: {
        ...profile,
        email: draft.email || profile.email,
        phone: draft.phone || profile.phone,
      },
      deliveryAddress: [draft.addressLine1, draft.addressLine2, draft.city]
        .filter(Boolean)
        .join(", "),
    };

    const orders = getStoredOrders();
    saveStoredOrders([order, ...orders]);
    saveStoredCart({ items: [], updatedAt: new Date().toISOString() });
    saveStoredCheckoutDraft(defaultCheckoutDraft);
    return order;
  },

  async getCustomerProfile() {
    // TODO: Replace with Spring Boot customer profile endpoint.
    return getStoredCustomerProfile() ?? defaultCustomerProfile;
  },

  async saveCustomerProfile(profile) {
    // TODO: Replace with Spring Boot customer profile mutation endpoint.
    saveStoredCustomerProfile(profile);
    return profile;
  },

  async getOrders() {
    // TODO: Replace with Spring Boot orders endpoint.
    return getStoredOrders();
  },
};
