import { useEffect, useRef, useState } from "react";
import { loadUnicornStudio, type UnicornScene } from "@/lib/unicornStudio";
import { OceanDust } from "./OceanDust";

const PRIMARY_SCENE_ID = "ywpMeQH9jueVeyngMZw0";
const DEEP_SCENE_ID = "uFY4IYPs2LU8fWm96Im2";

export const UnicornHeroBackground = () => {
  const primaryRef = useRef<HTMLDivElement>(null);
  const deepRef = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const primaryElement = primaryRef.current;
    const deepElement = deepRef.current;
    if (!primaryElement || !deepElement || prefersReducedMotion) return;

    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const scenes: UnicornScene[] = [];
    let cancelled = false;

    const addScene = async () => {
      try {
        const runtime = await loadUnicornStudio();
        if (cancelled) return;

        const primaryScene = await runtime.addScene({
            element: primaryElement,
            projectId: PRIMARY_SCENE_ID,
            dpi: coarsePointer ? 1 : 1.5,
            fps: coarsePointer ? 30 : 60,
            lazyLoad: true,
            production: true,
            altText: "Onde bioluminescenti interattive",
            ariaLabel: "Sfondo astratto con onde verdi e cyan",
          });
        if (cancelled) {
          primaryScene.destroy();
          return;
        }
        scenes.push(primaryScene);

        const deepScene = await runtime.addScene({
            element: deepElement,
            projectId: DEEP_SCENE_ID,
            dpi: coarsePointer ? 1 : 1.5,
            fps: coarsePointer ? 30 : 60,
            fixed: true,
            production: true,
            altText: "Raggi di luce bioluminescenti",
            ariaLabel: "Sfondo astratto verde con profondità luminosa",
          });

        if (cancelled) {
          deepScene.destroy();
          return;
        }
        scenes.push(deepScene);
      } catch (error) {
        if (!cancelled) {
          scenes.forEach((scene) => scene.destroy());
          scenes.length = 0;
          primaryElement.replaceChildren();
          deepElement.replaceChildren();
          setHasError(true);
          console.error("[Digital Yogin] Inizializzazione Unicorn Studio non riuscita.", error);
        }
      }
    };

    void addScene();

    return () => {
      cancelled = true;
      scenes.forEach((scene) => scene.destroy());
      primaryElement.replaceChildren();
      deepElement.replaceChildren();
    };
  }, [prefersReducedMotion]);

  return (
    <div className={`dy-unicorn-background${hasError ? " dy-unicorn-background--fallback" : ""}`} aria-hidden="true">
      <div className="dy-unicorn-deep">
        <div ref={deepRef} className="dy-unicorn-scene dy-unicorn-scene--deep" />
        <div className="dy-unicorn-emerald-overlay" />
      </div>
      <div className="dy-unicorn-primary-mask">
        <div className="dy-unicorn-primary-blend">
          <div ref={primaryRef} className="dy-unicorn-scene dy-unicorn-scene--primary" />
        </div>
      </div>
      {!prefersReducedMotion && <OceanDust />}
      <div className="dy-unicorn-veil" />
    </div>
  );
};
