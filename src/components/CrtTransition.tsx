import { useState, useEffect, useCallback } from "react";

interface CrtTransitionProps {
  active: boolean;
  onComplete: () => void;
}

/**
 * Full-screen CRT power-on/off transition overlay.
 * Shows horizontal scan lines collapsing to a single bright line, then expanding out.
 */
export const CrtTransition = ({ active, onComplete }: CrtTransitionProps) => {
  const [phase, setPhase] = useState<"idle" | "collapse" | "line" | "expand" | "done">("idle");

  useEffect(() => {
    if (!active) {
      setPhase("idle");
      return;
    }

    setPhase("collapse");

    const t1 = setTimeout(() => setPhase("line"), 300);
    const t2 = setTimeout(() => setPhase("expand"), 600);
    const t3 = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 1000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [active, onComplete]);

  if (phase === "idle" || phase === "done") return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
      {/* Background blackout */}
      <div
        className={`absolute inset-0 bg-background transition-opacity ${
          phase === "collapse" || phase === "line" ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDuration: phase === "expand" ? "400ms" : "250ms" }}
      />

      {/* Horizontal bright line */}
      <div
        className="absolute left-0 right-0 mx-auto"
        style={{
          height: phase === "line" ? "2px" : phase === "collapse" ? "100vh" : "0px",
          top: "50%",
          transform: "translateY(-50%)",
          background: `linear-gradient(90deg, transparent, hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--primary)), transparent)`,
          boxShadow: phase === "line"
            ? "0 0 30px 10px hsl(var(--primary) / 0.6), 0 0 60px 20px hsl(var(--primary) / 0.3)"
            : "none",
          transition: "height 300ms ease-in-out, box-shadow 200ms",
          opacity: phase === "expand" ? 0 : 1,
        }}
      />

      {/* Scanline noise during collapse */}
      {phase === "collapse" && (
        <div
          className="absolute inset-0"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              hsl(var(--primary) / 0.1) 2px,
              hsl(var(--primary) / 0.1) 4px
            )`,
            animation: "crt-static 0.1s steps(3) infinite",
          }}
        />
      )}

      {/* Flash on expand */}
      {phase === "expand" && (
        <div
          className="absolute inset-0 bg-primary/20"
          style={{
            animation: "crt-flash 400ms ease-out forwards",
          }}
        />
      )}
    </div>
  );
};
