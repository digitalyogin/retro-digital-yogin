import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CommandCenter } from "@/components/CommandCenter";
import { OnboardingTour } from "@/components/OnboardingTour";
import { useUserPreferences } from "@/hooks/useUserPreferences";

interface RetroLayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { code: "01", label: "QUICK_SCAN", path: "/" },
  { code: "03", label: "HISTORY", path: "/03" },
  { code: "05", label: "CHI_SIAMO", path: "/chi-siamo" },
  { code: "06", label: "PROGETTI", path: "/progetti" },
  { code: "07", label: "CONTATTI", path: "/contatti" },
  { code: "08", label: "BLOG", path: "/blog" },
  { code: "09", label: "SETTINGS", path: "/09" },
];

export const RetroLayout = ({ children }: RetroLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tourStep, setTourStep] = useState(0);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const { preferences, updatePreferences } = useUserPreferences();

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Global keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when typing in inputs (except the command line)
      const target = e.target as HTMLElement;
      if (
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      ) {
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        navigate("/");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  const activeCode = NAV_ITEMS.find((n) => {
    if (n.path === "/blog") return location.pathname === "/blog" || location.pathname.startsWith("/blog/");
    return n.path === location.pathname;
  })?.code || "01";

  const timeStr = currentTime.toLocaleTimeString("it-IT", { hour12: false });
  const dateStr = currentTime.toLocaleDateString("it-IT");

  useEffect(() => {
    if (!preferences.onboardingSeen) {
      setTourStep(0);
      setIsTourOpen(true);
    }
  }, [preferences.onboardingSeen]);

  const completeTour = () => {
    updatePreferences({ onboardingSeen: true });
    setIsTourOpen(false);
    setTourStep(0);
  };

  const nextTourStep = () => {
    setTourStep((current) => {
      if (current >= 2) {
        completeTour();
        return current;
      }
      return current + 1;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100]">
        <div className="w-full h-full" style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
        }} />
      </div>

      {/* Header */}
      <header className="border-b border-border bg-card/80 px-4 py-2 flex items-center justify-between text-xs font-terminal z-50 relative">
        <div className="flex items-center gap-4">
          <span className="text-primary text-glow font-bold text-sm">DIGITAL_YOGIN</span>
          <span className="text-muted-foreground hidden md:inline">v3.0</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground hidden sm:inline">{dateStr}</span>
          <span className="text-secondary">{timeStr}</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary">ONLINE</span>
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        {children}
      </main>

      {/* Footer Navigation */}
      <footer className="border-t border-border bg-card/80 px-4 py-2 z-50 relative">
        {/* Nav items */}
        <div className="flex flex-wrap gap-2 mb-2 justify-center md:justify-start">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.code}
              onClick={() => navigate(item.path)}
              className={`px-3 py-1 text-xs font-terminal border transition-all ${
                activeCode === item.code
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              [{item.code}] {item.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <p className="text-xs text-muted-foreground font-terminal">
            Navigazione rapida semplificata. Per supporto apri AI Guide.
          </p>
          <CommandCenter navItems={NAV_ITEMS} onNavigate={navigate} />
        </div>
      </footer>

      {preferences.showPersistentHint ? (
        <div className="fixed bottom-20 right-4 z-[205] border border-primary bg-card px-3 py-2 text-xs font-terminal max-w-[260px]">
          <p className="text-primary">Nuovo utente?</p>
          <p className="text-muted-foreground mt-1">Apri la guida per muoverti senza comandi tecnici.</p>
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => {
                setTourStep(0);
                setIsTourOpen(true);
              }}
              className="px-2 py-1 border border-primary text-primary hover:bg-primary/10"
            >
              Apri guida
            </button>
            <button
              onClick={() => updatePreferences({ showPersistentHint: false })}
              className="px-2 py-1 border border-border text-muted-foreground hover:border-primary hover:text-primary"
            >
              Chiudi
            </button>
          </div>
        </div>
      ) : null}

      <OnboardingTour
        open={isTourOpen}
        step={tourStep}
        onNext={nextTourStep}
        onSkip={completeTour}
        onComplete={completeTour}
      />
    </div>
  );
};
