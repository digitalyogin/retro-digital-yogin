import { useEffect, useRef, useState } from 'react';

const SYMBOLS = 'ॐΩψφθλπ∞∆Σ☿♀⊕♂♃♄⛢☉☽108OM AUM10अआइईउऊऋएऐओऔVOLONTÀRAPPRESENTAZIONEMAYAVELOILLUSIONEREALTÀ';

export const BackgroundStaticMatrix = ({ showGeometry = true }: { showGeometry?: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [glowingCells, setGlowingCells] = useState<Set<string>>(new Set());

  useEffect(() => {
    const drawStatic = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Sfondo nero pieno
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // Testo nitido
      const fontSize = 12;
      const stepY = Math.floor(fontSize * 1.2);
      ctx.font = `600 ${fontSize}px monospace`;
      ctx.textBaseline = 'top';

      // Colonne
      const columns = Math.floor(window.innerWidth / fontSize);
      const rows = Math.floor(window.innerHeight / stepY);

      for (let i = 0; i < columns; i++) {
        const x = Math.floor(i * fontSize);
        for (let r = 0; r < rows; r++) {
          // Densità ridotta: 50% occupato (più discreto)
          if (Math.random() < 0.5) continue;
          const y = Math.floor(r * stepY);
          const ch = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
          
          // Controlla se questa cella è "glowing"
          const isGlowing = glowingCells.has(`${i}-${r}`);
          
          if (isGlowing) {
            // Simbolo illuminato
            ctx.fillStyle = 'rgba(0, 220, 180, 1)';
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'rgba(0, 220, 180, 0.6)';
          } else {
            // Simbolo normale (discreto)
            ctx.fillStyle = 'rgba(0, 180, 120, 0.4)';
            ctx.shadowBlur = 0;
            ctx.shadowColor = 'transparent';
          }
          
          ctx.fillText(ch, x, y);
        }
      }
    };

    drawStatic();
    const onResize = () => drawStatic();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [glowingCells]);

  // Animazione simboli rivelatori
  useEffect(() => {
    const interval = setInterval(() => {
      const newGlowing = new Set<string>();
      const count = Math.floor(Math.random() * 3) + 3; // 3-5 simboli
      
      const columns = Math.floor(window.innerWidth / 12);
      const rows = Math.floor(window.innerHeight / 14.4);
      
      for (let i = 0; i < count; i++) {
        const col = Math.floor(Math.random() * columns);
        const row = Math.floor(Math.random() * rows);
        newGlowing.add(`${col}-${row}`);
      }
      
      setGlowingCells(newGlowing);
    }, 2500); // Ogni 2.5 secondi
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
      {/* Geometrie centrali mistiche con animazioni combinate */}
      {showGeometry && (
        <div 
          className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center"
          style={{ filter: 'drop-shadow(0 0 20px hsla(45, 100%, 50%, 0.2))' }}
        >
          <svg 
            width="60vmin" 
            height="60vmin" 
            viewBox="0 0 100 100" 
            aria-hidden="true"
            className="animate-sacred-pulse"
            style={{ 
              animation: 'sacred-pulse 8s ease-in-out infinite, spin 120s linear infinite' 
            }}
          >
            <g fill="none" stroke="hsl(45 100% 50%)" strokeOpacity="0.4" strokeWidth="0.6">
              <circle cx="50" cy="50" r="46" />
              <circle cx="50" cy="50" r="35" />
              <circle cx="50" cy="50" r="24" />
              <path d="M50 10 L90 90 L10 90 Z" />
              <path d="M50 90 L85 25 L15 25 Z" />
              <circle cx="50" cy="50" r="2" />
            </g>
          </svg>
        </div>
      )}
    </>
  );
};

export default BackgroundStaticMatrix;
