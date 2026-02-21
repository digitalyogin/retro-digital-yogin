import { useState, useRef, useEffect } from "react";
import { Loader2, Search, Sparkles, Download, Mail, CheckCircle, Gift } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export const OracleWidget = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scanProgress, setScanProgress] = useState("");
  const [lastScanInput, setLastScanInput] = useState("");
  const [lastScanResult, setLastScanResult] = useState("");
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: "", email: "", phone: "" });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [hasIncentives, setHasIncentives] = useState(false);
  const [isFlickering, setIsFlickering] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Start flickering after inactivity
  useEffect(() => {
    const resetInactivity = () => {
      setIsFlickering(false);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = setTimeout(() => {
        setIsFlickering(true);
        // Stop flickering after 3 seconds
        setTimeout(() => setIsFlickering(false), 3000);
      }, 8000);
    };

    resetInactivity();
    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((e) => window.addEventListener(e, resetInactivity));
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetInactivity));
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, []);

  // Check if the response mentions incentives
  const checkForIncentives = (text: string): boolean => {
    const incentiveKeywords = [
    "incentiv", "bonus", "fondo", "bando", "agevolazion",
    "contribut", "finanziament", "tasso zero", "fondo perduto",
    "impresa donna", "resto al sud", "digitalizzazione", "credito d'imposta",
    "smart&start", "NITO", "voucher"];

    const lowerText = text.toLowerCase();
    return incentiveKeywords.some((keyword) => lowerText.includes(keyword));
  };

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
    if (!lastScanResult || !lastScanInput) return;

    const reportContent = `
================================================================================
                           DIGITAL ORACLE REPORT
                      Analisi Presenza Online
================================================================================

Input analizzato: ${lastScanInput}
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
      description: "Il report è stato salvato come file di testo."
    });
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.email || !lastScanResult || !lastScanInput) return;

    setIsSubmittingLead(true);

    try {
      const score = extractScore(lastScanResult);

      const { error } = await supabase.from("oracle_leads").insert({
        email: leadForm.email,
        name: leadForm.name || null,
        phone: leadForm.phone || null,
        website_url: lastScanInput,
        scan_result: lastScanResult,
        score: score
      });

      if (error) throw error;

      setLeadSubmitted(true);
      toast({
        title: "Richiesta inviata!",
        description: "Ti contatteremo presto per il checkup completo."
      });
    } catch (error) {
      console.error("Error submitting lead:", error);
      toast({
        title: "Errore",
        description: "Impossibile inviare la richiesta. Riprova.",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const streamResponse = async (
  endpoint: string,
  body: object,
  onChunk: (content: string) => void) =>
  {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${endpoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
        },
        body: JSON.stringify(body)
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

  const handleScan = async (userInput: string) => {
    setShowLeadForm(false);
    setLeadSubmitted(false);
    setLastScanInput(userInput);
    setLastScanResult("");
    setHasIncentives(false);

    // Scroll widget into view when scan starts
    widgetRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    setMessages((prev) => [
    ...prev,
    { role: "system", content: `🔍 ANALISI: ${userInput}` }]
    );
    setIsLoading(true);
    setScanProgress("Connessione in corso...");

    try {
      setTimeout(() => setScanProgress("Analisi in corso..."), 1500);
      setTimeout(() => setScanProgress("Elaborazione AI..."), 3000);

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const result = await streamResponse("oracle-scan", { input: userInput }, (content) => {
        setScanProgress("");
        setLastScanResult(content);
        setMessages((prev) =>
        prev.map((m, i) =>
        i === prev.length - 1 ? { ...m, content } : m
        )
        );
      });

      // Show lead form and check for incentives after successful scan
      if (result) {
        setShowLeadForm(true);
        setHasIncentives(checkForIncentives(result));
      }
    } catch (error) {
      console.error("Scan error:", error);
      setMessages((prev) => [
      ...prev.slice(0, -1),
      {
        role: "assistant",
        content: error instanceof Error ? `ERRORE: ${error.message}` : "ERRORE: Impossibile completare l'analisi."
      }]
      );
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
    await handleScan(userInput);
  };

  return (
    <div ref={widgetRef} className="border-2 border-primary bg-card p-6 md:p-8 mb-6 rounded-sm animate-fade-in scroll-mt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-primary/30 pb-3">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="text-primary font-terminal text-lg md:text-xl">TURIYA v2.0  </span>
        </div>
        <span className="text-green-500 animate-pulse text-sm">● ONLINE</span>
      </div>

      {/* Scan Area */}
      <div className="h-72 md:h-80 overflow-y-auto mb-5 space-y-4 scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent pr-2">
        {messages.length === 0 ?
        <div className="text-muted-foreground text-2xl space-y-3">
            <p className="text-primary/90 text-lg">Inserisci il tuo sito, profilo social o descrivi la tua attività per ricevere un'analisi personalizzata.</p>
            <p>{'>'} Inserisci uno di questi esempi:</p>
            <p className="text-primary/80 pl-4">• URL del tuo sito (es: www.miosito.it)</p>
            <p className="text-primary/80 pl-4">• Profilo social (es: instagram.com/tuobrand)</p>
            <p className="text-primary/80 pl-4">• Descrizione della tua attività (es: "Ho una sartoria a Milano, non ho un sito")</p>
            <p className={`text-secondary mt-4 ${isFlickering ? "animate-[text-flicker_0.15s_ease-in-out_infinite]" : ""}`}>{'>'} Turiya ti guiderà con consigli personalizzati, incentivi statali e strategie di crescita.</p>
            <p className="text-primary animate-pulse">{'>'} In attesa di input...</p>
          </div> :

        messages.map((msg, idx) =>
        <div
          key={idx}
          className={`text-base leading-relaxed ${
          msg.role === "user" ?
          "text-primary" :
          msg.role === "system" ?
          "text-yellow-500" :
          "text-foreground"}`
          }>

              <span className="text-muted-foreground font-semibold">
                {msg.role === "user" ? "[USER]" : msg.role === "system" ? "[SYSTEM]" : "[ORACLE]"}
              </span>{" "}
              <span className="whitespace-pre-wrap">{msg.content}</span>
              {msg.role === "assistant" && msg.content === "" && isLoading &&
          <span className="animate-pulse">▌</span>
          }
            </div>
        )
        }
        {scanProgress &&
        <div className="text-yellow-500 text-base flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            {scanProgress}
          </div>
        }
        <div ref={messagesEndRef} />
      </div>

      {/* Lead Form (after scan) */}
      {showLeadForm && !leadSubmitted &&
      <div className="border border-primary/50 bg-primary/5 p-5 mb-5 space-y-4 rounded-sm">
          <div className="flex items-center gap-2 text-primary text-base">
            <Mail className="w-5 h-5" />
            <span className="font-terminal text-lg">RICHIEDI_CHECKUP_COMPLETO</span>
          </div>
          <p className="text-muted-foreground text-base">
            Vuoi un'analisi più approfondita? Lascia i tuoi dati e ti contatteremo!
          </p>
          <form onSubmit={handleLeadSubmit} className="space-y-3">
            <input
            type="text"
            value={leadForm.name}
            onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
            placeholder="Nome (opzionale)"
            className="w-full bg-background border border-primary/30 text-foreground px-4 py-3 text-base focus:outline-none focus:border-primary placeholder:text-muted-foreground" />

            <input
            type="email"
            value={leadForm.email}
            onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
            placeholder="Email *"
            required
            className="w-full bg-background border border-primary/30 text-foreground px-4 py-3 text-base focus:outline-none focus:border-primary placeholder:text-muted-foreground" />

            <input
            type="tel"
            value={leadForm.phone}
            onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
            placeholder="Telefono (opzionale)"
            className="w-full bg-background border border-primary/30 text-foreground px-4 py-3 text-base focus:outline-none focus:border-primary placeholder:text-muted-foreground" />

            <button
            type="submit"
            disabled={isSubmittingLead || !leadForm.email}
            className="w-full border border-primary bg-primary/20 py-3 text-primary hover:bg-primary/30 transition-colors disabled:opacity-50 text-base font-terminal">

              {isSubmittingLead ?
            <Loader2 className="w-5 h-5 animate-spin mx-auto" /> :

            "INVIA_RICHIESTA"
            }
            </button>
          </form>
        </div>
      }

      {/* Lead Submitted Confirmation */}
      {leadSubmitted &&
      <div className="border border-green-500/50 bg-green-500/10 p-5 mb-5 flex items-center gap-4 rounded-sm">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <div>
            <p className="text-green-500 text-base font-terminal">RICHIESTA_INVIATA</p>
            <p className="text-muted-foreground text-base">Ti contatteremo presto!</p>
          </div>
        </div>
      }

      {/* Actions (Download + Incentives) */}
      {lastScanResult && !isLoading &&
      <div className="flex flex-wrap gap-3 mb-5">
          <button
          onClick={downloadReport}
          className="flex items-center gap-2 px-5 py-3 text-base border border-primary/50 text-primary hover:bg-primary/10 transition-colors">

            <Download className="w-5 h-5" />
            SCARICA_REPORT
          </button>
          {hasIncentives &&
        <button
          onClick={() => navigate("/incentivi")}
          className="flex items-center gap-2 px-5 py-3 text-base border border-green-500/50 bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors animate-pulse">

              <Gift className="w-5 h-5" />
              SCOPRI_INCENTIVI
            </button>
        }
        </div>
      }

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary text-lg">{'>'}</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="URL, profilo social o descrivi la tua attività..."
            disabled={isLoading}
            className="w-full bg-background border border-primary/50 text-foreground pl-10 pr-4 py-3 text-base focus:outline-none focus:border-primary placeholder:text-muted-foreground disabled:opacity-50" />

        </div>
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="border border-primary bg-primary/10 px-5 py-3 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">

          {isLoading ?
          <Loader2 className="w-5 h-5 animate-spin" /> :

          <Search className="w-5 h-5" />
          }
        </button>
      </form>

      {/* Footer */}
      <div className="text-sm text-muted-foreground mt-4 text-center">
        <span>Analisi powered by <span className="text-primary">DIGITAL_YOGIN AI</span></span>
      </div>
    </div>);

};