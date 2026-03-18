import type { ReactNode } from "react";

import { SiteFooter } from "@/components/home/sections/SiteFooter";
import { StorefrontHeader } from "@/components/storefront/layout/StorefrontHeader";

export default function StorefrontLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <StorefrontHeader />
      {children}
      <SiteFooter />
    </>
  );
}
