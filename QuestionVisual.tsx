import type { QuestionVisual as Visual, Shape } from '../data/questions';
function describe(shape: Shape): string {
  if (shape.kind === 'dots') return `${shape.count} punti`;
  if (shape.kind === 'polygon') return `poligono di ${shape.sides} lati`;
  if (shape.kind === 'cells') return `griglia due per due con celle nere ${shape.filled.map(i => ['in alto a sinistra', 'in alto a destra', 'in basso a sinistra', 'in basso a destra'][i]).join(' e ')}`;
  return `freccia verso ${({0: 'l’alto', 45: 'l’alto a destra', 90: 'destra', 135: 'il basso a destra', 180: 'il basso', 225: 'il basso a sinistra', 270: 'sinistra', 315: 'l’alto a sinistra'} as Record<number, string>)[shape.rotation]}${shape.dot === undefined ? '' : `, punto ${['in alto a sinistra', 'in alto a destra', 'in basso a sinistra', 'in basso a destra'][shape.dot]}`}`;
}
export function ShapeGraphic({ shape, className }: { shape: Shape; className?: string }) {
  let content;
  if (shape.kind === 'arrow') {
    const corner = shape.dot === undefined ? null : [[17, 17], [83, 17], [17, 83], [83, 83]][shape.dot];
    content = <>{corner && <circle cx={corner[0]} cy={corner[1]} r="4" fill="currentColor" />}<g transform={`rotate(${shape.rotation} 50 50)`}><path d="M50 76V25m-20 20 20-20 20 20" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></g></>;
  } else if (shape.kind === 'dots') {
    const positions = [[50, 50], [30, 30], [70, 70], [70, 30], [30, 70], [30, 50], [70, 50], [50, 30], [50, 70]];
    content = positions.slice(0, shape.count).map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" fill="currentColor" />);
  } else if (shape.kind === 'polygon') {
    const points = Array.from({ length: shape.sides }, (_, i) => { const angle = i / shape.sides * Math.PI * 2 - Math.PI / 2; return `${50 + Math.cos(angle) * 31},${50 + Math.sin(angle) * 31}`; }).join(' ');
    content = <polygon points={points} fill="none" stroke="currentColor" strokeWidth="3" />;
  } else {
    content = <>{[0, 1, 2, 3].map(i => <rect key={i} x={22 + i % 2 * 28} y={22 + Math.floor(i / 2) * 28} width="26" height="26" fill={shape.filled.includes(i) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.3" />)}</>;
  }
  return <svg className={className} viewBox="0 0 100 100" aria-hidden="true">{content}</svg>;
}
export function QuestionVisual({ visual }: { visual: Visual }) {
  if (visual.kind === 'reflection') return <div className="reflection-visual" aria-label="Una freccia punta in alto a destra. L’asse di riflessione è verticale.">
    <ShapeGraphic shape={{ kind: 'arrow', rotation: 45 }} /><span className="reflection-axis" aria-hidden="true" /><span className="missing-shape" aria-hidden="true">?</span>
  </div>;
  const description = visual.kind === 'matrix' ? `Matrice di tre righe e tre colonne. ${visual.shapes.map((shape, i) => `Riga ${Math.floor(i / 3) + 1}, colonna ${i % 3 + 1}: ${shape ? describe(shape) : 'figura mancante'}.`).join(' ')}` : `Sequenza: ${visual.shapes.map(shape => shape ? describe(shape) : 'figura mancante').join('; ')}; figura mancante.`;
  return <div className={`question-visual ${visual.kind}`} role="img" aria-label={description}>
    {visual.shapes.map((shape, i) => <div className="visual-cell" key={i}>{shape ? <ShapeGraphic shape={shape} /> : <span className="missing-shape">?</span>}{visual.kind === 'sequence' && <span className="visual-step">0{i + 1}</span>}</div>)}
    {visual.kind === 'sequence' && <div className="visual-cell final-cell"><span className="missing-shape">?</span><span className="visual-step">04</span></div>}
  </div>;
}
