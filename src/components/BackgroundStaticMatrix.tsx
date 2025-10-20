import { useEffect, useRef } from 'react';

const SYMBOLS = 'ॐΩψφθλπ∞∆Σ☿♀⊕♂♃♄⛢☉☽108OM AUM10अआइईउऊऋएऐओऔVOLONTÀRAPPRESENTAZIONEMAYAVELOILLUSIONEREALTÀ';

export const BackgroundStaticMatrix = ({ showGeometry = true }: { showGeometry?: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = 'rgba(0, 180, 120, 0.9)';

      // Colonne
      const columns = Math.floor(window.innerWidth / fontSize);
      const rows = Math.floor(window.innerHeight / stepY);

      for (let i = 0; i < columns; i++) {
        const x = Math.floor(i * fontSize);
        for (let r = 0; r < rows; r++) {
          // Densità: 80% circa occupato
          if (Math.random() < 0.2) continue;
          const y = Math.floor(r * stepY);
          const ch = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
          ctx.fillText(ch, x, y);
        }
      }
    };

    drawStatic();
    const onResize = () => drawStatic();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
      {/* Geometrie centrali statiche */}
      {showGeometry && (
        <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center">
          <svg width="60vmin" height="60vmin" viewBox="0 0 100 100" aria-hidden="true">
            <g fill="none" stroke="hsl(45 100% 55%)" strokeOpacity="0.25" strokeWidth="0.4">
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
