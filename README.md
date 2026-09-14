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

## Dove vedere i dati (Google Sheet diretto)

**Importante:** il sito scrive **direttamente** su questo Google Sheet (non più tramite formResponse):

https://docs.google.com/spreadsheets/d/1lULR-CpicCsOZQT7BqidPj6tO10IqpnHde_MMaFF1oQ/edit

### Setup una tantum (obbligatorio)

1. Apri lo Sheet sopra → **Estensioni → Apps Script**
2. Incolla il contenuto di `apps-script/Code.gs` → Salva
3. **Deploy → Nuova distribuzione → App Web**
   - Esegui come: Me
   - Chi può accedere: Anyone
4. Copia l’URL `/macros/s/.../exec`
5. Crea `.env` nella root del progetto:

```bash
cp .env.example .env
# poi metti:
SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXX/exec
```

6. Riavvia `npm run dev`

Su Vercel: Project → Settings → Environment Variables → stessa `SHEETS_WEBHOOK_URL`.

**Flusso dati:** anagrafica + PSS in locale → a fine **Parte 2** viene aggiunta **una riga** allo Sheet. 

## Script

```bash
npm run dev      # sviluppo
npm run build    # build produzione
npm run preview  # anteprima build
```
