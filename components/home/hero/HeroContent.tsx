import Link from "next/link";

import { heroFruits, quickPicks } from "@/components/home/data/content";
import { AssetImage } from "@/components/home/shared/AssetImage";

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="h-[15px] w-[15px]" fill="none" viewBox="0 0 20 20">
      <path
        d="M5 15L15 5M7 5H15V13"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function HeroContent() {
  return (
    <section className="relative flex min-h-[560px] flex-col justify-center overflow-hidden py-10 lg:min-h-[640px] lg:py-12 2xl:min-h-[700px]">
      <div className="relative z-10 max-w-[980px]">
        <span className="inline-flex rounded-full border border-[#173534]/14 px-4 py-2 text-[0.72rem] font-bold tracking-[0.18em] text-[#355654] sm:px-5">
          COMPLETE FRESH PRODUCE SOLUTIONS
        </span>
        <div className="relative mt-6">
          <h1 className="max-w-[980px] text-[4rem] font-extrabold uppercase leading-[0.88] tracking-[-0.085em] text-[#173534] sm:text-[5.2rem] xl:text-[7.1rem] 2xl:text-[8.1rem]">
            <span className="block">SHOP FRESH</span>
            <span className="block">PRODUCE</span>
          </h1>
          {heroFruits.map((fruit) => (
            <AssetImage
              key={`${fruit.src}-${fruit.alt}-${fruit.className}`}
              alt={fruit.alt}
              className="object-contain"
              fallbackClassName="flex h-full w-full items-center justify-center rounded-full border border-dashed border-[#173534]/18 bg-[#F4FBF3] text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#355654]"
              fallbackLabel={fruit.fallbackLabel}
              fill
              sizes="(max-width: 1280px) 120px, 180px"
              src={fruit.src}
              wrapperClassName={`pointer-events-none absolute ${fruit.className}`}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-10 grid gap-6 xl:grid-cols-[360px_1fr] xl:items-end xl:justify-between">
        <div className="flex flex-col gap-5">
          <Link
            className="group inline-flex h-14 items-center justify-center gap-3 self-start rounded-full bg-[#173534] px-7 text-[0.9rem] font-extrabold tracking-[0.16em] text-white transition duration-200 hover:-translate-y-0.5 hover:brightness-[1.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67BE63] focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:h-[58px] sm:px-8"
            href="/shop"
          >
            <span>SHOP NOW</span>
            <span className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowIcon />
            </span>
          </Link>
          <div className="flex flex-wrap gap-2.5">
            {quickPicks.map((item) => (
              <span
                key={item}
                className="inline-flex rounded-full border border-[#173534]/10 bg-[#F6FBF5] px-4 py-2 text-[0.78rem] font-semibold text-[#355654]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <p className="max-w-[520px] text-[1.02rem] font-medium leading-8 text-[#355654] xl:justify-self-end">
          FreshCo makes healthy groceries, fruits, and vegetables easy to order
          for every home, with curated pantry picks, seasonal freshness, and a
          cleaner shopping rhythm that feels premium from the first screen.
        </p>
      </div>
    </section>
  );
}
