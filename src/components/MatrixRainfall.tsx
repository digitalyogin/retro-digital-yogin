import { useEffect, useRef, useState } from "react";
import { AnimatedMandala } from "./AnimatedMandala";

interface Column {
  x: number;
  y: number;
  speed: number;
  char: string;
  brightness: number;
  spawnTime: number;
  lastChange: number;
  isHead: boolean;
}

interface RevealedWord {
  word: string;
  x: number;
  y: number;
  spawnTime: number;
  currentLetters: number;
  glitchChars: string[];
  isComplete: boolean;
}

interface EnergyParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

interface BackgroundMatrixRainfallProps {
  showGeometry?: boolean;
}

const SACRED_SYMBOLS = "ॐΩψφθλπ∞∆Σ☿♀⊕♂♃♄⛢☉☽अआइईउऊऋएऐओऔ";
const KEYWORDS = [
  "MAYA", "ILLUSIONE", "VOLONTÀ", "BRAHMAN", "ATMAN", 
  "DHARMA", "KARMA", "MOKSHA", "YOGA", "VEDANTA"
];

// Estrai lettere dalle parole chiave
const KEYWORD_CHARS = Array.from(new Set(KEYWORDS.join(""))).join("");
const RANDOM_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

const getRandomChar = (): string => {
  const rand = Math.random();
  if (rand < 0.7) {
    // 70% simboli sacri
    return SACRED_SYMBOLS[Math.floor(Math.random() * SACRED_SYMBOLS.length)];
  } else if (rand < 0.9) {
    // 20% lettere da parole chiave
    return KEYWORD_CHARS[Math.floor(Math.random() * KEYWORD_CHARS.length)];
  } else {
    // 10% caratteri casuali
    return RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)];
  }
};

