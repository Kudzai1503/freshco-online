"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import type { Category } from "@/lib/storefront/types";

import { SignOutButton } from "@/components/auth/SignOutButton";
import { CartCountBadge } from "@/components/storefront/layout/CartCountBadge";
import { StorefrontMobileNav } from "@/components/storefront/layout/StorefrontMobileNav";

const primaryLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?department=fruits", label: "Produce" },
  { href: "/account/orders", label: "Orders" },
];

type StorefrontHeaderShellProps = Readonly<{
  embedded?: boolean;
  isAuthenticated: boolean;
  quickDepartments: Category[];
}>;

export function StorefrontHeaderShell({
  embedded = false,
  isAuthenticated,
  quickDepartments,
}: StorefrontHeaderShellProps) {
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    if (!embedded) {
      return;
    }

    function handleScroll() {
      setIsStuck(globalThis.scrollY > 12);
    }

    handleScroll();
    globalThis.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      globalThis.removeEventListener("scroll", handleScroll);
    };
  }, [embedded]);

  const scrolled = embedded ? isStuck : true;
  const headerClassName = `sticky top-0 z-40 border-b transition duration-300 ${
    scrolled
      ? "border-white/10 bg-[#173534] shadow-[0_18px_44px_rgba(23,53,52,0.18)]"
      : "border-transparent bg-white/96 backdrop-blur"
  }`;
  const navTextClassName = scrolled
    ? "text-white/78 hover:text-white focus-visible:ring-white focus-visible:ring-offset-[#173534]"
    : "text-[var(--freshco-text-soft)] hover:text-[var(--freshco-text)] focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-white";
  const lightPillClassName = scrolled
    ? "border-white/14 bg-white/10 text-white hover:bg-white/16 focus-visible:ring-white focus-visible:ring-offset-[#173534]"
    : "border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] text-[var(--freshco-text)] hover:bg-white focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-white";
  const chipClassName = scrolled
    ? "border-white/14 bg-white/10 text-white/82 hover:border-white/28 hover:text-white focus-visible:ring-white focus-visible:ring-offset-[#173534]"
    : "border-[var(--freshco-border)] bg-white text-[var(--freshco-text-soft)] hover:border-[var(--freshco-brand)] hover:text-[var(--freshco-text)] focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-white";

  return (
    <header className={headerClassName}>
      <div className="px-4 py-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14">
        <div className="flex items-center gap-3 xl:gap-5">
          <StorefrontMobileNav categories={quickDepartments} isAuthenticated={isAuthenticated} />
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

          <nav aria-label="Primary storefront" className="hidden xl:block">
            <ul className={`flex items-center gap-5 text-[0.78rem] font-extrabold uppercase tracking-[0.16em] ${scrolled ? "text-white/78" : "text-[var(--freshco-text-soft)]"}`}>
              {primaryLinks.map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <Link
                    className={`transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${navTextClassName}`}
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2.5">
            {isAuthenticated ? (
              <>
                <Link
                  className={`hidden h-12 items-center justify-center rounded-full border px-5 text-[0.8rem] font-extrabold uppercase tracking-[0.14em] transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 md:inline-flex ${lightPillClassName}`}
                  href="/account"
                >
                  Account
                </Link>
                <SignOutButton />
              </>
            ) : (
              <Link
                className={`hidden h-12 items-center justify-center rounded-full border px-5 text-[0.8rem] font-extrabold uppercase tracking-[0.14em] transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 md:inline-flex ${lightPillClassName}`}
                href="/sign-in?callbackUrl=%2Faccount"
              >
                Sign in
              </Link>
            )}
            <CartCountBadge />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {quickDepartments.map((department) => (
            <Link
              key={department.slug}
              className={`inline-flex rounded-full border px-4 py-2 text-[0.76rem] font-bold uppercase tracking-[0.12em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${chipClassName}`}
              href={`/shop?department=${department.slug}`}
            >
              {department.name}
            </Link>
          ))}
          <Link
            className={`inline-flex rounded-full border px-4 py-2 text-[0.76rem] font-bold uppercase tracking-[0.12em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
              scrolled
                ? "border-transparent bg-white/12 text-white hover:bg-white/16 focus-visible:ring-white focus-visible:ring-offset-[#173534]"
                : "border-transparent bg-[var(--freshco-surface-soft)] text-[var(--freshco-text)] hover:bg-white focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-white"
            }`}
            href="/shop"
          >
            All departments
          </Link>
        </div>
      </div>
    </header>
  );
}
