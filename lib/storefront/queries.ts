import { mockStorefrontClient } from "@/lib/storefront/mock-client";
import type { DepartmentSlug, ProductQuery, SortOption, StockState } from "@/lib/storefront/types";

type RawSearchParams = Record<string, string | string[] | undefined>;

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseCatalogSearchParams(searchParams: RawSearchParams): ProductQuery {
  const department = firstParam(searchParams.department);
  const stock = firstParam(searchParams.stock);
  const sort = firstParam(searchParams.sort);
  const query = firstParam(searchParams.q);

  return {
    query: query?.trim() || undefined,
    department:
      department && department !== "all" ? (department as DepartmentSlug) : "all",
    stock: stock && stock !== "all" ? (stock as StockState) : "all",
    sort: (sort as SortOption) || "featured",
  };
}

export async function getCatalogPageData(searchParams: RawSearchParams) {
  const filters = parseCatalogSearchParams(searchParams);
  const [departments, result] = await Promise.all([
    mockStorefrontClient.getDepartments(),
    mockStorefrontClient.getProducts(filters),
  ]);

  return {
    departments,
    filters,
    result,
  };
}

export async function getProductPageData(slug: string) {
  const product = await mockStorefrontClient.getProductBySlug(slug);
  if (!product) {
    return null;
  }

  const relatedProducts = await mockStorefrontClient.getRelatedProducts(product.id);

  return {
    product,
    relatedProducts,
  };
}
