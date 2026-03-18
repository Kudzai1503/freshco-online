import { HeroSection } from "@/components/home/hero/HeroSection";
import { HomeSections } from "@/components/home/sections/HomeSections";


export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--freshco-page)] text-[var(--freshco-text)]">
      <HeroSection />
      <HomeSections />
    </main>
  );
}
