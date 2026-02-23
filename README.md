# Yogin Akasha — Digital Turiya Terminal v3.1

Applicazione web retro-terminal (stile CRT anni '80/'90) per l'analisi di URL e sicurezza digitale.

**Live**: [retro-digital-yogin.lovable.app](https://retro-digital-yogin.lovable.app)

## Stack tecnologico

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **Lovable Cloud** (backend, auth, database)
- **Tanstack React Query** per data fetching

## Funzionalità principali

### Intro Boot Sequence (CRT cinematica)
- Schermata di avvio stile computer anni '80 con effetto CRT power-on
- Sequenza typewriter progressiva: `BOOTING YOGIN AKASHA...`, `MEMORY CHECK`, `TERMINAL INTERFACE`, `THREAT MATRIX`, `URL ANALYZER`
- Logo ASCII "YOGIN AKASHA — Digital Turiya Terminal v3.1"
- Prompt lampeggiante `PRESS ENTER TO INITIALIZE`
- Effetti: scanline overlay, text glow, cursor blink, micro-glitch casuale (~15% ogni 2s)
- Beep audio 8-bit solo su interazione utente (rispetta autoplay policy)
- Checkbox "Don't show again" → salva preferenza in `localStorage` (`introSeen`)
- Accessibilità: rispetta `prefers-reduced-motion` (intro statica + auto-skip), focus visibile, supporto tastiera completo (Enter/Esc)

### URL Analyzer (Quick Scan)
- Analisi rapida di URL con punteggio di sicurezza
- Interfaccia terminale retro con input stile command-line

### Full Report
- Report dettagliato con analisi approfondita

### Cronologia (History)
- Storico delle scansioni effettuate

### Export
- Esportazione risultati

### Incentivi
- Sezione dedicata agli incentivi digitali

### Impostazioni
- Configurazione preferenze utente

### Notifiche
- Sistema di notifiche con sottoscrizioni personalizzabili

### Autenticazione
- Login/signup con gestione profili utente

### Admin Leads
- Dashboard amministrativa per gestione lead da scansioni Oracle

## Struttura route

| Path | Pagina |
|------|--------|
| `/` `/01` | Quick Scan (URL Analyzer) |
| `/02` | Full Report |
| `/03` | History |
| `/04` | Export |
| `/09` | Settings |
| `/99` | About |
| `/admin` | Admin Leads |
| `/incentivi` | Incentivi |
| `/auth` | Autenticazione |
| `/notifiche` | Notifiche |

## Design system

Tema retro-terminale con palette verde fosforo su nero:
- `--phosphor` (#3cff7a) — colore primario
- `--cyan` (#4de8ff) — accenti secondari
- `--amber` (#ffcc66) — prompt e warning
- `--danger` (#ff5f56) — errori
- Font: `Share Tech Mono`, `VT323`
- Effetti: scanline overlay, glow, CRT flicker

## Sviluppo locale

```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm i
npm run dev
```

## Deploy

Apri [Lovable](https://lovable.dev/projects/5965aa77-b896-4b47-97d1-288633f69c87) → Share → Publish.
