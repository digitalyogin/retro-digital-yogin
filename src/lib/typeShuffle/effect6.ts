import { DEFAULT_EFFECT6_OPTIONS } from "./constants";
import type { ShuffleController, ShuffleEffect6Options } from "./types";

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const createRng = (seed?: number) => {
  if (typeof seed !== "number") return Math.random;
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
};

const getShuffledFrame = (
  finalText: string,
  revealedChars: number,
  charset: string,
  random: () => number
) => {
  const frame: string[] = [];

  for (let i = 0; i < finalText.length; i += 1) {
    const ch = finalText[i];
    const shouldReveal = i < revealedChars;

    if (shouldReveal || ch.trim() === "") {
      frame.push(ch);
      continue;
    }

    const index = Math.floor(random() * charset.length);
    frame.push(charset[index] ?? ch);
  }

  return frame.join("");
};

export function createShuffleEffect6(
  element: HTMLElement,
  finalText: string,
  options: ShuffleEffect6Options = {}
): ShuffleController {
  const merged = { ...DEFAULT_EFFECT6_OPTIONS, ...options };
  const durationMs = Math.max(200, merged.durationMs);
  const fps = Math.max(1, merged.fps);
  const frameInterval = 1000 / fps;
  const charset = merged.charset.length > 0 ? merged.charset : DEFAULT_EFFECT6_OPTIONS.charset;
  const random = createRng(options.seed);

  let rafId: number | null = null;
  let startTs: number | null = null;
  let lastFrameTs = 0;
  let running = false;
  let stopped = false;

  const finish = () => {
    element.textContent = finalText;
    running = false;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  const render = (ts: number) => {
    if (!running || stopped) return;

    if (startTs === null) startTs = ts;

    if (ts - lastFrameTs < frameInterval) {
      rafId = requestAnimationFrame(render);
      return;
    }

    lastFrameTs = ts;

    const elapsed = ts - startTs;
    const rawProgress = Math.min(elapsed / durationMs, 1);
    const progress = merged.revealCurve === "easeOut" ? easeOutCubic(rawProgress) : rawProgress;
    const revealedChars = Math.floor(progress * finalText.length);

    element.textContent = getShuffledFrame(finalText, revealedChars, charset, random);

    if (rawProgress >= 1) {
      finish();
      return;
    }

    rafId = requestAnimationFrame(render);
  };

  const play = () => {
    if (running || stopped) return;
    running = true;
    startTs = null;
    lastFrameTs = 0;
    rafId = requestAnimationFrame(render);
  };

  const stop = () => {
    if (!running) return;
    finish();
  };

  const destroy = () => {
    stopped = true;
    running = false;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    element.textContent = finalText;
  };

  return {
    play,
    stop,
    destroy,
    isRunning: () => running,
  };
}
