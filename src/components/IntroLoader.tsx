import { useState, useEffect, useCallback, useRef } from 'react';

interface IntroLoaderProps {
  onComplete: () => void;
}

const BOOT_LINES = [
  { text: 'BOOTING YOGIN AKASHA...', delay: 0 },
  { text: 'MEMORY CHECK ............ OK', delay: 800 },
  { text: 'TERMINAL INTERFACE ...... OK', delay: 1600 },
  { text: 'THREAT MATRIX ........... ONLINE', delay: 2400 },
  { text: 'URL ANALYZER ............ READY', delay: 3200 },
];

const ASCII_LOGO = [
  '╔═══════════════════════════════════╗',
  '║   Y O G I N   A K A S H A        ║',
  '║   DIGITAL ORACLE TERMINAL v3.1   ║',
  '╚═══════════════════════════════════╝',
];

const IntroLoader = ({ onComplete }: IntroLoaderProps) => {
  const [visibleLines, setVisibleLines] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [dontShow, setDontShow] = useState(false);
  const [flickerOn, setFlickerOn] = useState(false);
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const skipRef = useRef<HTMLButtonElement>(null);

  const finish = useCallback(() => {
    if (dontShow) localStorage.setItem('introSeen', 'true');
    onComplete();
  }, [dontShow, onComplete]);

  // Reduced motion: show static briefly then auto-complete
  useEffect(() => {
    if (prefersReducedMotion.current) {
      setVisibleLines(BOOT_LINES.length);
      setShowLogo(true);
      setShowPrompt(true);
      const t = setTimeout(finish, 1200);
      return () => clearTimeout(t);
    }
  }, [finish]);

  // CRT power-on flicker
  useEffect(() => {
    if (prefersReducedMotion.current) return;
    setFlickerOn(true);
    const t = setTimeout(() => setFlickerOn(false), 300);
    return () => clearTimeout(t);
  }, []);

  // Typewriter sequence
  useEffect(() => {
    if (prefersReducedMotion.current) return;
    const timers: NodeJS.Timeout[] = [];

    BOOT_LINES.forEach((line, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), line.delay));
    });

    // Show logo after last line
    timers.push(setTimeout(() => setShowLogo(true), 4000));
    // Show prompt
    timers.push(setTimeout(() => setShowPrompt(true), 4600));

    return () => timers.forEach(clearTimeout);
  }, []);

  // Keyboard: Enter to skip
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        finish();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [finish]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-300 ${flickerOn ? 'animate-[crt-power-on_0.3s_ease-out]' : ''}`}
      style={{ background: 'hsl(140 30% 2%)' }}
      role="dialog"
      aria-label="Boot sequence intro"
    >
      {/* Scanline overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-10"
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 3px)',
          opacity: 0.5,
        }}
      />

      {/* Content */}
      <div className="relative z-20 w-full max-w-2xl px-6 font-terminal">
        {/* Boot lines */}
        <div className="space-y-2 mb-8">
          {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
            <div
              key={i}
              className="text-primary text-sm sm:text-base tracking-wider"
              style={{ textShadow: '0 0 8px hsl(145 100% 65% / 0.5)' }}
            >
              {line.text}
              {i === visibleLines - 1 && !showLogo && (
                <span className="terminal-cursor ml-1">_</span>
              )}
            </div>
          ))}
        </div>

        {/* ASCII Logo */}
        {showLogo && (
          <div className="mb-8 animate-fade-in">
            {ASCII_LOGO.map((line, i) => (
              <div
                key={i}
                className="text-secondary text-xs sm:text-sm tracking-widest text-center"
                style={{ textShadow: '0 0 12px hsl(189 100% 70% / 0.4)' }}
              >
                {line}
              </div>
            ))}
          </div>
        )}

        {/* Prompt */}
        {showPrompt && (
          <div className="text-center space-y-6 animate-fade-in">
            <p
              className="text-accent text-lg sm:text-xl tracking-wide animate-pulse"
              style={{ textShadow: '0 0 10px hsl(40 100% 60% / 0.5)' }}
            >
              {'>'} PRESS ENTER TO INITIALIZE
            </p>

            {/* Skip button */}
            <button
              ref={skipRef}
              onClick={finish}
              className="text-muted-foreground hover:text-primary text-sm border border-border hover:border-primary px-4 py-2 transition-colors font-terminal uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            >
              [SKIP INTRO]
            </button>

            {/* Don't show again */}
            <label className="flex items-center justify-center gap-3 text-muted-foreground text-xs cursor-pointer group">
              <input
                type="checkbox"
                checked={dontShow}
                onChange={(e) => setDontShow(e.target.checked)}
                className="w-4 h-4 accent-primary bg-background border-border focus:ring-2 focus:ring-ring"
              />
              <span className="group-hover:text-primary transition-colors">
                DON'T SHOW AGAIN
              </span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntroLoader;
