import { useState, useEffect } from "react";
import { playCrtTransitionSound, playCrtPowerOnSound } from "@/lib/terminalSounds";

interface CrtTransitionProps {
  active: boolean;
  onComplete: () => void;
}

/**
 * Cinematic CRT power-off / power-on transition.
 * Phase 1: Screen shrinks vertically to a horizontal white line (TV off)
 * Phase 2: Line glows bright with phosphor afterglow
 * Phase 3: Static burst + screen expands back (TV on)
 */
export const CrtTransition = ({ active, onComplete }: CrtTransitionProps) => {
  const [phase, setPhase] = useState<
    "idle" | "shrink" | "line" | "static" | "expand" | "done"
  >("idle");

  useEffect(() => {
    if (!active) {
      setPhase("idle");
      return;
    }

    // Start shrink
    setPhase("shrink");
    playCrtTransitionSound();

    const t1 = setTimeout(() => setPhase("line"), 350);
    const t2 = setTimeout(() => {
      setPhase("static");
      playCrtPowerOnSound();
    }, 700);
    const t3 = setTimeout(() => setPhase("expand"), 1000);
    const t4 = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 1400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [active, onComplete]);

  if (phase === "idle" || phase === "done") return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      {/* Full black overlay that shrinks vertically like an old TV */}
      <div
        className="absolute inset-0 bg-background"
        style={{
          transition: phase === "shrink" ? "clip-path 350ms ease-in" :
                     phase === "expand" ? "clip-path 350ms ease-out, opacity 200ms" :
                     "none",
          clipPath: phase === "shrink"
            ? "inset(48% 0 48% 0)"
            : phase === "line"
            ? "inset(49.5% 0 49.5% 0)"
            : phase === "static" || phase === "expand"
            ? "inset(0 0 0 0)"
            : "inset(0 0 0 0)",
          opacity: phase === "expand" ? 0 : 1,
        }}
      />

      {/* Phosphor glow line */}
      {(phase === "line" || phase === "static") && (
        <div
          className="absolute left-0 right-0"
          style={{
            top: "50%",
            transform: "translateY(-50%)",
            height: phase === "line" ? "3px" : "2px",
            background: "linear-gradient(90deg, transparent 2%, hsl(var(--primary)) 15%, hsl(var(--secondary)) 50%, hsl(var(--primary)) 85%, transparent 98%)",
            boxShadow: `
              0 0 20px 8px hsl(var(--primary) / 0.7),
              0 0 60px 20px hsl(var(--primary) / 0.4),
              0 0 100px 40px hsl(var(--primary) / 0.15)
            `,
            animation: phase === "line" ? "crt-line-pulse 0.15s ease-in-out infinite alternate" : "none",
            transition: "height 200ms, opacity 300ms",
            opacity: phase === "static" ? 0.3 : 1,
          }}
        />
      )}

      {/* Static noise burst on power-on */}
      {phase === "static" && (
        <>
          <canvas
            className="absolute inset-0 w-full h-full"
            style={{ opacity: 0.4, mixBlendMode: "screen" }}
            ref={(canvas) => {
              if (!canvas) return;
              const ctx = canvas.getContext("2d");
              if (!ctx) return;
              canvas.width = 320;
              canvas.height = 180;
              let frame = 0;
              const draw = () => {
                if (frame > 8) return;
                const imgData = ctx.createImageData(320, 180);
                for (let i = 0; i < imgData.data.length; i += 4) {
                  const v = Math.random() * 255;
                  imgData.data[i] = v * 0.3;
                  imgData.data[i + 1] = v;
                  imgData.data[i + 2] = v * 0.5;
                  imgData.data[i + 3] = 200;
                }
                ctx.putImageData(imgData, 0, 0);
                frame++;
                requestAnimationFrame(draw);
              };
              draw();
            }}
          />
          {/* Horizontal rolling bar */}
          <div
            className="absolute left-0 right-0 h-16"
            style={{
              background: "linear-gradient(180deg, transparent, hsl(var(--primary) / 0.08), transparent)",
              animation: "crt-roll 0.3s linear infinite",
            }}
          />
        </>
      )}

      {/* Screen edge vignette during expand */}
      {phase === "expand" && (
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, transparent 50%, hsl(var(--primary) / 0.15) 100%)",
            animation: "crt-flash 400ms ease-out forwards",
          }}
        />
      )}

      {/* Scanlines always visible during transition */}
      {phase !== "expand" && (
        <div
          className="absolute inset-0"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
            opacity: 0.6,
          }}
        />
      )}
    </div>
  );
};
