import { ScrollStoryHero } from "@/components/public/ScrollStoryHero";
import "@/styles/scroll-story.css";

const ScrollStoryLab = () => (
  <div className="scroll-story-lab">
    <ScrollStoryHero />
    <section className="scroll-story-after" aria-labelledby="after-story-title">
      <p>03 / DAL SENSO ALLA FORMA</p>
      <h2 id="after-story-title">La direzione è il primo<br />atto di progetto.</h2>
      <span>Prototipo isolato · Digital Yogin</span>
    </section>
  </div>
);

export default ScrollStoryLab;
