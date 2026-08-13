import { PublicCTA } from "@/components/public/PublicCTA";
import { PublicPageHero } from "@/components/public/PublicPageHero";

const ChiSiamo = () => (
  <div className="public-page">
    <PublicPageHero
      eyebrow="IDENTITÀ · METODO · RELAZIONE"
      title="Tecnologia con"
      accent="intenzione."
      introduction="Digital Yogin unisce pensiero strategico, sensibilità progettuale e ingegneria software per dare forma a prodotti digitali utili e sostenibili."
    />
    <section className="public-page-section public-about-grid">
      <div className="public-editorial-lead">
        <p className="dy-eyebrow">IL NOSTRO CENTRO</p>
        <h2>Prima comprendiamo.<br /><em>Poi costruiamo.</em></h2>
      </div>
      <div className="public-editorial-copy">
        <p>Non partiamo dalla tecnologia, ma dal problema reale, dalle persone coinvolte e dal valore che il prodotto deve generare.</p>
        <p>Strategia, design e sviluppo non sono fasi isolate: lavorano insieme per ridurre l'incertezza e trasformare una visione in un sistema concreto.</p>
      </div>
      <article><span>01</span><h3>Strategia</h3><p>Definiamo obiettivi, priorità e vincoli prima di investire nella soluzione.</p></article>
      <article><span>02</span><h3>Design</h3><p>Progettiamo esperienze comprensibili, riconoscibili e coerenti con l'identità del prodotto.</p></article>
      <article><span>03</span><h3>Sviluppo</h3><p>Costruiamo software solido, misurabile e predisposto a evolvere senza perdere chiarezza.</p></article>
      <article><span>04</span><h3>Accompagnamento</h3><p>Restiamo accanto al progetto dopo il rilascio, osservando dati, uso reale e nuove opportunità.</p></article>
    </section>
    <PublicCTA title="Costruiamo una relazione, non solo un rilascio." />
  </div>
);

export default ChiSiamo;
