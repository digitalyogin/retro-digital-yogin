import { useEffect, useRef } from "react";

type DustParticle = { x: number; y: number; radius: number; speed: number; drift: number; alpha: number };

const TAU = Math.PI * 2;

export const FluidHeroBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const frameInterval = 1000 / (coarsePointer ? 24 : 30);
    const pointer = { x: 0.5, y: 0.4, targetX: 0.5, targetY: 0.4, energy: 0 };
    let width = 1;
    let height = 1;
    let animationFrame = 0;
    let resizeFrame = 0;
    let documentVisible = !document.hidden;
    let inViewport = true;
    let lastPaint = 0;
    let elapsed = 0;
    let particles: DustParticle[] = [];

    const createParticles = () => {
      const count = Math.min(coarsePointer ? 24 : 44, Math.round((width * height) / 28000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random(),
        y: Math.random() * 0.82,
        radius: Math.random() * 0.8 + 0.25,
        speed: Math.random() * 0.000035 + 0.000015,
        drift: (Math.random() - 0.5) * 0.00002,
        alpha: Math.random() * 0.18 + 0.04,
      }));
    };

    const waveY = (x: number, layer: number) => {
      const normalizedX = x / width;
      const base = height * (0.14 + layer * 0.072);
      const primary = Math.sin(normalizedX * TAU * (0.72 + layer * 0.045) + elapsed * (0.00016 + layer * 0.000008) + layer * 0.83);
      const secondary = Math.sin(normalizedX * TAU * 1.65 - elapsed * 0.000095 + layer * 1.27);
      const distanceX = normalizedX - pointer.x;
      const distanceY = base / height - pointer.y;
      const influence = Math.exp(-(distanceX * distanceX * 15 + distanceY * distanceY * 7));
      const perturbation = influence * pointer.energy * height * 0.075 * Math.sin(elapsed * 0.004 + layer * 1.1 - distanceX * 10);
      return base + primary * height * (0.055 + layer * 0.004) + secondary * height * 0.025 + perturbation;
    };

    const draw = (now: number, force = false) => {
      if (!force && now - lastPaint < frameInterval) {
        animationFrame = window.requestAnimationFrame(draw);
        return;
      }
      const delta = lastPaint ? Math.min(now - lastPaint, 50) : frameInterval;
      lastPaint = now;
      if (!reducedMotion.matches) elapsed += delta;
      pointer.x += (pointer.targetX - pointer.x) * 0.055;
      pointer.y += (pointer.targetY - pointer.y) * 0.055;
      pointer.energy *= 0.975;

      context.clearRect(0, 0, width, height);
      context.save();
      context.globalCompositeOperation = "screen";
      const layers = coarsePointer ? 5 : 7;
      const step = Math.max(18, width / (coarsePointer ? 30 : 48));

      for (let layer = layers - 1; layer >= 0; layer -= 1) {
        const points: Array<[number, number]> = [];
        for (let x = -step; x <= width + step; x += step) points.push([x, waveY(x, layer)]);
        const gradient = context.createLinearGradient(0, height * 0.05, width, height * 0.68);
        const alpha = 0.032 + (layers - layer) * 0.011;
        gradient.addColorStop(0, `rgba(8,46,37,${alpha})`);
        gradient.addColorStop(0.42, `rgba(16,185,129,${alpha * 1.55})`);
        gradient.addColorStop(0.72, `rgba(45,212,191,${alpha * 0.82})`);
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        context.beginPath();
        context.moveTo(points[0][0], points[0][1]);
        for (let index = 1; index < points.length - 1; index += 1) {
          const current = points[index];
          const next = points[index + 1];
          context.quadraticCurveTo(current[0], current[1], (current[0] + next[0]) / 2, (current[1] + next[1]) / 2);
        }
        context.lineTo(width + step, height * 0.83);
        context.lineTo(-step, height * 0.83);
        context.closePath();
        context.fillStyle = gradient;
        context.shadowColor = layer % 2 === 0 ? "rgba(16,185,129,.28)" : "rgba(45,212,191,.18)";
        context.shadowBlur = coarsePointer ? 18 : 28;
        context.fill();
      }

      context.shadowBlur = 0;
      for (const particle of particles) {
        if (!reducedMotion.matches) {
          particle.y -= particle.speed * delta;
          particle.x += particle.drift * delta;
          if (particle.y < -0.02) particle.y = 0.82;
          if (particle.x < -0.02) particle.x = 1.02;
          if (particle.x > 1.02) particle.x = -0.02;
        }
        context.beginPath();
        context.arc(particle.x * width, particle.y * height, particle.radius, 0, TAU);
        context.fillStyle = `rgba(110,231,183,${particle.alpha})`;
        context.fill();
      }
      context.restore();
      if (documentVisible && inViewport && !reducedMotion.matches) animationFrame = window.requestAnimationFrame(draw);
    };

    const resize = () => {
      window.cancelAnimationFrame(animationFrame);
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      const dpr = Math.min(window.devicePixelRatio || 1, coarsePointer ? 1.15 : 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      createParticles();
      draw(performance.now(), true);
    };

    const handlePointer = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.targetX = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
      pointer.targetY = Math.min(0.82, Math.max(0.04, (event.clientY - bounds.top) / bounds.height));
      pointer.energy = Math.min(1, pointer.energy + 0.14);
    };
    const handleVisibility = () => {
      documentVisible = !document.hidden;
      window.cancelAnimationFrame(animationFrame);
      if (documentVisible && inViewport) animationFrame = window.requestAnimationFrame(draw);
    };
    const handleMotionPreference = () => {
      window.cancelAnimationFrame(animationFrame);
      draw(performance.now(), true);
    };
    const resizeObserver = new ResizeObserver(() => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(resize);
    });
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting;
      window.cancelAnimationFrame(animationFrame);
      if (inViewport && documentVisible && !reducedMotion.matches) animationFrame = window.requestAnimationFrame(draw);
    });

    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    window.addEventListener("pointermove", handlePointer, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);
    reducedMotion.addEventListener("change", handleMotionPreference);
    resize();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.cancelAnimationFrame(resizeFrame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", handlePointer);
      document.removeEventListener("visibilitychange", handleVisibility);
      reducedMotion.removeEventListener("change", handleMotionPreference);
    };
  }, []);

  return (
    <div className="dy-fluid-background" aria-hidden="true">
      <canvas ref={canvasRef} className="dy-fluid-canvas" />
      <div className="dy-fluid-veil" />
    </div>
  );
};
