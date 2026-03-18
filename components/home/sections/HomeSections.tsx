import { BestSellersSection } from "@/components/home/sections/BestSellersSection";
import { CategoriesSection } from "@/components/home/sections/CategoriesSection";
import { FeaturedSection } from "@/components/home/sections/FeaturedSection";
import { PromoSection } from "@/components/home/sections/PromoSection";
import { SiteFooter } from "@/components/home/sections/SiteFooter";
import { StorySection } from "@/components/home/sections/StorySection";
import { TrendingSection } from "@/components/home/sections/TrendingSection";

export function HomeSections() {
  return (
    <>
      <CategoriesSection />
      <FeaturedSection />
      <PromoSection />
      <BestSellersSection />
      <TrendingSection />
      <StorySection />
      <SiteFooter />
    </>
  );
}
