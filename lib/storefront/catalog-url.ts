export type SearchParamsMap = Record<string, string | string[] | undefined>;

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function createCatalogHref(
  current: SearchParamsMap,
  updates: Record<string, string | undefined>,
) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(current)) {
    const normalized = firstParam(value);
    if (normalized) {
      params.set(key, normalized);
    }
  }

  for (const [key, value] of Object.entries(updates)) {
    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  }

  const shouldResetPage = Object.keys(updates).some((key) => key !== "page" && key !== "pageSize");
  if (shouldResetPage) {
    params.delete("page");
  }

  const query = params.toString();
  return query ? `/shop?${query}` : "/shop";
}
