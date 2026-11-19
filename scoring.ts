import { categories, categoryInfo, questions } from '../data/questions';
import type { Category, OptionId } from '../data/questions';

export interface CategoryScore { category: Category; correct: number; total: number; percentage: number }
export interface Result {
  correct: number; total: number; percentage: number; categories: CategoryScore[];
  strengths: Category[]; interpretation: string; label: string;
}
export function scoreAnswers(answers: (OptionId | null)[]): Result {
  const scores = categories.map(category => {
    const indices = questions.flatMap((q, i) => q.category === category ? [i] : []);
    const correct = indices.filter(i => answers[i] === questions[i].correct).length;
    return { category, correct, total: indices.length, percentage: Math.round(correct / indices.length * 100) };
  });
  const correct = scores.reduce((sum, s) => sum + s.correct, 0);
  // Compare exact fractions. The categories have different totals (8 or 7).
  const best = scores.reduce((a, b) => a.correct * b.total >= b.correct * a.total ? a : b);
  const strengths = correct === 0 ? [] : scores.filter(s => s.correct * best.total === best.correct * s.total).map(s => s.category);
  const label = correct >= 26 ? 'Prestazione molto accurata' : correct >= 20 ? 'Prestazione solida' : correct >= 10 ? 'Spazio per nuove connessioni' : 'Un punto di partenza';
  const opening = `Hai risolto correttamente ${correct} ${correct === 1 ? 'esercizio' : 'esercizi'} su ${questions.length}.`;
  const strengthText = !strengths.length ? 'Rileggi le spiegazioni e prova ad affrontare un problema alla volta.' : strengths.length === 4 ? 'La percentuale di risposte corrette è uguale nelle quattro aree.' : `In questa prova, ${strengths.map(c => categoryInfo[c].name.toLowerCase()).join(' e ')} ${strengths.length === 1 ? 'è l’area con la maggiore percentuale' : 'sono le aree con la maggiore percentuale'} di risposte corrette.`;
  return { correct, total: questions.length, percentage: Math.round(correct / questions.length * 100), categories: scores, strengths, label, interpretation: `${opening} ${strengthText} Il risultato descrive soltanto questa prova: familiarità con i quesiti, attenzione e contesto possono influenzarlo.` };
}
