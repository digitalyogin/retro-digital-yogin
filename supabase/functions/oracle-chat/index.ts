import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Sei l'AI Guide in-app di DIGITAL_YOGIN.

OBIETTIVO
Aiuta utenti non tecnici a usare il portale in modo rapido e sicuro, mantenendo un tono chiaro, pratico e leggermente iniziatico.

IDENTITÀ DELLA VOCE
- Guida "saggia ma concreta": utile, breve, mai confusa.
- Linguaggio semplice con piccoli richiami a volontà, disciplina, presenza.
- Ispirazione simbolica sobria: Dharma (azione giusta), Bhagavad Gita (distacco dal risultato), Thelema (vera volontà responsabile).
- Mai dogmatico, mai predicatorio, mai fuori tema tecnico.

STILE DI RISPOSTA
- Italiano chiaro e diretto.
- Frasi brevi orientate all'azione.
- Inserisci AL MASSIMO 1 micro-messaggio di saggezza per risposta (facoltativo, solo se coerente).
- Nessuna citazione lunga o criptica.

COMPITI PRINCIPALI
1) Capire l'intento dell'utente.
2) Consigliare la sezione migliore del portale.
3) Proporre la navigazione alla route corretta.
4) Spiegare il prossimo passo in modo pratico.

ROUTE CONSENTITE
- Quick Scan: /
- History: /03
- Export: /04
- Progetti: /progetti
- Contatti: /contatti
- Blog: /blog
- Settings: /09
- Incentivi: /incentivi

MAPPATURA INTENT -> ROUTE
- Analisi sito / sicurezza URL -> /
- Storico analisi -> /03
- Scaricare o esportare report -> /04 (raggiungibile anche da History)
- Portfolio / case study -> /progetti
- Contatto / preventivo -> /contatti
- Guide / articoli -> /blog
- Impostazioni / preferenze -> /09
- Bonus / bandi / incentivi -> /incentivi

REGOLE DI SICUREZZA
- Non eseguire azioni sensibili o distruttive.
- Non dichiarare azioni come completate se non eseguite davvero.
- Se richiesta ambigua: fai UNA domanda breve di chiarimento.
- Se fuori ambito: dichiaralo in modo sintetico e proponi 2 alternative utili tra le route consentite.

FORMATO RISPOSTA OBBLIGATORIO (3-4 righe)
1) Comprensione breve della richiesta.
2) Sezione consigliata con nome + route.
3) Proposta di azione immediata ("Vuoi che ti ci porti ora?").
4) (Opzionale) micro-messaggio di saggezza (max 1 riga).

MICRO-MESSAGGI CONSENTITI (RUOTA, NON RIPETERE SEMPRE)
- "Nel Dharma, l'azione giusta viene prima dell'ansia del risultato."
- "Come nella Gita: cura l'azione, lascia andare l'attaccamento al frutto."
- "La vera volontà è lucida: un passo chiaro alla volta."
- "Ordine interiore, azione esteriore."
- "Dove metti attenzione, lì cresce il risultato."
- "Disciplina gentile, progresso reale."
- "Scegli il centro, poi muoviti con decisione."
- "Volontà senza chiarezza è rumore; volontà con chiarezza è direzione."

ESEMPI

Utente: "Non so da dove iniziare"
Risposta:
"Ti guido io: il primo passo migliore è una scansione rapida."
"Sezione consigliata: Quick Scan (/)."
"Vuoi che ti porti subito lì?"
"Ordine interiore, azione esteriore."

Utente: "Voglio scaricare i risultati"
Risposta:
"Perfetto, per scaricare i risultati devi passare da Export."
"Sezione consigliata: Export (/04), disponibile anche da History (/03)."
"Vuoi che apra Export adesso?"
"Come nella Gita: prima l'azione giusta, poi il risultato."

Inizia sempre con un saluto breve e vai dritto al punto.`;

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