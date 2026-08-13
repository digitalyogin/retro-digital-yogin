import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Project } from "@/content/projects/projects";

export const ProjectCard = ({ project }: { project: Project }) => {
  const title = project.title.replaceAll("_", " ");
  return (
    <article className="public-project-card">
      <Link to={`/progetti/${project.slug}`} className="public-card-image" aria-label={`Apri il progetto ${title}`}>
        <img src={project.image} alt={`Anteprima del progetto ${title} per ${project.client}`} loading="lazy" width="1014" height="677" />
      </Link>
      <div className="public-card-body">
        <div className="public-card-meta"><span>{project.client}</span><time>{project.year}</time></div>
        <h2><Link to={`/progetti/${project.slug}`}>{title}</Link></h2>
        <p>{project.description}</p>
        <div className="public-tag-list" aria-label="Tecnologie">
          {project.tech.map((tech) => <span key={tech}>{tech}</span>)}
        </div>
        <Link to={`/progetti/${project.slug}`} className="public-text-link">Leggi il case study <ArrowUpRight size={14} /></Link>
      </div>
    </article>
  );
};
