import { jsPDF } from 'jspdf';
import { categoryInfo } from '../data/questions';
import type { Session } from '../features/test/session';
import { formatTime } from '../features/test/session';
import { scoreAnswers } from './scoring';

export const DISCLAIMER = 'Questo documento riporta il risultato di un esercizio online di ragionamento. Non costituisce una certificazione del quoziente intellettivo né una valutazione psicodiagnostica.';
export function localDateKey(iso: string): string {
  const date = new Date(iso);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
const printable = (text: string) => text.replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, '-').replace(/×/g, 'x').replace(/−/g, '-');
export function createReport(session: Session): { doc: jsPDF; filename: string } {
  if (session.status !== 'completed' || !session.completedAt || session.answers.some(a => a === null)) throw new Error('Il report richiede una prova completa.');
  const result = scoreAnswers(session.answers);
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
  doc.setProperties({ title: 'NEURO - Il tuo risultato', subject: 'Personal Reasoning Report', author: 'NEURO', keywords: 'ragionamento, risultato, esercizio' });
  doc.setCreationDate(new Date(session.completedAt));
  const text = (value: string, x: number, y: number, size = 10, color = 20, bold = false) => { doc.setFont('helvetica', bold ? 'bold' : 'normal'); doc.setFontSize(size); doc.setTextColor(color); doc.text(printable(value), x, y); };
  const paragraph = (value: string, x: number, y: number, width: number, size = 9, color = 70) => {
    doc.setFont('helvetica', 'normal'); doc.setFontSize(size); doc.setTextColor(color);
    const lines: string[] = doc.splitTextToSize(printable(value), width);
    doc.text(lines, x, y, { lineHeightFactor: 1.5 });
    return y + lines.length * size * 0.3528 * 1.5;
  };
  doc.setFillColor(0, 0, 0); doc.rect(0, 0, 210, 44, 'F');
  text('NEURO', 18, 22, 24, 255, true); text('DISCOVER YOUR MIND', 18, 32, 7, 190);
  text('PERSONAL REASONING REPORT', 125, 22, 8, 220);
  text(new Date(session.completedAt).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' }), 125, 32, 9, 220);
  text('IL TUO RISULTATO', 18, 61, 9, 90);
  text(String(result.correct).padStart(2, '0'), 16, 96, 63, 0, true); text('/ 30', 63, 95, 20, 130);
  text(`${result.percentage}%`, 126, 77, 26, 0, true); text('di risposte corrette', 126, 85, 9, 90);
  text(formatTime(session.elapsedMs), 126, 98, 15, 20, true); text('tempo trascorso, senza scadenza', 126, 105, 8, 90);
  doc.setDrawColor(215); doc.setLineWidth(0.25); doc.line(18, 116, 192, 116);
  text('QUATTRO MODI DI RAGIONARE', 18, 128, 9, 80);
  result.categories.forEach((score, i) => {
    const y = 141 + i * 15;
    text(categoryInfo[score.category].name, 18, y, 9, 30);
    text(`${score.correct} / ${score.total}    ${score.percentage}%`, 151, y, 9, 30, true);
    doc.setFillColor(232, 232, 232); doc.rect(18, y + 3, 174, 2, 'F');
    if (score.correct) { doc.setFillColor(25, 25, 25); doc.rect(18, y + 3, 174 * score.correct / score.total, 2, 'F'); }
  });
  text(result.label.toUpperCase(), 18, 208, 11, 20, true);
  paragraph(result.interpretation, 18, 218, 174, 9, 65);
  doc.setDrawColor(220); doc.line(18, 246, 192, 246);
  text('NOTA METODOLOGICA', 18, 255, 8, 60, true);
  paragraph('30 quesiti originali. Una risposta corretta vale un punto; nessuna penalità. Il tempo non modifica il punteggio. Il test non è standardizzato: nessun QI, percentile o confronto con la popolazione. I dati e il PDF sono elaborati localmente.', 18, 261, 174, 8, 90);
  paragraph(DISCLAIMER, 18, 279, 174, 7.5, 80);
  text('NEURO / Esercizio educativo gratuito', 18, 293, 6.5, 125); text('01 / 01', 181, 293, 6.5, 125);
  return { doc, filename: `NEURO-Risultato-${localDateKey(session.completedAt)}.pdf` };
}
export function downloadReport(session: Session) { const { doc, filename } = createReport(session); doc.save(filename); }
