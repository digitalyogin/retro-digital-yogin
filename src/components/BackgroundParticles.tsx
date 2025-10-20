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
    const fontSize = 18;
    let columns = Math.floor(window.innerWidth / fontSize);
    let drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    let animationId: number;

    const draw = () => {
      // Dark fade for black background with slow trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      ctx.font = `600 ${fontSize}px monospace`;
      ctx.textBaseline = 'top';

      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Matrix-style brightness with brighter head
        const brightness = Math.max(0.6, 1 - (drops[i] / (window.innerHeight / fontSize)) * 0.7);
        const glowIntensity = brightness * 6;
        
        // Classic Matrix green (90% probability) with occasional cyan/yellow accent
        const colorVariation = Math.random();
        if (colorVariation > 0.95) {
          ctx.fillStyle = `rgba(0, 255, 255, ${brightness})`; // cyan accent
          ctx.shadowColor = 'rgba(0, 255, 255, 0.6)';
        } else if (colorVariation > 0.90) {
          ctx.fillStyle = `rgba(170, 255, 0, ${brightness})`; // yellow-green accent
          ctx.shadowColor = 'rgba(170, 255, 0, 0.6)';
        } else {
          ctx.fillStyle = `rgba(0, 220, 130, ${brightness})`; // classic Matrix green
          ctx.shadowColor = 'rgba(0, 220, 130, 0.6)';
        }
        
        ctx.shadowBlur = glowIntensity;
        ctx.fillText(text, x, y);

        if (y > window.innerHeight && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i] += 0.3; // Slow falling speed as requested
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
