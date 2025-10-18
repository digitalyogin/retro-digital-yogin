import { useEffect, useState, useRef } from "react";
import { useMousePosition } from "@/hooks/useMousePosition";

export const Hero = () => {
  const [displayText, setDisplayText] = useState("");
  const [loading, setLoading] = useState(true);
  const [glitchActive, setGlitchActive] = useState(false);
  const fullText = "DIGITAL YOGIN";
  const { x, y } = useMousePosition();
  const cardRef1 = useRef<HTMLDivElement>(null);
  const cardRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        setLoading(false);
      }
    }, 150);

    return () => clearInterval(interval);
  }, []);

  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.95) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 300);
      }
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  // 3D tilt effect for cards
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, ref: React.RefObject<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = ((e.clientY - centerY) / rect.height) * 10;
    const rotateY = ((e.clientX - centerX) / rect.width) * 10;
    ref.current.style.setProperty('--rotate-x', `${-rotateX}deg`);
    ref.current.style.setProperty('--rotate-y', `${rotateY}deg`);
  };

  const handleMouseLeave = (ref: React.RefObject<HTMLDivElement>) => {
    if (!ref.current) return;
    ref.current.style.setProperty('--rotate-x', '0deg');
    ref.current.style.setProperty('--rotate-y', '0deg');
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="max-w-4xl w-full space-y-8 relative z-10">
        {/* System Header */}
        <div className="border-2 border-primary bg-card p-4 mb-8">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-primary">SYSTEM_INIT.EXE</span>
            <span className="text-muted-foreground">v2.1.4</span>
          </div>
          <div className="h-2 bg-muted relative overflow-hidden">
            <div className="absolute inset-0 bg-primary animate-pulse" style={{ width: loading ? '60%' : '100%' }} />
          </div>
        </div>

        {/* Main Title */}
        <div className="text-center space-y-4">
          <div className={`text-6xl md:text-8xl font-bold text-primary text-glow font-terminal mb-4 ${glitchActive ? 'animate-rgb-split' : ''}`}>
            {displayText}
            <span className="animate-pulse">_</span>
          </div>
          
          <div className="border-l-4 border-primary pl-6 text-left max-w-2xl mx-auto">
            <p className="text-xl md:text-2xl text-foreground mb-4">
              "La via di mezzo tra l'antico e il moderno"
            </p>
            <p className="text-lg text-muted-foreground">
              AGENZIA_DIGITALE :: SITI_WEB + APPLICAZIONI_MOBILI
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-4 mt-12">
          <div 
            ref={cardRef1}
            className="border border-primary p-6 bg-card/50 card-3d holo-border cursor-pointer"
            onMouseMove={(e) => handleMouseMove(e, cardRef1)}
            onMouseLeave={() => handleMouseLeave(cardRef1)}
          >
            <div className="text-primary text-sm mb-2">{'>'} SERVIZIO_01</div>
            <h3 className="text-2xl font-bold mb-2">SVILUPPO_WEB</h3>
            <p className="text-muted-foreground">
              Realizzazione di siti web moderni, responsive e ottimizzati per ogni dispositivo
            </p>
          </div>

          <div 
            ref={cardRef2}
            className="border border-primary p-6 bg-card/50 card-3d holo-border cursor-pointer"
            onMouseMove={(e) => handleMouseMove(e, cardRef2)}
            onMouseLeave={() => handleMouseLeave(cardRef2)}
          >
            <div className="text-primary text-sm mb-2">{'>'} SERVIZIO_02</div>
            <h3 className="text-2xl font-bold mb-2">APP_MOBILI</h3>
            <p className="text-muted-foreground">
              Sviluppo di applicazioni mobile native e ibride per iOS e Android
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="text-center mt-12">
          <div className="inline-block border border-primary px-6 py-2 animate-pulse">
            <span className="text-primary text-sm">SCROLL_DOWN :: ↓</span>
          </div>
        </div>
      </div>
    </section>
  );
};
