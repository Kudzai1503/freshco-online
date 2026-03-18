import type {
  Cart,
  Category,
  CheckoutDraft,
  CheckoutPreview,
  CustomerProfile,
  Department,
  Order,
  Product,
  ProductQuery,
  ProductSearchResult,
  SearchFilters,
} from "@/lib/storefront/types";

export interface StorefrontClient {
  getCategories(): Promise<Category[]>;
  getFeaturedProducts(): Promise<Product[]>;
  searchProducts(filters?: SearchFilters): Promise<ProductSearchResult>;
  getProductBySlug(slug: string): Promise<Product | null>;
  getRelatedProducts(productId: string): Promise<Product[]>;
  getCart(): Promise<Cart>;
  addToCart(productId: string, quantity?: number): Promise<Cart>;
  updateCartItemQty(productId: string, quantity: number): Promise<Cart>;
  removeCartItem(productId: string): Promise<Cart>;
  clearCart(): Promise<Cart>;
  getCheckoutDraft(): Promise<CheckoutDraft>;
  saveCheckoutDraft(draft: CheckoutDraft): Promise<CheckoutDraft>;
  getCheckoutPreview(): Promise<CheckoutPreview>;
  placeMockOrder(): Promise<Order>;
  getOrders(): Promise<Order[]>;
  getOrderById(orderId: string): Promise<Order | null>;
  getMockProfile(): Promise<CustomerProfile>;
  saveMockProfile(profile: CustomerProfile): Promise<CustomerProfile>;

  // Compatibility methods for the current app during migration.
  getDepartments(): Promise<Department[]>;
  getProducts(params?: ProductQuery): Promise<ProductSearchResult>;
  setCartItem(productId: string, quantity: number): Promise<Cart>;
  getCustomerProfile(): Promise<CustomerProfile>;
  saveCustomerProfile(profile: CustomerProfile): Promise<CustomerProfile>;
}
