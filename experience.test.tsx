import { useState } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Test from '../pages/Test';
import { App } from '../App';
import { newSession, STORAGE_KEY } from '../features/test/session';
import type { Session } from '../features/test/session';
import { questions } from '../data/questions';
import { scoreAnswers } from '../utils/scoring';
vi.mock('../three/BrainViewport', () => ({ BrainViewport: () => <div aria-label="Modello 3D" /> }));
// Screen transitions are disabled in this suite; the actual motion preference path is retained.
vi.mock('motion/react', async importOriginal => {
  const original = await importOriginal<typeof import('motion/react')>();
  return { ...original, useReducedMotion: () => true };
});
function Harness({ initial = newSession(), done = vi.fn() }: { initial?: Session; done?: () => void }) {
  const [s,set] = useState(initial);
  return <><Test session={s} update={set} restart={()=>set(newSession())} onFinish={done}/><output data-testid="state">{JSON.stringify(s)}</output></>;
}
beforeEach(() => { localStorage.clear(); });
describe('test experience', () => {
  it('prevents accidental empty submission and navigates to a missing answer', async () => {
    const user=userEvent.setup(); const s=newSession();s.index=29;const done=vi.fn();render(<Harness initial={s} done={done}/>);
    await user.click(screen.getByRole('button',{name:'Termina'}));expect(screen.getByRole('alert')).toHaveTextContent('Mancano 30 risposte');expect(done).not.toHaveBeenCalled();expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button',{name:/Vai alla prima/}));await screen.findByRole('heading',{name:questions[0].prompt});expect(screen.getAllByRole('radio')).toHaveLength(4);
  });
  it('completes all 30 questions, preserves back navigation and asks for final confirmation', async () => {
    const user=userEvent.setup();const done=vi.fn();render(<Harness done={done}/>);
    for(let i=0;i<questions.length;i++) {
      const q=questions[i]; await screen.findByRole('heading',{name:q.prompt});
      await user.click(screen.getByRole('radio',{name:new RegExp(q.options.find(o=>o.id===q.correct)!.label.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'))}));
      if(i===0) { expect(screen.getByRole('button',{name:'Indietro'})).toBeDisabled(); }
      await user.click(screen.getByRole('button',{name:i===29?'Termina':'Avanti'}));
    }
    const dialog=screen.getByRole('dialog');expect(done).not.toHaveBeenCalled();await user.click(within(dialog).getByRole('button',{name:'Annulla'}));expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button',{name:'Indietro'}));await screen.findByRole('heading',{name:questions[28].prompt});expect(screen.getByRole('radio',{checked:true})).toBeInTheDocument();
    await user.click(screen.getByRole('button',{name:'Avanti'}));await screen.findByRole('heading',{name:questions[29].prompt});await user.click(screen.getByRole('button',{name:'Termina'}));await user.click(screen.getByRole('button',{name:'Scopri il risultato'}));expect(done).toHaveBeenCalledOnce();
    const final=JSON.parse(screen.getByTestId('state').textContent!);expect(final.status).toBe('completed');expect(scoreAnswers(final.answers).correct).toBe(30);
  }, 30000);
  it('requires confirmation before resetting and supports Escape cancellation',async()=>{
    const user=userEvent.setup();const s=newSession();s.answers[0]='b';render(<Harness initial={s}/>);
    await user.click(screen.getByRole('button',{name:'Ricomincia'}));expect(screen.getByRole('dialog')).toBeInTheDocument();expect(screen.getByRole('button',{name:'Annulla'})).toHaveFocus();
    await user.keyboard('{Escape}');expect(screen.queryByRole('dialog')).not.toBeInTheDocument();expect(screen.getByRole('radio',{checked:true})).toBeInTheDocument();
    await user.click(screen.getByRole('button',{name:'Ricomincia'}));await user.click(screen.getByRole('button',{name:'Ricomincia il test'}));expect(screen.queryByRole('radio',{checked:true})).not.toBeInTheDocument();
  });
});
describe('application persistence and privacy',()=>{
  it('loads the home without the WebGL component affecting test access',async()=>{render(<App/>);expect(screen.getByRole('heading',{level:1})).toHaveTextContent('QUANTOCONOSCI LATUA MENTE?');fireEvent.click(screen.getByRole('button',{name:'INIZIA IL TEST'}));await screen.findByRole('heading',{name:questions[0].prompt});});
  it('restores the exact question and answer after a reload',async()=>{
    const s=newSession();s.index=14;s.answers[14]='d';s.elapsedMs=67000;localStorage.setItem(STORAGE_KEY,JSON.stringify(s));history.replaceState(null,'','/#/test');render(<App/>);
    await screen.findByRole('heading',{name:questions[14].prompt});expect(screen.getByRole('radio',{checked:true})).toBeInTheDocument();expect(screen.getByLabelText('Tempo trascorso 01:07')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('radio',{name:/Posto 3/}));await waitFor(()=>expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).answers[14]).toBe('c'));
  });
  it('recovers from malformed local data without crashing',async()=>{localStorage.setItem(STORAGE_KEY,'{bad json');render(<App/>);expect(screen.getByRole('status')).toHaveTextContent('danneggiato');fireEvent.click(screen.getByRole('button',{name:'INIZIA IL TEST'}));await screen.findByRole('heading',{name:questions[0].prompt});});
  it('deletes only the NEURO namespace after confirmation',async()=>{
    const user=userEvent.setup();localStorage.setItem(STORAGE_KEY,JSON.stringify(newSession()));localStorage.setItem('other-app','keep');history.replaceState(null,'','/#/privacy');render(<App/>);
    await screen.findByRole('button',{name:'Cancella i dati locali'});await user.click(screen.getByRole('button',{name:'Cancella i dati locali'}));await user.click(screen.getByRole('button',{name:'Cancella i dati'}));expect(localStorage.getItem(STORAGE_KEY)).toBeNull();expect(localStorage.getItem('other-app')).toBe('keep');
  });
});
