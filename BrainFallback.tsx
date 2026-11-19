export function BrainFallback({ loading = false }: { loading?: boolean }) {
  return <div className="brain-fallback" role="img" aria-label={loading ? 'Caricamento del modello 3D del cervello.' : 'Illustrazione statica del cervello. La versione interattiva richiede WebGL.'}>
    <svg viewBox="0 0 600 570" aria-hidden="true"><defs><radialGradient id="cortex-light" cx="30%" cy="20%" r="90%"><stop offset="0" stopColor="#ddd" /><stop offset=".6" stopColor="#777" /><stop offset="1" stopColor="#222" /></radialGradient><radialGradient id="brain-shadow"><stop stopColor="#999" stopOpacity=".2" /><stop offset="1" stopColor="#111" stopOpacity="0" /></radialGradient></defs>
      <ellipse cx="300" cy="490" rx="175" ry="30" fill="url(#brain-shadow)" /><g fill="none" stroke="#444" strokeWidth=".7"><ellipse cx="300" cy="270" rx="245" ry="200" transform="rotate(-28 300 270)" /><ellipse cx="300" cy="270" rx="240" ry="130" transform="rotate(32 300 270)" /></g>
      <g fill="url(#cortex-light)" stroke="#444" strokeWidth="2"><path d="M296 104C260 68 200 88 177 119c-53-3-85 42-77 82-36 35-35 80-10 109-10 50 20 85 59 91 20 44 79 59 118 28 24-16 25-43 26-75l3-250Z" /><path d="M304 104c36-36 96-16 119 15 53-3 85 42 77 82 36 35 35 80 10 109 10 50-20 85-59 91-20 44-79 59-118 28-24-16-25-43-26-75l-3-250Z" /></g>
      <g fill="none" stroke="#333" strokeWidth="6" strokeLinecap="round">{[-1, 1].map(side => <g key={side} transform={`translate(300 0) scale(${side} 1)`}><path d="M-22 119c-39-19-72 7-51 34s57 12 41 46-65 15-69-14-50-31-62-7 18 50 48 47 48 25 25 44-70-3-84 22 18 53 51 43 45 10 35 38-61 24-68 5" /><path d="M-114 126c-31 1-56 27-36 43M-184 209c-42 10-40 57-9 66m-52-8c-16 28 8 55 35 47m-8 34c-6 40 36 53 57 31m57 28c19 24 65 10 61-26m13-150c-27-1-47 21-31 42s46 15 40 47-48 29-36 50m-129-42c20-20 44-10 45 15" /></g>)}</g>
      <g fill="#ddd">{[[84, 156], [521, 173], [75, 350], [530, 365], [185, 65], [412, 481]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="3" />)}</g>
    </svg>
    {!loading && <span className="fallback-label">VISTA STATICA · WEBGL NON DISPONIBILE</span>}
  </div>;
}
