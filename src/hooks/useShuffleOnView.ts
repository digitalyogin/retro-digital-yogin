import { useEffect, useMemo, useRef, useState } from "react";
import { createShuffleEffect6 } from "@/lib/typeShuffle/effect6";
import type { ShuffleEffect6Options } from "@/lib/typeShuffle/types";

type UseShuffleOnViewOptions = {
  once?: boolean;
  threshold?: number;
  disabled?: boolean;
  effectOptions?: ShuffleEffect6Options;
};

const supportsIntersectionObserver = () => {
  return typeof window !== "undefined" && "IntersectionObserver" in window;
};

export const useShuffleOnView = (
  text: string,
  { once = true, threshold = 0.2, disabled = false, effectOptions }: UseShuffleOnViewOptions = {}
) => {
  const elementRef = useRef<HTMLElement | null>(null);
  const hasPlayedRef = useRef(false);
  const [hasReducedMotion, setHasReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setHasReducedMotion(media.matches);
    update();

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }

    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  const shouldAnimate = useMemo(() => {
    return !disabled && !hasReducedMotion && text.trim().length > 0;
  }, [disabled, hasReducedMotion, text]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.textContent = text;

    if (!shouldAnimate) return;

    if (!supportsIntersectionObserver()) {
      if (!once || !hasPlayedRef.current) {
        const controller = createShuffleEffect6(element, text, effectOptions);
        controller.play();
        hasPlayedRef.current = true;
        return () => controller.destroy();
      }
      return;
    }

    let controller: ReturnType<typeof createShuffleEffect6> | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (once && hasPlayedRef.current) return;

        if (controller) {
          controller.destroy();
          controller = null;
        }

        controller = createShuffleEffect6(element, text, effectOptions);
        controller.play();
        hasPlayedRef.current = true;

        if (once) {
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (controller) controller.destroy();
    };
  }, [effectOptions, once, shouldAnimate, text, threshold]);

  return { elementRef, shouldAnimate };
};
