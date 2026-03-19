"use client";

import { StorefrontRouteState } from "@/components/storefront/shared/StorefrontRouteState";

export default function StorefrontError() {
  return (
    <StorefrontRouteState
      actionHref="/shop"
      actionLabel="Back to shop"
      description="Something went wrong while loading this storefront page. Please try again or head back to the shop."
      eyebrow="Storefront error"
      title="This page could not load."
    />
  );
}
