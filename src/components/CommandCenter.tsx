import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Terminal, X, ChevronUp, ChevronDown } from "lucide-react";
import { useUserPreferences } from "@/hooks/useUserPreferences";

type NavItem = {
  code: string;
  label: string;
  path: string;
};

type CommandCenterProps = {
  navItems: NavItem[];
  onNavigate: (path: string) => void;
};

type TerminalLog = {
  type: "input" | "output" | "error" | "success";
  text: string;
};

type TabMode = "guided" | "terminal";

const QUICK_ACTIONS = [
  { label: "Vai a Quick Scan", path: "/", detail: "Apri analisi rapida URL" },
  { label: "Parla con AI Guide", path: "/", detail: "Apri assistenza guidata su Lovable AI" },
  { label: "Vai ai Progetti", path: "/progetti", detail: "Consulta portfolio e casi d'uso" },
  { label: "Vai ai Contatti", path: "/contatti", detail: "Invia una richiesta in pochi passaggi" },
  { label: "Vai al Blog", path: "/blog", detail: "Leggi guide e approfondimenti" },
  { label: "Apri Settings", path: "/09", detail: "Configura esperienza e preferenze" },
];

export const CommandCenter = ({ navItems, onNavigate }: CommandCenterProps) => {
  const { preferences } = useUserPreferences();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<TabMode>(preferences.guidedModeDefault ? "guided" : "terminal");
  const [terminalInput, setTerminalInput] = useState("");
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const commandMap = useMemo(() => {
    const map = new Map<string, string>();
    navItems.forEach((item) => {
      map.set(item.code, item.path);
      map.set(item.label.toLowerCase(), item.path);
    });
    map.set("home", "/");
    map.set("quickscan", "/");
    map.set("quick_scan", "/");
    map.set("settings", "/09");
    map.set("blog", "/blog");
    map.set("progetti", "/progetti");
    map.set("contatti", "/contatti");
    map.set("chi-siamo", "/chi-siamo");
    map.set("ai", "/");
    map.set("assistant", "/");
    return map;
  }, [navItems]);

  useEffect(() => {
    if (!open) return;
    setTab(preferences.guidedModeDefault ? "guided" : "terminal");
  }, [open, preferences.guidedModeDefault]);

  useEffect(() => {
    if (!open) return;
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs, open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    if (open) {
      window.addEventListener("keydown", onKeyDown);
    }
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const pushLog = (entry: TerminalLog) => setLogs((prev) => [...prev, entry]);

  const showHelp = () => {
    pushLog({ type: "success", text: "Comandi disponibili:" });
    pushLog({ type: "output", text: "help, clear, ai, home, quickscan, progetti, contatti, blog, settings" });
    pushLog({ type: "output", text: "Puoi anche usare i codici: 01, 08, 09..." });
  };

  const execute = (rawCommand: string) => {
    const command = rawCommand.trim().toLowerCase();
    if (!command) return;

    pushLog({ type: "input", text: `> ${rawCommand}` });

    if (command === "clear") {
      setLogs([]);
      return;
    }

    if (command === "help") {
      showHelp();
      return;
    }

    const targetPath = commandMap.get(command);
    if (targetPath) {
      pushLog({ type: "success", text: `Navigazione verso ${targetPath}` });
      onNavigate(targetPath);
      setOpen(false);
      return;
    }

    pushLog({ type: "error", text: `Comando non riconosciuto: ${rawCommand}` });
    pushLog({ type: "output", text: "Digita help per la guida rapida." });
  };

  const submitTerminal = (event: FormEvent) => {
    event.preventDefault();
    execute(terminalInput);
    setTerminalInput("");
  };

  return (
    <>
      {open ? (
        <div className="fixed left-0 right-0 bottom-0 z-[210] border-t-2 border-primary bg-card/95 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Terminal className="text-primary" size={16} />
                <span className="text-primary font-terminal text-sm">COMMAND CENTER</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="border border-border px-2 py-1 text-muted-foreground hover:text-primary hover:border-primary"
                aria-label="Chiudi command center"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setTab("guided")}
                className={`px-3 py-1 text-xs border font-terminal ${
                  tab === "guided" ? "border-primary bg-primary/20 text-primary" : "border-border text-muted-foreground"
                }`}
              >
                GUIDATA
              </button>
              <button
                onClick={() => setTab("terminal")}
                className={`px-3 py-1 text-xs border font-terminal ${
                  tab === "terminal" ? "border-primary bg-primary/20 text-primary" : "border-border text-muted-foreground"
                }`}
              >
                TERMINALE
              </button>
            </div>

            <div className="h-[45vh] md:h-[42vh] overflow-y-auto border border-border bg-background/70 p-3">
              {tab === "guided" ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Seleziona un'azione rapida. Nessun comando tecnico necessario.
                  </p>

                  <div className="grid md:grid-cols-2 gap-3">
                    {QUICK_ACTIONS.map((action) => (
                      <button
                        key={action.path}
                        onClick={() => {
                          onNavigate(action.path);
                          setOpen(false);
                        }}
                        className="text-left border border-border p-3 hover:border-primary transition-colors"
                      >
                        <p className="text-primary font-terminal text-sm">{action.label}</p>
                        <p className="text-xs text-muted-foreground mt-1">{action.detail}</p>
                      </button>
                    ))}
                  </div>

                  <div className="border border-border p-3 space-y-2">
                    <p className="text-sm text-secondary">Shortcut veloci</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { cmd: "ai", label: "AI Guide" },
                        { cmd: "01", label: "Quick Scan" },
                        { cmd: "08", label: "Blog" },
                        { cmd: "help", label: "Guida" },
                      ].map((item) => (
                        <button
                          key={item.cmd}
                          onClick={() => execute(item.cmd)}
                          className="px-2 py-1 border border-primary/50 text-primary text-xs hover:bg-primary/10"
                        >
                          [{item.cmd}] {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-1 text-xs mb-2">
                    {logs.length === 0 ? (
                      <p className="text-muted-foreground">Digita help o ai per iniziare.</p>
                    ) : (
                      logs.map((log, index) => (
                        <p
                          key={index}
                          className={
                            log.type === "input"
                              ? "text-primary"
                              : log.type === "success"
                              ? "text-secondary"
                              : log.type === "error"
                              ? "text-destructive"
                              : "text-muted-foreground"
                          }
                        >
                          {log.text}
                        </p>
                      ))
                    )}
                    <div ref={logsEndRef} />
                  </div>

                  <form onSubmit={submitTerminal} className="border-t border-border pt-2 flex items-center gap-2">
                    <span className="text-accent text-xs">&gt;</span>
                    <input
                      value={terminalInput}
                      onChange={(event) => setTerminalInput(event.target.value)}
                      placeholder="Digita un comando..."
                      className="flex-1 bg-transparent outline-none text-primary text-xs"
                      aria-label="Input comandi terminale"
                    />
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1 border border-primary text-primary hover:bg-primary/10 transition-colors text-xs font-terminal"
        aria-label="Apri command center"
      >
        <Terminal size={14} />
        COMMAND CENTER
        <ChevronUp size={12} />
      </button>

      {open ? (
        <button
          onClick={() => setOpen(false)}
          className="fixed bottom-4 right-4 z-[215] border border-border bg-card px-2 py-1 text-xs text-muted-foreground hover:text-primary"
          aria-label="Riduci command center"
        >
          <ChevronDown size={12} />
        </button>
      ) : null}
    </>
  );
};
