import { mockStorefrontClient } from "@/lib/storefront/mock-client";
import type { DepartmentFilter, SearchFilters } from "@/lib/storefront/types";

type RawSearchParams = Record<string, string | string[] | undefined>;

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseNumberParam(value: string | string[] | undefined) {
  const normalized = firstParam(value);

  if (!normalized) {
    return undefined;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function parseCatalogSearchParams(searchParams: RawSearchParams): SearchFilters {
  const department = firstParam(searchParams.department);
  const query = firstParam(searchParams.q);

  return {
    query: query?.trim() || undefined,
    department:
      department && department !== "all" ? (department as DepartmentFilter) : "all",
    page: Math.max(1, parseNumberParam(searchParams.page) ?? 1),
    pageSize: Math.max(1, parseNumberParam(searchParams.pageSize) ?? 12),
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
