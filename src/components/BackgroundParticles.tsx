import { useEffect, useRef } from 'react';

export const BackgroundParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Codice filosofico di Schopenhauer: "Il mondo come volontà e rappresentazione"
    const characters = 'ॐΩψφθλπ∞∆Σ☿♀⊕♂♃♄⛢☉☽108अआइईउऊऋएऐओऔVOLONTÀRAPPRESENTAZIONEMAYAVELOILLUSIONEREALTÀ';
    const fontSize = 18;
    const columns = Math.floor(window.innerWidth / fontSize);
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    let animationId: number;

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      ctx.font = `600 ${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Matrix-style glow effect
        const brightness = Math.max(0.5, 1 - (drops[i] / (canvas.height / fontSize)) * 0.7);
        const glowIntensity = brightness * 10;
        
        // Variazione di colore (verde Matrix classico con tocchi cyan/giallo)
        const colorVariation = Math.random();
        if (colorVariation > 0.9) {
          ctx.fillStyle = `rgba(0, 255, 255, ${brightness})`; // cyan
          ctx.shadowColor = 'rgba(0, 255, 255, 0.6)';
        } else if (colorVariation > 0.8) {
          ctx.fillStyle = `rgba(170, 255, 0, ${brightness})`; // giallo-verde
          ctx.shadowColor = 'rgba(170, 255, 0, 0.6)';
        } else {
          ctx.fillStyle = `rgba(0, 220, 130, ${brightness})`; // verde Matrix classico
          ctx.shadowColor = 'rgba(0, 220, 130, 0.6)';
        }
        
        ctx.shadowBlur = glowIntensity;
        ctx.fillText(text, x, y);

        if (y > window.innerHeight && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i] += 0.08; // Molto rallentato per effetto Matrix autentico
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
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
