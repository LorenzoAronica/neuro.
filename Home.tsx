import { motion, useReducedMotion } from 'motion/react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Icon } from '../components/Icon';
import { BrainViewport } from '../three/BrainViewport';
import { Reveal } from '../animations/Reveal';
import { categories, categoryInfo } from '../data/questions';

export default function Home({ start, resume, completed }: { start: () => void; resume: boolean; completed: boolean }) {
  const reduced = useReducedMotion();
  const cta = resume ? 'RIPRENDI IL TEST' : completed ? 'VEDI IL RISULTATO' : 'INIZIA IL TEST';
  return <><Header start={start} cta={resume ? 'Riprendi il test' : completed ? 'Il tuo risultato' : 'Inizia il test'} /><main id="main">
    <section className="hero container" aria-labelledby="hero-title">
      <div className="hero-copy">
        <motion.div initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="hero-eyebrow"><span className="tiny-cross">✳</span> UNO SPAZIO PER LA TUA CURIOSITÀ</motion.div>
        <h1 id="hero-title">{['QUANTO', 'CONOSCI LA', 'TUA MENTE?'].map((line, i) => <span className="title-line" key={line}><motion.span initial={reduced ? false : { y: '105%' }} animate={{ y: 0 }} transition={{ delay: 0.1 + i * 0.1, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}>{line}</motion.span></span>)}</h1>
        <Reveal delay={0.3}><p className="hero-description">Metti alla prova il tuo ragionamento, scopri i tuoi punti di forza e affronta nuove sfide cognitive.</p>
          <button className="button primary hero-button" onClick={start}>{cta}<span className="button-arrow"><Icon name="arrow" /></span></button>
          <p className="hero-meta">30 domande <span>·</span> Gratuito <span>·</span> Nessuna registrazione</p>
          {resume && <p className="resume-note">Le tue risposte sono qui. Continua da dove eri rimasto.</p>}
        </Reveal>
      </div>
      <div className="hero-brain"><BrainViewport /><span className="hero-brain-tag" aria-hidden="true">COMPLESSITÀ NATURALE.<br />NUOVE CONNESSIONI.</span></div>
      <a href="#progetto" className="scroll-cue"><span>SCOPRI NEURO</span><span aria-hidden="true">↓</span></a>
    </section>
    <div className="hero-facts container"><div><span className="fact-number">30<span> /</span></span><p>DOMANDE ORIGINALI</p></div><div><span className="fact-number">04<span> /</span></span><p>AREE DI RAGIONAMENTO</p></div><div><span className="fact-number">100<span>%</span></span><p>GRATUITO, SEMPRE</p></div><p className="facts-note">Nessun account.<br />Solo tu e il tuo ragionamento.<Icon name="shield" size={23} /></p></div>
    <section id="progetto" className="intro-section light-section"><div className="container intro-grid">
      <Reveal><span className="section-kicker">01 / UNO SGUARDO CONSAPEVOLE</span><h2>COS’È IL QUOZIENTE<br />INTELLETTIVO?</h2><p className="intro-statement">La mente è molto più<br />di un numero<span>.</span></p><a href="#/metodo" className="text-link">Leggi il metodo e i limiti<Icon name="arrow" size={17} /></a></Reveal>
      <Reveal delay={0.12} className="intro-text"><p>Il quoziente intellettivo, o QI, è un indice ricavato da test standardizzati: prove costruite con procedure precise e confrontate con campioni di riferimento.</p><p>Questi strumenti possono esplorare abilità come ragionamento, comprensione verbale, memoria di lavoro e velocità di elaborazione. La loro interpretazione richiede strumenti validati e un contesto adeguato.</p><div className="method-note"><span aria-hidden="true">↗</span><p><strong>NEURO è un esercizio, non una diagnosi.</strong> Questo test online non è standardizzato né validato clinicamente. Il risultato racconta la tua prestazione sui nostri quesiti: non misura il QI o l’intelligenza generale.</p></div></Reveal>
    </div></section>
    <section id="capacita" className="capabilities-section section-space container"><Reveal><div className="section-topline"><span className="section-kicker">02 / QUATTRO PROSPETTIVE</span><span className="mono muted">LOGICA. NUMERI. SCHEMI. PAROLE.</span></div><h2>COSA METTERAI<br />ALLA PROVA<span className="muted">?</span></h2><p className="section-lead">Modi diversi di osservare. Una sola mente da esplorare.</p></Reveal>
      <div className="capability-grid">{categories.map((category, i) => <Reveal key={category} delay={i * 0.07} className="capability-card"><div className="capability-top"><span className="mono">0{i + 1}</span><span className="mono muted">{categoryInfo[category].total} QUESITI</span></div><div className="capability-art"><Icon name={category} size={62} /></div><h3>{categoryInfo[category].name}</h3><p>{categoryInfo[category].description}</p><span className="card-corner" aria-hidden="true">↗</span></Reveal>)}</div>
    </section>
    <section id="come-funziona" className="steps-section section-space"><div className="container"><Reveal><div className="section-topline"><span className="section-kicker">03 / IL PERCORSO</span><span className="mono muted">SEMPLICE, DALL’INIZIO ALLA FINE.</span></div><h2>COME FUNZIONA<span className="muted">.</span></h2></Reveal>
      <div className="steps-grid">{[
        ['Inizia il test', 'Trova un momento tranquillo. Nessun account, nessuna scadenza: prenditi lo spazio che ti serve.'],
        ['Rispondi alle 30 domande', 'Affronta difficoltà progressive. Puoi tornare indietro e riprendere la prova su questo browser.'],
        ['Scopri e scarica il risultato', 'Esplora le quattro aree, rileggi le spiegazioni e scarica gratuitamente il tuo report PDF.'],
      ].map(([title, text], i) => <Reveal delay={i * 0.1} key={title} className="step"><span className="step-number">0{i + 1}</span><span className="step-line" /><h3>{title}</h3><p>{text}</p></Reveal>)}</div>
    </div></section>
    <section className="why-section section-space container"><Reveal className="why-heading"><span className="section-kicker">04 / IL VALORE DELLA SFIDA</span><h2>PERCHÉ<br />PROVARLO<span className="muted">?</span></h2><p className="section-lead">Non serve un’etichetta.<br />Basta la voglia di capire.</p><div className="network-emblem" aria-hidden="true"><svg viewBox="0 0 260 180"><g fill="none" stroke="#444"><path d="m28 91 57-62 84 7 58 57-57 61-85-5L28 91Zm57-62 85 125M28 91l199 2M85 149 169 36M85 29v120M169 36l1 118M28 91 170 154M28 91l141-55" /></g><g fill="#bbb">{[[28,91],[85,29],[169,36],[227,93],[170,154],[85,149],[128,92]].map(([x,y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="4" />)}</g></svg><span className="mono muted">MAKE NEW CONNECTIONS.</span></div></Reveal>
      <div className="why-list">{[
        ['Sfida il tuo ragionamento', 'Esci dalle risposte automatiche e prova a costruire un percorso, un indizio alla volta.'],
        ['Cambia punto di vista', 'Confrontati con problemi numerici, relazioni logiche, forme e connessioni tra parole.'],
        ['Osserva le tue prestazioni', 'Scopri le aree che ti sono risultate più accessibili in questa specifica prova.'],
        ['Porta con te ciò che impari', 'Conserva un riepilogo chiaro e rivedi il ragionamento dietro ogni soluzione.'],
      ].map(([title, text], i) => <Reveal key={title} delay={i * 0.06}><div className="why-item"><span className="mono muted">0{i + 1}</span><div><h3>{title}</h3><p>{text}</p></div><Icon name="arrow" size={18} /></div></Reveal>)}</div>
    </section>
    <section className="faq-section container"><Reveal><span className="section-kicker">QUALCHE RISPOSTA, PRIMA DI INIZIARE.</span><div className="faq-grid">
      <details><summary>È un test del QI?<span>+</span></summary><p>È un test di ragionamento ispirato ad alcuni tipi di esercizi presenti nei test cognitivi. Non ha una validazione clinica, non assegna un QI e non permette confronti con la popolazione.</p></details>
      <details><summary>C’è un limite di tempo?<span>+</span></summary><p>No. Un cronometro informativo mostra il tempo trascorso nella schermata del test. Non ci sono scadenze e la velocità non cambia il punteggio.</p></details>
      <details><summary>Dove finiscono le mie risposte?<span>+</span></summary><p>Restano nel localStorage di questo browser. Il test e il PDF vengono elaborati sul tuo dispositivo. Puoi cancellare il salvataggio dalla pagina Privacy e dati locali.</p></details>
      <details><summary>È tutto davvero gratuito?<span>+</span></summary><p>Sì. Test, risultati, spiegazioni e PDF sono gratuiti. Non chiediamo registrazione, email o pagamenti e non inseriamo pubblicità.</p></details>
    </div></Reveal></section>
    <section className="final-cta container"><Reveal><span className="section-kicker">IL PROSSIMO PASSO È TUO.</span><h2>PRONTO A METTERTI<br />ALLA PROVA<span>?</span></h2><button className="button primary" onClick={start}>{resume ? 'RIPRENDI LA TUA PROVA' : completed ? 'ESPLORA IL TUO RISULTATO' : 'INIZIA ORA — È GRATIS'}<Icon name="arrow" /></button><p>Niente da dimostrare. Qualcosa da scoprire.</p></Reveal><span className="cta-watermark" aria-hidden="true">N</span></section>
  </main><Footer /></>;
}
