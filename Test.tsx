import { useCallback, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { Session } from '../features/test/session';
import { finishSession, formatTime } from '../features/test/session';
import { categoryInfo, questions } from '../data/questions';
import { Logo } from '../components/Logo';
import { Icon } from '../components/Icon';
import { QuestionVisual, ShapeGraphic } from '../components/QuestionVisual';
import { ConfirmDialog } from '../components/ConfirmDialog';

export default function Test({ session, update, restart, onFinish }: { session: Session; update: (session: Session) => void; restart: () => void; onFinish: () => void }) {
  const [dialog, setDialog] = useState<'finish' | 'restart' | null>(null);
  const [missing, setMissing] = useState(false);
  const [navigator, setNavigator] = useState(false);
  const focusQuestion = useCallback((node: HTMLHeadingElement | null) => {
    if (node && !document.querySelector('[role="dialog"]')) node.focus({ preventScroll: true });
  }, []);
  const reduced = useReducedMotion();
  const question = questions[session.index];
  const answered = session.answers.filter(Boolean).length;
  function go(index: number) { update({ ...session, index }); window.scrollTo({ top: 0, behavior: 'instant' }); }
  function requestFinish() { if (answered !== questions.length) { setMissing(true); setNavigator(true); } else setDialog('finish'); }
  return <div className="test-shell"><header className="test-header container"><Logo compact /><div className="test-header-label mono">LA TUA ESPLORAZIONE</div><a href="#/" className="quiet-link">Salva ed esci<Icon name="close" size={16} /></a></header>
    <main id="main" className="test-main"><div className="test-progress-info"><span className="mono">Domanda <strong>{String(session.index + 1).padStart(2, '0')}</strong><span className="muted"> di 30</span></span><span className="timer" aria-label={`Tempo trascorso ${formatTime(session.elapsedMs)}`}><Icon name="clock" size={16} /><span>{formatTime(session.elapsedMs)}</span><span className="timer-note">senza scadenza</span></span></div>
      <div className="progress-track" role="progressbar" aria-label="Domande con risposta" aria-valuenow={answered} aria-valuemin={0} aria-valuemax={30} aria-valuetext={`${answered} risposte su 30`}><span style={{ width: `${answered / 30 * 100}%` }} /></div>
      <div className="test-category-row"><span className="category-badge"><Icon name={question.category} size={15} />{categoryInfo[question.category].name}</span><span className="difficulty mono"><span className={`difficulty-bars ${question.difficulty}`} aria-hidden="true"><i /><i /><i /></span>{question.difficulty}</span></div>
      <AnimatePresence mode="wait" initial={false}><motion.div key={question.id} className="question-panel" initial={reduced ? false : { opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: reduced ? 0 : 0.16 }}>
        <h1 ref={focusQuestion} tabIndex={-1}>{question.prompt}</h1>
        {question.context && <p className={`question-context ${question.category === 'numeric' && question.context.includes('·') ? 'number-sequence' : ''}`} id="question-context">{question.context}</p>}
        {question.visual && <QuestionVisual visual={question.visual} />}
        <fieldset className={`answer-options ${question.options[0].shape ? 'visual-options' : ''}`}><legend className="sr-only">Scegli una risposta per la domanda {session.index + 1}</legend>{question.options.map((option, i) => <label key={option.id} className={`answer-option ${session.answers[session.index] === option.id ? 'selected' : ''}`}>
          <input type="radio" name={`answer-${question.id}`} value={option.id} checked={session.answers[session.index] === option.id} onChange={() => { const answers = [...session.answers]; answers[session.index] = option.id; update({ ...session, answers }); }} />
          <span className="answer-letter">{String.fromCharCode(65 + i)}</span>{option.shape && <ShapeGraphic shape={option.shape} className="answer-shape" />}<span className={option.shape ? 'visual-answer-label' : 'answer-text'}>{option.label}</span><span className="answer-indicator">{session.answers[session.index] === option.id && <Icon name="check" size={15} />}</span>
        </label>)}</fieldset>
      </motion.div></AnimatePresence>
      <div className="test-navigation"><button className="button secondary" onClick={() => go(session.index - 1)} disabled={session.index === 0}><Icon name="back" size={17} />Indietro</button><span className="test-nav-hint">Una risposta. Un punto.<br /><span className="muted">La velocità non conta.</span></span>{session.index === questions.length - 1 ? <button className="button primary" onClick={requestFinish}>Termina<Icon name="check" size={18} /></button> : <button className="button primary" onClick={() => go(session.index + 1)}>Avanti<Icon name="arrow" size={18} /></button>}</div>
      {missing && answered < 30 && <div className="missing-notice" role="alert">Mancano {30 - answered} risposte. Completa le domande indicate qui sotto prima di consegnare.<button onClick={() => go(session.answers.findIndex(a => a === null))}>Vai alla prima domanda senza risposta<Icon name="arrow" size={16} /></button></div>}
      <div className="test-tools"><button className="quiet-link" aria-expanded={navigator} aria-controls="question-navigator" onClick={() => setNavigator(!navigator)}>{answered}/30 risposte<span aria-hidden="true">{navigator ? '−' : '+'}</span></button><span className="saved-label"><Icon name="shield" size={13} />Salvataggio locale automatico</span><button className="quiet-link muted" onClick={() => setDialog('restart')}>Ricomincia</button></div>
      {navigator && <nav id="question-navigator" className="question-navigator" aria-label="Vai a una domanda">{questions.map((q, i) => <button key={q.id} className={`${session.answers[i] ? 'answered' : ''} ${session.index === i ? 'current' : ''}`} aria-label={`Domanda ${i + 1}, ${session.answers[i] ? 'con risposta' : 'senza risposta'}`} aria-current={session.index === i ? 'step' : undefined} onClick={() => go(i)}>{i + 1}</button>)}<p>Le caselle piene hanno una risposta. Puoi rivederle in qualsiasi momento.</p></nav>}
      <p className="test-privacy-note">Le risposte restano in questo browser. <a href="#/privacy">Privacy e dati locali</a></p>
    </main>
    {dialog && <ConfirmDialog title={dialog === 'finish' ? 'Vuoi consegnare la prova?' : 'Vuoi ricominciare?'} confirmLabel={dialog === 'finish' ? 'Scopri il risultato' : 'Ricomincia il test'} onCancel={() => setDialog(null)} onConfirm={() => { if (dialog === 'finish') { update(finishSession(session)); onFinish(); } else { restart(); setMissing(false); setNavigator(false); } setDialog(null); }}><p>{dialog === 'finish' ? 'Hai risposto a tutte le 30 domande. Dopo la consegna vedrai il punteggio e le spiegazioni. Puoi ancora annullare e rivedere le risposte.' : 'Le risposte e il tempo della prova attuale verranno cancellati. La nuova prova contiene le stesse domande: la familiarità può influenzare il risultato.'}</p></ConfirmDialog>}
  </div>;
}
