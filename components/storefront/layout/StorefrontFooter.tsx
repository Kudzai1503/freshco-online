import Link from "next/link";

export function StorefrontFooter() {
  return (
    <footer className="border-t border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)]">
      <div className="grid gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:px-8 xl:px-10 2xl:px-14">
        <div className="max-w-[520px]">
          <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.18em] text-[var(--freshco-brand-dark)]">
            FreshCo Storefront
          </p>
          <h2 className="mt-3 text-[2rem] font-extrabold leading-[0.95] tracking-[-0.06em] text-[var(--freshco-text)]">
            Shopper-first mock commerce flow aligned to the FreshCo design system.
          </h2>
          <p className="mt-4 text-[1rem] leading-7 text-[var(--freshco-text-soft)]">
            This storefront is powered by a mock client layer today and is structured to connect cleanly to the existing Spring Boot backend later.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="text-[0.78rem] font-extrabold uppercase tracking-[0.16em] text-[var(--freshco-text-soft)]">
              Shop
            </h3>
            <ul className="mt-4 space-y-3 text-[0.98rem] text-[var(--freshco-text)]">
              <li><Link href="/shop">Browse products</Link></li>
              <li><Link href="/cart">Cart</Link></li>
              <li><Link href="/checkout">Checkout</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[0.78rem] font-extrabold uppercase tracking-[0.16em] text-[var(--freshco-text-soft)]">
              Account
            </h3>
            <ul className="mt-4 space-y-3 text-[0.98rem] text-[var(--freshco-text)]">
              <li><Link href="/account">Overview</Link></li>
              <li><Link href="/account/orders">Orders</Link></li>
              <li><Link href="/account/profile">Profile</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

