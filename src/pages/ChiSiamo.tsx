const ChiSiamo = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4 py-8">
      <div className="w-full max-w-4xl border border-border bg-card p-8">
        <h1 className="text-2xl font-terminal text-primary text-glow mb-4">[02] CHI_SIAMO</h1>
        <div className="space-y-4 text-muted-foreground font-terminal text-sm">
          <div className="border border-border p-4 space-y-2">
            <p className="text-primary text-lg">DIGITAL_YOGIN</p>
            <p>{">"} "La via di mezzo tra l'antico e il moderno"</p>
            <p>{">"} Agenzia digitale specializzata in analisi web,</p>
            <p>{">"} sviluppo e consulenza tecnologica.</p>
          </div>

          <div className="border border-border p-4 space-y-2">
            <p className="text-secondary">MISSION:</p>
            <p>{">"} Combinare tradizione e innovazione per creare</p>
            <p>{">"} soluzioni digitali su misura.</p>
          </div>

          <div className="border border-border p-4 space-y-2">
            <p className="text-secondary">TEAM:</p>
            <p>{">"} Professionisti del web con esperienza in</p>
            <p>{">"} sviluppo, design e strategia digitale.</p>
          </div>

          <div className="border border-border p-4 space-y-2">
            <p className="text-secondary">LOCATION:</p>
            <p>{">"} Padova, Italia</p>
            <p>{">"} Timezone: CET (UTC+1)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChiSiamo;
