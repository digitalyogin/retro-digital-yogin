const FullReport = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4 py-8">
      <div className="w-full max-w-4xl border border-border bg-card p-8">
        <h1 className="text-2xl font-terminal text-primary text-glow mb-4">[02] FULL_REPORT</h1>
        <div className="space-y-4 text-muted-foreground font-terminal text-sm">
          <p>{">"} Esegui prima un Quick Scan dalla sezione [01].</p>
          <p>{">"} Il Full Report espanderà l'analisi con:</p>
          <div className="border border-border p-4 space-y-2">
            <p className="text-secondary">[1] RISK_SCORE dettagliato</p>
            <p className="text-secondary">[2] REDIRECT_CHAIN completa</p>
            <p className="text-secondary">[3] DOMAIN / SSL / WHOIS summary</p>
            <p className="text-secondary">[4] RECOMMENDATIONS personalizzate</p>
          </div>
          <p className="text-accent mt-4">{">"} Funzionalità in arrivo. Usa [01] per il Quick Scan.</p>
        </div>
      </div>
    </div>
  );
};

export default FullReport;
