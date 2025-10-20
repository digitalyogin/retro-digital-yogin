import { useEffect, useRef } from 'react';

export const BackgroundParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // HiDPI support for crisp text
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.scale(dpr, dpr);

    // Codice filosofico di Schopenhauer: "Il mondo come volontà e rappresentazione"
    const characters = 'ॐΩψφθλπ∞∆Σ☿♀⊕♂♃♄⛢☉☽108अआइईउऊऋएऐओऔVOLONTÀRAPPRESENTAZIONEMAYAVELOILLUSIONEREALTÀ';
    const fontSize = 12;
    let columns = Math.floor(window.innerWidth / fontSize);
    let drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    let animationId: number;

    const draw = () => {
      // Deep black background with minimal fade for authentic Matrix look
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      ctx.font = `600 ${fontSize}px monospace`;
      ctx.textBaseline = 'top';

      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Matrix-style brightness with brighter head and longer trails
        const brightness = Math.max(0.3, 1 - (drops[i] / (window.innerHeight / fontSize)) * 0.8);
        const glowIntensity = brightness * 3;
        
        // Authentic Matrix dark green - muted and crisp
        ctx.fillStyle = `rgba(0, 180, 120, ${brightness})`;
        ctx.shadowColor = 'rgba(0, 180, 120, 0.4)';
        ctx.shadowBlur = glowIntensity;
        ctx.fillText(text, x, y);

        if (y > window.innerHeight && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i] += 0.25; // Optimal Matrix speed - smooth and relaxed
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      ctx.textBaseline = 'top';
      
      // Recalculate columns and reinitialize drops
      columns = Math.floor(window.innerWidth / fontSize);
      drops = [];
      for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-100"
    />
  );
};