export const MatrixRainfall = ({ showGeometry = false }: BackgroundMatrixRainfallProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const columnsRef = useRef<Column[]>([]);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const [revealedWords, setRevealedWords] = useState<RevealedWord[]>([]);
  const energyParticlesRef = useRef<EnergyParticle[]>([]);
  const isMobileRef = useRef(false);

  const createEnergyPulse = (x: number, y: number) => {
    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 / 20) * i;
      energyParticlesRef.current.push({
        x, y,
        vx: Math.cos(angle) * 3,
        vy: Math.sin(angle) * 3,
        life: 1
      });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Detect mobile
    isMobileRef.current = window.innerWidth < 768;

    const initCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);

      // Inizializza colonne
      const fontSize = 16;
      const columnWidth = fontSize;
      const numColumns = Math.min(80, Math.floor(window.innerWidth / columnWidth));
      
      columnsRef.current = Array.from({ length: numColumns }, (_, i) => ({
        x: i * columnWidth,
        y: Math.random() * -window.innerHeight,
        speed: 50 + Math.random() * 100, // 50-150 px/s per variare profondità
        char: getRandomChar(),
        brightness: 0,
        spawnTime: Date.now(),
        lastChange: Date.now(),
        isHead: Math.random() < 0.3 // 30% sono "head" luminose
      }));
    };

    initCanvas();

    let lastWordSpawn = Date.now();

    const animate = (currentTime: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = currentTime;
      const deltaTime = (currentTime - lastTimeRef.current) / 1000; // secondi
      lastTimeRef.current = currentTime;

      // Skip frame su mobile per performance (30fps invece di 60fps)
      if (isMobileRef.current && Math.random() < 0.5) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Clear canvas
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"; // Trail effect con fade lento
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      ctx.font = "bold 16px 'Courier New', monospace";
      ctx.textAlign = "center";

      // Update e render colonne
      columnsRef.current.forEach((col) => {
        // Update posizione
        col.y += col.speed * deltaTime;

        // Reset se esce dallo schermo
        if (col.y > window.innerHeight + 50) {
          col.y = -50;
          col.x = Math.random() * window.innerWidth;
          col.speed = 50 + Math.random() * 100;
          col.char = getRandomChar();
          col.spawnTime = Date.now();
          col.brightness = 0;
          col.isHead = Math.random() < 0.3;
        }

        // Cambia carattere periodicamente
        if (Date.now() - col.lastChange > 50 + Math.random() * 50) {
          col.char = getRandomChar();
          col.lastChange = Date.now();
        }

        // Calcola brightness con easing
        const age = (Date.now() - col.spawnTime) / 1000;
        const fadeInDuration = 0.5;
        const fadeOutStart = 3;
        const fadeOutDuration = 1;

        if (age < fadeInDuration) {
          col.brightness = easeInOutCubic(age / fadeInDuration);
        } else if (age < fadeOutStart) {
          col.brightness = 1;
        } else {
          col.brightness = 1 - easeInOutCubic(Math.min(1, (age - fadeOutStart) / fadeOutDuration));
        }

        // Motion blur trail (3 posizioni precedenti)
        const trailLength = 3;
        for (let i = trailLength; i >= 1; i--) {
          const trailY = col.y - i * 15;
          const trailAlpha = col.brightness * (1 - i / trailLength) * 0.3;

          ctx.save();
          ctx.globalAlpha = trailAlpha;
          ctx.fillStyle = `hsl(180, 100%, ${60 + trailAlpha * 20}%)`;
          ctx.shadowBlur = 6 * trailAlpha;
          ctx.shadowColor = "rgba(0, 255, 200, 0.6)";
          ctx.fillText(col.char, col.x, trailY);
          ctx.restore();
        }

        // Carattere principale
        ctx.save();
        if (col.isHead) {
          // Head luminosa - più grande e nitida
          ctx.font = "bold 18px 'Courier New', monospace";
          ctx.globalAlpha = col.brightness;
          ctx.fillStyle = "#ffffff";
          ctx.shadowBlur = 20;
          ctx.shadowColor = "rgba(255, 255, 255, 1)";
          ctx.strokeStyle = "rgba(0, 255, 200, 0.3)";
          ctx.lineWidth = 0.5;
          ctx.strokeText(col.char, col.x, col.y);
          ctx.fillText(col.char, col.x, col.y);
          ctx.font = "bold 16px 'Courier New', monospace"; // Reset
        } else {
          // Carattere normale - più nitido
          ctx.globalAlpha = col.brightness * 0.85;
          ctx.fillStyle = `hsl(180, 100%, ${60 + col.brightness * 20}%)`;
          ctx.shadowBlur = 8 * col.brightness;
          ctx.shadowColor = "rgba(0, 255, 200, 0.9)";
          ctx.fillText(col.char, col.x, col.y);
        }
        ctx.restore();
      });

      // Spawn parole rivelate casuali
      if (Date.now() - lastWordSpawn > 3000 && Math.random() < 0.015) {
        const word = KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)];
        setRevealedWords((prev) => [
          ...prev,
          {
            word,
            x: 100 + Math.random() * (window.innerWidth - 200),
            y: 100 + Math.random() * (window.innerHeight * 0.6),
            spawnTime: Date.now(),
            currentLetters: 0,
            glitchChars: Array(word.length).fill('').map(() => getRandomChar()),
            isComplete: false
          },
        ]);
        lastWordSpawn = Date.now();
      }

      // Update e render energy particles
      energyParticlesRef.current = energyParticlesRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= deltaTime * 2;
        
        if (p.life > 0) {
          ctx.save();
          ctx.globalAlpha = p.life * 0.8;
          ctx.fillStyle = `hsl(45, 100%, ${50 + p.life * 30}%)`;
          ctx.shadowBlur = 15;
          ctx.shadowColor = 'hsl(45, 100%, 50%)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          return true;
        }
        return false;
      });

      // Render parole rivelate con cyber hack effect
      setRevealedWords((prev) => {
        const now = Date.now();
        return prev.filter((w) => {
          const age = (now - w.spawnTime) / 1000;
          if (age > 6) return false; // Rimuovi dopo 6s

          ctx.save();
          ctx.textAlign = "center";

          // Fase 1: Glitch injection (0-0.8s)
          if (age < 0.8) {
            const progress = age / 0.8;
            w.currentLetters = Math.floor(progress * w.word.length);
            
            // Costruisci testo con glitch
            let displayText = '';
            for (let i = 0; i < w.word.length; i++) {
              if (i < w.currentLetters) {
                displayText += w.word[i];
              } else {
                displayText += getRandomChar();
              }
            }
            
            // RGB Chromatic aberration
            ctx.font = "bold 32px 'Courier New', monospace";
            
            ctx.fillStyle = 'red';
            ctx.globalAlpha = 0.5;
            ctx.fillText(displayText, w.x - 2, w.y);
            
            ctx.fillStyle = 'cyan';
            ctx.fillText(displayText, w.x + 2, w.y);
            
            ctx.fillStyle = 'white';
            ctx.globalAlpha = 1;
            ctx.fillText(displayText, w.x, w.y);
            
            // Scanline effect
            const scanlineY = w.y - 10 + Math.sin(age * 30) * 5;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(w.x - w.word.length * 10, scanlineY, w.word.length * 20, 2);
            
          } 
          // Fase 2: Parola completa con glow (0.8-3.5s)
          else if (age < 3.5) {
            if (!w.isComplete) {
              w.isComplete = true;
              createEnergyPulse(w.x, w.y);
            }
            
            ctx.font = "bold 36px 'Courier New', monospace";
            ctx.fillStyle = 'hsl(45, 100%, 70%)';
            ctx.shadowBlur = 35;
            ctx.shadowColor = 'hsl(45, 100%, 50%)';
            ctx.fillText(w.word, w.x, w.y);
            
            // "BREACH DETECTED" label
            ctx.font = "bold 11px 'Courier New', monospace";
            ctx.fillStyle = 'rgba(255, 50, 50, 0.9)';
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(255, 0, 0, 0.8)';
            const breachText = '[INJECTION DETECTED]';
            ctx.fillText(breachText, w.x, w.y + 25);
            
            // Box intorno al breach
            const breachWidth = ctx.measureText(breachText).width;
            ctx.strokeStyle = 'rgba(255, 50, 50, 0.6)';
            ctx.lineWidth = 1;
            ctx.strokeRect(w.x - breachWidth / 2 - 5, w.y + 10, breachWidth + 10, 20);
          }
          // Fase 3: Fade out (3.5-6s)
          else {
            const fadeAlpha = 1 - easeInOutCubic((age - 3.5) / 2.5);
            ctx.globalAlpha = fadeAlpha;
            ctx.font = "bold 36px 'Courier New', monospace";
            ctx.fillStyle = 'hsl(45, 100%, 70%)';
            ctx.shadowBlur = 30;
            ctx.shadowColor = 'hsl(45, 100%, 50%)';
            ctx.fillText(w.word, w.x, w.y);
          }
          
          ctx.restore();
          return true;
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    // Resize handler con debounce
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        isMobileRef.current = window.innerWidth < 768;
        initCanvas();
      }, 300);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full -z-10"
        style={{ background: "#000" }}
      />

      {/* Geometria Sacra Mandala Animato */}
      {showGeometry && <AnimatedMandala />}
    </>
  );
};
