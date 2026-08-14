import { useRef, type CSSProperties } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollVideo } from "@/hooks/useScrollVideo";
import { ScrollVideo } from "./ScrollVideo";
import { EncodedSymbolOverlay } from "./EncodedSymbolOverlay";

const stageClass = (progress: number, start: number, end: number) =>
  progress >= start && progress < end ? "scroll-story-copy is-current" : "scroll-story-copy";

export const ScrollStoryHero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { progress, ready, reducedMotion, handleLoadedMetadata } = useScrollVideo(sectionRef, videoRef);

  return (
    <section
      ref={sectionRef}
      className={`scroll-story ${reducedMotion ? "is-reduced" : ""}`}
      style={{ "--story-progress": progress } as CSSProperties}
      aria-labelledby="scroll-story-title"
    >
      <div className={`scroll-story-sticky ${ready || reducedMotion ? "is-ready" : ""}`}>
        <ScrollVideo ref={videoRef} onLoadedMetadata={handleLoadedMetadata} reducedMotion={reducedMotion} />
        <EncodedSymbolOverlay progress={progress} />

        <div className="sr-only" id="scroll-story-title">
          Digital craft, human vision. Diamo forma al tuo centro nel rumore digitale. La tecnologia amplifica. Il senso orienta.
          Umano e macchina non sono opposti. Cooperano per trasformare complessità in direzione. Prima il senso. Poi il software.
        </div>

        <div className="scroll-story-narrative" aria-hidden="true">
          <div className={`${stageClass(progress, 0, 0.3)} story-opening`}>
            <p>DIGITAL CRAFT · HUMAN VISION</p>
            <h1>Diamo forma al tuo centro<span>nel rumore digitale</span></h1>
          </div>
          <div className={`${stageClass(progress, 0.3, 0.52)} story-amplifies`}>
            <h2>La tecnologia amplifica.<span>Il senso orienta.</span></h2>
          </div>
          <div className={`${stageClass(progress, 0.52, 0.72)} story-connection`}>
            <p>02 / CONNESSIONE</p><h2>Umano e macchina<br />non sono opposti.</h2>
          </div>
          <div className={`${stageClass(progress, 0.72, 0.9)} story-cooperate`}>
            <h2>La complessità<br />diventa direzione.</h2>
          </div>
          <div className={`${stageClass(progress, 0.9, 1.01)} story-final`}>
            <h2>Prima il senso.<span>Poi il software.</span></h2>
          </div>
        </div>

        <Link className={`scroll-story-cta ${progress >= 0.9 || reducedMotion ? "is-visible" : ""}`} to="/contatti">
          INIZIA UN PROGETTO <ArrowUpRight size={15} />
        </Link>
        {!reducedMotion && <div className="scroll-story-cue" aria-hidden="true"><span>SCORRI PER CONNETTERE</span><ArrowDown size={14} /></div>}
        <div className="scroll-story-progress" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} /></div>
      </div>
    </section>
  );
};
