import { OrderConfirmationClient } from "@/components/storefront/checkout/OrderConfirmationClient";

export default async function CheckoutSuccessPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const resolvedSearchParams = await searchParams;
  const rawOrder = resolvedSearchParams.order;
  const orderId = Array.isArray(rawOrder) ? rawOrder[0] : rawOrder;

  return (
    <main className="bg-white px-4 py-8 sm:px-6 lg:px-8 xl:px-10 2xl:px-14">
      <OrderConfirmationClient orderId={orderId} />
    </main>
  );
}
