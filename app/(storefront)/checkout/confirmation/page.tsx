import { redirect } from "next/navigation";

export default async function LegacyCheckoutConfirmationPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const resolvedSearchParams = await searchParams;
  const rawOrder = resolvedSearchParams.order;
  const orderId = Array.isArray(rawOrder) ? rawOrder[0] : rawOrder;
  redirect(orderId ? `/checkout/success?order=${encodeURIComponent(orderId)}` : "/checkout/success");
}
