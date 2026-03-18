import type {
  Cart,
  CheckoutDraft,
  CheckoutPreview,
  CustomerProfile,
  Department,
  Order,
  Product,
  ProductQuery,
  ProductSearchResult,
} from "@/lib/storefront/types";

export interface StorefrontClient {
  getDepartments(): Promise<Department[]>;
  getProducts(params?: ProductQuery): Promise<ProductSearchResult>;
  getProductBySlug(slug: string): Promise<Product | null>;
  searchProducts(query: string, params?: ProductQuery): Promise<ProductSearchResult>;
  getRelatedProducts(productId: string): Promise<Product[]>;
  getCart(): Promise<Cart>;
  setCartItem(productId: string, quantity: number): Promise<Cart>;
  removeCartItem(productId: string): Promise<Cart>;
  getCheckoutDraft(): Promise<CheckoutDraft>;
  saveCheckoutDraft(draft: CheckoutDraft): Promise<CheckoutDraft>;
  getCheckoutPreview(): Promise<CheckoutPreview>;
  placeMockOrder(): Promise<Order>;
  getCustomerProfile(): Promise<CustomerProfile>;
  saveCustomerProfile(profile: CustomerProfile): Promise<CustomerProfile>;
  getOrders(): Promise<Order[]>;
}

