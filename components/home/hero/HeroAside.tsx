import { AssetImage } from "@/components/home/shared/AssetImage";

function ArrowCircle() {
  return (
    <button
      aria-label="Discover produce"
      className="group flex h-12 w-12 items-center justify-center rounded-full border border-[#173534]/12 bg-white text-[#173534] transition duration-200 hover:-translate-y-0.5 hover:bg-[#F7FBF4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67BE63] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      type="button"
    >
      <svg
        aria-hidden="true"
        className="h-[16px] w-[16px] transition-transform duration-200 group-hover:translate-x-0.5"
        fill="none"
        viewBox="0 0 20 20"
      >
        <path d="M5 10H15M11 6L15 10L11 14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    </button>
  );
}

function AvatarStack() {
  const avatars = [
    { src: "", alt: "FreshCo customer Anna", label: "A1" },
    { src: "", alt: "FreshCo customer Maya", label: "A2" },
    { src: "", alt: "FreshCo customer James", label: "A3" },
  ];

  return (
    <div className="flex items-center">
      {avatars.map((avatar, index) => (
        <AssetImage
          key={`${avatar.alt}-${index}`}
          alt={avatar.alt}
          className="object-cover"
          fallbackClassName="flex h-full w-full items-center justify-center rounded-full bg-[#B8D8D1] text-[0.72rem] font-extrabold uppercase tracking-[0.08em] text-[#173534]"
          fallbackLabel={avatar.label}
          fill
          sizes="44px"
          src={avatar.src}
          wrapperClassName={`relative h-11 w-11 overflow-hidden rounded-full border-2 border-[#D8F0DD] ${index > 0 ? "-ml-3" : ""}`}
        />
      ))}
    </div>
  );
}

export function HeroAside() {
  return (
    <aside className="grid gap-5 xl:grid-rows-[minmax(0,1fr)_auto]">
      <section className="group relative min-h-[480px] overflow-hidden rounded-[34px] border border-[#173534]/10 bg-[#F4FBF3] px-7 py-7 transition duration-300 hover:-translate-y-1 xl:min-h-[760px]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[48%] bg-[linear-gradient(180deg,rgba(223,242,223,0.9)_0%,rgba(244,251,243,0)_100%)]" />
        <div className="relative z-10 flex items-start justify-between gap-4">
          <h2 className="max-w-[170px] text-[1.7rem] font-extrabold uppercase leading-[0.98] tracking-[-0.05em] text-[#173534]">
            DISCOVER OUR PRODUCE
          </h2>
          <ArrowCircle />
        </div>
        <div className="relative z-10 mt-7 flex items-center gap-3 text-[#173534]/70">
          <span className="block h-px flex-1 bg-[#173534]/18" />
          <svg aria-hidden="true" className="h-3 w-14" fill="none" viewBox="0 0 56 12">
            <path d="M1 6H53M48 1L54 6L48 11" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
        <AssetImage
          alt="Smiling shopper holding a basket of produce"
          className="object-contain object-bottom"
          fallbackClassName="flex h-full w-full items-end justify-center rounded-[30px] border border-dashed border-[#173534]/12 bg-white/35 px-8 pb-10 text-center text-[0.9rem] font-semibold uppercase tracking-[0.16em] text-[#355654]"
          fallbackLabel="Shopper photo"
          fill
          sizes="(max-width: 1280px) 100vw, 520px"
          src=""
          wrapperClassName="pointer-events-none absolute bottom-0 left-1/2 h-[74%] w-[92%] -translate-x-1/2"
        />
      </section>

      <section className="group rounded-[34px] border border-[#173534]/10 bg-[#E7F5EB] px-7 py-7 text-[#173534] transition duration-300 hover:-translate-y-1">
        <div className="flex flex-col gap-5">
          <div className="max-w-[320px]">
            <h2 className="text-[1.9rem] font-extrabold leading-[1.02] tracking-[-0.05em]">
              Smart people count on high quality!
            </h2>
            <p className="mt-3 text-[1rem] font-medium leading-7 text-[#355654]">
              Good health starts with better produce and everyday essentials.
            </p>
          </div>
          <div className="flex items-end justify-between gap-4">
            <AvatarStack />
            <div className="text-right">
              <p className="text-[2.3rem] font-extrabold leading-none tracking-[-0.06em]">
                3.5M+
              </p>
              <p className="mt-1 text-[0.86rem] font-bold uppercase tracking-[0.14em] text-[#355654]">
                Satisfied Users
              </p>
            </div>
          </div>
        </div>
      </section>
    </aside>
  );
}
