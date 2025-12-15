import HeroSection from '@/sections/HeroSection';
import ResearchSection from '@/sections/ResearchSection';
import CoverArtsSection from '@/sections/CoverArtsSection';
import PublicationsSection from '@/sections/PublicationsSection';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ResearchSection />
      <CoverArtsSection />
      <PublicationsSection />
    </main>
  );
}
