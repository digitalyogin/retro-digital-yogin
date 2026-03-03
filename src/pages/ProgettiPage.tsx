import { ShuffleText } from "@/components/animation/ShuffleText";

const projects = [
  {
    code: "PRJ-101",
    title: "Portale Servizi Territoriali",
    description:
      "Piattaforma modulare per gestione richieste cittadini con dashboard operativa e flussi approvativi tracciati.",
  },
  {
    code: "PRJ-214",
    title: "E-commerce Omnicanale",
    description:
      "Sistema commercio digitale con sincronizzazione catalogo, logistica integrata e monitoraggio conversioni multi-canale.",
  },
  {
    code: "PRJ-330",
    title: "Hub Formazione Aziendale",
    description:
      "Ambiente LMS custom con contenuti dinamici, reporting avanzato e strumenti di valutazione per team distribuiti.",
  },
];

const ProgettiPage = () => {
  return (
    <div className="min-h-[calc(100vh-120px)] px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <ShuffleText
          as="h1"
          text="PROGETTI"
          className="text-3xl md:text-5xl font-bold text-primary text-glow font-terminal"
        />
        <ShuffleText
          as="p"
          text="Una selezione di progetti orientati a impatto, prestazioni e manutenibilita a lungo termine."
          className="text-lg text-muted-foreground"
        />

        <div className="grid md:grid-cols-3 gap-4">
          {projects.map((project) => (
            <article key={project.code} className="border border-border bg-card p-5 space-y-3">
              <p className="text-xs text-primary">{project.code}</p>
              <ShuffleText
                as="h2"
                text={project.title}
                className="text-xl text-secondary font-terminal"
              />
              <ShuffleText
                as="p"
                text={project.description}
                className="text-sm text-foreground/90 leading-relaxed"
              />
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgettiPage;
