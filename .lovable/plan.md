

# Piano: Auto-navigazione dalle risposte AI Guide

Il problema: quando l'AI Guide risponde suggerendo una route (es. "Quick Scan (/)"), il terminale non esegue la navigazione. L'utente resta nel Command Center.

## Soluzione

**File: `src/components/CommandCenter.tsx`**

Dopo che lo streaming AI e completato e il testo accumulato e disponibile, scansionare la risposta per individuare route consentite e navigare automaticamente con un breve delay.

Logica di detection:
1. Definire una mappa di pattern -> path: `"quick scan" -> "/"`, `"history" -> "/03"`, `"export" -> "/04"`, `"progetti" -> "/progetti"`, `"contatti" -> "/contatti"`, `"blog" -> "/blog"`, `"settings" -> "/09"`, `"incentivi" -> "/incentivi"`
2. Cercare anche route esplicite nella risposta: `(/)`, `(/03)`, `(/04)`, etc.
3. Se l'utente ha espresso un intento di navigazione (parole chiave come "portami", "vai", "apri", "naviga") E la risposta AI contiene una route riconosciuta, navigare automaticamente dopo ~1.5s
4. Mostrare un log `"success"` tipo "Navigazione verso /..." prima di chiudere il Command Center

Questo viene implementato come una funzione `detectAndNavigate(userText, aiResponse)` chiamata alla fine dello streaming, che controlla sia il messaggio utente sia la risposta AI per decidere se navigare.

