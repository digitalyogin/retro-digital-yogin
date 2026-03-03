import { useEffect, useMemo, useRef, useState, useCallback, type FormEvent } from "react";
import { Terminal, X, ChevronUp, ChevronDown } from "lucide-react";
import { playCmdOpenSound, playCmdSubmitSound, playCmdResponseSound } from "@/lib/terminalSounds";
import {
  getTuriyaIntroDone,
  setTuriyaIntroDone,
  TURIYA_ONBOARDING_EVENT,
} from "@/lib/preferences/storage";
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
  type: "input" | "output" | "error" | "success" | "ai";
  text: string;
};

type TabMode = "guided" | "terminal";

type ChatMessage = { role: "user" | "assistant"; content: string };

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const QUICK_ACTIONS = [
  { label: "Vai a Quick Scan", path: "/", detail: "Apri analisi rapida URL" },
  { label: "Parla con Turiya", path: "/", detail: "Apri assistenza guidata con Turiya" },
  { label: "Vai ai Progetti", path: "/progetti", detail: "Consulta portfolio e casi d'uso" },
  { label: "Vai ai Contatti", path: "/contatti", detail: "Invia una richiesta in pochi passaggi" },
  { label: "Vai al Blog", path: "/blog", detail: "Leggi guide e approfondimenti" },
  { label: "Apri Settings", path: "/09", detail: "Configura esperienza e preferenze" },
];

const NAV_INTENT_REGEX = /portami|vai\b|apri|naviga|andiamo|porta\b/i;

