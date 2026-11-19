import { useEffect, useRef } from 'react';
import { Icon } from './Icon';
export function ConfirmDialog({ title, children, confirmLabel, onConfirm, onCancel }: { title: string; children: React.ReactNode; confirmLabel: string; onConfirm: () => void; onCancel: () => void }) {
  const dialog = useRef<HTMLDivElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);
  const cancelAction = useRef(onCancel);
  cancelAction.current = onCancel;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    cancel.current?.focus();
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cancelAction.current();
      if (e.key !== 'Tab') return;
      const elements = dialog.current?.querySelectorAll<HTMLElement>('button, a[href], input, [tabindex="0"]');
      if (!elements?.length) return;
      const first = elements[0], last = elements[elements.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handle);
    return () => { document.removeEventListener('keydown', handle); document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  return <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onCancel(); }}>
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="dialog-title" aria-describedby="dialog-body" ref={dialog}>
      <span className="eyebrow">UN ULTIMO PASSAGGIO</span>
      <h2 id="dialog-title">{title}</h2><div id="dialog-body">{children}</div>
      <div className="modal-actions"><button className="button secondary" onClick={onCancel} ref={cancel}>Annulla</button><button className="button primary" onClick={onConfirm}>{confirmLabel}<Icon name="arrow" /></button></div>
    </div>
  </div>;
}
