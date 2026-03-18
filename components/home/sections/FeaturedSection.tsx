import { featuredProducts } from "@/components/home/data/content";
import { ProductCard } from "@/components/home/shared/ProductCard";
import { SectionHeading } from "@/components/home/shared/SectionHeading";

export function FeaturedSection() {
  return (
    <section className="bg-white px-4 py-7 sm:px-6 lg:px-8 xl:px-10 2xl:px-14" id="featured">
      <div className="rounded-[38px] border border-[#173534]/10 bg-[#F8FCF7] px-5 py-8 sm:px-7 lg:px-10 lg:py-10">
        <SectionHeading
          copy="The retail rhythm is denser now, but still structured with enough contrast and spacing that the products feel premium rather than cluttered."
          eyebrow="FEATURED PRODUCTS"
          title="Fresh picks with a sharper, more professional hierarchy."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.title} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
