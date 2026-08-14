import { forwardRef, useState } from "react";

type ScrollVideoProps = {
  onLoadedMetadata: () => void;
  reducedMotion: boolean;
};

export const ScrollVideo = forwardRef<HTMLVideoElement, ScrollVideoProps>(
  ({ onLoadedMetadata, reducedMotion }, ref) => {
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [videoFailed, setVideoFailed] = useState(false);
    const useContactPoster = reducedMotion || videoFailed;
    const showPoster = useContactPoster || !videoLoaded;

    return (
      <div className="scroll-story-media" aria-hidden="true">
        <picture className={`scroll-story-poster ${showPoster ? "is-visible" : ""}`}>
          <source
            media="(max-width: 700px)"
            srcSet={useContactPoster
              ? "/media/scroll-story/scroll-story-mobile-poster.webp"
              : "/media/scroll-story/scroll-story-mobile-opening.webp"}
          />
          <img
            src={useContactPoster
              ? "/media/scroll-story/scroll-story-poster.webp"
              : "/media/scroll-story/scroll-story-opening.webp"}
            alt=""
          />
        </picture>
        {!reducedMotion && !videoFailed && (
          <video
            ref={ref}
            className="scroll-story-video"
            muted
            playsInline
            preload="auto"
            poster="/media/scroll-story/scroll-story-opening.webp"
            onLoadedMetadata={onLoadedMetadata}
            onLoadedData={() => setVideoLoaded(true)}
            onError={(event) => {
              if (event.currentTarget.error) setVideoFailed(true);
            }}
            tabIndex={-1}
          >
            <source
              media="(max-width: 700px)"
              src="/media/scroll-story/scroll-story-mobile.mp4"
              type="video/mp4"
              onError={(event) => {
                const { media } = event.currentTarget;
                if (!media || window.matchMedia(media).matches) setVideoFailed(true);
              }}
            />
            <source
              src="/media/scroll-story/scroll-story-desktop.mp4"
              type="video/mp4"
              onError={() => setVideoFailed(true)}
            />
          </video>
        )}
        <div className="scroll-story-vignette" />
      </div>
    );
  },
);

ScrollVideo.displayName = "ScrollVideo";