export const CommandCenter = ({ navItems, onNavigate }: CommandCenterProps) => {
  const { preferences } = useUserPreferences();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<TabMode>(preferences.guidedModeDefault ? "guided" : "terminal");
  const [terminalInput, setTerminalInput] = useState("");
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const onboardingStartedRef = useRef(false);

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
    return map;
  }, [navItems]);

  useEffect(() => {
    if (!open) return;
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs, open]);

  useEffect(() => {
    if (!open) return;
    if (logs.length > 0) return;
    setTab(preferences.guidedModeDefault ? "guided" : "terminal");
  }, [open, logs.length, preferences.guidedModeDefault]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const pushLog = useCallback(
    (entry: TerminalLog) => setLogs((prev) => [...prev, entry]),
    []
  );

  const updateLastLog = useCallback(
    (text: string) =>
      setLogs((prev) => {
        if (prev.length === 0) return prev;
        const copy = [...prev];
        copy[copy.length - 1] = { ...copy[copy.length - 1], text };
        return copy;
      }),
    []
  );

  const ROUTE_KEYWORDS: [RegExp, string][] = useMemo(() => [
    [/quick\s*scan/i, "/"],
    [/history|storico/i, "/03"],
    [/export|esport/i, "/04"],
    [/progett/i, "/progetti"],
    [/contatt|preventivo/i, "/contatti"],
    [/blog|articol|guide/i, "/blog"],
    [/settings|impostazion|preferenz/i, "/09"],
    [/incentiv|bonus|bandi/i, "/incentivi"],
    [/chi siamo/i, "/chi-siamo"],
  ], []);

  const ROUTE_LITERALS = useMemo(
    () => ["/progetti", "/contatti", "/blog", "/incentivi", "/chi-siamo", "/03", "/04", "/09", "/"],
    []
  );

  const hasRouteMention = useCallback((text: string, route: string) => {
    if (route === "/") {
      return /\(\/\)|quick\s*scan|sezione consigliata:\s*quick scan/i.test(text);
    }
    const escaped = route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`(^|[^\\w])${escaped}($|[^\\w])`, "i");
    return pattern.test(text);
  }, []);

  const detectAndNavigate = useCallback(
    (userText: string, aiResponse: string) => {
      if (!NAV_INTENT_REGEX.test(userText)) return;

      const combined = aiResponse.toLowerCase();

      // Check explicit route literals in order from specific to generic.
      for (const route of ROUTE_LITERALS) {
        if (hasRouteMention(combined, route)) {
          const match = route;
          setTimeout(() => {
            pushLog({ type: "success", text: `Navigazione verso ${match}` });
            setTimeout(() => { onNavigate(match); setOpen(false); }, 600);
          }, 1200);
          return;
        }
      }

      // Check keyword patterns
      for (const [pattern, path] of ROUTE_KEYWORDS) {
        if (pattern.test(combined)) {
          setTimeout(() => {
            pushLog({ type: "success", text: `Navigazione verso ${path}` });
            setTimeout(() => { onNavigate(path); setOpen(false); }, 600);
          }, 1200);
          return;
        }
      }
    },
    [pushLog, onNavigate, ROUTE_KEYWORDS, ROUTE_LITERALS, hasRouteMention]
  );

  const streamAiResponse = useCallback(
    async (userText: string, options?: { markTuriyaIntroDone?: boolean }) => {
      const newUserMsg: ChatMessage = { role: "user", content: userText };
      const updatedMessages = [...chatMessages, newUserMsg];
      setChatMessages(updatedMessages);

      setIsAiLoading(true);
      playCmdSubmitSound();
      pushLog({ type: "ai", text: "▌" });

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/oracle-chat`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
            },
            body: JSON.stringify({ messages: updatedMessages }),
            signal: controller.signal,
          }
        );

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          pushLog({ type: "error", text: (errBody as Record<string, string>).error || `Errore AI (${res.status})` });
          if (options?.markTuriyaIntroDone) {
            pushLog({
              type: "output",
              text: "Connessione a Turiya non disponibile. Digita `riprova` o usa i comandi base.",
            });
          }
          setIsAiLoading(false);
          return;
        }

        const reader = res.body?.getReader();
        if (!reader) {
          pushLog({ type: "error", text: "Nessuna risposta dallo stream." });
          if (options?.markTuriyaIntroDone) {
            pushLog({
              type: "output",
              text: "Connessione a Turiya non disponibile. Digita `riprova` o usa i comandi base.",
            });
          }
          setIsAiLoading(false);
          return;
        }

        const decoder = new TextDecoder();
        let accumulated = "";
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const payload = trimmed.slice(5).trim();
            if (payload === "[DONE]") continue;

            try {
              const parsed = JSON.parse(payload);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                accumulated += delta;
                updateLastLog(accumulated + "▌");
              }
            } catch {
              // skip malformed chunks
            }
          }
        }

        updateLastLog(accumulated || "(nessuna risposta)");
        playCmdResponseSound();
        setChatMessages((prev) => [...prev, { role: "assistant", content: accumulated }]);
        if (options?.markTuriyaIntroDone) {
          setTuriyaIntroDone(true);
        }
        detectAndNavigate(userText, accumulated);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        pushLog({ type: "error", text: "Errore di connessione a Turiya." });
        if (options?.markTuriyaIntroDone) {
          pushLog({
            type: "output",
            text: "Connessione a Turiya non disponibile. Digita `riprova` o usa i comandi base.",
          });
        }
      } finally {
        setIsAiLoading(false);
        abortRef.current = null;
      }
    },
    [chatMessages, pushLog, updateLastLog, detectAndNavigate]
  );

  const startTuriyaOnboarding = useCallback(() => {
    if (getTuriyaIntroDone()) return;
    if (onboardingStartedRef.current) return;
    onboardingStartedRef.current = true;
    setOpen(true);
    setTab("terminal");

    const seedMessage =
      "Presentati come Turiya, guida ufficiale di Digital Yogin. " +
      "Di' che sei uno yogin con esperienza imprenditoriale e digitale, con spirito yogico. " +
      "Mantieni tono semplice e concreto. In massimo 4 righe: presentazione, come puoi aiutare, " +
      "e domanda finale con call-to-action tra Quick Scan e History.";

    void streamAiResponse(seedMessage, { markTuriyaIntroDone: true });
  }, [streamAiResponse]);

  useEffect(() => {
    const handleStart = () => {
      startTuriyaOnboarding();
    };
    window.addEventListener(TURIYA_ONBOARDING_EVENT, handleStart);
    return () => window.removeEventListener(TURIYA_ONBOARDING_EVENT, handleStart);
  }, [startTuriyaOnboarding]);

  const showHelp = useCallback(() => {
    pushLog({ type: "success", text: "Comandi disponibili:" });
    pushLog({ type: "output", text: "help, clear, riprova, home, quickscan, progetti, contatti, blog, settings" });
    pushLog({ type: "output", text: "Puoi anche usare i codici: 01, 08, 09..." });
    pushLog({ type: "output", text: "Oppure scrivi una domanda per Turiya." });
  }, [pushLog]);

  const execute = useCallback(
    (rawCommand: string) => {
      const command = rawCommand.trim().toLowerCase();
      if (!command) return;

      pushLog({ type: "input", text: `> ${rawCommand}` });

      if (command === "clear") {
        setLogs([]);
        setChatMessages([]);
        onboardingStartedRef.current = false;
        return;
      }
      if (command === "help") {
        showHelp();
        return;
      }
      if (command === "riprova") {
        onboardingStartedRef.current = false;
        startTuriyaOnboarding();
        return;
      }

      const targetPath = commandMap.get(command);
      if (targetPath) {
        pushLog({ type: "success", text: `Navigazione verso ${targetPath}` });
        onNavigate(targetPath);
        setOpen(false);
        return;
      }

      // Fallback: send to Turiya
      streamAiResponse(rawCommand);
    },
    [pushLog, showHelp, commandMap, onNavigate, streamAiResponse, startTuriyaOnboarding]
  );

  const submitTerminal = (event: FormEvent) => {
    event.preventDefault();
    if (isAiLoading) return;
    execute(terminalInput);
    setTerminalInput("");
  };

  return (
    <>
      {open && (
        <div className="fixed left-0 right-0 bottom-0 z-[210] border-t-2 border-primary bg-card/95 backdrop-blur-md">
          <div className="max-w-5xl xl:max-w-6xl mx-auto px-4 py-3 md:px-5 md:py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Terminal className="text-primary" size={16} />
                <span className="text-primary font-terminal text-sm md:text-base">COMMAND CENTER</span>
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
                onClick={() => setTab("terminal")}
                className={`px-3 py-1 text-xs md:text-sm border font-terminal ${
                  tab === "terminal" ? "border-primary bg-primary/20 text-primary" : "border-border text-muted-foreground"
                }`}
              >
                TERMINALE
              </button>
              <button
                onClick={() => setTab("guided")}
                className={`px-3 py-1 text-xs md:text-sm border font-terminal ${
                  tab === "guided" ? "border-primary bg-primary/20 text-primary" : "border-border text-muted-foreground"
                }`}
              >
                GUIDATA
              </button>
            </div>

            <div className="h-[45vh] md:h-[62vh] lg:h-[66vh] xl:h-[70vh] overflow-y-auto border border-border bg-background/70 p-4 lg:p-5">
              {tab === "guided" ? (
                <div className="space-y-4">
                  <p className="text-sm md:text-base leading-6 text-muted-foreground">
                    Seleziona un'azione rapida. Nessun comando tecnico necessario.
                  </p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {QUICK_ACTIONS.map((action) => (
                      <button
                        key={action.label}
                        onClick={() => {
                          onNavigate(action.path);
                          setOpen(false);
                        }}
                        className="text-left border border-border p-3 hover:border-primary transition-colors"
                      >
                        <p className="text-primary font-terminal text-sm md:text-base">{action.label}</p>
                        <p className="text-xs md:text-sm text-muted-foreground mt-1 leading-5">{action.detail}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-1 text-xs md:text-sm lg:text-base leading-6 mb-3">
                    {logs.length === 0 ? (
                      <div className="space-y-2 text-muted-foreground">
                        <p>
                          Digita <span className="text-primary">help</span> per i comandi, o scrivi una domanda per Turiya.
                        </p>
                        <p>
                          Suggerimento rapido: <span className="text-primary">riprova</span> per riavviare l'introduzione di Turiya.
                        </p>
                        <p>
                          Esempio: <span className="text-primary">portami alla cronologia</span>.
                        </p>
                      </div>
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
                              : log.type === "ai"
                              ? "text-secondary whitespace-pre-wrap"
                              : "text-muted-foreground"
                          }
                        >
                          {log.text}
                        </p>
                      ))
                    )}
                    <div ref={logsEndRef} />
                  </div>

                  <form onSubmit={submitTerminal} className="border-t border-border pt-3 flex items-center gap-2">
                    <span className="text-accent text-xs md:text-sm lg:text-base">&gt;</span>
                    <input
                      value={terminalInput}
                      onChange={(event) => setTerminalInput(event.target.value)}
                      disabled={isAiLoading}
                      placeholder={isAiLoading ? "Turiya sta rispondendo..." : "Digita un comando o chiedi qualcosa..."}
                      className="flex-1 bg-transparent outline-none text-primary text-xs md:text-sm lg:text-base leading-6 disabled:opacity-50"
                      aria-label="Input comandi terminale"
                    />
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => { setOpen(true); playCmdOpenSound(); }}
        className="flex items-center gap-2 px-3 py-1 border border-primary text-primary hover:bg-primary/10 transition-colors text-xs font-terminal"
        aria-label="Apri command center"
      >
        <Terminal size={14} />
        COMMAND CENTER
        <ChevronUp size={12} />
      </button>

      {open && (
        <button
          onClick={() => setOpen(false)}
          className="fixed bottom-4 right-4 z-[215] border border-border bg-card px-2 py-1 text-xs text-muted-foreground hover:text-primary"
          aria-label="Riduci command center"
        >
          <ChevronDown size={12} />
        </button>
      )}
    </>
  );
};
