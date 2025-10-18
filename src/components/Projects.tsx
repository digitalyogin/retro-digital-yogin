import { ExternalLink } from "lucide-react";

const projects = [
  {
    id: "PRJ_001",
    title: "E-COMMERCE_PLATFORM",
    description: "Piattaforma di vendita online completa con gestione prodotti, carrello e pagamenti integrati",
    client: "RETAIL_CLIENT_A",
    status: "DEPLOYED",
    tech: ["React", "Node.js", "PostgreSQL"]
  },
  {
    id: "PRJ_002",
    title: "MOBILE_APP_FITNESS",
    description: "Applicazione mobile per tracking allenamenti e nutrizione con integrazione wearables",
    client: "HEALTH_CORP_B",
    status: "IN_PRODUCTION",
    tech: ["React Native", "Firebase", "GraphQL"]
  },
  {
    id: "PRJ_003",
    title: "CORPORATE_WEBSITE",
    description: "Sito web aziendale multilingua con CMS personalizzato e sistema di prenotazioni",
    client: "ENTERPRISE_C",
    status: "DEPLOYED",
    tech: ["Next.js", "Strapi", "AWS"]
  },
  {
    id: "PRJ_004",
    title: "BOOKING_SYSTEM",
    description: "Sistema di prenotazione online per strutture ricettive con gestione disponibilità real-time",
    client: "HOSPITALITY_D",
    status: "IN_DEVELOPMENT",
    tech: ["Vue.js", "Laravel", "MySQL"]
  },
  {
    id: "PRJ_005",
    title: "ANALYTICS_DASHBOARD",
    description: "Dashboard interattiva per analisi dati e visualizzazione KPI aziendali in tempo reale",
    client: "FINTECH_E",
    status: "DEPLOYED",
    tech: ["React", "D3.js", "Python"]
  },
  {
    id: "PRJ_006",
    title: "SOCIAL_PLATFORM",
    description: "Piattaforma social di nicchia con sistema di messaggistica e content sharing",
    client: "STARTUP_F",
    status: "BETA",
    tech: ["React", "Socket.io", "MongoDB"]
  }
];

export const Projects = () => {
  return (
    <section className="py-20 px-4 border-t-2 border-primary relative z-10">
      <div className="max-w-6xl mx-auto">
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
          {projects.map((project) => (
            <div 
              key={project.id}
              className="border border-primary bg-card p-6 hover:border-2 transition-all group"
            >
              {/* Project Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-primary text-xs mb-1">{project.id}</div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                </div>
                <div className={`text-xs px-2 py-1 border ${
                  project.status === 'DEPLOYED' ? 'border-primary text-primary' :
                  project.status === 'IN_PRODUCTION' ? 'border-accent text-accent' :
                  project.status === 'BETA' ? 'border-secondary text-secondary' :
                  'border-muted-foreground text-muted-foreground'
                }`}>
                  {project.status}
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
                    className="text-xs border border-primary/50 px-2 py-1 text-primary/80"
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
