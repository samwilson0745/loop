import type { AppUsage, UsageEvent, UsageSession } from './types';
export function aggregateApps(apps: { packageName: string; displayName?: string; durationMs: number }[]): AppUsage[] {
  const merged = new Map<string,{packageName:string;displayName:string;durationMs:number}>();
  for (const app of apps) { if (!app.packageName || !Number.isFinite(app.durationMs) || app.durationMs <= 0) continue; const row=merged.get(app.packageName) ?? {packageName:app.packageName,displayName:app.displayName || app.packageName,durationMs:0}; row.durationMs+=app.durationMs; if (app.displayName) row.displayName=app.displayName; merged.set(app.packageName,row); }
  const total=[...merged.values()].reduce((sum,app)=>sum+app.durationMs,0);
  return [...merged.values()].map(app=>({...app,share:total ? app.durationMs/total : 0})).sort((a,b)=>b.durationMs-a.durationMs||a.packageName.localeCompare(b.packageName));
}
export function deriveSessions(events: UsageEvent[], names: Map<string,string>, maxSessionMs=6*60*60*1000): UsageSession[] {
  const ordered=[...events].filter(e=>e.packageName && Number.isFinite(e.timestamp)).sort((a,b)=>a.timestamp-b.timestamp);
  const active=new Map<string,number>(); const sessions:UsageSession[]=[];
  for (const event of ordered) {
    const foreground=/FOREGROUND|RESUMED|MOVE_TO_FOREGROUND|ACTIVITY_RESUMED/i.test(event.eventType);
    const background=/BACKGROUND|PAUSED|MOVE_TO_BACKGROUND|ACTIVITY_PAUSED|STOPPED/i.test(event.eventType);
    if (foreground) { if (!active.has(event.packageName)) active.set(event.packageName,event.timestamp); }
    else if (background) { const start=active.get(event.packageName); if (start!==undefined) { const durationMs=event.timestamp-start; if (durationMs>0 && durationMs<=maxSessionMs) sessions.push({packageName:event.packageName,displayName:names.get(event.packageName)||event.packageName,start,end:event.timestamp,durationMs}); active.delete(event.packageName); } }
  }
  return sessions;
}
export function hourlyTotals(sessions: UsageSession[], start: number) { const buckets=Array.from({length:24},()=>0); for(const s of sessions){let cursor=s.start; while(cursor<s.end){const hour=new Date(cursor).getHours(); const boundary=new Date(cursor);boundary.setMinutes(60,0,0); const stop=Math.min(boundary.getTime(),s.end); buckets[hour]+=stop-cursor;cursor=stop;} } return buckets.map((ms,hour)=>({hour,label:String(hour).padStart(2,'0'),durationMs:ms})); }
