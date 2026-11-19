import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useSession } from '../hooks/useSession';
import { STORAGE_KEY } from '../features/test/session';

describe('storage failure and elapsed time',()=>{
  it('continues in memory when the browser denies localStorage',()=>{
    vi.spyOn(Storage.prototype,'getItem').mockImplementation(()=>{throw new DOMException('Denied','SecurityError');});
    vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new DOMException('Denied','SecurityError');});
    const {result}=renderHook(()=>useSession(false));expect(result.current.notice).toContain('non consente');
    act(()=>{result.current.start();});expect(result.current.session?.status).toBe('active');expect(result.current.notice).toContain('non disponibile');
    act(()=>result.current.setSession(s=>s?{...s,answers:s.answers.map((a,i)=>i===0?'b':a)}:s));expect(result.current.session?.answers[0]).toBe('b');
  });
  it('persists time while the test is open and pauses it on other screens',()=>{
    vi.useFakeTimers({toFake:['setInterval','clearInterval','performance']});
    const {result,rerender,unmount}=renderHook(({open})=>useSession(open),{initialProps:{open:true}});
    try {
      act(()=>{result.current.start();});act(()=>vi.advanceTimersByTime(3100));expect(result.current.session?.elapsedMs).toBe(3000);
      rerender({open:false});expect(result.current.session?.elapsedMs).toBe(3100);act(()=>vi.advanceTimersByTime(3600000));expect(result.current.session?.elapsedMs).toBe(3100);
      rerender({open:true});act(()=>vi.advanceTimersByTime(2000));expect(result.current.session?.elapsedMs).toBe(5100);expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).elapsedMs).toBe(5100);
    } finally {unmount();vi.useRealTimers();}
  });
});
