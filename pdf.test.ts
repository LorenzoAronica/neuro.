import { describe, expect, it } from 'vitest';
import { createReport, localDateKey } from '../utils/pdf';
import { finishSession, newSession } from '../features/test/session';
import { questions } from '../data/questions';

describe('local PDF report', () => {
  it('generates one A4 page with the correct filename and PDF header', () => {
    const s=newSession(new Date('2026-11-15T10:00:00Z')); s.answers=questions.map(q=>q.correct);s.elapsedMs=360000;
    const {doc,filename}=createReport(finishSession(s,new Date('2026-11-15T10:06:00Z')));
    expect(doc.getNumberOfPages()).toBe(1);expect(doc.internal.pageSize.getWidth()).toBeCloseTo(210,0);expect(doc.internal.pageSize.getHeight()).toBeCloseTo(297,0);
    expect(filename).toBe('NEURO-Risultato-2026-11-15.pdf'); expect(doc.output().slice(0,8)).toBe('%PDF-1.3');expect(doc.output()).toContain('NEURO - Il tuo risultato');
  });
  it('uses completion day, including for a test started the previous day', () => {
    const s=newSession(new Date('2026-11-14T12:00:00Z'));s.answers=questions.map(q=>q.correct);
    expect(createReport(finishSession(s,new Date('2026-11-15T12:00:00Z'))).filename).toContain(localDateKey('2026-11-15T12:00:00Z'));
  });
  it('rejects incomplete report generation',()=>expect(()=>createReport(newSession())).toThrow('completa'));
});
