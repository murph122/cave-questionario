# CAVE Questionario (v0.1)

Sito statico per **prenotazione esperimento** + **questionari stress / CAVE**.  
Stack: Vite + React + TypeScript · Deploy: Vercel · Dati: Google Sheets (webhook).

Guida di progetto: `../CAVE-Questionario-Guida.md`

## Avvio locale

```bash
cd cave-questionario
npm install
npm run dev
```

Apri l’URL mostrato da Vite (di solito `http://localhost:5173`).

> In locale le API `/api/*` non girano con `vite` puro: prenotazioni e risposte vengono salvate in **localStorage** come fallback. Per provare le API usa `vercel dev` oppure deploy su Vercel.

## Pagine

| Path | Contenuto |
|------|-----------|
| `/` | Benvenuto |
| `/prenota` | Prenotazione (lun–ven, 28/09–09/10/2026) |
| `/anagrafica` | Dati anagrafici |
| `/parte-1` | PSS-10 |
| `/parte-2` | SAM + SSSQ + IEQ-SF + IPQ |
| `/parte-3` | SSQ / SUS (placeholder) |
| `/grazie` | Conferma |

## Deploy su Vercel

1. Crea repo GitHub e pusha questa cartella.  
2. Importa il progetto su [Vercel](https://vercel.com).  
3. (Opzionale ma consigliato) Imposta la variabile d’ambiente:

```
SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXX/exec
```

4. Deploy.

### Google Apps Script (opzionale, per Sheets)

1. Crea un Google Sheet con il tuo account `xinyumao396@gmail.com`.  
2. Estensioni → Apps Script, incolla uno script che in `doPost` scrive su fogli `Bookings` / `Responses`, e in `doGet?action=listBookings` restituisce `{ taken: ["2026-09-29|S1", ...] }`.  
3. Distribuisci come Web App (accesso: chiunque).  
4. Copia l’URL in `SHEETS_WEBHOOK_URL` su Vercel.

Senza webhook, le API rispondono comunque in modalità `demo` (memoria volatile sull’istanza serverless).

## Note v0.1

- Codice anonimo automatico: `CAVE-XXXX`  
- DEM1, IPQ7+, SSQ, SUS: placeholder bilingue  
- Capacità slot: 1 persona  
- Contatto obbligatorio: email **o** telefono  

## Script

```bash
npm run dev      # sviluppo
npm run build    # build produzione
npm run preview  # anteprima build
```
