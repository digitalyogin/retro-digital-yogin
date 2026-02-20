
# Aggiornamenti alla Pagina Incentivi Statali

## Cosa faremo

### 1. Data di ultimo aggiornamento
Aggiungeremo una costante `LAST_UPDATED` nella pagina Incentivi che mostra chiaramente quando i dati sono stati aggiornati l'ultima volta. Verra' mostrata sotto il titolo nella hero section con un formato tipo:

> Ultimo aggiornamento: 12 Febbraio 2026

Ogni volta che aggiorni manualmente i dati degli incentivi, basta cambiare questa data.

### 2. Banner disclaimer legale
Aggiungeremo un banner/alert ben visibile subito dopo la hero section (prima dei filtri) con un messaggio chiaro che specifica:
- Digital Yogin NON e' affiliato a nessun ente statale o erogatore di fondi
- Il servizio e' un aggregatore di informazioni a beneficio della comunita'
- Si invita sempre a verificare le info sui siti ufficiali

Usera' il componente `Alert` gia' presente nel progetto con un'icona di avviso.

---

## Dettagli tecnici

### File modificato: `src/pages/Incentivi.tsx`

**Costante data aggiornamento** (in cima al file):
```typescript
const LAST_UPDATED = "12 Febbraio 2026";
```

**Nella hero section**, sotto il paragrafo descrittivo:
```
Ultimo aggiornamento dati: 12 Febbraio 2026
```

**Banner disclaimer** tra la hero e i filtri, usando il componente `Alert` con variante default e bordo giallo/arancione per renderlo visibile ma non aggressivo. Testo:

> Questo portale e' un servizio informativo indipendente e NON e' affiliato, associato o sponsorizzato da alcun ente statale, ministeriale o erogatore di fondi. Le informazioni riportate hanno scopo puramente divulgativo. Verifica sempre i dettagli aggiornati sui siti ufficiali degli enti competenti.

### Import aggiuntivi
- `AlertTriangle` da lucide-react per l'icona del disclaimer
- `Alert`, `AlertDescription` da `@/components/ui/alert`
