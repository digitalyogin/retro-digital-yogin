import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

type PublicCTAProps = {
  title?: string;
  text?: string;
};

export const PublicCTA = ({
  title = "Portiamo il progetto al prossimo passo.",
  text = "Condividi obiettivi, vincoli e contesto: costruiremo insieme un percorso concreto.",
}: PublicCTAProps) => (
  <section className="public-page-cta" aria-labelledby="public-cta-title">
    <p className="dy-eyebrow">READY WHEN YOU ARE</p>
    <h2 id="public-cta-title">{title}</h2>
    <p>{text}</p>
    <Link to="/contatti" className="dy-button dy-button-primary">Parliamone <ArrowUpRight size={15} /></Link>
  </section>
);
