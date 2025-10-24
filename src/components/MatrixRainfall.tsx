import { useEffect, useRef, useState } from "react";

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
  const isMobileRef = useRef(false);

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

      ctx.font = "16px monospace";
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
          ctx.fillStyle = `hsl(180, 70%, ${40 + trailAlpha * 30}%)`;
          ctx.shadowBlur = 8 * trailAlpha;
          ctx.shadowColor = "rgba(0, 220, 180, 0.5)";
          ctx.fillText(col.char, col.x, trailY);
          ctx.restore();
        }

        // Carattere principale
        ctx.save();
        if (col.isHead) {
          // Head luminosa
          ctx.globalAlpha = col.brightness;
          ctx.fillStyle = "#ffffff";
          ctx.shadowBlur = 25;
          ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
        } else {
          // Carattere normale
          ctx.globalAlpha = col.brightness * 0.8;
          ctx.fillStyle = `hsl(180, 70%, ${50 + col.brightness * 30}%)`;
          ctx.shadowBlur = 15 * col.brightness;
          ctx.shadowColor = "rgba(0, 220, 180, 0.8)";
        }
        ctx.fillText(col.char, col.x, col.y);
        ctx.restore();
      });

      // Spawn parole rivelate casuali
      if (Date.now() - lastWordSpawn > 2000 && Math.random() < 0.02) {
        const word = KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)];
        setRevealedWords((prev) => [
          ...prev,
          {
            word,
            x: 100 + Math.random() * (window.innerWidth - 200),
            y: 100 + Math.random() * (window.innerHeight * 0.6),
            spawnTime: Date.now(),
          },
        ]);
        lastWordSpawn = Date.now();
      }

      // Render parole rivelate con fade in/out
      setRevealedWords((prev) => {
        const now = Date.now();
        return prev.filter((w) => {
          const age = (now - w.spawnTime) / 1000;
          if (age > 5) return false; // Rimuovi dopo 5s

          let alpha: number;
          if (age < 1) {
            alpha = easeInOutCubic(age); // Fade in 1s
          } else if (age < 3) {
            alpha = 1; // Hold 2s
          } else {
            alpha = 1 - easeInOutCubic((age - 3) / 2); // Fade out 2s
          }

          if (alpha > 0) {
            ctx.save();
            ctx.globalAlpha = alpha * 0.7;
            ctx.font = "bold 28px monospace";
            ctx.fillStyle = "hsl(45, 100%, 65%)";
            ctx.shadowBlur = 25;
            ctx.shadowColor = "hsl(45, 100%, 50%)";
            ctx.textAlign = "center";
            ctx.fillText(w.word, w.x, w.y);
            ctx.restore();
          }

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

      {/* Geometria Sacra Mandala */}
      {showGeometry && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none -z-10">
          <svg
            width="400"
            height="400"
            viewBox="0 0 400 400"
            className="opacity-20"
            style={{ filter: "drop-shadow(0 0 20px rgba(255, 215, 0, 0.3))" }}
          >
            {/* Cerchi concentrici */}
            {[50, 100, 150].map((r, i) => (
              <circle
                key={`circle-${i}`}
                cx="200"
                cy="200"
                r={r}
                fill="none"
                stroke="hsl(45, 100%, 60%)"
                strokeWidth="1"
                opacity={0.4 - i * 0.1}
              />
            ))}

            {/* Linee radiali */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const x1 = 200 + Math.cos(angle) * 50;
              const y1 = 200 + Math.sin(angle) * 50;
              const x2 = 200 + Math.cos(angle) * 150;
              const y2 = 200 + Math.sin(angle) * 150;
              return (
                <line
                  key={`line-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="hsl(45, 100%, 60%)"
                  strokeWidth="1"
                  opacity="0.3"
                />
              );
            })}

            {/* Om centrale */}
            <text
              x="200"
              y="215"
              fontSize="48"
              fontWeight="bold"
              textAnchor="middle"
              fill="hsl(45, 100%, 70%)"
              className="animate-sacred-pulse"
            >
              ॐ
            </text>
          </svg>
        </div>
      )}
    </>
  );
};
