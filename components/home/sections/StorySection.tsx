import { AssetImage } from "@/components/home/shared/AssetImage";
import { SectionHeading } from "@/components/home/shared/SectionHeading";

export function StorySection() {
  return (
    <section className="bg-white px-4 py-7 sm:px-6 lg:px-8 xl:px-10 2xl:px-14" id="stories">
      <div className="relative overflow-hidden rounded-[38px] bg-[#3F9853] px-6 py-8 text-white shadow-[0_18px_60px_rgba(23,53,52,0.08)] sm:px-8 lg:px-10 lg:py-10">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[58%] bg-[linear-gradient(180deg,rgba(137,210,120,0.45)_0%,rgba(63,152,83,0)_100%)]" />
        <div className="relative z-10 grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-center">
          <SectionHeading
            copy="The final promo band stays strictly in the green-and-white brand family, giving the page a confident finish without drifting back toward off-white or unrelated accent colors."
            eyebrow="FRESHCO STORY"
            light
            title="Fresh produce, thoughtful pantry picks, and a homepage that feels alive."
          />
          <div className="relative h-[240px] rounded-[30px] bg-white/12">
            <AssetImage
              alt="Assorted packaged produce and snacks"
              className="object-contain p-5"
              fallbackClassName="flex h-full w-full items-center justify-center text-center text-[0.95rem] font-bold uppercase tracking-[0.16em] text-white/88"
              fallbackLabel="Brand collage"
              fill
              sizes="(max-width: 1280px) 100vw, 520px"
              src=""
              wrapperClassName="absolute inset-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
