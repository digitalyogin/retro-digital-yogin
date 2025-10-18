import { ExternalLink } from "lucide-react";

const projects = [
  {
    title: "HOYA_VISION",
    description: "Creazione app in Flutter per entrambi le piattaforme iOS e Android con database integrato e gestionale lato azienda.",
    client: "HOYA Vision Care Europe",
    color: "primary"
  },
  {
    title: "MIGRANT",
    description: "Creazione app ibrida multilingua e relativo gestionale per il servizio del ricollocamento dei migranti per la Regione Marche.",
    client: "Regione Marche",
    color: "secondary"
  },
  {
    title: "BUONAPPE",
    description: "Sviluppo app nativa iOS e Android per il mondo della ristorazione e tutto quello che concerne il mondo del take away & delivery.",
    client: "Buonappe",
    color: "accent"
  },
  {
    title: "WE-BOLD",
    description: "Progetto per la gestione di società e collaboratori sportivi tramite gestionale webapp creato ad hoc con React e Firebase.",
    client: "WeBold srl",
    color: "primary"
  },
  {
    title: "FTO-REMOTEFLY",
    description: "Progetto di rebranding e creazione del sito web responsive con animazioni in CSS e Javascript.",
    client: "FTO REMOTEFLY SRL",
    color: "secondary"
  },
  {
    title: "FUROR_DI_VINO",
    description: "Progetto di branding completo e sviluppo ecommerce in Shopify con app di terze parti per vendita e logistica.",
    client: "Furor di Vino",
    color: "accent"
  }
];

export const Projects = () => {
  return (
    <section className="py-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-glow">
            {'<'} PROGETTI {'>'}
          </h2>
          <div className="text-sm text-muted-foreground">
            <span className="animate-pulse">▓</span> LOADING_PORTFOLIO.DAT
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <div
              key={idx}
              className={`border-2 border-${project.color} p-6 bg-card hover:bg-muted/50 transition-all group relative overflow-hidden`}
              style={{
                borderColor: `hsl(var(--${project.color}))`
              }}
            >
              <div className="absolute top-2 right-2 text-xs opacity-50">
                [{String(idx + 1).padStart(2, '0')}]
              </div>
              
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-glow">
                {project.title}
              </h3>
              
              <p className="text-sm md:text-base mb-4 text-muted-foreground">
                {project.description}
              </p>
              
              <div className={`text-xs md:text-sm border border-${project.color}/30 px-3 py-2 inline-block mb-4`}>
                CLIENT: <span className={`text-${project.color}`}>{project.client}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm group-hover:text-primary transition-colors cursor-pointer">
                <ExternalLink className="w-4 h-4" />
                <span>VIEW_PROJECT</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
