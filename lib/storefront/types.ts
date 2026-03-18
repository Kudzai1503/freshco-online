export type CategorySlug =
  | "fruits"
  | "vegetables"
  | "groceries"
  | "deli"
  | "confectionery"
  | "butchery"
  | "winery"
  | "dairy-eggs"
  | "beverages"
  | "household";

export type DepartmentSlug = CategorySlug;

export type StockState = "in_stock" | "low_stock" | "out_of_stock";

export type FulfillmentMethod =
  | "standard_delivery"
  | "express_delivery"
  | "pickup";

export type OrderStatus =
  | "confirmed"
  | "packed"
  | "out_for_delivery"
  | "delivered"
  | "ready_for_pickup"
  | "picked_up";

export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "stock-desc";

export type ProductAttributeValue = string | number | boolean;

export type ProductImage = Readonly<{
  src: string;
  alt: string;
}>;

export type Category = Readonly<{
  slug: CategorySlug;
  name: string;
  description: string;
}>;

export type Department = Category;

export type Address = Readonly<{
  line1: string;
  line2?: string;
  city: string;
  instructions?: string;
}>;

export type Product = Readonly<{
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  department: DepartmentSlug;
  price: number;
  compareAtPrice?: number;
  unit: string;
  stockQty: number;
  stockQuantity: number;
  stockState: StockState;
  featured: boolean;
  organic: boolean;
  tags: string[];
  shortDescription: string;
  longDescription: string;
  description: string;
  image: string;
  images: ProductImage[];
  badges: string[];
  ageRestricted: boolean;
  attributes: Readonly<Record<string, ProductAttributeValue>>;
  sku: string;
}>;

export type SearchFilters = Readonly<{
  query?: string;
  category?: CategorySlug | "all";
  department?: DepartmentSlug | "all";
  stock?: "all" | StockState;
  sort?: SortOption;
}>;

export type ProductQuery = SearchFilters;

export type ProductSearchResult = Readonly<{
  products: Product[];
  total: number;
}>;

export type CartItem = Readonly<{
  productId: string;
  quantity: number;
}>;

export type Cart = Readonly<{
  items: CartItem[];
  updatedAt: string;
}>;

export type CheckoutDraft = Readonly<{
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  deliveryNotes: string;
  paymentMethod: "card" | "cash";
  fulfillmentMethod: FulfillmentMethod;
  pickupLocation: string;
}>;

export type CustomerProfile = Readonly<{
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredDepartment: DepartmentSlug;
}>;

export type OrderItem = Readonly<{
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
  unit?: string;
}>;

export type OrderTrackingEvent = Readonly<{
  status: OrderStatus;
  label: string;
  description: string;
  timestamp: string;
  completed: boolean;
}>;

export type Order = Readonly<{
  id: string;
  createdAt: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  customer: CustomerProfile;
  deliveryAddress: string;
  address?: Address;
  fulfillmentMethod: FulfillmentMethod;
  fulfillmentLabel: string;
  etaLabel: string;
  pickupLocation?: string;
  trackingTimeline: OrderTrackingEvent[];
}>;

export type StockSnapshot = Readonly<
  Record<
    string,
    Readonly<{
      quantity: number;
      state: StockState;
    }>
  >
>;

export type CheckoutPreview = Readonly<{
  cart: Cart;
  items: Array<{
    product: Product;
    quantity: number;
    lineTotal: number;
  }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  fulfillmentMethod: FulfillmentMethod;
  fulfillmentLabel: string;
  etaLabel: string;
}>;
