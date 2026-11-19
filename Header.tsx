import { useState } from 'react';
import { Logo } from './Logo';
import { Icon } from './Icon';
export function Header({ cta = 'Inizia il test', start }: { cta?: string; start: () => void }) {
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <div className="header-inner"><Logo /><nav className="desktop-nav" aria-label="Navigazione principale"><a href="#progetto">Il progetto</a><a href="#capacita">Le capacità</a><a href="#come-funziona">Come funziona</a></nav>
      <button className="header-cta" onClick={start}>{cta}<Icon name="arrow" size={17} /></button>
      <button className="menu-toggle" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Chiudi menu' : 'Apri menu'} onClick={() => setOpen(!open)}><Icon name={open ? 'close' : 'menu'} /></button>
    </div>
    {open && <nav id="mobile-menu" className="mobile-nav" aria-label="Navigazione mobile" onClick={() => setOpen(false)}><a href="#progetto">Il progetto</a><a href="#capacita">Le capacità</a><a href="#come-funziona">Come funziona</a><a href="#/privacy">Privacy</a></nav>}
  </header>;
}
