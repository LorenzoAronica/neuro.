# Verifiche eseguite

Le verifiche qui riportate distinguono test automatici, controllo degli artefatti e controlli che richiedono un browser reale. Non sono una validazione psicometrica.

## Esiti automatici

- `npm run check`: TypeScript senza errori e **90 test superati in 8 file** con Vitest.
- `npm run build`: build di produzione completata con Vite.
- `npm audit --omit=dev`: **0 vulnerabilità** nelle dipendenze di produzione al momento della verifica; jsPDF aggiornato alla versione 4.2.1.
- Build con `VITE_BASE_PATH=/neuro/`: completata. Verificata l’esistenza dei riferimenti iniziali a JavaScript, CSS, font e favicon sotto il sottopercorso.
- Verificato che i motori Three/R3F e PDF non compaiano nei preload iniziali: vengono caricati attraverso le rispettive importazioni differite.
- Verificati Open Graph e sitemap con URL completo e sottopercorso in una build di prova isolata.
- Workflow GitHub Actions analizzato come YAML; presenti i job build e deploy. Non eseguito nell’account GitHub dell’utente.

## Copertura dei test

| Area | Controlli eseguiti |
|---|---|
| Banca domande | 30 ID e testi distinti, quattro opzioni, singola chiave corretta, distribuzione 8/8/7/7, spiegazioni, difficoltà progressiva |
| Soluzioni | Aritmetica indipendente per tutti gli 8 quesiti numerici, trasformazioni per i 7 astratti, enumerazioni dei casi logici complessi |
| Correzione | Nessuna risposta, tutte errate, tutte corrette, 24/30 = 80%, somme per categoria, confronto di frazioni e parità |
| Interfaccia DOM | Percorso completo di 30 risposte, quattro opzioni per domanda, selezione conservata tornando indietro, conferma finale e annullamento |
| Consegna incompleta | Nessun risultato con risposte mancanti, avviso e salto alla prima risposta assente |
| Ricominciare | Conferma prima di eliminare risposte o risultato; Escape annulla; focus iniziale su Annulla |
| Persistenza | Recupero di indice, scelta e tempo; scrittura immediata della risposta; dati corrotti, incompatibili o con valori non validi |
| Storage negato | Il test continua in memoria e informa che il salvataggio non è disponibile |
| Cronometro | Accumulo e persistenza mentre la schermata è aperta; pausa su altre schermate; formattazione oltre un’ora |
| Privacy | Eliminazione della sola chiave NEURO; conservazione delle altre chiavi del browser |
| Risultati | Punteggio e grafici collegati alle risposte; download attivato su richiesta; copia selezionabile se Share e clipboard mancano |
| PDF | Documento singolo A4, intestazione PDF, nome e data locale del completamento, rifiuto delle prove incomplete |
| Geometria | Coordinate finite, emisferi simmetrici e separati, normali, variazioni delle pieghe, cervelletto e rete deterministica |
| WebGL assente | Vista statica accessibile se il contesto manca o genera un’eccezione; assenza dei controlli 3D non utilizzabili |

## Controlli degli artefatti

È stato generato un report locale di prova **24/30, 80%, 08:03**, con **7/8 logica, 7/8 numerica, 5/7 astratta, 5/7 verbale**. Il testo del PDF è stato estratto per confermare i dati e il disclaimer. Tutti i blocchi di testo rientravano nella pagina A4. Il PDF è stato renderizzato e ispezionato visivamente: nessun elemento tagliato e impaginazione leggibile. Il controllo è stato ripetuto dopo l’aggiornamento di jsPDF.

La geometria originale del cervello è stata inoltre renderizzata con un percorso CPU indipendente per controllare la forma bilobata, le circonvoluzioni e il cervelletto. Questo controllo della forma **non verifica** il rendering WebGL nel sito.

La revisione contenutistica delle soluzioni è in [QUESTION-REVIEW.md](QUESTION-REVIEW.md). I quesiti verbali sono stati rivisti semanticamente; un controllo automatico di struttura non dimostra, da solo, l’assenza di ambiguità linguistiche.

## Verifiche rimaste da eseguire nel browser

Gli strumenti di controllo del browser condiviso non erano disponibili nella sessione. Per questo **non sono dichiarati superati** i seguenti controlli:

- resa visiva della home e dei risultati in Chrome e Safari;
- cervello effettivamente visibile nel canvas WebGL, rotazione, illuminazione e impulsi nel browser;
- trascinamento reale con mouse e touch;
- assenza di overflow ai diversi viewport e verifica dei breakpoint mobile;
- prestazioni e frame rate su GPU e smartphone reali;
- download PDF e Web Share nell’interfaccia del browser scelto;
- verifica con lettore di schermo reale e audit completo di accessibilità;
- deploy del workflow GitHub Pages nell’account dell’utente.

I test dell’interfaccia sono eseguiti in jsdom con movimento ridotto; nei test dell’intero percorso la vista 3D viene sostituita per isolare il funzionamento del test. I test della geometria e del fallback sono separati. Non è stato eseguito Lighthouse e non vengono attribuiti punteggi di performance o conformità.

Vite segnala che il chunk 3D supera 500 kB non compressi, circa 242 kB gzip nella build verificata. È un caricamento differito e non blocca l’accesso al test. Il tempo effettivo di caricamento e la fluidità dipendono dal dispositivo e non sono stati misurati.

## Controllo manuale riproducibile

1. Esegui `npm ci`, `npm run check`, `npm run build`, `npm run preview`.
2. Apri la home, ruota il cervello con mouse e pulsanti, poi ripeti da smartphone e con movimento ridotto.
3. Inizia una prova, scegli alcune risposte, ricarica e verifica il recupero. Esci alla home e riprendi.
4. Vai all’ultima domanda senza completare tutto: Termina deve indicare le risposte mancanti.
5. Completa e consegna, confronta le categorie con le soluzioni in `QUESTION-REVIEW.md`, scarica e apri il PDF.
6. Controlla i pulsanti di ripetizione, annullamento e condivisione; prova il fallback con WebGL disabilitato.
7. Dalla pagina Privacy cancella i dati e verifica che non rimanga una prova da riprendere.
