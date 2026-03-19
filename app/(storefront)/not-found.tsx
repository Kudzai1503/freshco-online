import { StorefrontRouteState } from "@/components/storefront/shared/StorefrontRouteState";

export default function StorefrontNotFound() {
  return (
    <StorefrontRouteState
      actionHref="/shop"
      actionLabel="Browse catalog"
      description="The page or product you requested could not be found."
      eyebrow="Not found"
      title="We could not find that storefront page."
    />
  );
}
