import { useNavigate } from "react-router-dom";

const History = () => {
  const navigate = useNavigate();

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
          <div className="border border-border p-4 space-y-3">
            <p className="text-secondary">{">"} Vuoi esportare? Usa il pulsante qui sotto.</p>
            <button
              onClick={() => navigate("/04")}
              className="px-4 py-2 border border-primary bg-primary/15 text-primary hover:bg-primary/25 transition-colors font-terminal text-xs"
            >
              [04] EXPORT REPORT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
