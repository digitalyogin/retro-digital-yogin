import { useState, useEffect, useCallback, useRef } from 'react';
import { playBootSound, isSoundEnabled } from '@/lib/terminalSounds';

interface IntroLoaderProps {
  onComplete: () => void;
}

const BOOT_LINES = [
  { text: 'DIGITAL YOGIN BIOS v3.1', delay: 0 },
  { text: 'COPYRIGHT (C) 1985 YOGIN SYSTEMS INC.', delay: 600 },
  { text: '', delay: 1000 },
  { text: 'MEMORY TEST .......... 640K OK', delay: 1200 },
  { text: 'VIDEO ADAPTER ........ CRT PHOSPHOR', delay: 1800 },
  { text: 'KEYBOARD ............. DETECTED', delay: 2200 },
  { text: 'MODEM ................ 2400 BAUD', delay: 2600 },
  { text: '', delay: 2800 },
  { text: 'LOADING YOGIN.SYS ....', delay: 3000 },
  { text: 'THREAT MATRIX ........ ONLINE', delay: 3600 },
  { text: 'URL ANALYZER ......... READY', delay: 4000 },
  { text: 'ORACLE ENGINE ........ ARMED', delay: 4400 },
];

const ASCII_LOGO = [
  '┌─────────────────────────────────────┐',
  '│  ██▓▒░ DIGITAL  YOGIN  TERMINAL ░▒▓██ │',
  '│        ═══ AKASHA  OS  v3.1 ═══       │',
  '└─────────────────────────────────────┘',
];

