import { OrdersClient } from "@/components/storefront/account/OrdersClient";

export default function OrdersPage() {
  return (
    <main className="bg-white px-4 py-8 sm:px-6 lg:px-8 xl:px-10 2xl:px-14">
      <section className="mb-6 rounded-[38px] border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] px-5 py-8 sm:px-7 lg:px-10">
        <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.18em] text-[var(--freshco-brand-dark)]">
          Orders
        </p>
        <h1 className="mt-3 text-[2.8rem] font-extrabold leading-[0.94] tracking-[-0.06em] text-[var(--freshco-text)]">
          Mock order history stored in this browser.
        </h1>
      </section>
      <OrdersClient />
    </main>
  );
}

