import type { ReactNode } from "react";

import { SiteFooter } from "@/components/home/sections/SiteFooter";
import { StorefrontAnnouncementBar } from "@/components/storefront/layout/StorefrontAnnouncementBar";
import { StorefrontHeader } from "@/components/storefront/layout/StorefrontHeader";

export default function StorefrontLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <StorefrontAnnouncementBar />
      <StorefrontHeader />
      {children}
      <SiteFooter />
    </>
  );
}
