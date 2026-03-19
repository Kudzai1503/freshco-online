import { HeroSection } from "@/components/home/hero/HeroSection";
import { HomeSections } from "@/components/home/sections/HomeSections";
import { StorefrontHeader } from "@/components/storefront/layout/StorefrontHeader";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--freshco-page)] text-[var(--freshco-text)]">
      <StorefrontHeader embedded />
      <HeroSection />
      <HomeSections />
    </main>
  );
}
