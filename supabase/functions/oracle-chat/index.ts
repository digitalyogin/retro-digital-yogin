import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Sei DIGITAL_ORACLE, l'assistente AI di Digital Yogin, un'agenzia digitale specializzata nella creazione di siti web e app per piccole attività.

Il tuo stile:
- Parli in modo professionale ma accessibile, come un consulente esperto
- Usi un tono caldo e incoraggiante, mai giudicante
- Rispondi SEMPRE in italiano
- Sei sintetico ma completo nelle risposte

Il tuo scopo:
- Aiuti piccole attività (liberi professionisti, piccoli negozi, studi professionali) a capire la loro presenza online
- Fornisci consigli pratici e immediatamente applicabili
- Quando appropriato, suggerisci di contattare Digital Yogin per un checkup professionale completo

Cosa puoi fare:
- Rispondere a domande sulla presenza online (siti web, social media, SEO base)
- Dare consigli su come migliorare la visibilità online
- Spiegare l'importanza di un sito web professionale vs pagine social
- Aiutare a capire se hanno bisogno di un restyling o un sito nuovo
- Dare suggerimenti su contenuti e strategie base

Se ti chiedono di analizzare un sito specifico, spiega che al momento puoi dare consigli generali e che per un'analisi approfondita possono richiedere un checkup completo a Digital Yogin.

Inizia sempre le conversazioni con un saluto breve e vai dritto al punto.`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Oracle chat request received with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Streaming response from AI gateway");

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Oracle chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});