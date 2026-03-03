# Lovable Compatibility Guardrails

Queste regole riducono i crash in preview Lovable e vanno mantenute in tutti i futuri sviluppi.

## 1) Browser API safety
- Non usare `window`, `document`, `localStorage`, `matchMedia`, `AudioContext` in scope modulo.
- Usali solo dentro `useEffect` o dentro funzioni che fanno prima `typeof window !== "undefined"`.
- Ogni accesso a `localStorage` deve essere dentro `try/catch`.

## 2) Supabase safety
- Validare sempre `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`.
- Se mancano, entrare in modalità degradata (warning in console), mai crash all'avvio app.
- Gestire tutti gli errori async di fetch/supabase con messaggio user-friendly.

## 3) Rendering resilience
- Mantenere un `ErrorBoundary` globale per evitare pagina bianca in preview.
- Evitare side effects nel render path.
- Usare fallback quando API non esistono (es. `IntersectionObserver`).

## 4) Performance & animation safety
- Animazioni pesanti su canvas solo con cleanup completo (`cancelAnimationFrame`, `removeEventListener`).
- Rispettare `prefers-reduced-motion`.
- Evitare loop ad alta frequenza senza throttling su mobile.

## 5) PR checklist (obbligatoria)
- `npm run build` senza errori.
- Verifica manuale route principali: `/`, `/02`, `/03`, `/04`, `/09`, `/99`, `/auth`, `/incentivi`, `/notifiche`.
- Nessun errore runtime bloccante in console durante la navigazione base.
- Test rapido con env mancanti: app deve mostrare warning, non crashare.

## 6) TypeShuffle integration rules
- Applicare TypeShuffle solo a titoli e paragrafi contenuto.
- Evitare animazione su testi di controlli interattivi (button, input, label form, menu).
- Trigger consigliato: on-view una volta (`once=true`).
- Obbligatorio fallback statico su `prefers-reduced-motion`.
