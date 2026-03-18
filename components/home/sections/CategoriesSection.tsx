import Link from "next/link";

import { categories } from "@/components/home/data/content";
import { SectionHeading } from "@/components/home/shared/SectionHeading";

export function CategoriesSection() {
  return (
    <section className="bg-white px-4 py-7 sm:px-6 lg:px-8 xl:px-10 2xl:px-14" id="categories">
      <div className="rounded-[38px] border border-[#173534]/10 bg-[#F9FCF8] px-5 py-8 sm:px-7 lg:px-10 lg:py-10">
        <SectionHeading
          copy="The page stays bright and screen-filling, while these category cards create strong scan paths instead of leaving blank space around isolated modules."
          eyebrow="CURATED CATEGORIES"
          title="Browse by what your home actually needs."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.title}
              className={`group relative overflow-hidden rounded-[30px] border border-[#173534]/8 ${category.surfaceClassName} p-6 transition duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67BE63] focus-visible:ring-offset-2`}
              href={category.href}
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[38%] bg-[linear-gradient(180deg,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0)_100%)]" />
              <div className="flex h-full flex-col justify-between gap-12">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#173534]">
                  <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 20 20">
                    <path d="M5 15L15 5M7 5H15V13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[1.42rem] font-extrabold leading-[1.02] tracking-[-0.04em] text-[#173534]">
                    {category.title}
                  </h3>
                  <p className="mt-3 max-w-[250px] text-[1rem] leading-7 text-[#355654]">
                    {category.subtitle}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
