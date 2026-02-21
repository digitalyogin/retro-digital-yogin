const Settings = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4 py-8">
      <div className="w-full max-w-4xl border border-border bg-card p-8">
        <h1 className="text-2xl font-terminal text-primary text-glow mb-4">[09] SETTINGS</h1>
        <div className="space-y-4 text-muted-foreground font-terminal text-sm">
          <div className="border border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span>THEME:</span>
              <span className="text-primary">PHOSPHOR_GREEN</span>
            </div>
            <div className="flex items-center justify-between">
              <span>SCANLINES:</span>
              <span className="text-primary">ON</span>
            </div>
            <div className="flex items-center justify-between">
              <span>SOUND_FX:</span>
              <span className="text-accent">OFF</span>
            </div>
            <div className="flex items-center justify-between">
              <span>LANGUAGE:</span>
              <span className="text-primary">IT</span>
            </div>
          </div>
          <p className="text-accent">{">"} Configurazione avanzata in arrivo.</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
