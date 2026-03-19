export function AgeRestrictedNotice({ compact = false }: Readonly<{ compact?: boolean }>) {
  return (
    <div
      className={`rounded-[20px] border border-[#A66A00]/18 bg-[#FFF6D8] text-[#6E4C05] ${
        compact ? "px-3 py-2 text-[0.8rem]" : "px-4 py-3 text-[0.92rem]"
      }`}
    >
      <span className="font-extrabold uppercase tracking-[0.12em]">18+ Notice</span>
      <span className="ml-2">
        Winery items require age confirmation at handoff.
      </span>
    </div>
  );
}
