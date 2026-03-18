import { homeDesignSystem } from "@/components/home/design-system";

type SectionHeadingProps = Readonly<{
  eyebrow: string;
  title: string;
  copy: string;
  light?: boolean;
}>;

export function SectionHeading({
  eyebrow,
  title,
  copy,
  light = false,
}: SectionHeadingProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
      <div className="max-w-[760px]">
        <p
          className={`text-[0.78rem] font-extrabold tracking-[0.2em] ${
            light ? "text-white/75" : homeDesignSystem.colors.brandDark.replace("bg-", "text-")
          }`}
        >
          {eyebrow}
        </p>
        <h2
          className={`mt-3 text-[2.25rem] font-extrabold leading-[0.94] tracking-[-0.06em] sm:text-[2.8rem] lg:text-[3.25rem] ${
            light ? "text-white" : homeDesignSystem.colors.text
          }`}
        >
          {title}
        </h2>
      </div>
      <p
        className={`max-w-[420px] text-[1rem] leading-7 ${
          light ? "text-white/82" : homeDesignSystem.colors.textSoft
        }`}
      >
        {copy}
      </p>
    </div>
  );
}
