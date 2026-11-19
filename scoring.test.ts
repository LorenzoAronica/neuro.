import { describe, expect, it } from 'vitest';
import { categories, optionIds, questions } from '../data/questions';
import { scoreAnswers } from '../utils/scoring';
describe('transparent scoring', () => {
  it('returns zero for no answers, without inventing a strength', () => {
    const r = scoreAnswers([]); expect(r.correct).toBe(0); expect(r.percentage).toBe(0); expect(r.strengths).toEqual([]);
  });
  it('returns zero for thirty incorrect answers', () => {
    const r = scoreAnswers(questions.map(q => optionIds.find(id => id !== q.correct)!)); expect(r.correct).toBe(0); expect(r.categories.every(c => c.correct === 0)).toBe(true);
  });
  it('returns full marks and four tied categories for all correct answers', () => {
    const r = scoreAnswers(questions.map(q => q.correct)); expect(r.correct).toBe(30); expect(r.percentage).toBe(100); expect(r.strengths).toEqual([...categories]);
    expect(r.categories.map(c => [c.correct,c.total])).toEqual([[8,8],[8,8],[7,7],[7,7]]);
  });
  it('returns 24/30 = 80% and consistent category sums', () => {
    const r = scoreAnswers(questions.map((q,i) => i < 24 ? q.correct : null)); expect(r.correct).toBe(24); expect(r.percentage).toBe(80); expect(r.categories.reduce((a,b) => a + b.correct,0)).toBe(r.correct);
  });
  it('compares category fractions instead of raw totals or rounded percentages', () => {
    const limits = { logic: 6, numeric: 5, abstract: 6, verbal: 3 }; const seen = { logic: 0, numeric: 0, abstract: 0, verbal: 0 };
    const r = scoreAnswers(questions.map(q => ++seen[q.category] <= limits[q.category] ? q.correct : null));
    expect(r.strengths).toEqual(['abstract']); expect(r.categories.map(c => c.percentage)).toEqual([75,63,86,43]);
  });
  it('uses no invented IQ, population percentile or intelligence label', () => {
    for (let count=0;count<=30;count++) { const r=scoreAnswers(questions.map((q,i)=>i<count?q.correct:null)); expect(`${r.label} ${r.interpretation}`).not.toMatch(/QI|percentile|genio|superiore alla media|intelligenza elevata/i); }
  });
});
