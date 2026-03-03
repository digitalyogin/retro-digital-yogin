# iOS SwiftUI Bridge Plan

Obiettivo: avere la stessa esperienza della web app in una app iOS Swift/SwiftUI senza divergenze funzionali.

## Architettura consigliata
- `Frontend Web (Lovable)`: UI, routing, animazioni web.
- `Supabase`: auth, database, edge functions.
- `iOS SwiftUI`: client nativo che usa le stesse API Supabase/Edge Functions.

## Contratto API condiviso
- Consolidare endpoint usati nel web (es. `oracle-scan`, `oracle-chat`) con request/response stabili.
- Versionare payload (`v1`) per evitare breaking changes tra web e iOS.
- Definire schema campi comune (URL input, score, report text, lead fields).

## Auth condivisa
- Usare Supabase Auth anche su iOS (`supabase-swift`) con stessi provider.
- Allineare redirect/login flow e gestione sessione.

## Design parity
- Definire token design condivisi:
  - colori (`phosphor`, `cyan`, `amber`, `danger`)
  - spaziature
  - timing animazioni (durata/easing)
- Mappare effetti web in SwiftUI:
  - glow -> `shadow`
  - pulse -> `repeatForever`
  - CRT scanline -> overlay `Canvas`/gradient layer

## Roadmap pratica
1. Estrarre un documento JSON di design tokens dalla web app.
2. Stabilizzare API edge functions con esempi request/response.
3. Creare app SwiftUI con 3 schermate MVP: Quick Scan, History, Settings.
4. Portare animazioni core con fallback per `Reduce Motion` su iOS.
5. Eseguire test di parità funzionale web vs iOS (stessi input, stessi output).

## Regola operativa per futuri sviluppi web
Ogni nuova feature Lovable deve includere:
- impatto su API (si/no),
- impatto su iOS (mappatura SwiftUI),
- fallback senza animazione,
- gestione errori non bloccante.
