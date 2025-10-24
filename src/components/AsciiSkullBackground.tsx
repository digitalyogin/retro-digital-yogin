import { useEffect, useRef, useState } from "react";
import asciiSkull from "@/assets/ascii-skull.png";

interface AsciiChar {
  char: string;
  color: string;
  brightness: number;
  glitchTime: number;
  pulseOffset: number;
}

// Caratteri ASCII ordinati per densità (da più scuro a più chiaro)
const ASCII_CHARS = " .:-=+*#%@█";
const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;:',.<>?/~`";

export const AsciiSkullBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const asciiGridRef = useRef<AsciiChar[][]>([]);
  const animationRef = useRef<number>();
  const imageLoadedRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const initCanvas = async () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);

      // Carica l'immagine del teschio
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      img.onload = () => {
        console.log("Skull image loaded");
        convertImageToAscii(img);
        imageLoadedRef.current = true;
      };
      
      img.onerror = (e) => {
        console.error("Error loading skull image:", e);
      };
      
      img.src = asciiSkull;
    };

    const convertImageToAscii = (img: HTMLImageElement) => {
      console.log("Converting image to ASCII...");
      
      // Dimensioni dei caratteri ASCII - più grandi per migliori performance
      const fontSize = 12;
      const charWidth = fontSize * 0.6;
      const charHeight = fontSize;

      const cols = Math.floor(window.innerWidth / charWidth);
      const rows = Math.floor(window.innerHeight / charHeight);
      
      console.log(`Grid size: ${cols}x${rows} (${cols * rows} characters)`);

      // Crea un canvas temporaneo per leggere i pixel dell'immagine
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = cols;
      tempCanvas.height = rows;
      const tempCtx = tempCanvas.getContext("2d");
      
      if (!tempCtx) return;

      // Disegna l'immagine ridimensionata
      tempCtx.drawImage(img, 0, 0, cols, rows);
      const imageData = tempCtx.getImageData(0, 0, cols, rows);
      const pixels = imageData.data;

      // Converti ogni pixel in un carattere ASCII
      asciiGridRef.current = [];
      
      for (let y = 0; y < rows; y++) {
        const row: AsciiChar[] = [];
        
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];

          // Calcola luminosità
          const brightness = (r + g + b) / 3;
          
          // Seleziona carattere in base alla luminosità
          const charIndex = Math.floor((brightness / 255) * (ASCII_CHARS.length - 1));
          const char = ASCII_CHARS[charIndex];

          // Converti RGB in stringa color CSS
          const color = `rgba(${r}, ${g}, ${b}, ${a / 255})`;

          row.push({
            char,
            color,
            brightness: brightness / 255,
            glitchTime: Math.random() * 1000,
            pulseOffset: Math.random() * Math.PI * 2
          });
        }
        
        asciiGridRef.current.push(row);
      }

      console.log(`ASCII grid created: ${cols}x${rows}`);
      setIsLoading(false);
      
      // Avvia l'animazione
      animationRef.current = requestAnimationFrame(animate);
    };

    const animate = (currentTime: number) => {
      if (!imageLoadedRef.current || asciiGridRef.current.length === 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const fontSize = 12;
      const charWidth = fontSize * 0.6;
      const charHeight = fontSize;

      // Clear canvas con sfondo nero
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      ctx.font = `${fontSize}px 'Courier New', monospace`;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";

      // Renderizza ogni carattere ASCII
      asciiGridRef.current.forEach((row, y) => {
        row.forEach((asciiChar, x) => {
          const posX = x * charWidth;
          const posY = y * charHeight;

          // Effetto pulse basato sul tempo
          const pulseSpeed = 2;
          const pulseIntensity = 0.15;
          const pulse = Math.sin(currentTime / 1000 * pulseSpeed + asciiChar.pulseOffset) * pulseIntensity + 1;

          // Effetto glitch casuale (5% probabilità ogni frame)
          let displayChar = asciiChar.char;
          const shouldGlitch = Math.random() < 0.002 && asciiChar.brightness > 0.1;
          
          if (shouldGlitch) {
            displayChar = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
            asciiChar.glitchTime = currentTime;
          } else if (currentTime - asciiChar.glitchTime < 100) {
            // Mantieni il glitch per 100ms
            displayChar = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          }

          // Applica luminosità e pulse
          const alpha = asciiChar.brightness * pulse;

          ctx.save();
          ctx.globalAlpha = alpha;
          
          // Aggiungi glow solo ai caratteri più luminosi
          if (asciiChar.brightness > 0.6) {
            ctx.shadowBlur = 4 * pulse;
            ctx.shadowColor = asciiChar.color;
          }

          ctx.fillStyle = asciiChar.color;
          ctx.fillText(displayChar, posX, posY);
          ctx.restore();
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    initCanvas();

    // Resize handler con debounce
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        imageLoadedRef.current = false;
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
    <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-primary text-sm font-mono animate-pulse">
            [LOADING ASCII ART...]
          </div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: "#000000", opacity: isLoading ? 0 : 1 }}
      />
    </div>
  );
};
