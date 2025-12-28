import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Search, MessageSquare, Sparkles, Download, Mail, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Mode = "chat" | "scan";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export const OracleWidget = () => {
  const { toast } = useToast();
  const [mode, setMode] = useState<Mode>("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scanProgress, setScanProgress] = useState("");
  const [lastScanUrl, setLastScanUrl] = useState("");
  const [lastScanResult, setLastScanResult] = useState("");
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: "", email: "", phone: "" });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showLeadForm]);

  const extractScore = (text: string): number | null => {
    const scoreMatch = text.match(/(?:SCORE|punteggio)[:\s]*(\d{1,3})/i);
    if (scoreMatch) {
      const score = parseInt(scoreMatch[1], 10);
      return score <= 100 ? score : null;
    }
    return null;
  };

  const downloadReport = () => {
    if (!lastScanResult || !lastScanUrl) return;

    const reportContent = `
================================================================================
                           DIGITAL ORACLE REPORT
                      Analisi Presenza Online
================================================================================

Sito analizzato: ${lastScanUrl}
Data: ${new Date().toLocaleDateString("it-IT")}

--------------------------------------------------------------------------------

${lastScanResult}

--------------------------------------------------------------------------------

Generato da Digital Yogin - www.digitalyogin.it
Per un checkup professionale completo, contattaci!

================================================================================
`;

    const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `oracle-report-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Scaricato",
      description: "Il report è stato salvato come file di testo.",
    });
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.email || !lastScanResult || !lastScanUrl) return;

    setIsSubmittingLead(true);

    try {
      const score = extractScore(lastScanResult);

      const { error } = await supabase.from("oracle_leads").insert({
        email: leadForm.email,
        name: leadForm.name || null,
        phone: leadForm.phone || null,
        website_url: lastScanUrl,
        scan_result: lastScanResult,
        score: score,
      });

      if (error) throw error;

      setLeadSubmitted(true);
      toast({
        title: "Richiesta inviata!",
        description: "Ti contatteremo presto per il checkup completo.",
      });
    } catch (error) {
      console.error("Error submitting lead:", error);
      toast({
        title: "Errore",
        description: "Impossibile inviare la richiesta. Riprova.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const streamResponse = async (
    endpoint: string,
    body: object,
    onChunk: (content: string) => void
  ) => {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${endpoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (response.status === 429) {
      throw new Error("Troppi messaggi. Riprova tra qualche secondo.");
    }
    if (response.status === 402) {
      throw new Error("Crediti AI esauriti.");
    }
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Errore nella connessione.");
    }
    if (!response.body) {
      throw new Error("Nessuna risposta ricevuta.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let fullContent = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") break;

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            fullContent += content;
            onChunk(fullContent);
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    return fullContent;
  };

  const handleChat = async (userInput: string) => {
    const userMessage: Message = { role: "user", content: userInput };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      await streamResponse(
        "oracle-chat",
        { messages: [...messages, userMessage] },
        (content) => {
          setMessages((prev) =>
            prev.map((m, i) =>
              i === prev.length - 1 ? { ...m, content } : m
            )
          );
        }
      );
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: "assistant",
          content: error instanceof Error ? `ERRORE: ${error.message}` : "ERRORE: Impossibile contattare l'Oracle.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScan = async (url: string) => {
    setShowLeadForm(false);
    setLeadSubmitted(false);
    setLastScanUrl(url);
    setLastScanResult("");

    setMessages((prev) => [
      ...prev,
      { role: "system", content: `🔍 SCANNING: ${url}` },
    ]);
    setIsLoading(true);
    setScanProgress("Connessione al sito...");

    try {
      setTimeout(() => setScanProgress("Estrazione contenuti..."), 1500);
      setTimeout(() => setScanProgress("Analisi AI in corso..."), 3000);

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const result = await streamResponse("oracle-scan", { url }, (content) => {
        setScanProgress("");
        setLastScanResult(content);
        setMessages((prev) =>
          prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content } : m
          )
        );
      });

      // Show lead form after successful scan
      if (result) {
        setShowLeadForm(true);
      }
    } catch (error) {
      console.error("Scan error:", error);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: "assistant",
          content: error instanceof Error ? `ERRORE: ${error.message}` : "ERRORE: Impossibile analizzare il sito.",
        },
      ]);
    } finally {
      setIsLoading(false);
      setScanProgress("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userInput = input.trim();
    setInput("");

    if (mode === "scan") {
      await handleScan(userInput);
    } else {
      await handleChat(userInput);
    }
  };

  const switchMode = (newMode: Mode) => {
    if (newMode !== mode) {
      setMode(newMode);
      setMessages([]);
      setInput("");
      setShowLeadForm(false);
      setLeadSubmitted(false);
      setLastScanResult("");
      setLastScanUrl("");
    }
  };

  return (
    <div className="border-2 border-primary bg-card p-4 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between text-sm mb-3 border-b border-primary/30 pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-primary font-terminal">DIGITAL_ORACLE v2.0</span>
        </div>
        <span className="text-green-500 animate-pulse text-xs">● ONLINE</span>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => switchMode("chat")}
          className={`flex items-center gap-2 px-4 py-2 text-sm border transition-colors ${
            mode === "chat"
              ? "border-primary bg-primary/20 text-primary"
              : "border-primary/30 text-muted-foreground hover:border-primary/60"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          CHAT
        </button>
        <button
          onClick={() => switchMode("scan")}
          className={`flex items-center gap-2 px-4 py-2 text-sm border transition-colors ${
            mode === "scan"
              ? "border-primary bg-primary/20 text-primary"
              : "border-primary/30 text-muted-foreground hover:border-primary/60"
          }`}
        >
          <Search className="w-4 h-4" />
          SCAN
        </button>
      </div>

      {/* Chat/Scan Area */}
      <div className="h-56 overflow-y-auto mb-4 space-y-3 scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <div className="text-muted-foreground text-sm space-y-2">
            {mode === "chat" ? (
              <>
                <p>{'>'} Modalità CHAT attiva.</p>
                <p>{'>'} Chiedi informazioni sulla tua presenza online.</p>
                <p className="text-primary animate-pulse">{'>'} In attesa di input...</p>
              </>
            ) : (
              <>
                <p>{'>'} Modalità SCAN attiva.</p>
                <p>{'>'} Inserisci l'URL del tuo sito per un'analisi completa.</p>
                <p className="text-muted-foreground text-xs">{'>'} Esempio: www.miosito.it</p>
                <p className="text-primary animate-pulse">{'>'} In attesa di URL...</p>
              </>
            )}
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`text-sm ${
                msg.role === "user"
                  ? "text-primary"
                  : msg.role === "system"
                  ? "text-yellow-500"
                  : "text-foreground"
              }`}
            >
              <span className="text-muted-foreground">
                {msg.role === "user" ? "[USER]" : msg.role === "system" ? "[SYSTEM]" : "[ORACLE]"}
              </span>{" "}
              <span className="whitespace-pre-wrap">{msg.content}</span>
              {msg.role === "assistant" && msg.content === "" && isLoading && (
                <span className="animate-pulse">▌</span>
              )}
            </div>
          ))
        )}
        {scanProgress && (
          <div className="text-yellow-500 text-sm flex items-center gap-2">
            <Loader2 className="w-3 h-3 animate-spin" />
            {scanProgress}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Lead Form (after scan) */}
      {showLeadForm && !leadSubmitted && (
        <div className="border border-primary/50 bg-primary/5 p-4 mb-4 space-y-3">
          <div className="flex items-center gap-2 text-primary text-sm">
            <Mail className="w-4 h-4" />
            <span className="font-terminal">RICHIEDI_CHECKUP_COMPLETO</span>
          </div>
          <p className="text-muted-foreground text-xs">
            Vuoi un'analisi più approfondita? Lascia i tuoi dati e ti contatteremo!
          </p>
          <form onSubmit={handleLeadSubmit} className="space-y-2">
            <input
              type="text"
              value={leadForm.name}
              onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
              placeholder="Nome (opzionale)"
              className="w-full bg-background border border-primary/30 text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary placeholder:text-muted-foreground"
            />
            <input
              type="email"
              value={leadForm.email}
              onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
              placeholder="Email *"
              required
              className="w-full bg-background border border-primary/30 text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary placeholder:text-muted-foreground"
            />
            <input
              type="tel"
              value={leadForm.phone}
              onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
              placeholder="Telefono (opzionale)"
              className="w-full bg-background border border-primary/30 text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              disabled={isSubmittingLead || !leadForm.email}
              className="w-full border border-primary bg-primary/20 py-2 text-primary hover:bg-primary/30 transition-colors disabled:opacity-50 text-sm font-terminal"
            >
              {isSubmittingLead ? (
                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
              ) : (
                "INVIA_RICHIESTA"
              )}
            </button>
          </form>
        </div>
      )}

      {/* Lead Submitted Confirmation */}
      {leadSubmitted && (
        <div className="border border-green-500/50 bg-green-500/10 p-4 mb-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <div>
            <p className="text-green-500 text-sm font-terminal">RICHIESTA_INVIATA</p>
            <p className="text-muted-foreground text-xs">Ti contatteremo presto!</p>
          </div>
        </div>
      )}

      {/* Actions (PDF Download) */}
      {lastScanResult && !isLoading && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={downloadReport}
            className="flex items-center gap-2 px-4 py-2 text-sm border border-primary/50 text-primary hover:bg-primary/10 transition-colors"
          >
            <Download className="w-4 h-4" />
            SCARICA_PDF
          </button>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary">{'>'}</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "chat" ? "Scrivi la tua domanda..." : "Inserisci URL (es: www.miosito.it)"}
            disabled={isLoading}
            className="w-full bg-background border border-primary/50 text-foreground px-8 py-2 text-sm focus:outline-none focus:border-primary placeholder:text-muted-foreground disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="border border-primary bg-primary/10 px-4 py-2 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : mode === "scan" ? (
            <Search className="w-4 h-4" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="text-xs text-muted-foreground mt-3 text-center">
        {mode === "scan" ? (
          <span>Analisi powered by <span className="text-primary">FIRECRAWL + AI</span></span>
        ) : (
          <span>Powered by <span className="text-primary">DIGITAL_YOGIN</span></span>
        )}
      </div>
    </div>
  );
};