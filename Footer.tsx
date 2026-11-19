import { Logo } from './Logo';
export function Footer() {
  return <footer className="site-footer container"><div className="footer-top"><Logo /><p>La curiosità è un buon inizio.</p><div><a href="#/metodo">Metodo e limiti</a><a href="#/privacy">Privacy e dati locali</a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} NEURO. Discover Your Mind.</span><span>Un esercizio di ragionamento. Non una misurazione del QI.</span><span>Progettato per la tua curiosità. ↗</span></div></footer>;
}
