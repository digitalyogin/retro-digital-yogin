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
  windowWidth: number;
  windowHeight: number;
  hexLines: string[];
  scriptPhase: 'prompt' | 'confirm' | 'executing' | 'complete';
  userChoice: 'Y' | 'N' | null;
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

const SACRED_SYMBOLS = "ॐΩψφθλπ∞∆Σ☿♀⊕♂♃♄⛢☉☽अआइईउऊऋएऐओऔ".split('');
const KEYWORDS = [
  'VOLONTÀ',
  'RAPPRESENTAZIONE', 
  'MAYA',
  'VELO',
  'ILLUSIONE',
  'REALTÀ'
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

      // Spawn parole rivelate casuali con sacred symbols
      if (Date.now() - lastWordSpawn > 3000 && Math.random() < 0.015) {
        const selectedWord = KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)];
        
        // Mix parola con sacred symbols (30% chance)
        let mixedWord = selectedWord;
        if (Math.random() < 0.3) {
          const symbol = SACRED_SYMBOLS[Math.floor(Math.random() * SACRED_SYMBOLS.length)];
          mixedWord = symbol + ' ' + selectedWord + ' ' + symbol;
        }
        
        setRevealedWords((prev) => [
          ...prev,
          {
            word: mixedWord,
            x: 100 + Math.random() * (window.innerWidth - 200),
            y: 100 + Math.random() * (window.innerHeight * 0.6),
            spawnTime: Date.now(),
            currentLetters: 0,
            glitchChars: Array(mixedWord.length).fill('').map(() => getRandomChar()),
            isComplete: false,
            windowWidth: 320,
            windowHeight: 180,
            hexLines: [],
            scriptPhase: 'prompt',
            userChoice: null
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

      // Render parole rivelate con bash script effect
      setRevealedWords((prev) => {
        const now = Date.now();
        return prev.filter((w) => {
          const age = (now - w.spawnTime) / 1000;
          if (age > 7) return false; // Rimuovi dopo 7s

          ctx.save();
          
          const winX = w.x - w.windowWidth / 2;
          const winY = w.y - w.windowHeight / 2;

          // Base finestra
          ctx.fillStyle = 'rgba(0, 20, 30, 0.95)';
          ctx.strokeStyle = 'rgba(0, 255, 200, 0.6)';
          ctx.lineWidth = 2;
          ctx.fillRect(winX, winY, w.windowWidth, w.windowHeight);
          ctx.strokeRect(winX, winY, w.windowWidth, w.windowHeight);
          
          // Header
          ctx.fillStyle = 'rgba(0, 60, 80, 0.95)';
          ctx.fillRect(winX, winY, w.windowWidth, 25);
          ctx.font = 'bold 11px "Courier New"';
          ctx.fillStyle = '#0ff';
          ctx.textAlign = 'left';
          ctx.fillText('● ○ ○  bash - sacred_inject.sh', winX + 10, winY + 16);

          // Fase 1: Prompt script (0-1s)
          if (age < 1) {
            ctx.font = '12px "Courier New"';
            ctx.fillStyle = '#0f0';
            ctx.fillText('$ ./sacred_inject.sh', winX + 10, winY + 45);
            
            // Typing effect sul prompt
            const promptText = 'Execute script? [Y/n]: ';
            const typingProgress = Math.max(0, (age - 0.3) / 0.7);
            const typedPrompt = promptText.substring(0, Math.floor(typingProgress * promptText.length));
            ctx.fillText(typedPrompt, winX + 10, winY + 65);
            
            // Cursor lampeggiante
            if (Math.floor(age * 4) % 2 === 0 && age > 0.3) {
              ctx.fillStyle = '#0ff';
              const cursorX = ctx.measureText(typedPrompt).width;
              ctx.fillRect(winX + 10 + cursorX, winY + 53, 8, 14);
            }
            
            w.scriptPhase = 'prompt';
          }
          // Fase 2: Conferma Y (1-1.5s)
          else if (age < 1.5) {
            ctx.font = '12px "Courier New"';
            ctx.fillStyle = '#0f0';
            ctx.fillText('$ ./sacred_inject.sh', winX + 10, winY + 45);
            ctx.fillStyle = '#fff';
            ctx.fillText('Execute script? [Y/n]: Y', winX + 10, winY + 65);
            
            w.scriptPhase = 'confirm';
            w.userChoice = 'Y';
          }
          // Fase 3: Esecuzione script (1.5-3.5s)
          else if (age < 3.5) {
            const execProgress = (age - 1.5) / 2;
            w.currentLetters = Math.floor(execProgress * w.word.length);
            
            ctx.font = '12px "Courier New"';
            ctx.fillStyle = '#0f0';
            ctx.fillText('$ ./sacred_inject.sh', winX + 10, winY + 45);
            ctx.fillStyle = '#fff';
            ctx.fillText('Execute script? [Y/n]: Y', winX + 10, winY + 65);
            
            ctx.fillStyle = '#ff0';
            ctx.fillText(`> Injecting ${w.word.substring(0, w.currentLetters)}...`, winX + 10, winY + 90);
            
            // Progress bar
            const barWidth = 200;
            ctx.strokeStyle = '#0f0';
            ctx.strokeRect(winX + 10, winY + 105, barWidth, 8);
            ctx.fillStyle = '#0f0';
            ctx.fillRect(winX + 10, winY + 105, barWidth * execProgress, 8);
            
            // Percentuale
            ctx.font = '10px "Courier New"';
            ctx.fillStyle = '#0f0';
            ctx.fillText(`${Math.floor(execProgress * 100)}%`, winX + 220, winY + 112);
            
            // Cursor lampeggiante
            if (Math.floor(age * 4) % 2 === 0) {
              ctx.fillStyle = '#0ff';
              const cursorX = ctx.measureText(`> Injecting ${w.word.substring(0, w.currentLetters)}...`).width;
              ctx.fillRect(winX + 10 + cursorX + 2, winY + 78, 8, 14);
            }
            
            w.scriptPhase = 'executing';
          }
          // Fase 4: Completamento (3.5-5.5s)
          else if (age < 5.5) {
            if (!w.isComplete) {
              w.isComplete = true;
              createEnergyPulse(w.x, w.y);
            }
            
            ctx.font = '12px "Courier New"';
            ctx.fillStyle = '#0f0';
            ctx.fillText('$ ./sacred_inject.sh', winX + 10, winY + 45);
            ctx.fillStyle = '#fff';
            ctx.fillText('Execute script? [Y/n]: Y', winX + 10, winY + 65);
            ctx.fillStyle = '#ff0';
            ctx.fillText(`> Injecting ${w.word}...`, winX + 10, winY + 90);
            
            // Progress bar completa
            ctx.strokeStyle = '#0f0';
            ctx.strokeRect(winX + 10, winY + 105, 200, 8);
            ctx.fillStyle = '#0f0';
            ctx.fillRect(winX + 10, winY + 105, 200, 8);
            ctx.font = '10px "Courier New"';
            ctx.fillText('100%', winX + 220, winY + 112);
            
            ctx.font = '12px "Courier New"';
            ctx.fillStyle = '#0f0';
            ctx.fillText('[✓] Injection complete', winX + 10, winY + 125);
            
            // Parola che pulsa
            const pulseScale = 1 + Math.sin((age - 3.5) * 4) * 0.08;
            ctx.font = `bold ${16 * pulseScale}px "Courier New"`;
            ctx.fillStyle = '#fff';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#0ff';
            ctx.fillText(`>>> ${w.word}`, winX + 10, winY + 150);
            
            w.scriptPhase = 'complete';
          }
          // Fase 5: Fade out (5.5-7s)
          else {
            const fadeAlpha = 1 - easeInOutCubic((age - 5.5) / 1.5);
            ctx.globalAlpha = fadeAlpha;
            
            ctx.font = '12px "Courier New"';
            ctx.fillStyle = '#0f0';
            ctx.fillText('$ ./sacred_inject.sh', winX + 10, winY + 45);
            ctx.fillStyle = '#fff';
            ctx.fillText('Execute script? [Y/n]: Y', winX + 10, winY + 65);
            ctx.fillStyle = '#ff0';
            ctx.fillText(`> Injecting ${w.word}...`, winX + 10, winY + 90);
            ctx.fillStyle = '#0f0';
            ctx.fillText('[✓] Injection complete', winX + 10, winY + 125);
            
            ctx.font = 'bold 16px "Courier New"';
            ctx.fillStyle = '#fff';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#0ff';
            ctx.fillText(`>>> ${w.word}`, winX + 10, winY + 150);
          }

          // Scanlines CRT effect
          for (let i = 0; i < w.windowHeight; i += 4) {
            ctx.fillStyle = 'rgba(0, 255, 200, 0.03)';
            ctx.fillRect(winX, winY + i, w.windowWidth, 1);
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
