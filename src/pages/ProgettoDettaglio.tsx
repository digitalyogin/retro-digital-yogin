import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { PublicCTA } from "@/components/public/PublicCTA";
import { projects } from "@/content/projects/projects";

const ProgettoDettaglio = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return (
      <div className="public-page public-empty-state">
        <p className="dy-eyebrow">PROGETTO NON TROVATO</p>
        <h1>Questo case study non è disponibile.</h1>
        <Link to="/progetti" className="dy-button dy-button-primary"><ArrowLeft size={15} /> Torna ai progetti</Link>
      </div>
    );
  }

  const title = project.title.replaceAll("_", " ");
  return (
    <div className="public-page">
      <article className="public-case-study">
        <Link to="/progetti" className="public-back-link"><ArrowLeft size={15} /> Tutti i progetti</Link>
        <header className="public-case-hero">
          <div>
            <p className="dy-eyebrow">{project.client} · {project.year}</p>
            <h1>{title}</h1>
            <p>{project.description}</p>
          </div>
          <div className="public-case-image">
            <img src={project.image} alt={`Progetto ${title} per ${project.client}`} width="1014" height="677" />
          </div>
        </header>

        <section className="public-case-summary" aria-label="Riepilogo progetto">
          <div><span>Cliente</span><strong>{project.client}</strong></div>
          <div><span>Anno</span><strong>{project.year}</strong></div>
          <div><span>Stato</span><strong>{project.status}</strong></div>
          <a href={project.website} target="_blank" rel="noopener noreferrer">Visita il sito <ExternalLink size={14} /></a>
        </section>

        <div className="public-case-content">
          <section>
            <p className="dy-eyebrow">IL PROGETTO</p>
            <h2>Dal contesto alla soluzione.</h2>
            {project.fullDescription.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>
          <aside>
            <div><p className="dy-eyebrow">SERVIZI</p><ul>{project.services.map((service) => <li key={service}>{service}</li>)}</ul></div>
            <div><p className="dy-eyebrow">STACK</p><div className="public-tag-list">{project.tech.map((tech) => <span key={tech}>{tech}</span>)}</div></div>
          </aside>
        </div>
      </article>
      <PublicCTA title="Hai una sfida simile?" text="Mettiamo a fuoco il problema e costruiamo il percorso più adatto per risolverlo." />
    </div>
  );
};

export default ProgettoDettaglio;
