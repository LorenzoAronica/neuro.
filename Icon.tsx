import type { CSSProperties } from 'react';
export function Icon({ name, size = 20, className, style }: { name: 'arrow' | 'back' | 'check' | 'download' | 'clock' | 'share' | 'close' | 'menu' | 'logic' | 'numeric' | 'abstract' | 'verbal' | 'shield' | 'rotate'; size?: number; className?: string; style?: CSSProperties }) {
  const paths = {
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    back: <><path d="M19 12H5m6 6-6-6 6-6" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    download: <><path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    share: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m9 10 6-3m-6 7 6 3" /></>,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    menu: <path d="M4 8h16M4 16h16" />,
    logic: <><rect x="3" y="3" width="6" height="6" rx="1" /><rect x="15" y="15" width="6" height="6" rx="1" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="m9 6 6 0M6 9v6m3 3h6M18 9v6" /></>,
    numeric: <><path d="m8 3-3 18M18 3l-3 18M3 9h18M2 15h18" /></>,
    abstract: <><path d="m12 2 10 17H2L12 2Z" /><circle cx="12" cy="14" r="7" /></>,
    verbal: <><path d="M4 4h16v12H9l-5 5V4Z" /><path d="M8 8h8m-8 4h5" /></>,
    shield: <><path d="m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6l8-4Z" /><path d="m8 12 3 3 5-6" /></>,
    rotate: <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M6 6a8 8 0 0 1 13 3M5 15a8 8 0 0 0 13 3" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className} style={style}>{paths[name]}</svg>;
}
