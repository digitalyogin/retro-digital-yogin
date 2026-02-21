
# Ripristino del Puntatore del Mouse

## Problema
Il cursore del mouse e' nascosto tramite `cursor: none` nel CSS globale (`src/index.css`), rendendo difficile l'usabilita' per gli utenti che non riescono a capire dove si trovano sullo schermo.

## Cosa faremo

Rimuoveremo le regole CSS che nascondono il cursore e il componente `CustomCursor` che lo sostituiva con un simbolo personalizzato.

### Modifiche in `src/index.css`
1. Rimuovere `cursor: none` dal `body`
2. Rimuovere il blocco `*:not(input)... { cursor: none !important; }` che forza il cursore nascosto su tutti gli elementi
3. Rimuovere il blocco `input, textarea... { cursor: text !important; }` (non piu' necessario senza il cursore custom)

### Modifiche in `src/App.tsx`
Rimuovere l'import e l'uso del componente `<CustomCursor />` se presente nel layout.

Il puntatore tornera' al comportamento standard del browser: freccia normale e cursore testo nei campi di input.
