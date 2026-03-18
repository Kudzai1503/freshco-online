import Image from "next/image";
import Link from "next/link";

import { departments } from "@/lib/storefront/mock/data";

import { CartCountBadge } from "@/components/storefront/layout/CartCountBadge";

export function StorefrontHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--freshco-border)] bg-white/95 backdrop-blur">
      <div className="px-4 py-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14">
        <div className="flex flex-wrap items-center gap-4">
          <Link
            className="inline-flex items-center rounded-[18px] transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            href="/"
          >
            <Image
              alt="FreshCo logo"
              className="h-auto w-[154px] sm:w-[172px]"
              height={88}
              priority
              src="/freshco/logofrshco.png"
              width={296}
            />
          </Link>

          <form action="/shop" className="order-3 flex w-full items-center gap-2 lg:order-none lg:ml-6 lg:max-w-[460px]">
            <label className="sr-only" htmlFor="storefront-search">
              Search FreshCo products
            </label>
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--freshco-text-soft)]">
                <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M16 16L21 21" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                </svg>
              </span>
              <input
                className="h-12 w-full rounded-full border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] pl-11 pr-4 text-[0.95rem] text-[var(--freshco-text)] outline-none transition focus:border-[var(--freshco-brand)]"
                id="storefront-search"
                name="q"
                placeholder="Search fruit, deli, confectionery, butchery, winery..."
                type="search"
              />
            </div>
            <button
              className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--freshco-brand)] px-5 text-[0.8rem] font-extrabold uppercase tracking-[0.14em] text-white transition duration-200 hover:-translate-y-0.5 hover:brightness-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-2"
              type="submit"
            >
              Search
            </button>
          </form>

          <nav aria-label="Store departments" className="hidden xl:block xl:flex-1">
            <ul className="flex flex-wrap items-center justify-center gap-3 text-[0.78rem] font-semibold uppercase tracking-[0.15em] text-[var(--freshco-text-soft)]">
              {departments.slice(0, 6).map((department) => (
                <li key={department.slug}>
                  <Link
                    className="rounded-full px-2 py-1 transition-colors hover:text-[var(--freshco-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-2"
                    href={`/shop?department=${department.slug}`}
                  >
                    {department.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2.5">
            <Link
              className="hidden h-12 items-center justify-center rounded-full border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] px-5 text-[0.8rem] font-extrabold uppercase tracking-[0.14em] text-[var(--freshco-text)] transition duration-200 hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-2 md:inline-flex"
              href="/account"
            >
              Account
            </Link>
            <CartCountBadge />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 xl:hidden">
          {departments.map((department) => (
            <Link
              key={department.slug}
              className="inline-flex rounded-full border border-[var(--freshco-border)] bg-white px-4 py-2 text-[0.76rem] font-bold uppercase tracking-[0.12em] text-[var(--freshco-text-soft)] transition hover:border-[var(--freshco-brand)] hover:text-[var(--freshco-text)]"
              href={`/shop?department=${department.slug}`}
            >
              {department.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

