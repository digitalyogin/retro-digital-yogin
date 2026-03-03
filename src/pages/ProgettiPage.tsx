import { useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ShuffleText } from "@/components/animation/ShuffleText";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { projects } from "@/content/projects/projects";
import { CrtTransition } from "@/components/CrtTransition";

const ProgettiPage = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useScrollAnimation(sectionRef);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [targetSlug, setTargetSlug] = useState<string | null>(null);

  const handleProjectClick = useCallback((slug: string) => {
    setTargetSlug(slug);
    setTransitioning(true);
  }, []);

  const handleTransitionComplete = useCallback(() => {
    setTransitioning(false);
    if (targetSlug) {
      navigate(`/progetti/${targetSlug}`);
    }
  }, [navigate, targetSlug]);

  return (
    <>
      <CrtTransition active={transitioning} onComplete={handleTransitionComplete} />
      <section ref={sectionRef} className="py-10 px-4 min-h-[calc(100vh-120px)]">
      <div
        className={`max-w-6xl mx-auto transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="mb-10 border-b-2 border-primary pb-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <ShuffleText
              as="h1"
              text="PROGETTI_COMPLETATI"
              className="text-3xl md:text-5xl font-bold text-primary text-glow"
            />
            <span className="text-muted-foreground text-sm">DATABASE_ARCHIVE</span>
          </div>
          <ShuffleText
            as="p"
            text="Archivio portfolio con animazioni retro e dettagli tecnici dei progetti rilasciati."
            className="text-muted-foreground mt-3"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="border border-primary bg-card p-6 hover:border-2 hover:border-accent transition-all group relative overflow-hidden cursor-pointer"
              style={{
                animationDelay: `${index * 0.15}s`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(30px)",
                transition: "all 0.6s ease-out",
                transformStyle: "preserve-3d",
              }}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
              onClick={() => handleProjectClick(project.slug)}
            >
              <div className="w-full h-48 overflow-hidden relative mb-5">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
                  }}
                />
                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply pointer-events-none" />
              </div>

              {hoveredProject === project.id && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-transparent" />
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-primary data-stream" />
                </div>
              )}

              <div className="flex items-start justify-between mb-4 gap-3">
                <div>
                  <div className="text-primary text-xs mb-1">{project.id}</div>
                  <ShuffleText
                    as="h2"
                    text={project.title}
                    className="text-xl font-bold text-foreground group-hover:text-primary transition-colors"
                  />
                </div>
                <div className="text-xs px-2 py-1 border border-primary text-primary">{project.year}</div>
              </div>

              <ShuffleText
                as="p"
                text={project.description}
                className="text-sm text-muted-foreground mb-4 leading-relaxed"
              />

              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-xs border border-primary/50 px-2 py-1 text-primary/80 hover:border-accent hover:text-accent transition-colors"
                    style={{
                      animationDelay: `${idx * 0.1}s`,
                      animation: hoveredProject === project.id ? "float 2s ease-in-out infinite" : "none",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-primary/30 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">CLIENT: {project.client}</span>
                <span className="text-primary text-xs group-hover:translate-x-1 transition-transform">{'>'} VIEW_DETAILS</span>
              </div>
              <a
                href={project.website}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-3 text-xs text-accent hover:text-primary transition-colors"
                onClick={(event) => event.stopPropagation()}
              >
                {">"} SITE: {project.website}
              </a>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-primary pt-6 text-center">
          <p className="text-muted-foreground text-sm">
            TOTAL_PROJECTS: {projects.length} :: LAST_UPDATE: {new Date().toLocaleDateString("it-IT")}
          </p>
        </div>
      </div>
      </section>
    </>
  );
};

export default ProgettiPage;
