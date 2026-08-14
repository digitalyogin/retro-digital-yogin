import { ScrollStoryHero } from "@/components/public/ScrollStoryHero";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import "@/styles/scroll-story.css";

const capabilities = [
  ["01", "Strategia", "Posizionamento, ricerca e architettura del progetto."],
  ["02", "Identità & Design", "Brand, UX/UI e sistemi visivi coerenti e riconoscibili."],
  ["03", "Web & Prodotti digitali", "Siti, piattaforme e interfacce progettate per essere utili e durare."],
  ["04", "Evoluzione", "Ottimizzazione, contenuti e accompagnamento dopo il lancio."],
] as const;

const ScrollStoryLab = () => (
  <div className="scroll-story-lab">
    <ScrollStoryHero />
    <section className="scroll-story-after" aria-labelledby="after-story-title">
      <header className="scroll-story-after-heading">
        <p>05 / COSA FACCIAMO</p>
        <h2 id="after-story-title">Trasformiamo idee complesse<br />in esperienze digitali chiare.</h2>
        <div>
          <p>Uniamo strategia, identità, design e sviluppo per costruire prodotti digitali utili, riconoscibili e capaci di evolvere.</p>
          <Link to="/contatti">PARLIAMO DEL TUO PROGETTO <ArrowUpRight size={15} /></Link>
        </div>
      </header>
      <div className="scroll-story-capabilities">
        {capabilities.map(([number, title, description]) => (
          <article key={number}>
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>
    </section>
  </div>
);

export default ScrollStoryLab;
