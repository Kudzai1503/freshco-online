export type DepartmentSlug =
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

export type StockState = "in_stock" | "low_stock" | "out_of_stock";

export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "stock-desc";

export type Department = {
  slug: DepartmentSlug;
  name: string;
  description: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  department: DepartmentSlug;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  tags: string[];
  stockQuantity: number;
  stockState: StockState;
  featured?: boolean;
  ageRestricted?: boolean;
  sku: string;
};

export type ProductQuery = {
  query?: string;
  department?: DepartmentSlug | "all";
  stock?: "all" | StockState;
  sort?: SortOption;
};

export type ProductSearchResult = {
  products: Product[];
  total: number;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type Cart = {
  items: CartItem[];
  updatedAt: string;
};

export type CheckoutDraft = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  deliveryNotes: string;
  paymentMethod: "card" | "cash";
};

export type CustomerProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredDepartment: DepartmentSlug;
};

export type OrderItem = {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
};

export type Order = {
  id: string;
  createdAt: string;
  status: "confirmed" | "processing";
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  customer: CustomerProfile;
  deliveryAddress: string;
};

export type StockSnapshot = Record<
  string,
  {
    quantity: number;
    state: StockState;
  }
>;

export type CheckoutPreview = {
  cart: Cart;
  items: Array<{
    product: Product;
    quantity: number;
    lineTotal: number;
  }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
};

