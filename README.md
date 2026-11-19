# NEURO — Discover Your Mind

Sito statico gratuito in italiano per un test educativo di ragionamento. React, TypeScript e Vite; cervello originale con Three.js e React Three Fiber; animazioni Motion; report locale con jsPDF; verifiche con Vitest e Testing Library.

Nessun backend, account, email, pubblicità, tracciamento, database o chiave API. Il risultato **non è un QI**, un percentile, una diagnosi o una certificazione.

## Avvio sul Mac

1. Installa **Node.js 22.12 o successivo** (Node 24 LTS va bene) da https://nodejs.org.
2. Estrai la cartella `neuro` dall’archivio e apri Terminale nella cartella. Se l’hai estratta in Download:

```sh
cd ~/Downloads/neuro
npm ci
npm run dev
```

3. Apri l’URL locale stampato da Vite, normalmente `http://localhost:5173`.
4. Per fermare il server premi `Ctrl+C`.

```sh
npm run check       # TypeScript + tutti i test automatici
npm run test:watch  # test durante lo sviluppo
npm run build      # sito statico in dist/
npm run preview    # anteprima della build, normalmente porta 4173
```

Serve una connessione per installare le dipendenze. Il sito usa risorse e font ospitati con il progetto; non richiede servizi esterni per correggere le risposte o generare il PDF. Non aprire `dist/index.html` tramite `file://`: usa `npm run preview` oppure un hosting statico.

## Funzionalità

- Home monocromatica con introduzione al QI, quattro aree, percorso, motivazioni, FAQ e inviti al test.
- Geometria originale a due emisferi, circonvoluzioni, cervelletto e tronco; illuminazione, rete 3D e impulsi. Rotazione automatica, trascinamento, reazione al mouse e controlli da tastiera.
- Scena 3D caricata separatamente, risoluzione e geometria ridotte su smartphone; rendering sospeso fuori vista e nelle schede nascoste; vista statica SVG se WebGL fallisce.
- 30 quesiti originali con quattro opzioni: 8 logici, 8 numerici, 7 astratti, 7 verbali. Figure SVG originali e descrizioni accessibili.
- Navigazione libera, riepilogo delle risposte, cronometro senza scadenza, conferma della consegna, blocco delle consegne incomplete.
- Salvataggio automatico, recupero dopo ricarica, validazione dei dati locali e funzionamento in memoria se localStorage non è disponibile.
- Risultati totali e per area, commenti deterministici locali, spiegazioni di tutte le soluzioni, download PDF A4, condivisione del solo link del sito.
- Pagine Metodo e Privacy; cancellazione dei soli dati NEURO con conferma.
- Navigazione tramite hash, compatibile con qualsiasi sottopercorso statico, e asset gestiti da Vite.
- Font Inter variabile locale; favicon originale, Open Graph con PNG, robots.txt e sitemap generati in build.

## Struttura

```text
neuro/
├── .github/workflows/deploy.yml  # test, build e GitHub Pages
├── .openai/hosting.json         # solo anteprima Sites, non necessaria a Pages
├── public/                     # favicon, immagine social, licenza del font
├── scripts/seo.ts              # metadati e sitemap con URL di destinazione
├── src/
│   ├── animations/             # reveal rispettando reduced-motion
│   ├── components/             # logo, controlli, dialoghi, SVG dei quesiti
│   ├── data/questions.ts       # banca domande e metadati delle aree
│   ├── features/test/          # sessione, validazione e cronometro
│   ├── hooks/useSession.ts     # persistenza e gestione del tempo
│   ├── pages/                  # home, test, risultati, informazioni
│   ├── styles/                 # design e breakpoint responsive
│   ├── three/                  # geometria, scena e fallback
│   ├── utils/                  # correzione e generazione PDF
│   └── tests/                  # dati, soluzioni, UI, sessione, PDF, geometria
├── docs/                       # verifiche e revisione dei quesiti
├── package-lock.json
└── vite.config.ts
```

## Pubblicare gratis su GitHub Pages

Per un account GitHub gratuito usa un **repository pubblico**. Il sito pubblico non richiede accesso ai visitatori. La pubblicazione su GitHub Pages è preparata, ma non è stata eseguita nel tuo account GitHub.

1. Accedi a GitHub e crea un nuovo repository pubblico, per esempio `neuro`. Lascia disattivate le opzioni per creare README, licenza e `.gitignore` perché sono già nel progetto.
2. Nella cartella estratta apri Terminale. Sostituisci `TUO-USERNAME` con il tuo nome utente GitHub:

