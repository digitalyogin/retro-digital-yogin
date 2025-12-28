import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ANALYSIS_PROMPT = `Sei DIGITAL_ORACLE, un esperto analista di presenza online. 
Analizza i seguenti dati estratti dal sito web dell'utente e fornisci un report dettagliato.

Il tuo report DEVE includere:

1. **DIGITAL_PRESENCE_SCORE**: Un punteggio da 0 a 100 basato su:
   - Qualità dei contenuti (0-25 punti)
   - SEO e Meta Tags (0-25 punti)
   - Struttura e navigazione (0-25 punti)
   - Professionalità e branding (0-25 punti)

2. **PUNTI_DI_FORZA**: 2-3 aspetti positivi del sito

3. **AREE_CRITICHE**: 2-3 problemi principali da risolvere

4. **AZIONI_IMMEDIATE**: 3 azioni che possono fare subito (gratuite)

5. **AZIONI_AVANZATE**: 2-3 miglioramenti che richiedono un professionista

Concludi sempre suggerendo di contattare Digital Yogin per un checkup professionale completo.

Rispondi SEMPRE in italiano. Sii diretto e pratico nei consigli.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: "URL is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!FIRECRAWL_API_KEY) {
      console.error("FIRECRAWL_API_KEY not configured");
      return new Response(
        JSON.stringify({ success: false, error: "Firecrawl non configurato" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ success: false, error: "AI non configurata" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Format URL
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`;
    }

    console.log("Scanning URL:", formattedUrl);

    // Step 1: Scrape the website with Firecrawl
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
          error: scrapeData.error || "Impossibile analizzare il sito. Verifica che l'URL sia corretto." 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const siteContent = scrapeData.data?.markdown || scrapeData.markdown || "";
    const siteLinks = scrapeData.data?.links || scrapeData.links || [];
    const metadata = scrapeData.data?.metadata || scrapeData.metadata || {};

    console.log("Site scraped successfully. Content length:", siteContent.length);

    // Step 2: Analyze with AI
    const analysisPrompt = `
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

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: ANALYSIS_PROMPT },
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