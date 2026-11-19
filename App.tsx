import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { useSession } from './hooks/useSession';
import Home from './pages/Home';
const Test = lazy(() => import('./pages/Test'));
const Results = lazy(() => import('./pages/Results'));
const Information = lazy(() => import('./pages/Information'));
type Route = 'home' | 'test' | 'results' | 'privacy' | 'method';
function readRoute(): Route {
  return ({ '#/test': 'test', '#/risultati': 'results', '#/privacy': 'privacy', '#/metodo': 'method' } as Record<string, Route>)[window.location.hash] || 'home';
}
export function App() {
  const [route, setRoute] = useState(readRoute);
  const { session, setSession, start, clear, notice, dismissNotice } = useSession(route === 'test');
  const navigate = useCallback((hash: string) => { window.location.hash = hash; }, []);
  useEffect(() => {
    const change = () => { setRoute(readRoute()); if (window.location.hash.startsWith('#/')) window.scrollTo(0, 0); };
    window.addEventListener('hashchange', change);
    return () => window.removeEventListener('hashchange', change);
  }, []);
  useEffect(() => {
    const titles: Record<Route, string> = { home: 'Test di ragionamento gratuito', test: 'Il tuo test', results: 'Il tuo risultato', privacy: 'Privacy e dati locali', method: 'Metodo e limiti' };
    document.title = `NEURO — ${titles[route]} | Discover Your Mind`;
    if (route === 'home' && window.location.hash && !window.location.hash.startsWith('#/')) requestAnimationFrame(() => document.getElementById(window.location.hash.slice(1))?.scrollIntoView());
  }, [route]);
  useEffect(() => {
    if (route === 'test' && session?.status === 'completed') navigate('/risultati');
    else if (route === 'test' && !session) start();
    else if (route === 'results' && session?.status !== 'completed') navigate(session ? '/test' : '/');
  }, [route, session?.status, !!session, navigate, start]);
  function begin() { if (session?.status === 'completed') navigate('/risultati'); else { if (!session) start(); navigate('/test'); } }
  return <><a href="#main" className="skip-link" onClick={e => { e.preventDefault(); const main = document.getElementById('main'); main?.setAttribute('tabindex', '-1'); main?.focus(); main?.scrollIntoView(); }}>Salta al contenuto</a>
    {notice && <div className="storage-notice" role="status"><span>{notice}</span><button onClick={dismissNotice} aria-label="Chiudi avviso">×</button></div>}
    <Suspense fallback={<div className="page-loading" role="status">NEURO<span>Caricamento…</span></div>}>
      {route === 'home' && <Home start={begin} resume={session?.status === 'active'} completed={session?.status === 'completed'} />}
      {route === 'test' && session?.status === 'active' && <Test session={session} update={setSession} restart={start} onFinish={() => navigate('/risultati')} />}
      {route === 'results' && session?.status === 'completed' && <Results session={session} restart={() => { start(); navigate('/test'); }} />}
      {(route === 'privacy' || route === 'method') && <Information kind={route} hasData={!!session} clear={clear} start={begin} />}
    </Suspense>
  </>;
}
