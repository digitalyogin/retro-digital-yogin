import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Projects } from "@/components/Projects";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { BackgroundParticles } from "@/components/BackgroundParticles";
import { CustomCursor } from "@/components/CustomCursor";
import { SystemStats } from "@/components/SystemStats";
import { TerminalConsole } from "@/components/TerminalConsole";
import { useScrollProgress } from "@/hooks/useScrollAnimation";

const Index = () => {
  const scrollProgress = useScrollProgress();

  return (
    <div className="min-h-screen relative">
      {/* Background Effects */}
      <BackgroundParticles />
      
      {/* Interactive Elements */}
      <CustomCursor />
      <SystemStats />
      <TerminalConsole />

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
