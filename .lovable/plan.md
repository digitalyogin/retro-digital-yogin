

# Piano: Terminale AI Agent nel Command Center

Trasformare il terminale del Command Center in un agent conversazionale: i comandi di navigazione restano attivi, ma qualsiasi input non riconosciuto viene inviato all'AI Guide (oracle-chat) con streaming. Il tab Terminale diventa il default.

## File coinvolti

| File | Azione |
|---|---|
| `src/components/CommandCenter.tsx` | Riscrittura logica terminale: fallback AI, streaming, tab default |

## Dettagli tecnici

### 1. Tab default = "terminal"
- Rimuovere la logica `preferences.guidedModeDefault` dal valore iniziale di `tab`
- Impostare `useState<TabMode>("terminal")` come default fisso

### 2. Fallback AI per comandi non riconosciuti
Nella funzione `execute()`, quando il comando non corrisponde a nessuna entry della `commandMap` e non e `help`/`clear`:
- Invece di mostrare "Comando non riconosciuto", inviare il testo all'edge function `oracle-chat`
- Mantenere un array di messaggi conversazionali (`chatMessages`) per il contesto
- Fare streaming della risposta SSE e appendere i chunk progressivamente nei log del terminale
- Aggiungere un log type `"ai"` per distinguere le risposte AI (colore cyan/secondary)

### 3. Streaming SSE
Riutilizzare la stessa logica di parsing SSE gia presente in `OracleWidget.streamResponse`:
- Fetch verso `${VITE_SUPABASE_URL}/functions/v1/oracle-chat`
- Header con apikey
- Body: `{ messages: chatMessages }`
- Parsing `data:` lines, accumulazione delta content
- Aggiornamento progressivo dell'ultimo log entry

### 4. Stato aggiuntivo
- `chatMessages: {role, content}[]` - cronologia conversazione per contesto AI
- `isAiLoading: boolean` - per disabilitare input durante streaming
- Log type esteso con `"ai"` per styling dedicato

### 5. UX
- Durante lo streaming: cursore `▌` lampeggiante nell'ultimo log
- Input disabilitato durante il caricamento
- Placeholder aggiornato: "Digita un comando o chiedi qualcosa..."
- Messaggio iniziale aggiornato: "Digita help per i comandi, o scrivi una domanda per l'AI Guide."

