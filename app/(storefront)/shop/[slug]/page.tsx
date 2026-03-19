import { redirect } from "next/navigation";

export default async function LegacyProductDetailRedirect({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;
  redirect(`/product/${slug}`);
}
