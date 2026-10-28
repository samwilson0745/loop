export const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
export function dayRange(key: string) { const [y,m,d] = key.split('-').map(Number); const start = new Date(y,m-1,d).getTime(); return { start, end: new Date(y,m-1,d+1).getTime() }; }
export const shiftDate = (d: Date, days: number) => { const next = new Date(d); next.setDate(next.getDate()+days); return next; };
export const prettyDate = (key: string) => { const [y,m,d]=key.split('-').map(Number); return new Date(y,m-1,d).toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'}); };
export function durationLabel(ms: number) { const mins=Math.floor(ms/60000); const h=Math.floor(mins/60); const m=mins%60; return h ? `${h}h ${m}m` : `${m}m`; }
