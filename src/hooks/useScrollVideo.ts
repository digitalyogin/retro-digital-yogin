import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

type VideoWithFrameCallback = HTMLVideoElement & {
  requestVideoFrameCallback?: (callback: (now: number, metadata: { mediaTime: number }) => void) => number;
  cancelVideoFrameCallback?: (handle: number) => void;
};

const storyTimeline = [
  [0, 0],
  [0.2, 0.18],
  [0.4, 0.35],
  [0.62, 0.46],
  [0.82, 0.72],
  [1, 1],
] as const;

const mapStoryTime = (progress: number) => {
  for (let index = 1; index < storyTimeline.length; index += 1) {
    const [endProgress, endTime] = storyTimeline[index];
    const [startProgress, startTime] = storyTimeline[index - 1];
    if (progress <= endProgress) {
      const segmentProgress = (progress - startProgress) / (endProgress - startProgress);
      return startTime + segmentProgress * (endTime - startTime);
    }
  }
  return 1;
};

export const useScrollVideo = (
  sectionRef: RefObject<HTMLElement>,
  videoRef: RefObject<HTMLVideoElement>,
) => {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const rafRef = useRef(0);
  const targetTimeRef = useRef(0);
  const frameCallbackRef = useRef<number>();

  const syncVideo = useCallback(() => {
    const video = videoRef.current as VideoWithFrameCallback | null;
    if (!video || !Number.isFinite(video.duration) || video.readyState < 1) return;

    const targetTime = Math.min(video.duration - 0.01, targetTimeRef.current * video.duration);
    if (Math.abs(video.currentTime - targetTime) > 1 / 48) video.currentTime = targetTime;

    if (video.requestVideoFrameCallback) {
      if (frameCallbackRef.current !== undefined && video.cancelVideoFrameCallback) {
        video.cancelVideoFrameCallback(frameCallbackRef.current);
      }
      frameCallbackRef.current = video.requestVideoFrameCallback(() => {
        frameCallbackRef.current = undefined;
      });
    }
  }, [videoRef]);

  const measure = useCallback(() => {
    rafRef.current = 0;
    const section = sectionRef.current;
    if (!section || reducedMotion) return;
    const rect = section.getBoundingClientRect();
    const scrollableDistance = Math.max(1, section.offsetHeight - window.innerHeight);
    const nextProgress = Math.min(1, Math.max(0, -rect.top / scrollableDistance));
    targetTimeRef.current = mapStoryTime(nextProgress);
    setProgress(nextProgress);
    syncVideo();
  }, [reducedMotion, sectionRef, syncVideo]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setProgress(0.5);
      return;
    }
    const scheduleMeasure = () => {
      // Immediate sync also covers background-tab rAF throttling; the queued frame
      // coalesces rapid wheel/touch events once the browser is ready to paint.
      measure();
      if (!rafRef.current) rafRef.current = window.requestAnimationFrame(measure);
    };
    scheduleMeasure();
    window.addEventListener("scroll", scheduleMeasure, { passive: true });
    window.addEventListener("resize", scheduleMeasure, { passive: true });
    return () => {
      window.removeEventListener("scroll", scheduleMeasure);
      window.removeEventListener("resize", scheduleMeasure);
      window.cancelAnimationFrame(rafRef.current);
    };
  }, [measure, reducedMotion]);

  const handleLoadedMetadata = useCallback(() => {
    setReady(true);
    syncVideo();
  }, [syncVideo]);

  return { progress, ready, reducedMotion, handleLoadedMetadata };
};
