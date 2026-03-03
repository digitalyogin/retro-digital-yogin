import { useUserPreferences } from "@/hooks/useUserPreferences";

type ToggleRowProps = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  description: string;
};

const ToggleRow = ({ label, value, onChange, description }: ToggleRowProps) => {
  return (
    <div className="border border-border p-4 space-y-2">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-primary font-terminal text-sm">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <button
          onClick={() => onChange(!value)}
          className={`px-3 py-1 border text-xs font-terminal transition-colors ${
            value
              ? "border-primary bg-primary/20 text-primary"
              : "border-border text-muted-foreground hover:border-primary hover:text-primary"
          }`}
        >
          {value ? "ON" : "OFF"}
        </button>
      </div>
    </div>
  );
};

const Settings = () => {
  const { preferences, updatePreferences, resetPreferences } = useUserPreferences();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4 py-8">
      <div className="w-full max-w-4xl border border-border bg-card p-8">
        <h1 className="text-2xl font-terminal text-primary text-glow mb-4">[09] SETTINGS</h1>
        <div className="space-y-4 text-muted-foreground font-terminal text-sm">
          <ToggleRow
            label="ANIMAZIONI"
            value={preferences.motionEnabled}
            onChange={(value) => updatePreferences({ motionEnabled: value })}
            description="Attiva o disattiva effetti di movimento su testi e UI dinamica."
          />

          <ToggleRow
            label="SOUND_FX"
            value={preferences.terminalSoundsEnabled}
            onChange={(value) => updatePreferences({ terminalSoundsEnabled: value })}
            description="Abilita feedback audio retro durante interazioni e comandi."
          />

          <ToggleRow
            label="GUIDA_SEMPLIFICATA"
            value={preferences.guidedModeDefault}
            onChange={(value) => updatePreferences({ guidedModeDefault: value })}
            description="Apri di default la modalita guidata nel Command Center."
          />

          <ToggleRow
            label="MOSTRA_HINT"
            value={preferences.showPersistentHint}
            onChange={(value) => updatePreferences({ showPersistentHint: value })}
            description="Mostra o nascondi il suggerimento rapido per nuovi utenti."
          />

          <div className="border border-border p-4 flex flex-wrap gap-3">
            <button
              onClick={() => updatePreferences({ onboardingSeen: false, showPersistentHint: true })}
              className="px-4 py-2 border border-primary text-primary hover:bg-primary/10 transition-colors"
            >
              RIVEDI_TUTORIAL
            </button>
            <button
              onClick={resetPreferences}
              className="px-4 py-2 border border-destructive text-destructive hover:bg-destructive/10 transition-colors"
            >
              RESET_PREFERENZE
            </button>
          </div>

          <p className="text-accent">{">"} Preferenze salvate in locale su questo browser.</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
