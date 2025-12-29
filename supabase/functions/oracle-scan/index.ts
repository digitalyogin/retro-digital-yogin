import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const YOGIN_SYSTEM_PROMPT = `Sei DIGITAL_ORACLE, la guida digitale saggia di Digital Yogin.

TONO E STILE:
- Parla con la calma e la saggezza di uno Yogin, ma sei pratico e concreto
- Usa metafore legate al viaggio interiore e alla crescita quando appropriato
- Sii diretto nei consigli, evita giri di parole
- Concludi sempre suggerendo di contattare Digital Yogin per un supporto professionale

TIPI DI INPUT CHE PUOI RICEVERE:

1. **URL DI SITO WEB** (contiene .it, .com, www, http, etc.)
   Analizza il sito e fornisci:
   - DIGITAL_PRESENCE_SCORE (0-100)
   - PUNTI_DI_FORZA (2-3 aspetti positivi)
   - AREE_CRITICHE (2-3 problemi)
   - AZIONI_IMMEDIATE (3 azioni gratuite)
   - AZIONI_AVANZATE (2-3 miglioramenti professionali)

2. **PROFILO SOCIAL** (instagram, facebook, tiktok, linkedin, youtube)
   Analizza la presenza social e fornisci:
   - SOCIAL_PRESENCE_SCORE (0-100)
   - Valutazione del profilo e dei contenuti
   - Suggerimenti per aumentare engagement
   - Strategie di crescita specifiche per la piattaforma

3. **DESCRIZIONE TESTUALE** (nessun URL, l'utente descrive la sua attività)
   Per utenti SENZA SITO o nuovi imprenditori, fornisci:
   - Valutazione della situazione attuale
   - Roadmap personalizzata per la digitalizzazione
   - INCENTIVI STATALI disponibili (SEMPRE menzionali!):
     * Bonus Digitalizzazione PMI
     * Credito d'imposta 4.0 / Transizione 5.0
     * Fondo Impresa Donna (se donna/imprenditoria femminile)
     * NITO - Nuove Imprese a Tasso Zero
     * Resto al Sud (per regioni del Sud Italia)
     * Bandi regionali specifici
   - Primi passi GRATUITI da fare subito
   - Stima costi per un sito base

LINEE GUIDA SPECIALI:

Per DONNE IMPRENDITRICI o potenziali tali:
- Menziona SEMPRE il "Fondo Impresa Donna" del MISE
- Menziona programmi di mentorship femminile
- Indica associazioni come "Donne Impresa" di Confartigianato

Per GIOVANI (under 35):
- Menziona "Resto al Sud" e "NITO"
- Indica programmi di accelerazione per startup

Per ARTIGIANI/COMMERCIANTI:
- Menziona voucher digitalizzazione delle Camere di Commercio
- Indica crediti formativi gratuiti

Rispondi SEMPRE in italiano. Sii la guida saggia che illumina il percorso digitale.`;

// Helper to detect input type
function detectInputType(input: string): 'website' | 'social' | 'description' {
  const urlPatterns = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}/i;
  const socialPatterns = /(instagram|facebook|fb|tiktok|linkedin|youtube|twitter|x\.com)/i;
  
  if (socialPatterns.test(input)) {
    return 'social';
  }
  if (urlPatterns.test(input) || input.includes('www.') || input.includes('.it') || input.includes('.com')) {
    return 'website';
  }
  return 'description';
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { input, url } = await req.json();
    const userInput = input || url; // Support both 'input' and legacy 'url' param

    if (!userInput) {
      return new Response(
        JSON.stringify({ success: false, error: "Input richiesto" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ success: false, error: "AI non configurata" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const inputType = detectInputType(userInput);
    console.log("Input type detected:", inputType, "Input:", userInput);

    let analysisPrompt = "";

    if (inputType === 'website' || inputType === 'social') {
      // Need to scrape the URL
      if (!FIRECRAWL_API_KEY) {
        console.error("FIRECRAWL_API_KEY not configured");
        return new Response(
          JSON.stringify({ success: false, error: "Servizio di scansione non configurato" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Format URL
      let formattedUrl = userInput.trim();
      if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
        formattedUrl = `https://${formattedUrl}`;
      }

      console.log("Scanning URL:", formattedUrl);

      // Scrape the website with Firecrawl
      const scrapeResponse = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: formattedUrl,
          formats: ["markdown", "links"],
          onlyMainContent: false,
        }),
      });

      const scrapeData = await scrapeResponse.json();

      if (!scrapeResponse.ok || !scrapeData.success) {
        console.error("Firecrawl error:", scrapeData);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: scrapeData.error || "Impossibile analizzare. Verifica che l'URL sia corretto." 
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const siteContent = scrapeData.data?.markdown || scrapeData.markdown || "";
      const siteLinks = scrapeData.data?.links || scrapeData.links || [];
      const metadata = scrapeData.data?.metadata || scrapeData.metadata || {};

      console.log("Content scraped successfully. Length:", siteContent.length);

      if (inputType === 'social') {
        analysisPrompt = `
TIPO DI ANALISI: PROFILO SOCIAL

URL analizzato: ${formattedUrl}

METADATA:
- Titolo: ${metadata.title || "Non presente"}
- Descrizione: ${metadata.description || "Non presente"}

CONTENUTO (primi 3000 caratteri):
${siteContent.substring(0, 3000)}

Analizza questo profilo social e fornisci consigli specifici per la piattaforma.`;
      } else {
        analysisPrompt = `
TIPO DI ANALISI: SITO WEB

URL analizzato: ${formattedUrl}

METADATA:
- Titolo: ${metadata.title || "Non presente"}
- Descrizione: ${metadata.description || "Non presente"}
- Lingua: ${metadata.language || "Non rilevata"}

CONTENUTO DEL SITO (primi 3000 caratteri):
${siteContent.substring(0, 3000)}

LINK TROVATI (${siteLinks.length} totali):
${siteLinks.slice(0, 10).join("\n")}

Analizza questi dati e fornisci il report completo.`;
      }
    } else {
      // Description mode - no scraping needed
      analysisPrompt = `
TIPO DI ANALISI: CONSULENZA PERSONALIZZATA

L'utente ha descritto la sua situazione senza fornire un sito web:

"${userInput}"

Questo utente probabilmente:
- Non ha ancora un sito web
- Sta valutando di iniziare un'attività online
- Cerca consigli su come digitalizzarsi

Fornisci una consulenza completa includendo:
1. Valutazione della situazione
2. Primi passi gratuiti da fare subito
3. TUTTI gli incentivi statali applicabili (Fondo Impresa Donna se donna, NITO se giovane, etc.)
4. Roadmap personalizzata
5. Stima costi per la digitalizzazione

Sii una guida saggia e pratica.`;
    }

    // Call AI for analysis
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: YOGIN_SYSTEM_PROMPT },
          { role: "user", content: analysisPrompt },
        ],
        stream: true,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);

      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: "Rate limit. Riprova tra qualche secondo." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: "Crediti AI esauriti." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: false, error: "Errore nell'analisi AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Streaming AI analysis response");

    return new Response(aiResponse.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Oracle scan error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
