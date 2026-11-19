import { useEffect, useMemo, useState } from 'react';
import { animate, motion, useReducedMotion } from 'motion/react';
import type { Session } from '../features/test/session';
import { formatTime } from '../features/test/session';
import { categoryInfo, questions } from '../data/questions';
import { scoreAnswers } from '../utils/scoring';
import { Logo } from '../components/Logo';
import { Icon } from '../components/Icon';
import { Reveal } from '../animations/Reveal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Footer } from '../components/Footer';
import { QuestionVisual } from '../components/QuestionVisual';

export default function Results({ session, restart }: { session: Session; restart: () => void }) {
  const result = useMemo(() => scoreAnswers(session.answers), [session.answers]);
  const [displayScore, setDisplayScore] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const [pdfState, setPdfState] = useState<'idle' | 'loading'>('idle');
  const [message, setMessage] = useState('');
  const [copyLink, setCopyLink] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) { setDisplayScore(result.correct); return; }
    const control = animate(0, result.correct, { duration: 1.3, ease: 'easeOut', onUpdate: v => setDisplayScore(Math.round(v)) });
    return () => control.stop();
  }, [result.correct, reduced]);
  const homeUrl = new URL(window.location.href); homeUrl.hash = '/';
  async function download() {
    if (pdfState === 'loading') return;
    setPdfState('loading'); setMessage('');
    try { const { downloadReport } = await import('../utils/pdf'); downloadReport(session); setMessage('Il PDF è stato creato. Controlla i download del browser.'); }
    catch { setMessage('Non è stato possibile creare il PDF. Riprova: il risultato rimane salvato in questo browser.'); }
    finally { setPdfState('idle'); }
  }
  async function share() {
    try {
      if (navigator.share) { await navigator.share({ title: 'NEURO — Discover Your Mind', text: '30 domande per esplorare il tuo ragionamento. Gratuito, senza registrazione.', url: homeUrl.href }); setMessage('Condivisione completata.'); }
      else if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(homeUrl.href); setMessage('Link del sito copiato. Il punteggio rimane privato.'); }
      else setCopyLink(true);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setCopyLink(true);
    }
  }
  return <><header className="results-header container"><Logo compact /><a href="#/" className="quiet-link">Torna alla home<Icon name="arrow" size={16} /></a></header><main id="main" className="results-main container">
    <section className="result-hero"><Reveal><span className="result-complete"><Icon name="check" size={13} />ESPLORAZIONE COMPLETATA</span><h1>IL TUO RISULTATO<span>.</span></h1><p>Un nuovo punto di vista sul tuo ragionamento.</p></Reveal>
      <div className="score-composition"><div className="score-orbit" aria-hidden="true"><div /><div /><div /><i /><i /><i /></div><div className="score-number" aria-label={`${result.correct} risposte corrette su 30`}><span aria-hidden="true">{String(displayScore).padStart(2, '0')}</span><span className="score-denominator" aria-hidden="true">/ 30</span></div><p className="result-percentage">{result.percentage}% <span>di risposte corrette</span></p></div>
      <Reveal delay={0.25}><div className="result-meta"><div><Icon name="clock" size={18} /><span>{formatTime(session.elapsedMs)}<small>TEMPO TRASCORSO</small></span></div><div><Icon name="check" size={18} /><span>30 di 30<small>DOMANDE COMPLETATE</small></span></div><div><Icon name="shield" size={18} /><span>Solo sul tuo dispositivo<small>IL TUO RISULTATO È PRIVATO</small></span></div></div></Reveal>
    </section>
    <section className="category-results" aria-labelledby="category-title"><Reveal><div className="section-topline"><span className="section-kicker">IL DETTAGLIO DELLA PROVA</span><span className="mono muted">OGNI CONNESSIONE CONTA.</span></div><h2 id="category-title">QUATTRO AREE.<br />IL TUO PERCORSO.</h2></Reveal><div className="result-categories-grid">{result.categories.map((score, i) => <Reveal key={score.category} delay={i * 0.08} className="category-result-card"><div className="category-result-top"><Icon name={score.category} size={29} /><span className="mono muted">0{i + 1}</span></div><h3>{categoryInfo[score.category].name}</h3><p className="category-score">{score.correct}<span> / {score.total}</span></p><div className="category-bar" role="img" aria-label={`${score.percentage}% di risposte corrette in ${categoryInfo[score.category].name}`}><motion.span initial={reduced ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.1 }} style={{ width: `${score.correct / score.total * 100}%` }} /></div><p className="category-percentage">{score.percentage}% di risposte corrette</p></Reveal>)}</div></section>
    <Reveal className="interpretation"><div><span className="section-kicker">UNO SPUNTO DI RIFLESSIONE</span><h2>{result.label}<span>.</span></h2></div><div><p>{result.interpretation}</p><p className="small muted">Le aree sono confrontate tramite la percentuale di risposte corrette, perché contengono numeri diversi di domande. Queste indicazioni non rappresentano livelli di intelligenza generale.</p></div></Reveal>
    <section className="report-section"><Reveal><Icon name="download" size={30} /><h2>LA TUA ESPLORAZIONE,<br />DA PORTARE CON TE.</h2><p>Un report chiaro con punteggi, grafici e nota metodologica.<br />Generato su questo dispositivo. Sempre gratuito.</p><div className="result-actions"><button className="button primary" onClick={download} disabled={pdfState === 'loading'}>{pdfState === 'loading' ? 'CREAZIONE DEL PDF…' : 'SCARICA IL RISULTATO'}<Icon name="download" size={18} /></button><button className="button secondary" onClick={share}>CONDIVIDI IL SITO<Icon name="share" size={17} /></button></div><p className="action-message" role="status">{message}</p>{copyLink && <label className="copy-link">Copia questo link:<input value={homeUrl.href} readOnly onFocus={e => e.currentTarget.select()} /></label>}</Reveal></section>
    <section className="review-section"><Reveal><div className="section-topline"><span className="section-kicker">LA CURIOSITÀ CONTINUA</span><span className="mono muted">30 DOMANDE / 30 SPIEGAZIONI</span></div><h2>DIETRO OGNI RISPOSTA.</h2><p className="section-lead">Apri una domanda per scoprire il ragionamento.</p></Reveal><div className="review-list">{questions.map((q, i) => { const chosen = q.options.find(o => o.id === session.answers[i])!; const correct = q.options.find(o => o.id === q.correct)!; const match = chosen.id === correct.id; return <details key={q.id} className="review-item"><summary><span className="mono muted">{String(i + 1).padStart(2, '0')}</span><span>{categoryInfo[q.category].name}</span><span className="review-state">{match ? <><Icon name="check" size={14} />Corretta</> : 'Da rivedere'}</span><span className="review-plus">+</span></summary><div className="review-body"><h3>{q.prompt}</h3>{q.context && <p>{q.context}</p>}{q.visual && <QuestionVisual visual={q.visual} />}<p>La tua risposta: <strong>{chosen.label}</strong></p>{!match && <p>Risposta corretta: <strong>{correct.label}</strong></p>}<p className="review-explanation">{q.explanation}</p></div></details>; })}</div></section>
    <div className="result-end"><p>Questa prova non è standardizzata e non misura il QI clinico.<br />Non fornisce diagnosi, certificazioni o confronti con la popolazione.</p><div><button className="button secondary" onClick={() => setConfirm(true)}>RIFAI IL TEST<Icon name="rotate" size={16} /></button><a className="text-link" href="#/">TORNA ALLA HOME<Icon name="arrow" size={16} /></a></div></div>
  </main><Footer />{confirm && <ConfirmDialog title="Un’altra esplorazione?" confirmLabel="Rifai il test" onCancel={() => setConfirm(false)} onConfirm={() => { setConfirm(false); restart(); }}><p>Il risultato attuale verrà sostituito. Scarica prima il PDF se vuoi conservarlo. Ritroverai le stesse domande: conoscere già le soluzioni può cambiare la prestazione.</p></ConfirmDialog>}</>;
}
