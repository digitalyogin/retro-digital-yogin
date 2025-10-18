import { useState, useEffect } from 'react';

type LoaderPhase = 'boot' | 'loading' | 'breach' | 'recovery' | 'granted' | 'complete';

interface IntroLoaderProps {
  onComplete: () => void;
}

const IntroLoader = ({ onComplete }: IntroLoaderProps) => {
  const [phase, setPhase] = useState<LoaderPhase>('boot');
  const [bootText, setBootText] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [showSkip, setShowSkip] = useState(false);

  const bootMessages = [
    'SYSTEM_INIT.EXE',
    'WEYLAND-YUTANI DIGITAL SYSTEMS v2.4.1',
    'LOADING CORE MODULES...',
    'INITIALIZING NEURAL NETWORK...',
    'ESTABLISHING SECURE CONNECTION...',
  ];

  const loadingMessages = [
    'VERIFYING CREDENTIALS...',
    'LOADING DATABASE_PROTOCOL...',
    'SYNCING QUANTUM_PROCESSORS...',
    'CALIBRATING NEURAL_INTERFACE...',
  ];

  const breachMessages = [
    '>>> UNAUTHORIZED_ACCESS_DETECTED <<<',
    'WARNING: FIREWALL_COMPROMISED',
    'ALERT: INTRUSION_IN_PROGRESS',
    'SYSTEM_INTEGRITY: CRITICAL',
  ];

  const recoveryMessages = [
    'DEPLOYING_COUNTERMEASURES...',
    'ISOLATING_THREAT_VECTOR...',
    'RESTORING_SECURE_PROTOCOLS...',
    'SYSTEM_STABILIZING...',
  ];

  useEffect(() => {
    // Show skip button after 2 seconds
    const skipTimer = setTimeout(() => setShowSkip(true), 2000);

    // Boot phase
    if (phase === 'boot') {
      bootMessages.forEach((msg, index) => {
        setTimeout(() => {
          setBootText(prev => [...prev, msg]);
        }, index * 400);
      });

      setTimeout(() => setPhase('loading'), 2500);
    }

    // Loading phase
    if (phase === 'loading') {
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => setPhase('breach'), 500);
            return 100;
          }
          return prev + 2;
        });
      }, 50);

      return () => clearInterval(progressInterval);
    }

    // Breach phase
    if (phase === 'breach') {
      setTimeout(() => setPhase('recovery'), 2000);
    }

    // Recovery phase
    if (phase === 'recovery') {
      setTimeout(() => setPhase('granted'), 1500);
    }

    // Access granted phase
    if (phase === 'granted') {
      setTimeout(() => {
        setPhase('complete');
        localStorage.setItem('intro-shown', 'true');
        onComplete();
      }, 1500);
    }

    return () => clearTimeout(skipTimer);
  }, [phase, onComplete]);

  // Handle skip
  const handleSkip = () => {
    setPhase('complete');
    localStorage.setItem('intro-shown', 'true');
    onComplete();
  };

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleSkip();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  if (phase === 'complete') return null;

  return (
    <div className={`fixed inset-0 z-[9999] bg-background flex items-center justify-center overflow-hidden ${
      phase === 'breach' ? 'animate-screen-shake' : ''
    }`}>
      {/* Animated Grid Background */}
      <div className="absolute inset-0 animate-scroll-grid">
        <div className="absolute inset-0 grid-background opacity-40" />
      </div>

      {/* Scanline Effect */}
      <div className="absolute inset-0 scanline-overlay" />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl px-8">
        
        {/* Boot Phase */}
        {phase === 'boot' && (
          <div className="space-y-2 font-mono">
            {bootText.map((text, index) => (
              <div
                key={index}
                className="text-primary text-glow animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {text}
                {index === bootText.length - 1 && <span className="terminal-cursor">_</span>}
              </div>
            ))}
          </div>
        )}

        {/* Loading Phase */}
        {phase === 'loading' && (
          <div className="space-y-6">
            <div className="text-primary text-2xl text-glow border-glow border-2 border-primary p-6">
              SYSTEM INITIALIZATION
            </div>
            
            {loadingMessages.map((msg, index) => (
              <div key={index} className="space-y-2 animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
                <div className="text-primary font-mono text-sm">{msg}</div>
                <div className="w-full h-2 bg-muted border border-border">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ))}

            <div className="text-primary text-xl font-mono text-center mt-8">
              LOADING... {progress}%
            </div>
          </div>
        )}

        {/* Breach Phase */}
        {phase === 'breach' && (
          <div className="space-y-4 animate-pulse">
            <div className="text-destructive text-3xl text-center font-mono border-4 border-destructive p-8 warning-flash glitch">
              ⚠ SECURITY BREACH DETECTED ⚠
            </div>
            
            {breachMessages.map((msg, index) => (
              <div
                key={index}
                className="text-destructive font-mono text-xl text-center glitch"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {msg}
              </div>
            ))}

            <div className="mt-8 h-1 bg-destructive animate-pulse" />
          </div>
        )}

        {/* Recovery Phase */}
        {phase === 'recovery' && (
          <div className="space-y-4">
            <div className="text-accent text-2xl text-center font-mono border-2 border-accent p-6">
              DEPLOYING COUNTERMEASURES
            </div>
            
            {recoveryMessages.map((msg, index) => (
              <div
                key={index}
                className="text-accent font-mono animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {'>'} {msg}
              </div>
            ))}

            <div className="w-full h-3 bg-muted border border-accent mt-6">
              <div className="h-full bg-accent animate-pulse" style={{ width: '85%' }} />
            </div>
          </div>
        )}

        {/* Access Granted Phase */}
        {phase === 'granted' && (
          <div className="text-center space-y-6 animate-scale-in">
            <div className="text-primary text-4xl font-mono text-glow border-glow border-4 border-primary p-12">
              ACCESS GRANTED
            </div>
            <div className="text-primary text-lg font-mono">
              WELCOME TO DIGITAL YOGIN SYSTEMS
            </div>
            <div className="text-muted-foreground text-sm font-mono">
              SECURE CONNECTION ESTABLISHED
            </div>
          </div>
        )}
      </div>

      {/* Skip Button */}
      {showSkip && (
        <button
          onClick={handleSkip}
          className="fixed bottom-8 right-8 text-muted-foreground hover:text-primary font-mono text-sm border border-border hover:border-primary px-4 py-2 transition-colors"
        >
          [ESC] SKIP INTRO
        </button>
      )}
    </div>
  );
};

export default IntroLoader;
