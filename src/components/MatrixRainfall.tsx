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
  isComplete: boolean;
  windowWidth: number;
  windowHeight: number;
  alertType: string;
  linesRevealed: number;
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

const getAlertType = (word: string): string => {
  const cleanWord = word.replace(/[ॐΩψφθλπ∞∆Σ☿♀⊕♂♃♄⛢☉☽अआइईउऊऋएऐओऔ\s]/g, '');
  const alertMap: Record<string, string> = {
    'MAYA': 'PHILOSOPHICAL_BREACH',
    'VOLONTÀ': 'CONSCIOUSNESS_SHIFT',
    'ILLUSIONE': 'REALITY_DISTORTION',
    'VELO': 'PERCEPTION_ANOMALY',
    'RAPPRESENTAZIONE': 'MATRIX_FLUCTUATION',
    'REALTÀ': 'PARADIGM_SHIFT'
  };
  return alertMap[cleanWord] || 'SYSTEM_ANOMALY';
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
            isComplete: false,
            windowWidth: 340,
            windowHeight: 160,
            alertType: getAlertType(selectedWord),
            linesRevealed: 0
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

      // Render system alert windows
      setRevealedWords((prev) => {
        const now = Date.now();
        return prev.filter((w) => {
          const age = (now - w.spawnTime) / 1000;
          if (age > 6) return false; // Rimuovi dopo 6s

          const winX = w.x - w.windowWidth / 2;
          const winY = w.y - w.windowHeight / 2;

          ctx.save();

          // Fase 1: Apertura finestra con fade-in (0-0.5s)
          if (age < 0.5) {
            const openProgress = easeInOutCubic(age / 0.5);
            ctx.globalAlpha = openProgress;
            const scale = 0.9 + openProgress * 0.1;
            ctx.translate(w.x, w.y);
            ctx.scale(scale, scale);
            ctx.translate(-w.x, -w.y);
          }

          // Background finestra (stile Terminal/SystemStats)
          ctx.fillStyle = 'rgba(0, 20, 30, 0.95)';
          ctx.strokeStyle = 'rgba(0, 255, 200, 0.6)';
          ctx.lineWidth = 2;
          ctx.fillRect(winX, winY, w.windowWidth, w.windowHeight);
          ctx.strokeRect(winX, winY, w.windowWidth, w.windowHeight);

          // Header bar
          ctx.fillStyle = 'rgba(0, 60, 80, 0.95)';
          ctx.fillRect(winX, winY, w.windowWidth, 28);
          ctx.strokeRect(winX, winY, w.windowWidth, 28);

          // Icona + Titolo header
          ctx.font = 'bold 12px "Courier New"';
          ctx.fillStyle = '#0ff';
          ctx.textAlign = 'left';
          ctx.fillText('⚠ SYSTEM_ALERT', winX + 10, winY + 18);

          // Fase 2: Typing contenuto (0.5-2s)
          if (age >= 0.5 && age < 2) {
            const typingProgress = (age - 0.5) / 1.5;
            w.linesRevealed = Math.floor(typingProgress * 6);
          } else if (age >= 2) {
            w.linesRevealed = 6;
          }

          // Contenuto alert
          const lines = [
            `[STATUS]: ANOMALY_DETECTED`,
            ``,
            `>>> ${w.word}`,
            ``,
            `[TYPE]: ${w.alertType}`,
            `[PRIORITY]: HIGH`
          ];

          let yOffset = 50;
          for (let i = 0; i < Math.min(w.linesRevealed, lines.length); i++) {
            if (lines[i].includes('>>>')) {
              // Parola principale evidenziata
              ctx.font = 'bold 16px "Courier New"';
              ctx.fillStyle = '#fff';
              ctx.shadowBlur = 12;
              ctx.shadowColor = 'rgba(0, 255, 255, 0.8)';
              
              // Pulse effect (dopo fase 2)
              if (age >= 2 && age < 4) {
                const pulseScale = 1 + Math.sin((age - 2) * 5) * 0.06;
                ctx.save();
                const textWidth = ctx.measureText(lines[i]).width;
                const textX = winX + 12 + textWidth / 2;
                const textY = winY + yOffset;
                ctx.translate(textX, textY);
                ctx.scale(pulseScale, pulseScale);
                ctx.translate(-textX, -textY);
                ctx.fillText(lines[i], winX + 12, winY + yOffset);
                ctx.restore();
              } else {
                ctx.fillText(lines[i], winX + 12, winY + yOffset);
              }
            } else if (lines[i].includes('[')) {
              // Labels con colore accent
              ctx.font = '11px "Courier New"';
              ctx.fillStyle = '#0f0';
              ctx.shadowBlur = 0;
              ctx.fillText(lines[i], winX + 12, winY + yOffset);
            } else if (lines[i] !== '') {
              // Testo normale
              ctx.font = '11px "Courier New"';
              ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
              ctx.shadowBlur = 0;
              ctx.fillText(lines[i], winX + 12, winY + yOffset);
            }

            yOffset += lines[i] === '' ? 8 : 20;
          }

          // Cursor lampeggiante durante typing (0.5-2s)
          if (age >= 0.5 && age < 2 && Math.floor(age * 3) % 2 === 0 && w.linesRevealed < lines.length) {
            ctx.fillStyle = '#0ff';
            ctx.fillRect(winX + 12, winY + yOffset - 14, 7, 13);
          }

          // Energy pulse al completamento
          if (age >= 2 && !w.isComplete) {
            w.isComplete = true;
            createEnergyPulse(w.x, w.y);
          }

          // Fase 4: Fade out (4-6s)
          if (age >= 4) {
            const fadeAlpha = 1 - easeInOutCubic((age - 4) / 2);
            ctx.globalAlpha = fadeAlpha;
          }

          // Scanlines CRT effect
          ctx.globalAlpha = ctx.globalAlpha * 0.5;
          for (let i = 0; i < w.windowHeight; i += 4) {
            ctx.fillStyle = 'rgba(0, 255, 200, 0.06)';
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
