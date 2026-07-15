import HeroSection from '@/sections/HeroSection';
import ResearchSection from '@/sections/ResearchSection';
import CoverArtsSection from '@/sections/CoverArtsSection';
import PublicationsSection from '@/sections/PublicationsSection';
import HomeBackdrop from '@/components/HomeBackdrop';

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <HomeBackdrop />
      <div className="relative z-10">
        <HeroSection />
        <ResearchSection />
        <CoverArtsSection />
        <PublicationsSection />
      </div>
    </main>
  );
}
