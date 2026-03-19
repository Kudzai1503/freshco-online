import Link from "next/link";

import { promoCards } from "@/components/home/data/content";
import { AssetImage } from "@/components/home/shared/AssetImage";

export function PromoSection() {
  return (
    <section className="bg-white px-4 py-7 sm:px-6 lg:px-8 xl:px-10 2xl:px-14" id="offers">
      <div className="grid gap-4 2xl:grid-cols-2">
        {promoCards.map((promo) => (
          <article
            key={promo.title}
            className={`group relative overflow-hidden rounded-[34px] border border-[#173534]/10 ${promo.surfaceClassName} px-6 py-8 transition duration-300 hover:-translate-y-1 sm:px-8`}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[44%] bg-[linear-gradient(180deg,rgba(255,255,255,0.65)_0%,rgba(255,255,255,0)_100%)]" />
            <div className="relative z-10 max-w-[340px]">
              <p className="text-[0.76rem] font-extrabold tracking-[0.18em] text-[#173534]/70">
                {promo.eyebrow}
              </p>
              <h3 className="mt-3 text-[2.2rem] font-extrabold leading-[0.98] tracking-[-0.05em] text-[#173534]">
                {promo.title}
              </h3>
              <p className="mt-4 text-[1rem] leading-7 text-[#355654]">{promo.copy}</p>
              <Link
                className="mt-6 inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-[0.82rem] font-extrabold uppercase tracking-[0.14em] text-[#173534] transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67BE63] focus-visible:ring-offset-2"
                href={promo.href}
              >
                {promo.cta}
                <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 20 20">
                  <path d="M5 15L15 5M7 5H15V13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                </svg>
              </Link>
            </div>
            <AssetImage
              alt={promo.title}
              className="object-contain object-right-bottom transition duration-300 group-hover:scale-[1.03]"
              fallbackClassName="flex h-full w-full items-end justify-end pr-6 pb-6 text-[0.86rem] font-bold uppercase tracking-[0.16em] text-[#355654]"
              fallbackLabel={promo.fallbackLabel}
              fill
              sizes="(max-width: 1280px) 100vw, 520px"
              src={promo.src}
              wrapperClassName="pointer-events-none absolute inset-0"
            />
          </article>
        ))}
      </div>
    </section>
  );
}
