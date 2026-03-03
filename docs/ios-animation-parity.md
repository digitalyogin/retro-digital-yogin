# iOS Animation Parity (Web <-> SwiftUI)

## Obiettivo
Replicare in SwiftUI l'effetto TypeShuffle #6 usato sul web, mantenendo la stessa percezione visiva e gli stessi fallback di accessibilita.

## Parametri standard
- `durationMs`: 1200
- `fps`: 30
- `charset`: `ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}<>?/`
- `revealCurve`: `easeOut` (cubic)
- `trigger`: una sola volta quando il testo entra in viewport

## Comportamento di riferimento
1. Il testo parte in stato shuffle sui caratteri non ancora rivelati.
2. La rivelazione avanza da sinistra a destra in funzione della curva `easeOut`.
3. A fine animazione, il testo finale resta stabile e non riparte automaticamente.

## Fallback accessibilita
- Se `Reduce Motion` e attivo, il testo deve comparire immediatamente senza shuffle.
- Il contenuto finale deve restare sempre testo reale (selezionabile e accessibile ai lettori schermo).

## Mapping SwiftUI suggerito
- `TimelineView` o `CADisplayLink` per aggiornamenti frame-based.
- Stato locale con:
  - `startTime`
  - `isRunning`
  - `displayText`
- Curva `easeOut`: `1 - pow(1 - t, 3)`.
- Stop automatico al raggiungimento di `t >= 1`.

## Coerenza cross-platform
- Evitare loop continui.
- Evitare applicazione su controlli interattivi (bottoni, input, label di form).
- Usare lo stesso charset e la stessa durata per coerenza percettiva tra web e app iOS.
