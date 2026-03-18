import Image from "next/image";
import Link from "next/link";

import { navItems } from "@/components/home/data/content";

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16L21 21" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg aria-hidden="true" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24">
      <path
        d="M4 6H5.7C6.3 6 6.82 6.4 6.96 6.98L7.35 8.5H19.5L17.88 14.16C17.69 14.85 17.06 15.33 16.35 15.33H9.07C8.31 15.33 7.65 14.82 7.45 14.08L5.58 7.33"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <circle cx="10" cy="18.3" r="1.25" fill="currentColor" />
      <circle cx="16.4" cy="18.3" r="1.25" fill="currentColor" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg aria-hidden="true" className="h-3 w-3" fill="none" viewBox="0 0 12 12">
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" />
    </svg>
  );
}

export function HomeHeader() {
  return (
    <header
      className="flex flex-wrap items-center gap-4 border-b border-[var(--freshco-border)] pb-6 lg:flex-nowrap lg:justify-between lg:pb-8"
    >
      <Link
        className="inline-flex items-center rounded-[18px] transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        href="/"
      >
        <Image
          alt="FreshCo logo"
          className="h-auto w-[150px] sm:w-[172px]"
          height={88}
          priority
          src="/freshco/logofrshco.png"
          width={296}
        />
      </Link>

      <nav aria-label="Primary" className="order-3 w-full lg:order-none lg:w-auto">
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-3 text-[0.8rem] font-semibold tracking-[0.16em] text-[var(--freshco-text-soft)] lg:justify-center xl:gap-x-8">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                className="group inline-flex items-center gap-1.5 transition-colors hover:text-[var(--freshco-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                href={item.href}
              >
                <span>{item.label}</span>
                {item.hasChevron ? (
                  <span className="transition-transform duration-200 group-hover:translate-y-[1px]">
                    <ChevronIcon />
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="ml-auto flex items-center gap-2.5 sm:gap-3">
        <button
          aria-label="Search products"
          className="group flex h-12 w-12 items-center justify-center rounded-full border border-[var(--freshco-border)] bg-[#F6FBF5] text-[var(--freshco-text)] transition duration-200 hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          type="button"
        >
          <span className="transition-transform duration-200 group-hover:scale-105">
            <SearchIcon />
          </span>
        </button>
        <Link
          className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--freshco-brand)] px-5 text-[0.82rem] font-extrabold tracking-[0.14em] text-white transition duration-200 hover:-translate-y-0.5 hover:brightness-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:px-6"
          href="/shop"
        >
          ORDER NOW
        </Link>
        <button
          aria-label="Open cart"
          className="group flex h-12 w-12 items-center justify-center rounded-full border border-[var(--freshco-border)] bg-white text-[var(--freshco-text)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#F7FBF4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          type="button"
        >
          <span className="transition-transform duration-200 group-hover:scale-105">
            <CartIcon />
          </span>
        </button>
      </div>
    </header>
  );
}
