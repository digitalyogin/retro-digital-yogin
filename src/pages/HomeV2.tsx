import { ArrowDown, ArrowUpRight, Braces, Code2, Compass, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import { projects } from "@/content/projects/projects";

const services = [
  {
    index: "01",
    title: "Strategia & Discovery",
    command: "> run ./discovery.sh",
    description: "Mettiamo alla prova l'idea, il contesto e gli obiettivi prima di trasformarli in tecnologia.",
    icon: Compass,
  },
  {
    index: "02",
    title: "App & Prodotti digitali",
    command: "> build ./mobile.app",
    description: "Progettiamo applicazioni native e cross-platform chiare, solide e pronte a crescere.",
    icon: Smartphone,
  },
  {
    index: "03",
    title: "Web Experience",
    command: "> deploy ./experience",
    description: "Siti, piattaforme ed e-commerce dove identità, contenuto e performance lavorano insieme.",
    icon: Code2,
  },
  {
    index: "04",
    title: "Evoluzione continua",
    command: "> iterate --with-care",
    description: "Accompagniamo il prodotto dopo il lancio con analisi, manutenzione e scelte sostenibili.",
    icon: Braces,
  },
];

const artifactLines = [
  ["keyword", "struct"], ["type", " DigitalVision"], ["plain", " {"],
  ["keyword", "\n  let"], ["plain", " purpose: "], ["type", "Purpose"],
  ["keyword", "\n  var"], ["plain", " technology: "], ["string", '"human_centered"'],
  ["keyword", "\n  var"], ["plain", " impact: "], ["string", '"measurable"'],
  ["plain", "\n\n  "], ["keyword", "func"], ["type", " bringToLife"], ["plain", "() {"],
  ["plain", "\n    question.assumptions()"],
  ["plain", "\n    design.withIntent()"],
  ["plain", "\n    build.forPeople()"],
  ["plain", "\n  }\n}"],
] as const;

const HomeV2 = () => {
  const featuredProjects = projects.slice(0, 4);

  return (
    <>
      <section className="dy-hero" aria-labelledby="home-title">
        <div className="dy-atmosphere" aria-hidden="true">
          <div className="dy-orbit dy-orbit-one" />
          <div className="dy-orbit dy-orbit-two" />
          <div className="dy-core" />
        </div>
        <div className="dy-hero-content">
          <p className="dy-eyebrow">DIGITAL CRAFT · HUMAN VISION</p>
          <h1 id="home-title">
            Diamo forma al tuo centro
            <span>nel rumore digitale</span>
          </h1>
          <p className="dy-hero-copy">
            Strategia, design e sviluppo per trasformare idee ambiziose in prodotti digitali utili, riconoscibili e sostenibili.
          </p>
          <div className="dy-hero-actions">
            <Link to="/contatti" className="dy-button dy-button-primary">Inizia un progetto <ArrowUpRight size={15} /></Link>
            <a href="#filosofia" className="dy-button dy-button-ghost">Scopri il metodo</a>
          </div>
        </div>
        <a className="dy-depth-cue" href="#filosofia" aria-label="Vai alla filosofia">
          <span>SCENDI IN PROFONDITÀ</span>
          <ArrowDown size={14} />
        </a>
      </section>

      <section id="filosofia" className="dy-section dy-philosophy">
        <div className="dy-section-index">01 / FILOSOFIA</div>
        <div className="dy-philosophy-mark" aria-hidden="true">⌁</div>
        <p className="dy-philosophy-lead">La tecnologia non dovrebbe aggiungere altro rumore.</p>
        <p className="dy-philosophy-accent">Dovrebbe creare chiarezza, possibilità e movimento.</p>
        <p className="dy-philosophy-copy">
          Digital Yogin è il punto d'incontro tra pensiero strategico e realizzazione tecnica. Ascoltiamo, analizziamo e mettiamo in discussione ogni idea prima di scrivere la prima riga di codice.
        </p>
      </section>

      <section className="dy-section dy-artifact-section" aria-labelledby="artifact-title">
        <div className="dy-section-heading">
          <div><span>02 / IL METODO</span><h2 id="artifact-title">Prima il senso.<br />Poi il software.</h2></div>
          <p>Un processo rigoroso, senza perdere la capacità di vedere ciò che ancora non esiste.</p>
        </div>
        <div className="dy-editor">
          <div className="dy-editor-bar">
            <div className="dy-window-dots"><span /><span /><span /></div>
            <span>DigitalVision.swift</span>
            <span className="dy-live"><i /> LIVE</span>
          </div>
          <div className="dy-editor-body">
            <div className="dy-line-numbers" aria-hidden="true">1<br />2<br />3<br />4<br />5<br />6<br />7<br />8<br />9<br />10<br />11</div>
            <pre aria-label="Esempio del metodo Digital Yogin"><code>{artifactLines.map(([kind, text], index) => <span key={index} className={`syntax-${kind}`}>{text}</span>)}</code></pre>
          </div>
          <div className="dy-editor-status"><span>main*</span><span>UTF-8 · Swift · Intentional</span></div>
        </div>
      </section>

      <section id="servizi" className="dy-section dy-services" aria-labelledby="services-title">
        <div className="dy-section-heading">
          <div><span>03 / CAPACITÀ</span><h2 id="services-title">Dall'intuizione<br />al prodotto.</h2></div>
          <p>Competenze diverse, orchestrate come un unico percorso: capire, progettare, costruire, evolvere.</p>
        </div>
        <div className="dy-service-grid">
          {services.map(({ index, title, command, description, icon: Icon }) => (
            <article className="dy-service-card" key={index}>
              <div className="dy-service-top"><span>{index}</span><Icon size={24} strokeWidth={1.4} /></div>
              <h3>{title}</h3><code>{command}</code><p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="portfolio" className="dy-section dy-portfolio" aria-labelledby="portfolio-title">
        <div className="dy-archive-title">
          <span>04 / PROGETTI SELEZIONATI</span>
          <h2 id="portfolio-title">Progetti reali.<br /><em>Impatto concreto.</em></h2>
        </div>
        <div className="dy-project-grid">
          {featuredProjects.map((project) => (
            <Link to={`/progetti/${project.slug}`} className="dy-project-card" key={project.id}>
              <div className="dy-project-image"><img src={project.image} alt={`Anteprima del progetto ${project.title.replaceAll("_", " ")} per ${project.client}`} loading="lazy" width="720" height="480" /><span>{project.id}</span></div>
              <div className="dy-project-content">
                <div className="dy-project-meta"><span>{project.client}</span><span>{project.year}</span></div>
                <h3>{project.title.replaceAll("_", " ")}</h3><p>{project.description}</p>
                <div className="dy-tags">{project.tech.slice(0, 4).map((tech) => <span key={tech}>[{tech}]</span>)}</div>
              </div>
            </Link>
          ))}
        </div>
        <Link to="/progetti" className="dy-archive-link">APRI_ARCHIVIO_COMPLETO <ArrowUpRight size={15} /></Link>
      </section>

      <section className="dy-cta">
        <p className="dy-eyebrow">READY WHEN YOU ARE</p>
        <h2>Costruiamo qualcosa<br /><em>che abbia senso.</em></h2>
        <p>Raccontaci dove vuoi arrivare. Ti aiuteremo a trovare il percorso digitale più solido per farlo.</p>
        <Link to="/contatti" className="dy-button dy-button-primary">Avvia la conversazione <ArrowUpRight size={15} /></Link>
      </section>

    </>
  );
};

export default HomeV2;
