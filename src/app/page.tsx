import { Portal } from "@/components/im/Portal";
import { AboutHacknovate } from "@/components/stranger-things/AboutHacknovate";
import { CinematicAbout } from "@/components/stranger-things/CinematicAbout";
import { AboutTracksSection } from "@/components/stranger-things/AboutTracksSection";
import { CardScrollAnimation } from "@/components/stranger-things/CardScrollAnimation";
import { HacktropicaMemories } from "@/components/stranger-things/HacktropicaMemories";
import { AudioToggle } from "@/components/shared/AudioToggle";
import { SectionDivider } from "@/components/shared/SectionDivider";

export default function Home() {
  return (
    <main className="relative bg-black min-h-screen selection:bg-red-900 selection:text-white">
      <AudioToggle />
      <Portal />
      <SectionDivider />
      <AboutHacknovate />
      <SectionDivider />
      <CinematicAbout />
      <SectionDivider />
      <AboutTracksSection />
      <SectionDivider />
      <CardScrollAnimation />
      <SectionDivider />
      <HacktropicaMemories />
      <SectionDivider />
    </main>
  );
}
