import Link from "next/link";

import { AssetImage } from "@/components/home/shared/AssetImage";

type ArrowButtonProps = Readonly<{
  dark?: boolean;
  href: string;
}>;

function ArrowButton({ dark = false, href }: ArrowButtonProps) {
  return (
    <Link
      aria-label="Explore more"
      className={`group flex h-11 w-11 items-center justify-center rounded-full transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67BE63] focus-visible:ring-offset-2 ${
        dark
          ? "bg-white/12 text-white focus-visible:ring-offset-[#0E6C6B]"
          : "bg-white text-[#173534] focus-visible:ring-offset-[#DDF0D7]"
      }`}
      href={href}
    >
      <svg
        aria-hidden="true"
        className="h-[16px] w-[16px] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        fill="none"
        viewBox="0 0 20 20"
      >
        <path
          d="M5 15L15 5M7 5H15V13"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    </Link>
  );
}

function LeafIcon() {
  return (
    <svg aria-hidden="true" className="h-8 w-8 text-[#173534]" fill="none" viewBox="0 0 32 32">
      <path d="M9 18C9 10.82 15.05 5 22.5 5C22.5 12.18 16.45 18 9 18Z" fill="currentColor" opacity="0.12" />
      <path
        d="M9 18C15.5 18 20.5 13 22.5 5C23.37 12.11 19.27 18 13.5 21.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path d="M13.5 21.5C14.5 20 16.55 18.74 19.5 18.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  );
}

export function HeroCards() {
  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)]">
      <article className="group relative min-h-[340px] overflow-hidden rounded-[34px] bg-[#0E6C6B] px-7 py-7 text-white transition duration-300 hover:-translate-y-1">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex rounded-full border border-white/18 bg-white/8 px-4 py-2 text-[0.78rem] font-bold tracking-[0.14em] text-white/90">
              Organic
            </span>
            <ArrowButton dark href="/shop?department=fruits" />
          </div>
          <div className="flex gap-1.5 pt-2">
            <span className="h-1.5 w-1.5 rounded-full bg-white/55" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
          </div>
        </div>
        <h2 className="mt-7 max-w-[320px] text-[2.15rem] font-extrabold leading-[1.02] tracking-[-0.05em] sm:text-[2.7rem]">
          Organic goodness you can taste.
        </h2>
        <p className="mt-4 max-w-[270px] text-[1rem] leading-7 text-white/76">
          Curated weekly boxes with peak-season fruit, vibrant vegetables, and
          pantry staples chosen for everyday freshness.
        </p>
        <AssetImage
          alt="Basket of fresh groceries"
          className="object-contain object-bottom"
          fallbackClassName="flex h-full w-full items-end justify-center rounded-[28px] border border-dashed border-white/20 bg-white/8 px-6 pb-4 text-center text-[0.85rem] font-semibold uppercase tracking-[0.16em] text-white/85"
          fallbackLabel="Fresh basket"
          fill
          sizes="(max-width: 1280px) 100vw, 520px"
          src="/assets/bread.png"
          wrapperClassName="pointer-events-none absolute bottom-0 right-0 h-[64%] w-[68%] translate-x-[6%]"
        />
      </article>

      <article className="group relative min-h-[340px] overflow-hidden rounded-[34px] border border-[#173534]/10 bg-[#F5FBF2] px-7 py-7 text-[#173534] transition duration-300 hover:-translate-y-1">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[42%] bg-[linear-gradient(180deg,rgba(220,240,210,0.82)_0%,rgba(245,251,242,0)_100%)]" />
        <div className="flex items-start justify-between gap-4">
          <h2 className="max-w-[260px] text-[1.8rem] font-extrabold leading-[1.03] tracking-[-0.05em] sm:text-[2.15rem]">
            Healthy and fresh produce market
          </h2>
          <LeafIcon />
        </div>

        <AssetImage
          alt="Bowl of fresh produce"
          className="object-contain"
          fallbackClassName="flex h-full w-full items-center justify-center rounded-full border border-dashed border-[#173534]/18 bg-white/55 text-center text-[0.82rem] font-semibold uppercase tracking-[0.16em] text-[#355654]"
          fallbackLabel="Fruit bowl"
          fill
          sizes="(max-width: 1280px) 260px, 320px"
          src="/assets/bananas.png"
          wrapperClassName="pointer-events-none absolute left-1/2 top-[46%] h-[56%] w-[66%] -translate-x-1/2 -translate-y-1/2"
        />
        <div className="absolute left-1/2 top-[58%] -translate-x-[12%] -translate-y-1/2">
          <ArrowButton href="/shop?department=vegetables" />
        </div>
        <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between gap-4">
          <p className="text-[2rem] font-extrabold leading-none tracking-[-0.06em]">4.8+</p>
          <p className="max-w-[190px] text-right text-[0.96rem] font-medium leading-6 text-[#355654]">
            Healthy grocery choices for your family
          </p>
        </div>
      </article>
    </section>
  );
}
