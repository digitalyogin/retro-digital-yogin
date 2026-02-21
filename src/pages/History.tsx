const History = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4 py-8">
      <div className="w-full max-w-4xl border border-border bg-card p-8">
        <h1 className="text-2xl font-terminal text-primary text-glow mb-4">[03] HISTORY</h1>
        <div className="space-y-3 text-muted-foreground font-terminal text-sm">
          <p>{">"} Cronologia delle analisi eseguite.</p>
          <div className="border border-border p-4">
            <p className="text-accent">{">"} Nessuna analisi in archivio.</p>
            <p className="text-muted-foreground mt-2">{">"} Esegui un Quick Scan [01] per popolare la cronologia.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
