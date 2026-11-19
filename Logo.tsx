export function Logo({ compact = false }: { compact?: boolean }) {
  return <a className="brand" href="#/" aria-label="NEURO — Torna alla home">
    <svg className="brand-symbol" viewBox="0 0 38 38" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" aria-hidden="true"><path d="M17 8C11 3 6 9 7 14c-6 4-4 12 0 13 1 6 7 7 10 3V8Zm4 0c6-5 11 1 10 6 6 4 4 12 0 13-1 6-7 7-10 3V8Z" /><path d="M11 12c-2 4 0 7 4 7M7 23c4-2 7 0 7 4m13-15c2 4 0 7-4 7m8 4c-4-2-7 0-7 4" /></svg>
    <span className="brand-word">NEURO<span className="brand-dot" aria-hidden="true">•</span></span>
    {!compact && <span className="brand-payoff">DISCOVER<br />YOUR MIND</span>}
  </a>;
}
