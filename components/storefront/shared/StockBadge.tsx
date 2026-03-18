import type { StockState } from "@/lib/storefront/types";

const badgeStyles: Record<StockState, string> = {
  in_stock: "bg-[#EAF7EC] text-[var(--freshco-brand-dark)]",
  low_stock: "bg-[#FFF6D8] text-[#A66A00]",
  out_of_stock: "bg-[#FCE4E4] text-[#A33A3A]",
};

const badgeLabels: Record<StockState, string> = {
  in_stock: "In stock",
  low_stock: "Low stock",
  out_of_stock: "Out of stock",
};

export function StockBadge({
  stockState,
  quantity,
}: Readonly<{ stockState: StockState; quantity: number }>) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-[0.72rem] font-extrabold uppercase tracking-[0.12em] ${badgeStyles[stockState]}`}
    >
      {badgeLabels[stockState]}
      {stockState !== "out_of_stock" ? ` · ${quantity}` : ""}
    </span>
  );
}
