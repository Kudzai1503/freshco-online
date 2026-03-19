import { requireAuth } from "@/lib/auth/guards";
import { OrderDetailClient } from "@/components/storefront/account/OrderDetailClient";

export default async function OrderDetailPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  await requireAuth("/account/orders");
  const { id } = await params;

  return (
    <main className="bg-white px-4 py-8 sm:px-6 lg:px-8 xl:px-10 2xl:px-14">
      <section className="mb-6 rounded-[38px] border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] px-5 py-8 sm:px-7 lg:px-10">
        <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.18em] text-[var(--freshco-brand-dark)]">
          Order detail
        </p>
        <h1 className="mt-3 text-[2.8rem] font-extrabold leading-[0.94] tracking-[-0.06em] text-[var(--freshco-text)]">
          Track this FreshCo order from confirmation to delivery.
        </h1>
      </section>
      <OrderDetailClient orderId={id} />
    </main>
  );
}
