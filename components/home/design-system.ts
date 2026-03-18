
export const homeDesignSystem = {
  colors: {
    page: "bg-white",

    text: "text-[#173534]",
    textSoft: "text-[#355654]",
    brand: "bg-[#67BE63]",
    brandDark: "bg-[#3F9853]",
    surface: "bg-white",
    surfaceSoft: "bg-[#F8FCF7]",
    surfaceSoftAlt: "bg-[#F9FCF8]",
    surfaceSoftStrong: "bg-[#F4FBF3]",
    surfaceTint: "bg-[#E7F5EB]",
    border: "border-[#173534]/10",
  },
  radius: {
    section: "rounded-[38px]",
    card: "rounded-[30px]",
    hero: "rounded-[40px]",
    inner: "rounded-[24px]",
    pill: "rounded-full",
  },
  shadow: {
    soft: "shadow-[0_18px_60px_rgba(23,53,52,0.08)]",
    softer: "shadow-[0_18px_44px_rgba(23,53,52,0.08)]",
    hero: "shadow-[0_18px_60px_rgba(23,53,52,0.06)]",
  },
  focus: {
    ring: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67BE63] focus-visible:ring-offset-2",
    ringOnWhite: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67BE63] focus-visible:ring-offset-2 focus-visible:ring-offset-white",
  },
  motion: {
    lift: "transition duration-300 hover:-translate-y-1",
    button: "transition duration-200 hover:-translate-y-0.5",
  },
  layout: {
    pageSectionX: "px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14",
    pageSectionY: "py-7",
    heroSectionY: "pb-8 pt-4",
    shellPadding: "px-5 py-8 sm:px-7 lg:px-10 lg:py-10",
  },
  fades: {
    topSoft:
      "bg-[linear-gradient(180deg,rgba(255,255,255,0.65)_0%,rgba(255,255,255,0)_100%)]",
    greenTop:
      "bg-[linear-gradient(180deg,rgba(223,242,223,0.9)_0%,rgba(244,251,243,0)_100%)]",
    greenTopSoft:
      "bg-[linear-gradient(180deg,rgba(220,240,210,0.82)_0%,rgba(245,251,242,0)_100%)]",
    greenBand:
      "bg-[linear-gradient(180deg,rgba(137,210,120,0.45)_0%,rgba(63,152,83,0)_100%)]",
    bestSeller:
      "bg-[linear-gradient(180deg,rgba(223,240,214,0.85)_0%,rgba(245,251,243,0)_100%)]",
  },
} as const;

