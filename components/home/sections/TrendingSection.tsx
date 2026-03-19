import { trendingProducts } from "@/components/home/data/content";
import { ProductCard } from "@/components/home/shared/ProductCard";
import { SectionHeading } from "@/components/home/shared/SectionHeading";

export function TrendingSection() {
  return (
    <section className="bg-white px-4 py-7 sm:px-6 lg:px-8 xl:px-10 2xl:px-14" id="trending">
      <div className="rounded-[38px] border border-[#173534]/10 bg-[#F7FBF6] px-5 py-8 sm:px-7 lg:px-10 lg:py-10">
        <SectionHeading
          copy="Stock up on fruit, salad greens, and colorful staples that keep weeknight meals moving."
          eyebrow="TRENDING PRODUCTS"
          title="Stock up on colorful everyday essentials."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
          {trendingProducts.map((product) => (
            <ProductCard key={product.title} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
