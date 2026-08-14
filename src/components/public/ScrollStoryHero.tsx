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
          Ogni progetto nasce da una domanda umana. L’algoritmo amplia ciò che possiamo immaginare.
          Quando intuizione e calcolo si incontrano, nasce una direzione. Dati, simboli e sistemi diventano significato.
          La tecnologia è lo strumento. Il senso resta umano.
        </div>

        <div className="scroll-story-narrative" aria-hidden="true">
          <div className={`${stageClass(progress, 0, 0.21)} story-opening`}>
            <p>01 / INTUIZIONE</p>
            <h1>Ogni progetto nasce{" "}<span>da una domanda umana.</span></h1>
          </div>
          <div className={`${stageClass(progress, 0.23, 0.43)} story-amplifies`}>
            <p>02 / POSSIBILITÀ</p>
            <h2>L’algoritmo amplia{" "}<span>ciò che possiamo immaginare.</span></h2>
          </div>
          <div className={`${stageClass(progress, 0.45, 0.65)} story-connection`}>
            <p>03 / CONNESSIONE</p>
            <h2>Quando intuizione e calcolo{" "}<span>si incontrano, nasce una direzione.</span></h2>
          </div>
          <div className={`${stageClass(progress, 0.67, 0.85)} story-cooperate`}>
            <p>04 / SIGNIFICATO</p>
            <h2>Dati, simboli e sistemi{" "}<span>diventano significato.</span></h2>
          </div>
          <div className={`${stageClass(progress, 0.87, 1.01)} story-final`}>
            <h2>La tecnologia è lo strumento.{" "}<span>Il senso resta umano.</span></h2>
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
