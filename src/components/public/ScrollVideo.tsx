import { forwardRef } from "react";

type ScrollVideoProps = {
  onLoadedMetadata: () => void;
  reducedMotion: boolean;
};

export const ScrollVideo = forwardRef<HTMLVideoElement, ScrollVideoProps>(
  ({ onLoadedMetadata, reducedMotion }, ref) => (
    <div className="scroll-story-media" aria-hidden="true">
      <picture className={`scroll-story-poster ${reducedMotion ? "is-visible" : ""}`}>
        <source media="(max-width: 700px)" srcSet="/media/scroll-story/scroll-story-mobile-poster.webp" />
        <img src="/media/scroll-story/scroll-story-poster.webp" alt="" />
      </picture>
      {!reducedMotion && (
        <video
          ref={ref}
          className="scroll-story-video"
          muted
          playsInline
          preload="auto"
          poster="/media/scroll-story/scroll-story-poster.webp"
          onLoadedMetadata={onLoadedMetadata}
          tabIndex={-1}
        >
          <source media="(max-width: 700px)" src="/media/scroll-story/scroll-story-mobile.mp4" type="video/mp4" />
          <source src="/media/scroll-story/scroll-story-desktop.mp4" type="video/mp4" />
        </video>
      )}
      <div className="scroll-story-vignette" />
    </div>
  ),
);

ScrollVideo.displayName = "ScrollVideo";
