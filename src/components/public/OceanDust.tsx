import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  speedX: number;
  opacity: number;
};

const TAU = Math.PI * 2;

export const OceanDust = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    let animationFrame = 0;
    let resizeFrame = 0;
    let width = 1;
    let height = 1;
    let particles: Particle[] = [];

    const createParticles = () => {
      const densityCount = Math.floor((width * height) / 12000);
      const count = Math.min(coarsePointer ? 32 : 90, densityCount);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        speedY: Math.random() * 0.3 + 0.1,
        speedX: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.4 + 0.1,
      }));
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      for (const particle of particles) {
        if (!reducedMotion.matches) {
          particle.y -= particle.speedY;
          particle.x += particle.speedX;
          if (particle.y < -10) {
            particle.y = height + 10;
            particle.x = Math.random() * width;
          }
          if (particle.x < -10) particle.x = width + 10;
          if (particle.x > width + 10) particle.x = -10;
        }
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, TAU);
        context.fillStyle = `rgba(16, 185, 129, ${particle.opacity})`;
        context.fill();
      }
      if (!document.hidden && !reducedMotion.matches) animationFrame = window.requestAnimationFrame(draw);
    };

    const resize = () => {
      window.cancelAnimationFrame(animationFrame);
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      const dpr = Math.min(window.devicePixelRatio || 1, coarsePointer ? 1 : 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      createParticles();
      draw();
    };
    const handleResize = () => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(resize);
    };
    const handleVisibility = () => {
      window.cancelAnimationFrame(animationFrame);
      if (!document.hidden) draw();
    };
    const handleMotionPreference = () => {
      window.cancelAnimationFrame(animationFrame);
      draw();
    };

    window.addEventListener("resize", handleResize, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);
    reducedMotion.addEventListener("change", handleMotionPreference);
    resize();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.cancelAnimationFrame(resizeFrame);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
      reducedMotion.removeEventListener("change", handleMotionPreference);
    };
  }, []);

  return <canvas ref={canvasRef} className="dy-ocean-dust" aria-hidden="true" />;
};
