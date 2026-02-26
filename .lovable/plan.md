

# Piano: Transizione Matrix Dissolve + Suoni WAV personalizzati

## Panoramica
Sostituire l'attuale transizione CRT con un effetto "Matrix Dissolve" -- la pagina corrente si dissolve in caratteri che cadono (stile Matrix), poi la nuova pagina emerge dai caratteri. I suoni sintetizzati verranno rimpiazzati con i file WAV forniti.

---

## 1. Copiare i file audio nel progetto

Copiare i 5 file WAV in `public/sounds/`:
- `Rainbow1.wav` -- suono di entrata (navigazione verso una pagina)
- `Rainbow2.wav` -- suono di uscita (quando si lascia una pagina)
- `Rainbow3.wav` -- disponibile come suono extra
- `SpaceBall_Error4.wav` -- suono per errori (toast/messaggi di errore)
- `SpaceBall_Done4.wav` -- suono per success (toast/messaggi di conferma)

---

## 2. Aggiornare `src/lib/terminalSounds.ts`

- Aggiungere funzioni che riproducono i file WAV tramite `new Audio()`:
  - `playEnterSound()` -- riproduce `/sounds/Rainbow1.wav` (volume soft ~0.3)
  - `playExitSound()` -- riproduce `/sounds/Rainbow2.wav` (volume soft ~0.3)
  - `playErrorWav()` -- riproduce `/sounds/SpaceBall_Error4.wav` (volume ~0.25)
  - `playSuccessWav()` -- riproduce `/sounds/SpaceBall_Done4.wav` (volume ~0.25)
- Tutte le funzioni rispettano il toggle `isSoundEnabled()`
- Rimuovere `playCrtTransitionSound` e `playCrtPowerOnSound` (non piu necessari)

---

## 3. Riscrivere `src/components/CrtTransition.tsx` -- Matrix Dissolve

Nuova animazione a 4 fasi:

1. **dissolve** (~500ms): Un canvas fullscreen genera caratteri Matrix (katakana/numeri) che cadono dall'alto, coprendo progressivamente lo schermo con un overlay scuro. Riproduce `playExitSound()`.
2. **rain** (~400ms): La pioggia di caratteri riempie lo schermo completamente -- la pagina sotto non e piu visibile.
3. **emerge** (~500ms): I caratteri iniziano a dissolversi dal centro verso i bordi, rivelando la nuova pagina. Riproduce `playEnterSound()`.
4. **done**: Transizione completata, chiama `onComplete()`.

Dettagli tecnici del canvas:
- Colonne di caratteri verdi (stile phosphor `#3cff7a`) su sfondo nero
- Caratteri: mix di katakana, numeri e simboli
- Ogni colonna cade a velocita leggermente diversa per un effetto organico
- Fade-out radiale dal centro durante la fase "emerge"

---

## 4. Integrare suoni nei toast/notifiche

Modificare i punti dove vengono mostrati messaggi di errore e successo per riprodurre i suoni corrispondenti:
- Cercare utilizzi di `toast` e `sonner` nel progetto
- Aggiungere `playErrorWav()` per errori
- Aggiungere `playSuccessWav()` per conferme/successi

---

## File coinvolti

| File | Azione |
|---|---|
| `public/sounds/*.wav` | Copia dei 5 file audio |
| `src/lib/terminalSounds.ts` | Aggiunta funzioni WAV, rimozione vecchi suoni CRT |
| `src/components/CrtTransition.tsx` | Riscrittura completa con effetto Matrix Dissolve |
| Componenti che usano toast (da verificare) | Aggiunta chiamate `playErrorWav`/`playSuccessWav` |

