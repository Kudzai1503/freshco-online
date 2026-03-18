"use client";

import Link from "next/link";

import { useStorefrontSession } from "@/lib/storefront/browser-session";

export function AccountOverviewClient() {
  const { loaded, profile, orders, cart } = useStorefrontSession();

  if (!loaded) {
    return <p className="text-[var(--freshco-text-soft)]">Loading account…</p>;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-[30px] border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] p-6">
        <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.16em] text-[var(--freshco-brand-dark)]">
          Shopper profile
        </p>
        <h2 className="mt-3 text-[2rem] font-extrabold tracking-[-0.05em] text-[var(--freshco-text)]">
          {profile.firstName} {profile.lastName}
        </h2>
        <p className="mt-3 text-[1rem] leading-7 text-[var(--freshco-text-soft)]">
          {profile.email} · {profile.phone}
        </p>
        <p className="mt-2 text-[0.92rem] font-semibold text-[var(--freshco-text-soft)]">
          Preferred department: {profile.preferredDepartment.replace("-", " ")}
        </p>
        <Link
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full border border-[var(--freshco-border)] bg-white px-5 text-[0.78rem] font-extrabold uppercase tracking-[0.14em] text-[var(--freshco-text)]"
          href="/account/profile"
        >
          Edit profile
        </Link>
      </section>

      <section className="grid gap-4">
        <article className="rounded-[30px] border border-[var(--freshco-border)] bg-white p-6">
          <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.16em] text-[var(--freshco-text-soft)]">
            Current cart
          </p>
          <p className="mt-3 text-[2.3rem] font-extrabold tracking-[-0.06em] text-[var(--freshco-text)]">
            {cart.items.length}
          </p>
          <p className="text-[0.98rem] text-[var(--freshco-text-soft)]">
            distinct products in progress
          </p>
        </article>
        <article className="rounded-[30px] border border-[var(--freshco-border)] bg-white p-6">
          <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.16em] text-[var(--freshco-text-soft)]">
            Orders
          </p>
          <p className="mt-3 text-[2.3rem] font-extrabold tracking-[-0.06em] text-[var(--freshco-text)]">
            {orders.length}
          </p>
          <p className="text-[0.98rem] text-[var(--freshco-text-soft)]">
            stored in this browser demo
          </p>
          <Link className="mt-4 inline-flex text-[0.9rem] font-bold text-[var(--freshco-brand-dark)]" href="/account/orders">
            View order history
          </Link>
        </article>
      </section>
    </div>
  );
}

