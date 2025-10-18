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
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    let animationId: number;

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 15, 20, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Matrix-style glow effect
        const brightness = Math.max(0.3, 1 - (drops[i] / (canvas.height / fontSize)) * 0.7);
        const glowIntensity = brightness * 15;
        
        // Variazione di colore (verde principale con tocchi cyan/giallo)
        const colorVariation = Math.random();
        if (colorVariation > 0.9) {
          ctx.fillStyle = `rgba(0, 255, 255, ${brightness * 0.9})`; // cyan
          ctx.shadowColor = 'rgba(0, 255, 255, 0.8)';
        } else if (colorVariation > 0.8) {
          ctx.fillStyle = `rgba(170, 255, 0, ${brightness * 0.8})`; // giallo-verde
          ctx.shadowColor = 'rgba(170, 255, 0, 0.7)';
        } else {
          ctx.fillStyle = `rgba(0, 255, 170, ${brightness * 0.8})`; // verde principale
          ctx.shadowColor = 'rgba(0, 255, 170, 0.9)';
        }
        
        ctx.shadowBlur = glowIntensity;
        ctx.fillText(text, x, y);

        // Secondo layer per profondità (più scuro)
        ctx.shadowBlur = glowIntensity * 0.5;
        ctx.fillStyle = `rgba(0, 255, 170, ${brightness * 0.4})`;
        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i] += 0.3; // Rallentato del 70%
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
      className="fixed inset-0 pointer-events-none z-0 opacity-30"
    />
  );
};
