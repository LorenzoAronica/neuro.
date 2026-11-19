import { useCallback, useEffect, useRef, useState } from 'react';
import type { Session } from '../features/test/session';
import { newSession, parseSession, STORAGE_KEY } from '../features/test/session';

function readInitial(): { session: Session | null; notice: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const session = parseSession(raw);
    return { session, notice: raw && !session ? 'Il salvataggio precedente non è compatibile o è danneggiato. Puoi iniziare una nuova prova.' : '' };
  } catch { return { session: null, notice: 'Il browser non consente il salvataggio locale. Puoi fare il test, ma evita di ricaricare la pagina.' }; }
}
export function useSession(isTest: boolean) {
  const [initial] = useState(readInitial);
  const [session, setSession] = useState<Session | null>(initial.session);
  const [notice, setNotice] = useState(initial.notice);
  const current = useRef(session);
  const last = useRef(performance.now());
  const set = useCallback((next: Session | null | ((old: Session | null) => Session | null)) => {
    const value = typeof next === 'function' ? next(current.current) : next;
    current.current = value;
    setSession(value);
    try {
      if (value) localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      else localStorage.removeItem(STORAGE_KEY);
    } catch { setNotice('Salvataggio locale non disponibile. Le risposte restano in questa pagina: evita di ricaricarla.'); }
  }, []);
  const running = isTest && session?.status === 'active';
  useEffect(() => {
    if (!running) return;
    last.current = performance.now();
    const tick = () => {
      const now = performance.now();
      const delta = Math.max(0, now - last.current);
      last.current = now;
      set(s => s?.status === 'active' ? { ...s, elapsedMs: s.elapsedMs + delta } : s);
    };
    const interval = window.setInterval(tick, 1000);
    window.addEventListener('pagehide', tick);
    document.addEventListener('visibilitychange', tick);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('pagehide', tick);
      document.removeEventListener('visibilitychange', tick);
      tick();
    };
  }, [running, set]);
  const start = useCallback(() => { const s = newSession(); set(s); return s; }, [set]);
  return { session, setSession: set, start, clear: () => set(null), notice, dismissNotice: () => setNotice('') };
}
