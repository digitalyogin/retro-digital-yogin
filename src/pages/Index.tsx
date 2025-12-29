import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Projects } from "@/components/Projects";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { AsciiSkullBackground } from "@/components/AsciiSkullBackground";
import { useScrollProgress } from "@/hooks/useScrollAnimation";

const Index = () => {
  const scrollProgress = useScrollProgress();

  return (
    <div className="min-h-screen relative">
      {/* Background Effects */}
      <AsciiSkullBackground />

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-muted z-50">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Main Content */}
      <Hero />
      <Services />
      <Projects />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
