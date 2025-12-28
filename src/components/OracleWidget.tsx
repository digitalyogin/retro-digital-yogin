import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const OracleWidget = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    let assistantContent = "";

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/oracle-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: [...messages, userMessage] }),
        }
      );

      if (response.status === 429) {
        throw new Error("Troppi messaggi. Riprova tra qualche secondo.");
      }
      if (response.status === 402) {
        throw new Error("Crediti AI esauriti.");
      }
      if (!response.ok || !response.body) {
        throw new Error("Errore nella connessione all'Oracle.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      // Add empty assistant message to update progressively
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

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
              assistantContent += content;
              setMessages((prev) =>
                prev.map((m, i) =>
                  i === prev.length - 1 ? { ...m, content: assistantContent } : m
                )
              );
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("Oracle error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? `ERRORE: ${error.message}`
              : "ERRORE: Impossibile contattare l'Oracle.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-2 border-primary bg-card p-4 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between text-sm mb-4 border-b border-primary/30 pb-2">
        <span className="text-primary font-terminal">🔮 DIGITAL_ORACLE v1.0</span>
        <span className="text-green-500 animate-pulse">● ONLINE</span>
      </div>

      {/* Chat Area */}
      <div className="h-48 overflow-y-auto mb-4 space-y-3 scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <div className="text-muted-foreground text-sm space-y-2">
            <p>{'>'} Benvenuto nel DIGITAL_ORACLE.</p>
            <p>{'>'} Chiedi informazioni sulla tua presenza online o su come migliorare il tuo sito web.</p>
            <p className="text-primary animate-pulse">{'>'} In attesa di input...</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`text-sm ${
                msg.role === "user"
                  ? "text-primary"
                  : "text-foreground"
              }`}
            >
              <span className="text-muted-foreground">
                {msg.role === "user" ? "[USER]" : "[ORACLE]"}
              </span>{" "}
              <span className="whitespace-pre-wrap">{msg.content}</span>
              {msg.role === "assistant" && msg.content === "" && isLoading && (
                <span className="animate-pulse">▌</span>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary">{'>'}</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Scrivi la tua domanda..."
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
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="text-xs text-muted-foreground mt-3 text-center">
        Powered by DIGITAL_YOGIN :: <span className="text-primary">Richiedi un checkup completo ↓</span>
      </div>
    </div>
  );
};