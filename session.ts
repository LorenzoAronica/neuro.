import { BANK_VERSION, optionIds, questions } from '../../data/questions';
import type { OptionId } from '../../data/questions';

export const STORAGE_KEY = 'neuro.reasoning.session.v1';
export interface Session {
  version: 1; bankVersion: string; status: 'active' | 'completed';
  answers: (OptionId | null)[]; index: number; elapsedMs: number;
  startedAt: string; completedAt: string | null;
}
export function newSession(now = new Date()): Session {
  return { version: 1, bankVersion: BANK_VERSION, status: 'active', answers: questions.map(() => null), index: 0, elapsedMs: 0, startedAt: now.toISOString(), completedAt: null };
}
export function parseSession(raw: string | null): Session | null {
  if (!raw) return null;
  try {
    const s = JSON.parse(raw);
    if (!s || s.version !== 1 || s.bankVersion !== BANK_VERSION || !['active', 'completed'].includes(s.status)) return null;
    if (!Array.isArray(s.answers) || s.answers.length !== questions.length || s.answers.some((a: unknown) => a !== null && !optionIds.includes(a as OptionId))) return null;
    if (!Number.isInteger(s.index) || s.index < 0 || s.index >= questions.length) return null;
    if (typeof s.elapsedMs !== 'number' || !Number.isFinite(s.elapsedMs) || s.elapsedMs < 0) return null;
    if (typeof s.startedAt !== 'string' || !Number.isFinite(Date.parse(s.startedAt))) return null;
    if (s.completedAt !== null && (typeof s.completedAt !== 'string' || !Number.isFinite(Date.parse(s.completedAt)))) return null;
    if (s.status === 'completed' && (s.answers.includes(null) || !s.completedAt || Date.parse(s.completedAt) < Date.parse(s.startedAt))) return null;
    if (s.status === 'active' && s.completedAt !== null) return null;
    // Copy only declared fields; never trust stored score or arbitrary properties.
    return { version: 1, bankVersion: BANK_VERSION, status: s.status, answers: [...s.answers], index: s.index, elapsedMs: s.elapsedMs, startedAt: s.startedAt, completedAt: s.completedAt };
  } catch { return null; }
}
export function finishSession(session: Session, now = new Date()): Session {
  if (session.answers.some(a => a === null)) throw new Error('Completa tutte le risposte prima di consegnare.');
  return { ...session, status: 'completed', completedAt: now.toISOString() };
}
export function formatTime(milliseconds: number): string {
  const seconds = Math.floor(Math.max(0, milliseconds) / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}` : `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}
