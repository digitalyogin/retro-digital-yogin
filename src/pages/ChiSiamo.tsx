const ChiSiamo = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4 py-8">
      <div className="w-full max-w-4xl border border-border bg-card p-8 space-y-6">
        <h1 className="text-2xl font-terminal text-primary text-glow mb-4">[02] CHI_SIAMO</h1>

        <div className="space-y-4 text-muted-foreground font-terminal text-2xl">
          {/* Headline */}
          <div className="border border-border p-4">
            <p className="text-primary text-lg leading-relaxed">
              {">"} C'è sempre un modo migliore per fare una cosa.
            </p>
          </div>

          {/* Intro team */}
          <div className="border border-border p-4 space-y-3">
            <p className="text-secondary">TEAM:</p>
            <p>
              {">"} Siamo un team di analisti, programmatori, designer, esperti di comunicazione e specialisti del marketing digitale. Siamo multidisciplinari e super specializzati, sempre pronti a metterci in discussione.
            </p>
            <p>
              {">"} Veniamo da ogni parte del mondo e il nostro è un ambiente di lavoro valoriale e dal know-how multiculturale, dove apertura e inclusione sono di default.
            </p>
          </div>

          {/* Metodo */}
          <div className="border border-border p-4 space-y-3">
            <p className="text-secondary">METODO:</p>
            <p>
              {">"} La nostra metodologia di lavoro orientata agli obiettivi (OKR oriented), prevede un alto coinvolgimento del cliente in tutti i processi e utilizza un approccio flessibile al lavoro di gruppo, per concentrarsi sul miglioramento continuo (metodo Agile).
            </p>
            <p>
              {">"} Ogni nostro progetto è una relazione a lungo termine, che non si conclude una volta pubblicati il tuo sito o la tua app. Mettiamo a disposizione il nostro know-how per un continuo miglioramento del processo, offrendoti un partner affidabile, preciso ed efficiente.
            </p>
            <p>
              {">"} Lavoriamo con entusiasmo, intuito, creatività, passione e divertimento per ascoltare i tuoi bisogni e tradurli in risposte digitali.
            </p>
          </div>

          {/* Chi siamo */}
          <div className="border border-border p-4 space-y-3">
            <p className="text-secondary">ORIGIN:</p>
            <p className="text-primary">
              {">"} Digital Yogin nasce nel 2014 e non è una semplice digital agency.
            </p>
            <p>
              {">"} Vogliamo essere una guida per i clienti che si affidano a noi, un partner digitale che accompagna l'azienda nella sua crescita passo dopo passo, fino a vederla camminare sulle sue gambe.
            </p>
            <p>
              {">"} Abbiamo un approccio multiculturale, basato sulla diversità e sull'unione di diverse culture, visioni e conoscenze.
            </p>
            <p>
              {">"} Diamo valore a ogni progetto creando qualcosa di nuovo e unico. Lavoriamo con i clienti in modo olistico, focalizzandoci non solo sulla vendita ma soprattutto sull'esperienza della collaborazione.
            </p>
            <p>
              {">"} Con noi ogni cliente non realizza solo un progetto, ma un percorso di crescita personale e aziendale.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChiSiamo;
