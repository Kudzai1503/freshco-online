export type NavItem = {
  label: string;
  href: string;
  hasChevron?: boolean;
};

export type FruitAsset = {
  src: string;
  alt: string;
  fallbackLabel: string;
  className: string;
};

export type CategoryItem = {
  title: string;
  subtitle: string;
  surfaceClassName: string;
  href: string;
};

export type ProductCardData = {
  title: string;
  category: string;
  price: string;
  rating: string;
  badge?: string;
  src: string;
  fallbackLabel: string;
  bgClassName: string;
};

export type PromoCardData = {
  eyebrow: string;
  title: string;
  copy: string;
  cta: string;
  surfaceClassName: string;
  src: string;
  fallbackLabel: string;
};

export type FooterLinkGroup = {
  heading: string;
  links: { label: string; href: string }[];
};

export const navItems: NavItem[] = [
  { label: "ABOUT", href: "#about" },
  { label: "SHOP", href: "/shop", hasChevron: true },
  { label: "PRODUCE", href: "/shop?department=fruits", hasChevron: true },
  { label: "OFFERS", href: "#offers" },
  { label: "BLOG", href: "#stories" },
];

export const quickPicks = [
  "Seasonal Fruit Boxes",
  "Leafy Greens",
  "Pantry Picks",
  "Same-Day Delivery",
];

export const heroFruits: FruitAsset[] = [
  {
    src: "",
    alt: "Fresh strawberry",
    fallbackLabel: "Berry",
    className:
      "left-[0%] top-[11%] h-[80px] w-[80px] -rotate-[14deg] md:h-[96px] md:w-[96px] 2xl:h-[118px] 2xl:w-[118px]",
  },
  {
    src: "",
    alt: "Sliced strawberry",
    fallbackLabel: "Berry",
    className:
      "left-[40%] top-[20%] h-[56px] w-[56px] rotate-[18deg] md:h-[72px] md:w-[72px] 2xl:h-[84px] 2xl:w-[84px]",
  },
  {
    src: "",
    alt: "Banana bunch",
    fallbackLabel: "Banana",
    className:
      "right-[2%] top-[0%] h-[124px] w-[124px] rotate-[8deg] md:h-[158px] md:w-[158px] 2xl:h-[192px] 2xl:w-[192px]",
  },
  {
    src: "",
    alt: "Orange slices",
    fallbackLabel: "Orange",
    className:
      "bottom-[24%] left-[5%] h-[74px] w-[74px] -rotate-[12deg] md:h-[92px] md:w-[92px] 2xl:h-[112px] 2xl:w-[112px]",
  },
  {
    src: "",
    alt: "Kiwi slices",
    fallbackLabel: "Kiwi",
    className:
      "bottom-[19%] right-[18%] h-[72px] w-[72px] rotate-[12deg] md:h-[92px] md:w-[92px] 2xl:h-[108px] 2xl:w-[108px]",
  },
  {
    src: "",
    alt: "Green grapes",
    fallbackLabel: "Grapes",
    className:
      "bottom-[8%] right-[1%] h-[92px] w-[92px] -rotate-[8deg] md:h-[118px] md:w-[118px] 2xl:h-[148px] 2xl:w-[148px]",
  },
];

export const categories: CategoryItem[] = [
  {
    title: "Organic Fruit",
    subtitle: "Peak-season sweetness and easy weekly picks.",
    surfaceClassName: "bg-[#EFF8EC]",
    href: "#featured",
  },
  {
    title: "Vegetable Crates",
    subtitle: "Farm-fresh greens, roots, and kitchen essentials.",
    surfaceClassName: "bg-[#E9F6F0]",
    href: "#best-sellers",
  },
  {
    title: "Pantry Staples",
    subtitle: "Healthy basics curated for quick family meals.",
    surfaceClassName: "bg-[#F1F8E8]",
    href: "#offers",
  },
  {
    title: "Fresh Deals",
    subtitle: "Daily bundles and same-day neighborhood delivery.",
    surfaceClassName: "bg-[#EAF7F0]",
    href: "#trending",
  },
];

export const featuredProducts: ProductCardData[] = [
  {
    title: "Crisp Greens Mix",
    category: "Leafy Bundle",
    price: "$12.90",
    rating: "4.9",
    badge: "Best Seller",
    src: "",
    fallbackLabel: "Greens",
    bgClassName: "bg-[#F2F8EE]",
  },
  {
    title: "Sunny Citrus Box",
    category: "Seasonal Fruit",
    price: "$18.40",
    rating: "4.8",
    badge: "Fresh Pick",
    src: "",
    fallbackLabel: "Citrus",
    bgClassName: "bg-[#F4FBEE]",
  },
  {
    title: "Avocado Duo Pack",
    category: "Healthy Fats",
    price: "$9.50",
    rating: "4.7",
    src: "",
    fallbackLabel: "Avocado",
    bgClassName: "bg-[#E6F1DA]",
  },
  {
    title: "Berry Breakfast Set",
    category: "Ready Basket",
    price: "$15.90",
    rating: "4.9",
    src: "",
    fallbackLabel: "Berries",
    bgClassName: "bg-[#EDF6E6]",
  },
];

export const trendingProducts: ProductCardData[] = [
  {
    title: "Baby Spinach",
    category: "Greens",
    price: "$6.90",
    rating: "4.6",
    src: "",
    fallbackLabel: "Spinach",
    bgClassName: "bg-[#EEF6E3]",
  },
  {
    title: "Golden Mango",
    category: "Tropical",
    price: "$8.30",
    rating: "4.8",
    src: "",
    fallbackLabel: "Mango",
    bgClassName: "bg-[#F0F8DE]",
  },
  {
    title: "Rainbow Peppers",
    category: "Veggie Pack",
    price: "$11.20",
    rating: "4.7",
    src: "",
    fallbackLabel: "Peppers",
    bgClassName: "bg-[#EAF7EC]",
  },
  {
    title: "Hydration Watermelon",
    category: "Fruit Slice",
    price: "$13.10",
    rating: "4.9",
    src: "",
    fallbackLabel: "Melon",
    bgClassName: "bg-[#F3FBEF]",
  },
];

export const promoCards: PromoCardData[] = [
  {
    eyebrow: "LIMITED OFFER",
    title: "Fresh organic picks for the week ahead",
    copy: "Handpicked bundles with weekly essentials, colorful fruits, and pantry favorites.",
    cta: "Build a box",
    surfaceClassName: "bg-[#F3FAF1]",
    src: "",
    fallbackLabel: "Weekly box",
  },
  {
    eyebrow: "FAST DELIVERY",
    title: "Shop neighborhood produce with same-day ease",
    copy: "A smoother grocery routine with curated categories, meal-friendly staples, and direct checkout.",
    cta: "Explore offers",
    surfaceClassName: "bg-[#EEF9F4]",
    src: "",
    fallbackLabel: "Delivery",
  },
];

export const footerGroups: FooterLinkGroup[] = [
  {
    heading: "Company",
    links: [
      { label: "About FreshCo", href: "/#about" },
      { label: "Our Values", href: "/#stories" },
      { label: "Careers", href: "/#footer" },
    ],
  },
  {
    heading: "Shop",
    links: [
      { label: "Fresh Produce", href: "/#featured" },
      { label: "Best Sellers", href: "/#best-sellers" },
      { label: "Trending", href: "/#trending" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Delivery Info", href: "/#offers" },
      { label: "FAQs", href: "/#footer" },
      { label: "Contact Us", href: "/#footer" },
    ],
  },
];
