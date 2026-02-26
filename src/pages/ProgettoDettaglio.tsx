import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { projects } from "@/lib/projectsData";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { CrtTransition } from "@/components/CrtTransition";

const ProgettoDettaglio = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const project = projects.find((p) => p.slug === slug);
  const [loaded, setLoaded] = useState(false);
  const [goingBack, setGoingBack] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleBack = useCallback(() => {
    setGoingBack(true);
  }, []);

  const handleBackComplete = useCallback(() => {
    setGoingBack(false);
    navigate("/03");
  }, [navigate]);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4 py-8">
        <div className="w-full max-w-3xl border border-border bg-card p-8 text-center">
          <h1 className="text-2xl font-terminal text-destructive mb-4">[ERR] PROGETTO_NON_TROVATO</h1>
          <p className="text-muted-foreground font-terminal mb-6">{">"} Il progetto richiesto non esiste nel database.</p>
          <button onClick={() => navigate("/03")} className="border border-primary text-primary px-4 py-2 font-terminal hover:bg-primary hover:text-primary-foreground transition-colors">
            {"<"} TORNA_AI_PROGETTI
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <CrtTransition active={goingBack} onComplete={handleBackComplete} />
      <div
        className={`flex flex-col items-center min-h-[calc(100vh-120px)] px-4 py-8 transition-all duration-700 ${
          loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{
          animation: loaded ? "crt-power-on 0.6s ease-out" : "none",
        }}
      >
        <div className="w-full max-w-3xl">
          {/* Back */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-muted-foreground font-terminal mb-6 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {"<"} BACK_TO_PROJECTS
          </button>

          {/* Hero Image */}
          <div className="border border-border mb-6 overflow-hidden relative">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute inset-0 pointer-events-none" style={{
              background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)",
            }} />
            <div className="absolute inset-0 bg-primary/5 mix-blend-multiply pointer-events-none" />
          </div>

          {/* Header */}
          <div className="border border-border bg-card p-8 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-primary text-xs font-terminal">{project.id}</span>
                <h1 className="text-3xl md:text-4xl font-terminal text-primary text-glow mt-1">{project.title}</h1>
              </div>
              <span className="text-xs px-2 py-1 border border-primary text-primary font-terminal">{project.status}</span>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 border-t border-border pt-6">
              <div>
                <span className="text-xs text-muted-foreground font-terminal block mb-1">CLIENT</span>
                <span className="text-foreground font-terminal">{project.client}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground font-terminal block mb-1">YEAR</span>
                <span className="text-foreground font-terminal">{project.year}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground font-terminal block mb-1">WEBSITE</span>
                <a href={project.website} target="_blank" rel="noopener noreferrer" className="text-secondary font-terminal flex items-center gap-1 hover:text-primary transition-colors">
                  Link <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="border border-border bg-card p-6 mb-6">
            <h2 className="text-lg font-terminal text-primary mb-3">[SERVIZI]</h2>
            <ul className="space-y-2">
              {project.services.map((s, i) => (
                <li key={i} className="text-muted-foreground font-terminal text-2xl flex items-start gap-2">
                  <span className="text-primary">{">"}</span> {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Description */}
          <div className="border border-border bg-card p-6 mb-6">
            <h2 className="text-lg font-terminal text-primary mb-3">[DETTAGLI]</h2>
            <div className="space-y-4">
              {project.fullDescription.map((p, i) => (
                <p key={i} className="text-muted-foreground font-terminal text-2xl leading-relaxed">
                  <span className="text-primary">{">"}</span> {p}
                </p>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="border border-border bg-card p-6">
            <h2 className="text-lg font-terminal text-primary mb-3">[TECH_STACK]</h2>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t, i) => (
                <span key={i} className="text-xs border border-primary/50 px-3 py-1 text-primary/80 font-terminal">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProgettoDettaglio;
