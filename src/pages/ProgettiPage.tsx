import { ProjectCard } from "@/components/public/ProjectCard";
import { PublicCTA } from "@/components/public/PublicCTA";
import { PublicPageHero } from "@/components/public/PublicPageHero";
import { projects } from "@/content/projects/projects";

const ProgettiPage = () => (
  <div className="public-page">
    <PublicPageHero
      eyebrow={`${String(projects.length).padStart(2, "0")} / PROGETTI REALI`}
      title="Prodotti costruiti per"
      accent="generare valore."
      introduction="Una selezione completa di applicazioni, piattaforme ed esperienze digitali sviluppate per organizzazioni, imprese e nuovi servizi."
    />
    <section className="public-page-section public-project-grid" aria-label="Archivio progetti">
      {projects.map((project) => <ProjectCard project={project} key={project.id} />)}
    </section>
    <PublicCTA title="Il prossimo progetto può partire da qui." />
  </div>
);

export default ProgettiPage;
