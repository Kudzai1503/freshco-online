import { HeroAside } from "@/components/home/hero/HeroAside";
import { HeroCards } from "@/components/home/hero/HeroCards";
import { HeroContent } from "@/components/home/hero/HeroContent";

export async function HeroSection() {
  return (
    <section className="bg-white" id="about">
      <div className="px-4 pb-8 pt-3 sm:px-6 lg:px-8 xl:px-10 2xl:px-14">
        <div
          className="rounded-[40px] border border-[var(--freshco-border)] bg-white px-5 py-5 shadow-[0_18px_60px_rgba(23,53,52,0.06)] sm:px-7 lg:px-10 lg:py-8 2xl:px-12"
        >
          <div className="grid gap-6 pt-7 xl:grid-cols-[minmax(0,1.45fr)_minmax(390px,0.78fr)] xl:items-start">
            <div className="grid gap-6">
              <HeroContent />
              <HeroCards />
            </div>
            <HeroAside />
          </div>
        </div>
      </div>
    </section>
  );
}
