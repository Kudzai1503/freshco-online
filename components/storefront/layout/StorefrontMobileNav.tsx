"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

import type { Category } from "@/lib/storefront/types";

type StorefrontMobileNavProps = Readonly<{
  categories: Category[];
  isAuthenticated: boolean;
}>;

const primaryLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?department=fruits", label: "Produce" },
  { href: "/account/orders", label: "Orders" },
  { href: "/cart", label: "Cart" },
];

export function StorefrontMobileNav({
  categories,
  isAuthenticated,
}: StorefrontMobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = globalThis.document.body.style.overflow;
    globalThis.document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    globalThis.addEventListener("keydown", handleKeyDown);

    return () => {
      globalThis.document.body.style.overflow = previousOverflow;
      globalThis.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        aria-controls="storefront-mobile-nav"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--freshco-border)] bg-white text-[var(--freshco-text)] transition duration-200 hover:bg-[var(--freshco-surface-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-2 lg:hidden"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <span className="sr-only">Open navigation</span>
        <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
          <path
            d="M4 7H20M4 12H20M4 17H15"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
        </svg>
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-[#173534]/24"
            onClick={() => setIsOpen(false)}
            type="button"
          />
          <aside
            aria-label="Mobile storefront navigation"
            className="absolute left-0 top-0 flex h-full w-full max-w-[360px] flex-col border-r border-[var(--freshco-border)] bg-white"
            id="storefront-mobile-nav"
          >
            <div className="flex items-center justify-between border-b border-[var(--freshco-border)] px-5 py-4">
              <div>
                <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.16em] text-[var(--freshco-brand-dark)]">
                  FreshCo
                </p>
                <p className="mt-1 text-[1.2rem] font-extrabold tracking-[-0.04em] text-[var(--freshco-text)]">
                  Shop navigation
                </p>
              </div>
              <button
                aria-label="Close navigation"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--freshco-text-soft)] transition hover:bg-[var(--freshco-surface-soft)]"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                <span aria-hidden="true" className="text-[1.3rem] leading-none">
                  ×
                </span>
              </button>
            </div>

            <div className="px-5 py-4">
              <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.16em] text-[var(--freshco-text-soft)]">
                Browse
              </p>
              <div className="mt-3 grid gap-2">
                {primaryLinks.map((link) => (
                  <Link
                    className="rounded-[18px] border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] px-4 py-3 text-[0.92rem] font-bold text-[var(--freshco-text)]"
                    href={link.href}
                    key={`${link.label}-${link.href}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto border-t border-[var(--freshco-border)] px-5 py-4">
              <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.16em] text-[var(--freshco-text-soft)]">
                Departments
              </p>
              <div className="mt-3 grid gap-2">
                {categories.map((category) => (
                  <Link
                    className="rounded-[16px] border border-[var(--freshco-border)] bg-white px-4 py-3 text-[0.92rem] font-bold text-[var(--freshco-text)]"
                    href={`/shop?department=${category.slug}`}
                    key={category.slug}
                    onClick={() => setIsOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-[var(--freshco-border)] px-5 py-4">
              {isAuthenticated ? (
                <div className="grid gap-2">
                  <Link
                    className="inline-flex h-11 items-center justify-center rounded-full border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] px-4 text-[0.78rem] font-extrabold uppercase tracking-[0.14em] text-[var(--freshco-text)]"
                    href="/account"
                    onClick={() => setIsOpen(false)}
                  >
                    Account
                  </Link>
                  <button
                    className="inline-flex h-11 items-center justify-center rounded-full border border-[var(--freshco-border)] bg-white px-4 text-[0.78rem] font-extrabold uppercase tracking-[0.14em] text-[var(--freshco-text)]"
                    onClick={() => void signOut({ callbackUrl: "/" })}
                    type="button"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <Link
                  className="inline-flex h-11 w-full items-center justify-center rounded-full bg-[var(--freshco-brand)] px-4 text-[0.78rem] font-extrabold uppercase tracking-[0.14em] text-white"
                  href="/sign-in?callbackUrl=%2Faccount"
                  onClick={() => setIsOpen(false)}
                >
                  Sign in
                </Link>
              )}
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
