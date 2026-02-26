import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { projects } from "@/lib/projectsData";

export const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useScrollAnimation(sectionRef);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <section ref={sectionRef} id="progetti" className="py-20 px-4 border-t-2 border-primary relative z-10">
      <div className={`max-w-6xl mx-auto transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        {/* Section Header */}
        <div className="mb-12 border-b-2 border-primary pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl md:text-6xl font-bold text-primary text-glow">
              PROGETTI_COMPLETATI
            </h2>
            <span className="text-muted-foreground text-sm">DATABASE_ARCHIVE</span>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <div 
              key={project.id}
              onClick={() => navigate(`/03/${project.slug}`)}
              className="border border-primary bg-card p-6 hover:border-2 hover:border-accent transition-all group relative overflow-hidden cursor-pointer"
              style={{ 
                animationDelay: `${index * 0.15}s`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.6s ease-out',
                transformStyle: 'preserve-3d'
              }}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              {/* Holographic overlay */}
              {hoveredProject === project.id && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-transparent" />
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-primary data-stream" />
                </div>
              )}
              {/* Project Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-primary text-xs mb-1">{project.id}</div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                </div>
                <div className="text-xs px-2 py-1 border border-primary text-primary">
                  {project.year}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {project.description}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((tech, idx) => (
                  <span 
                    key={idx}
                    className="text-xs border border-primary/50 px-2 py-1 text-primary/80 hover:border-accent hover:text-accent transition-colors"
                    style={{
                      animationDelay: `${idx * 0.1}s`,
                      animation: hoveredProject === project.id ? 'float 2s ease-in-out infinite' : 'none'
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Client */}
              <div className="pt-4 border-t border-primary/30 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  CLIENT: {project.client}
                </span>
                <span className="text-primary text-xs group-hover:translate-x-1 transition-transform">
                  {'>'} VIEW_DETAILS
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Archive Footer */}
        <div className="mt-12 border-t border-primary pt-6 text-center">
          <p className="text-muted-foreground text-sm">
            TOTAL_PROJECTS: {projects.length} :: LAST_UPDATE: {new Date().toLocaleDateString('it-IT')}
          </p>
        </div>
      </div>
    </section>
  );
};