const IntroLoader = ({ onComplete }: IntroLoaderProps) => {
  const [visibleLines, setVisibleLines] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [dontShow, setDontShow] = useState(false);
  const [screenOn, setScreenOn] = useState(false);
  const [glitchLine, setGlitchLine] = useState<number | null>(null);
  const [progressBar, setProgressBar] = useState(0);
  const hasInteracted = useRef(false);
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const finish = useCallback(() => {
    if (dontShow) localStorage.setItem('introSeen', 'true');
    if (hasInteracted.current && isSoundEnabled()) {
      playBootSound();
    }
    onComplete();
  }, [dontShow, onComplete]);

  // Track first interaction
  useEffect(() => {
    const markInteracted = () => { hasInteracted.current = true; };
    window.addEventListener('click', markInteracted, { once: true });
    window.addEventListener('keydown', markInteracted, { once: true });
    return () => {
      window.removeEventListener('click', markInteracted);
      window.removeEventListener('keydown', markInteracted);
    };
  }, []);

  // Reduced motion
  useEffect(() => {
    if (prefersReducedMotion.current) {
      setScreenOn(true);
      setVisibleLines(BOOT_LINES.length);
      setShowLogo(true);
      setShowPrompt(true);
      const t = setTimeout(finish, 1200);
      return () => clearTimeout(t);
    }
  }, [finish]);

  // CRT power-on: screen flickers on
  useEffect(() => {
    if (prefersReducedMotion.current) return;
    const t = setTimeout(() => setScreenOn(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Typewriter sequence
  useEffect(() => {
    if (prefersReducedMotion.current) return;
    const timers: NodeJS.Timeout[] = [];

    BOOT_LINES.forEach((line, i) => {
      timers.push(setTimeout(() => {
        setVisibleLines(i + 1);
        // Update progress bar
        setProgressBar(Math.round(((i + 1) / BOOT_LINES.length) * 100));
      }, line.delay + 500)); // +500 for screen power-on delay
    });

    timers.push(setTimeout(() => setShowLogo(true), 5200));
    timers.push(setTimeout(() => setShowPrompt(true), 5800));

    return () => timers.forEach(clearTimeout);
  }, []);

  // Random micro-glitch
  useEffect(() => {
    if (prefersReducedMotion.current) return;
    const interval = setInterval(() => {
      if (Math.random() < 0.12 && visibleLines > 0) {
        const line = Math.floor(Math.random() * visibleLines);
        setGlitchLine(line);
        setTimeout(() => setGlitchLine(null), 100);
      }
    }, 1800);
    return () => clearInterval(interval);
  }, [visibleLines]);

  // Keyboard
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        hasInteracted.current = true;
        finish();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [finish]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#010201' }}
      role="dialog"
      aria-label="Boot sequence intro"
    >
      {/* CRT screen power-on effect */}
      <div
        className="absolute inset-0 transition-all"
        style={{
          background: screenOn ? 'hsl(140 30% 2%)' : '#000',
          clipPath: screenOn ? 'inset(0 0 0 0)' : 'inset(50% 25% 50% 25%)',
          transition: 'clip-path 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s',
        }}
      />

      {/* Phosphor warmup glow */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(140 100% 50% / 0.03) 0%, transparent 70%)',
          opacity: screenOn ? 1 : 0,
          transition: 'opacity 1s ease-in',
        }}
      />

      {/* Scanline overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-10"
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 3px)',
          opacity: screenOn ? 0.6 : 0,
          transition: 'opacity 0.5s',
        }}
      />

      {/* CRT curvature vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-10"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.5) 100%)',
          opacity: screenOn ? 1 : 0,
        }}
      />

      {/* Content */}
      <div
        className="relative z-20 w-full max-w-2xl px-6 font-terminal"
        style={{
          opacity: screenOn ? 1 : 0,
          transition: 'opacity 0.5s ease-in 0.2s',
        }}
      >
        {/* Boot lines */}
        <div className="space-y-1 mb-6">
          {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
            <div
              key={i}
              className={`text-primary text-xs sm:text-sm tracking-wider ${glitchLine === i ? 'glitch' : ''}`}
              style={{
                textShadow: '0 0 6px hsl(145 100% 65% / 0.4)',
                fontFamily: 'monospace',
                ...(glitchLine === i ? { 
                  transform: `translateX(${Math.random() * 6 - 3}px)`, 
                  opacity: 0.6,
                  color: 'hsl(var(--secondary))',
                } : {}),
              }}
            >
              {line.text || '\u00A0'}
              {i === visibleLines - 1 && !showLogo && (
                <span className="terminal-cursor ml-1">█</span>
              )}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        {visibleLines > 0 && !showLogo && (
          <div className="mb-6">
            <div className="h-1 border border-primary/30 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{
                  width: `${progressBar}%`,
                  boxShadow: '0 0 8px hsl(var(--primary) / 0.6)',
                }}
              />
            </div>
            <div className="text-xs text-muted-foreground mt-1 font-terminal">
              LOADING... {progressBar}%
            </div>
          </div>
        )}

        {/* ASCII Logo */}
        {showLogo && (
          <div className="mb-6 animate-fade-in">
            {ASCII_LOGO.map((line, i) => (
              <div
                key={i}
                className="text-secondary text-[10px] sm:text-xs tracking-widest text-center"
                style={{
                  textShadow: '0 0 10px hsl(189 100% 70% / 0.5)',
                  fontFamily: 'monospace',
                }}
              >
                {line}
              </div>
            ))}
          </div>
        )}

        {/* Prompt */}
        {showPrompt && (
          <div className="text-center space-y-4 animate-fade-in">
            <p
              className="text-accent text-base sm:text-lg tracking-wide"
              style={{
                textShadow: '0 0 10px hsl(40 100% 60% / 0.5)',
                animation: 'blink 1s steps(1) infinite',
              }}
            >
              {'>'} PRESS ENTER TO INITIALIZE _
            </p>

            <button
              onClick={() => { hasInteracted.current = true; finish(); }}
              className="text-muted-foreground hover:text-primary text-sm border border-border hover:border-primary px-6 py-2 transition-colors font-terminal uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-ring"
            >
              [ ENTER ]
            </button>

            <label className="flex items-center justify-center gap-3 text-muted-foreground text-xs cursor-pointer group">
              <input
                type="checkbox"
                checked={dontShow}
                onChange={(e) => setDontShow(e.target.checked)}
                className="w-4 h-4 accent-primary bg-background border-border"
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
