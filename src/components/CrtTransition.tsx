import { useEffect, useRef, useCallback } from "react";
import { playExitSound, playEnterSound, playTransitionDoneSound } from "@/lib/terminalSounds";

interface CrtTransitionProps {
  active: boolean;
  onComplete: () => void;
  playDoneSound?: boolean;
}

const CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789@#$%&*+=<>{}[]";

export const CrtTransition = ({ active, onComplete, playDoneSound = false }: CrtTransitionProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const phaseRef = useRef<"idle" | "dissolve" | "rain" | "emerge" | "done">("idle");
  const startTimeRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const DISSOLVE_MS = 500;
  const RAIN_MS = 400;
  const EMERGE_MS = 500;

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const elapsed = performance.now() - startTimeRef.current;
    const fontSize = 14;
    const cols = Math.ceil(w / fontSize);

    if (phaseRef.current === "dissolve" && elapsed >= DISSOLVE_MS) {
      phaseRef.current = "rain";
      startTimeRef.current = performance.now();
      animRef.current = requestAnimationFrame(animate);
      return;
    }
    if (phaseRef.current === "rain" && elapsed >= RAIN_MS) {
      phaseRef.current = "emerge";
      startTimeRef.current = performance.now();
      void playEnterSound();
      animRef.current = requestAnimationFrame(animate);
      return;
    }
    if (phaseRef.current === "emerge" && elapsed >= EMERGE_MS) {
      phaseRef.current = "done";
      if (playDoneSound) void playTransitionDoneSound();
      onCompleteRef.current();
      return;
    }

    const phase = phaseRef.current;
    if (phase === "done" || phase === "idle") return;

    ctx.fillStyle = phase === "emerge"
      ? `rgba(0, 0, 0, ${0.15 - (elapsed / EMERGE_MS) * 0.12})`
      : "rgba(0, 0, 0, 0.12)";
    ctx.fillRect(0, 0, w, h);

    let coverage = 1;
    if (phase === "dissolve") {
      coverage = elapsed / DISSOLVE_MS;
    }

    ctx.font = `${fontSize}px "Share Tech Mono", monospace`;

    for (let i = 0; i < cols; i++) {
      const speed = 0.5 + (((i * 7 + 13) % 17) / 17) * 1.5;
      const totalElapsed =
        phase === "dissolve" ? elapsed :
        phase === "rain" ? DISSOLVE_MS + elapsed :
        DISSOLVE_MS + RAIN_MS + elapsed;
      const y = ((totalElapsed * speed * 0.15) + (i * 37 % h)) % (h + fontSize);

      if (phase === "dissolve" && i / cols > coverage * 1.3) continue;

      if (phase === "emerge") {
        const cx = w / 2;
        const cy = h / 2;
        const x = i * fontSize;
        const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        const maxDist = Math.sqrt(cx ** 2 + cy ** 2);
        const fadeProgress = elapsed / EMERGE_MS;
        const threshold = fadeProgress * maxDist * 1.5;
        if (dist < threshold) continue;
      }

      const char = CHARS[Math.floor(Math.random() * CHARS.length)];
      ctx.fillStyle = "#3cff7a";
      ctx.globalAlpha = 0.9 + Math.random() * 0.1;
      ctx.fillText(char, i * fontSize, y);

      if (Math.random() > 0.6) {
        ctx.fillStyle = "#1ea34a";
        ctx.globalAlpha = 0.4 + Math.random() * 0.3;
        const trailChar = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillText(trailChar, i * fontSize, y - fontSize);
      }

      ctx.globalAlpha = 1;
    }

    if (phase === "dissolve") {
      ctx.fillStyle = `rgba(0, 0, 0, ${coverage * 0.03})`;
      ctx.fillRect(0, 0, w, h);
    }

    animRef.current = requestAnimationFrame(animate);
  }, [playDoneSound]);

  useEffect(() => {
    if (!active) {
      phaseRef.current = "idle";
      cancelAnimationFrame(animRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    phaseRef.current = "dissolve";
    startTimeRef.current = performance.now();
    void playExitSound();
    animRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animRef.current);
  }, [active, animate]);

  if (!active && phaseRef.current === "idle") return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
      style={{ background: "transparent" }}
    />
  );
};
