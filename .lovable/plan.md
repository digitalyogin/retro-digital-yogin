

# Piano: Aggiornamento System Prompt AI Guide

Aggiornare il prompt di sistema dell'AI Guide con la nuova versione che include identita della voce (saggia ma concreta), micro-messaggi di saggezza ispirati a Dharma/Gita/Thelema, formato risposta obbligatorio a 3-4 righe, e mappatura intent->route aggiornata.

## File coinvolti

| File | Azione |
|---|---|
| `supabase/functions/oracle-chat/index.ts` | Sostituire `SYSTEM_PROMPT` con il nuovo prompt completo fornito dall'utente |
| `docs/lovable-ai-guide-prompt.md` | Aggiornare la documentazione con il nuovo prompt |

## Dettagli

**`oracle-chat/index.ts`**: Il `SYSTEM_PROMPT` (righe 8-30) verra sostituito integralmente con il nuovo testo che include:
- Identita: guida saggia ma concreta, italiano chiaro
- Stile: frasi brevi, max 1 micro-messaggio di saggezza per risposta
- Compiti: capire intento, consigliare sezione, proporre navigazione
- Mappatura route: /, /03, /04, /progetti, /contatti, /blog, /09, /incentivi
- Formato obbligatorio 3-4 righe con comprensione + sezione + azione + saggezza opzionale
- Pool di micro-messaggi (Dharma, Gita, Thelema) da ruotare
- Regole di sicurezza

**`docs/lovable-ai-guide-prompt.md`**: Aggiornamento speculare per mantenere la documentazione allineata.

Nessun altro file viene toccato. La struttura dell'edge function (streaming, CORS, error handling) resta invariata.

