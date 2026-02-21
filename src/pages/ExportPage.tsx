const ExportPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4 py-8">
      <div className="w-full max-w-4xl border border-border bg-card p-8">
        <h1 className="text-2xl font-terminal text-primary text-glow mb-4">[04] EXPORT</h1>
        <div className="space-y-3 text-muted-foreground font-terminal text-sm">
          <p>{">"} Esporta i risultati delle tue analisi.</p>
          <div className="border border-border p-4 space-y-2">
            <p className="text-secondary">[T] Esporta come .TXT</p>
            <p className="text-secondary">[J] Esporta come .JSON</p>
            <p className="text-secondary">[P] Esporta come .PDF</p>
          </div>
          <p className="text-accent mt-4">{">"} Esegui prima un'analisi dalla sezione [01].</p>
        </div>
      </div>
    </div>
  );
};

export default ExportPage;
