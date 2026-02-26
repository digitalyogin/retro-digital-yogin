import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Volume2, VolumeX } from "lucide-react";
import { isSoundEnabled, toggleSound } from "@/lib/terminalSounds";
interface RetroLayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { code: "01", label: "QUICK_SCAN", path: "/" },
  { code: "02", label: "CHI_SIAMO", path: "/02" },
  { code: "03", label: "PROGETTI", path: "/03" },
  { code: "04", label: "CONTATTI", path: "/04" },
  { code: "05", label: "BLOG", path: "/05" },
];

export const RetroLayout = ({ children }: RetroLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [commandInput, setCommandInput] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [soundOn, setSoundOn] = useState(isSoundEnabled);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navigateToCode = useCallback((code: string) => {
    if (code === "0" || code === "00") {
      navigate("/");
      return true;
    }
    const item = NAV_ITEMS.find((n) => n.code === code);
    if (item) {
      navigate(item.path);
      return true;
    }
    return false;
  }, [navigate]);

  // Global keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when typing in inputs (except the command line)
      const target = e.target as HTMLElement;
      const isCommandInput = target.getAttribute("data-command-input") === "true";
      if (
        !isCommandInput &&
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

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = commandInput.trim();
    if (navigateToCode(code)) {
      setCommandInput("");
    }
  };

  const activeCode = NAV_ITEMS.find(
    (n) => n.path === location.pathname
  )?.code || "01";

  const timeStr = currentTime.toLocaleTimeString("it-IT", { hour12: false });
  const dateStr = currentTime.toLocaleDateString("it-IT");

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
          <button
            onClick={() => setSoundOn(toggleSound())}
            className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
            title={soundOn ? "Disattiva suoni" : "Attiva suoni"}
          >
            {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
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
              className={`px-3 py-1 text-lg font-terminal border transition-all ${
                activeCode === item.code
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              [{item.code}] {item.label}
            </button>
          ))}
        </div>

        {/* Command line */}
        <form onSubmit={handleCommandSubmit} className="flex items-center gap-2">
          <span className="text-accent font-terminal text-sm">{">"}</span>
          <span className="text-muted-foreground font-terminal text-sm">Select option:</span>
          <input
            data-command-input="true"
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-primary font-terminal text-sm caret-primary"
            placeholder="_"
            autoComplete="off"
          />
          <span className="text-muted-foreground text-xs hidden sm:inline">[ESC=HOME]</span>
        </form>
      </footer>
    </div>
  );
};
