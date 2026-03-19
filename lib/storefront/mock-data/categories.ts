import type { Category } from "@/lib/storefront/types";

export const categories: Category[] = [
  {
    slug: "fruits",
    name: "Fruits",
    description: "Seasonal fruit, citrus, berries, and everyday family favorites.",
  },
  {
    slug: "vegetables",
    name: "Vegetables",
    description: "Leafy greens, roots, herbs, and salad staples for daily cooking.",
  },
  {
    slug: "groceries",
    name: "Groceries",
    description: "Pantry basics, grains, oils, and cooking essentials.",
  },
  {
    slug: "deli",
    name: "Deli",
    description: "Sliced meats, prepared salads, cheeses, and ready-to-eat bites.",
  },
  {
    slug: "confectionery",
    name: "Confectionery",
    description: "Chocolate, biscuits, sweets, and tea-time treats.",
  },
  {
    slug: "butchery",
    name: "Butchery",
    description: "Fresh cuts, braai packs, chicken, and premium proteins.",
  },
  {
    slug: "winery",
    name: "Winery",
    description: "Red, white, rosé, and sparkling wines for every table.",
  },
  {
    slug: "dairy-eggs",
    name: "Dairy & Eggs",
    description: "Milk, yogurt, cheese, butter, and breakfast-ready eggs.",
  },
  {
    slug: "beverages",
    name: "Beverages",
    description: "Juices, water, soft drinks, tea, coffee, and everyday refreshment.",
  },
  {
    slug: "household",
    name: "Household",
    description: "Cleaning, paper goods, laundry, and practical home supplies.",
  },
];

export const departments = categories;
