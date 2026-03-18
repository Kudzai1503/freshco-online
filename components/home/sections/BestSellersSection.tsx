import { featuredProducts, trendingProducts } from "@/components/home/data/content";
import { AssetImage } from "@/components/home/shared/AssetImage";
import { ProductCard } from "@/components/home/shared/ProductCard";
import { SectionHeading } from "@/components/home/shared/SectionHeading";

export function BestSellersSection() {
  return (
    <section className="bg-white px-4 py-7 sm:px-6 lg:px-8 xl:px-10 2xl:px-14" id="best-sellers">
      <div className="rounded-[38px] border border-[#173534]/10 bg-[#F8FCF7] px-5 py-8 sm:px-7 lg:px-10 lg:py-10">
        <SectionHeading
          copy="This spotlight uses more of the viewport width so the central offer feels intentional and substantial, not just another narrow card in a stack."
          eyebrow="BEST SELLERS"
          title="A stronger center-weighted product story with supporting favorites around it."
        />
        <div className="mt-8 grid gap-4 2xl:grid-cols-[0.78fr_1.25fr_0.78fr]">
          <div className="grid gap-4">
            <ProductCard product={featuredProducts[0]} />
            <ProductCard product={trendingProducts[0]} />
          </div>
          <div className="rounded-[34px] border border-[#173534]/10 bg-white p-5">
            <div className="relative overflow-hidden rounded-[28px] bg-[#F5FBF3] px-6 py-8 sm:px-8">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[46%] bg-[linear-gradient(180deg,rgba(223,240,214,0.85)_0%,rgba(245,251,243,0)_100%)]" />
              <span className="inline-flex rounded-full bg-white px-4 py-2 text-[0.74rem] font-extrabold tracking-[0.15em] text-[#173534]">
                EDITOR&apos;S BOX
              </span>
              <div className="mt-6 grid gap-6 xl:grid-cols-[1.08fr_0.92fr] xl:items-center">
                <div>
                  <p className="text-[0.82rem] font-bold uppercase tracking-[0.14em] text-[#3F9853]">
                    Weekly Bestseller
                  </p>
                  <h3 className="mt-3 text-[2.5rem] font-extrabold leading-[0.92] tracking-[-0.06em] text-[#173534]">
                    Harvest family produce box
                  </h3>
                  <p className="mt-4 max-w-[360px] text-[1rem] leading-7 text-[#355654]">
                    A generous mix of vibrant fruit, salad staples, and quick-cook vegetables designed for 4 to 5 days of family meals.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <p className="text-[2.1rem] font-extrabold tracking-[-0.05em] text-[#173534]">
                      $28.90
                    </p>
                    <button
                      className="inline-flex h-12 items-center justify-center rounded-full bg-[#173534] px-5 text-[0.82rem] font-extrabold uppercase tracking-[0.14em] text-white transition duration-200 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67BE63] focus-visible:ring-offset-2"
                      type="button"
                    >
                      Add to box
                    </button>
                  </div>
                </div>
                <div className="relative h-[320px] overflow-hidden rounded-[28px] border border-[#173534]/8 bg-[#F8FCF7]">
                  <AssetImage
                    alt="Harvest family produce box"
                    className="object-contain p-6"
                    fallbackClassName="flex h-full w-full items-center justify-center text-[1rem] font-bold uppercase tracking-[0.16em] text-[#355654]"
                    fallbackLabel="Harvest box"
                    fill
                    sizes="(max-width: 1280px) 100vw, 480px"
                    src=""
                    wrapperClassName="absolute inset-0"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            <ProductCard product={featuredProducts[1]} />
            <ProductCard product={trendingProducts[1]} />
          </div>
        </div>
      </div>
    </section>
  );
}
