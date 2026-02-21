const About = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4 py-8">
      <div className="w-full max-w-4xl border border-border bg-card p-8">
        <h1 className="text-2xl font-terminal text-primary text-glow mb-4">[99] ABOUT</h1>
        <div className="space-y-4 text-muted-foreground font-terminal text-sm">
          <div className="border border-border p-4 space-y-2">
            <p className="text-primary text-lg">DIGITAL_YOGIN</p>
            <p>{">"} "La via di mezzo tra l'antico e il moderno"</p>
            <p>{">"} Agenzia digitale specializzata in analisi web,</p>
            <p>{">"} sviluppo e consulenza tecnologica.</p>
          </div>

          <div className="border border-border p-4 space-y-2">
            <p className="text-secondary">LOCATION:</p>
            <p>{">"} Padova, Italia</p>
            <p>{">"} Timezone: CET (UTC+1)</p>
          </div>

          <div className="border border-border p-4 space-y-2">
            <p className="text-secondary">SYSTEM_INFO:</p>
            <p>{">"} Version: 3.0</p>
            <p>{">"} Engine: Oracle AI</p>
            <p>{">"} Status: <span className="text-primary">OPERATIONAL</span></p>
          </div>

          <p className="text-center text-muted-foreground mt-6">
            © {new Date().getFullYear()} DIGITAL YOGIN :: ALL_RIGHTS_RESERVED
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