```sh
git init -b main
git add .
git commit -m "Create NEURO reasoning experience"
git remote add origin https://github.com/TUO-USERNAME/neuro.git
git push -u origin main
```

Se Git richiede l’identità, configura `git config user.name "Il tuo nome"` e `git config user.email "la-tua-email-o-email-noreply-GitHub"`, quindi ripeti il commit. Per il push usa l’autenticazione GitHub disponibile sul Mac, ad esempio GitHub Desktop o `gh auth login`; GitHub non accetta la password dell’account per Git via HTTPS.

3. Nel repository apri **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. Apri **Actions → Build, test and deploy NEURO to GitHub Pages → Run workflow**, scegli `main` e avvia. Questo rilancia la pipeline anche se il primo push è avvenuto prima di attivare Pages.
5. Quando entrambi i job `build` e `deploy` sono verdi, apri l’URL mostrato dal job di deploy o da **Settings → Pages**. Normalmente sarà `https://TUO-USERNAME.github.io/neuro/`.

I push successivi a `main` avviano automaticamente controlli e pubblicazione. Se i test falliscono, la pubblicazione viene bloccata.

### Sottopercorsi, repository diversi e dominio personalizzato

Il workflow legge `base_path` e `base_url` da `actions/configure-pages`. Imposta automaticamente `VITE_BASE_PATH` e `VITE_SITE_URL`, quindi gestisce `/neuro/`, qualsiasi altro nome di repository e i domini personalizzati. Non serve cambiare il codice.

Le schermate usano `#/test`, `#/risultati`, `#/privacy` e `#/metodo`: non richiedono riscritture del server, un backend o `404.html`. Le importazioni di codice, i font e i CSS rispettano la base Vite. La geometria 3D viene creata dal codice e non richiede percorsi a modelli esterni.

Per una build manuale a un indirizzo già noto:

```sh
VITE_BASE_PATH=/neuro/ VITE_SITE_URL=https://TUO-USERNAME.github.io/neuro/ npm run build
```

Senza `VITE_SITE_URL`, la build usa percorsi relativi e una sitemap senza URL: non inventa un dominio. Il workflow Pages fornisce l’indirizzo reale e genera sitemap e metadati assoluti. I metadati social e la sitemap si riferiscono alla home; le schermate del test non sono pagine SEO distinte.

## Correzione, tempo e privacy

Ogni risposta corretta vale 1 punto, totale massimo 30. Le percentuali sono arrotondate solo per la visualizzazione. Le aree di maggiore facilità sono confrontate usando le frazioni esatte; con zero risposte corrette non viene attribuito alcun punto di forza. I commenti sono regole locali, senza AI esterna.

Il cronometro misura il tempo trascorso con la schermata del test aperta, incluse schede in secondo piano. Si ferma quando esci dalla schermata o chiudi il sito. La precisione pratica è dell’ordine di un secondo e non influisce sulla correzione. Il nome del PDF usa la data locale del completamento, anche per prove iniziate un altro giorno.

Chiave localStorage: `neuro.reasoning.session.v1`. La sessione include versione della banca, risposte, indice corrente, tempo e date. I punteggi vengono sempre ricalcolati. Se il salvataggio è corrotto o incompatibile, l’app offre una nuova prova senza bloccarsi. Il pulsante Privacy cancella solo questa chiave.

## Verifiche e limiti

Vedi [docs/QA.md](docs/QA.md) per i controlli effettivamente eseguiti e [docs/QUESTION-REVIEW.md](docs/QUESTION-REVIEW.md) per la revisione delle 30 soluzioni.

I test DOM non sostituiscono una prova visiva in un browser reale. Prima di una diffusione pubblica, controlla il layout sui dispositivi target, la resa WebGL e il download nel browser scelto. Una GPU/browser senza WebGL riceve il fallback statico e può comunque completare il test.

Il test non è uno strumento psicometrico validato. Le fasce descrittive si riferiscono alla prestazione sui quesiti. Ripetere le stesse domande dopo aver letto le soluzioni può influenzare il risultato.

## Licenze e attribuzioni

Codice, quesiti, geometria 3D, icone e illustrazioni originali: licenza MIT in `LICENSE`. Nessun modello 3D esterno. Inter di Rasmus Andersson: SIL Open Font License, distribuita in `public/INTER-LICENSE.txt`. Le dipendenze mantengono le rispettive licenze open source; le versioni riproducibili sono in `package-lock.json`.
