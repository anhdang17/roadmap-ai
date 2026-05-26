import { HeroSection, FeaturesSection, HowItWorksSection, CTASection } from "@/components/landing";
import { Footer } from "@/components/layout";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </main>
  );
}
