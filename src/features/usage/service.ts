import { aggregateApps, deriveSessions } from './aggregation';
import { dayRange } from './dates';
import { getDay, getPaused, getHistory, saveDay } from './database';
import { getPermissionStatus, queryUsage } from './native';
import type { DayUsage } from './types';
export async function loadDay(key:string,force=false):Promise<DayUsage>{
  const cached=await getDay(key); const paused=await getPaused(); if(paused){if(cached)return cached;return {dateKey:key,totalMs:0,apps:[],sessions:[],events:[],quality:'unknown',refreshedAt:0,error:'paused'};}
  const permission=await getPermissionStatus(); if(!permission){if(cached)return {...cached,error:'Usage Access is off. Showing the last locally saved reading.'};return {dateKey:key,totalMs:0,apps:[],sessions:[],events:[],quality:'unknown',refreshedAt:0,error:'usage-access'};}
  if(cached && !force && Date.now()-cached.refreshedAt<5*60_000)return cached;
  const {start,end}=dayRange(key); const queryEnd=Math.min(end,Date.now());
  try { const native=await queryUsage(start,queryEnd); const apps=aggregateApps(native.apps); const names=new Map(apps.map(app=>[app.packageName,app.displayName])); const sessions=deriveSessions(native.events,names); const result:DayUsage={dateKey:key,totalMs:apps.reduce((sum,a)=>sum+a.durationMs,0),apps,sessions,events:native.events,quality:'partial',refreshedAt:Date.now()}; await saveDay(result); await getHistory(key,8); return result; }
  catch(error){if(cached)return {...cached,error:error instanceof Error?error.message:'Could not refresh usage.'};return {dateKey:key,totalMs:0,apps:[],sessions:[],events:[],quality:'unknown',refreshedAt:0,error:error instanceof Error?error.message:'Could not read usage data.'};}
}
