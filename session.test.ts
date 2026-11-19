import { describe, expect, it } from 'vitest';
import { finishSession, formatTime, newSession, parseSession } from '../features/test/session';
import { questions } from '../data/questions';

describe('resilient local session', () => {
  it('round trips an active session', () => { const s = newSession(); s.answers[4] = 'c'; s.index = 12; s.elapsedMs=37205; expect(parseSession(JSON.stringify(s))).toEqual(s); });
  it.each([null, '', '{broken', 'null', 'false', '[]', '{}'])('handles missing or corrupt data: %s', raw => { expect(parseSession(raw)).toBeNull(); });
  it.each([{version:2},{bankVersion:'old'},{answers:[]},{answers:Array(30).fill('e')},{index:-1},{index:30},{index:2.5},{elapsedMs:-1},{elapsedMs:'10'},{elapsedMs:1e309},{startedAt:'bad'},{completedAt:'bad'},{status:'unknown'},{status:'completed',completedAt:new Date().toISOString()}])('rejects invalid session fields: %j', patch => { expect(parseSession(JSON.stringify({...newSession(),...patch}))).toBeNull(); });
  it('cannot submit incomplete answers', () => expect(() => finishSession(newSession())).toThrow('Completa'));
  it('retains only validated fields and recomputes results independently', () => { const s = newSession(); expect(parseSession(JSON.stringify({...s,score:999,secret:'extra'}))).toEqual(s); });
  it('round trips a complete session', () => { const s = newSession(new Date('2026-11-15T10:00:00Z')); s.answers = questions.map(q=>q.correct); const completed=finishSession(s,new Date('2026-11-15T10:05:00Z')); expect(parseSession(JSON.stringify(completed))).toEqual(completed); });
  it('formats timers without wrapping after an hour', () => { expect(formatTime(0)).toBe('00:00'); expect(formatTime(61000)).toBe('01:01'); expect(formatTime(3661000)).toBe('1:01:01'); });
});
