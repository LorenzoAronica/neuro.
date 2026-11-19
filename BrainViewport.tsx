import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import { BrainFallback } from './BrainFallback';
import { Icon } from '../components/Icon';
import type { Interaction } from './BrainScene';
const Scene = lazy(() => import('./BrainScene'));
class Boundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(_error: Error, _info: ErrorInfo) { this.props.onFailure(); }
  render() { return this.state.failed ? <BrainFallback /> : this.props.children; }
}
export function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!context) return false;
    context.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch { return false; }
}
export function BrainViewport() {
  const [supported] = useState(supportsWebGL);
  const [failed, setFailed] = useState(false);
  const [active, setActive] = useState(true);
  const [revision, setRevision] = useState(0);
  const wrapper = useRef<HTMLDivElement>(null);
  const drag = useRef({ x: 0, y: 0 });
  const interaction = useRef<Interaction>({ yaw: -0.5, pitch: 0.18, dragging: false, lastInput: 0, mouseX: 0, mouseY: 0 });
  const reduced = !!useReducedMotion();
  const fail = useCallback(() => setFailed(true), []);
  useEffect(() => {
    let inView = true;
    const update = () => setActive(inView && document.visibilityState !== 'hidden');
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; update(); });
    if (wrapper.current) observer.observe(wrapper.current);
    document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, []);
  const canInteract = supported && !failed;
  return <div className="brain-viewport" ref={wrapper}>
    <div className="brain-coordinates" aria-hidden="true"><span>FIG. 01 — HUMAN CORTEX</span><span>NEURAL EXPLORATION</span></div>
    <div className={`brain-interaction ${canInteract ? 'interactive' : ''}`} aria-label="Modello tridimensionale originale di un cervello. Trascina per ruotarlo; usa i pulsanti per la rotazione da tastiera."
      onPointerDown={e => { if (!canInteract) return; interaction.current.dragging = true; interaction.current.lastInput = performance.now(); drag.current = { x: e.clientX, y: e.clientY }; e.currentTarget.setPointerCapture(e.pointerId); }}
      onPointerMove={e => {
        if (!canInteract) return;
        const state = interaction.current;
        if (state.dragging) { state.yaw += (e.clientX - drag.current.x) * 0.008; state.pitch = Math.max(-0.65, Math.min(0.65, state.pitch + (e.clientY - drag.current.y) * 0.005)); drag.current = { x: e.clientX, y: e.clientY }; state.lastInput = performance.now(); setRevision(v => v + 1); }
        else if (!reduced && e.pointerType === 'mouse') { const r = e.currentTarget.getBoundingClientRect(); state.mouseX = (e.clientX - r.left) / r.width - 0.5; state.mouseY = (e.clientY - r.top) / r.height - 0.5; }
      }}
      onPointerUp={() => { interaction.current.dragging = false; interaction.current.lastInput = performance.now(); }}
      onPointerCancel={() => { interaction.current.dragging = false; }} onPointerLeave={() => { interaction.current.mouseX = 0; interaction.current.mouseY = 0; }}>
      <Boundary onFailure={fail}>{canInteract ? <Suspense fallback={<BrainFallback loading />}><Scene interaction={interaction} reduced={reduced} active={active} revision={revision} onFailure={fail} /></Suspense> : <BrainFallback />}</Boundary>
    </div>
    <div className="brain-controls"><span><i className="status-dot" />{canInteract ? 'TRASCINA PER ESPLORARE' : 'LA CURIOSITÀ PRENDE FORMA'}</span>{canInteract && <div>
      <button aria-label="Ruota cervello verso sinistra" onClick={() => { interaction.current.yaw -= 0.4; interaction.current.lastInput = performance.now(); setRevision(v => v + 1); }}>←</button>
      <button aria-label="Ruota cervello verso destra" onClick={() => { interaction.current.yaw += 0.4; interaction.current.lastInput = performance.now(); setRevision(v => v + 1); }}>→</button>
      <button aria-label="Ripristina vista del cervello" onClick={() => { interaction.current.yaw = -0.5; interaction.current.pitch = 0.18; setRevision(v => v + 1); }}><Icon name="rotate" size={14} /></button>
    </div>}</div>
  </div>;
}
