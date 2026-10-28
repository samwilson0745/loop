import { describe, expect, it } from 'vitest';
import { buildInsights } from '../src/features/usage/insights';
import type { DayUsage } from '../src/features/usage/types';
const record=(dateKey:string,totalMs:number):DayUsage=>({dateKey,totalMs,apps:[{packageName:'a',displayName:'Alpha',durationMs:totalMs,share:1}],sessions:[],events:[],quality:'partial',refreshedAt:0});
describe('attention engine',()=>{
  it('does not compare an incomplete day with full historical days',()=>{const today=record('2026-10-28',3*60*60_000);const history=['2026-10-27','2026-10-26','2026-10-25','2026-10-24'].map(d=>record(d,60*60_000));expect(buildInsights(today,history,new Date(2026,9,28,12).getTime()).some(x=>x.kind==='high_total_usage')).toBe(false);});
  it('requires four days and both relative and absolute thresholds',()=>{const current=record('2026-10-20',3*60*60_000);const history=['2026-10-19','2026-10-18','2026-10-17'].map(d=>record(d,60*60_000));const dateEnd=new Date(2026,9,22).getTime();expect(buildInsights(current,history,dateEnd).some(x=>x.kind==='high_total_usage')).toBe(false);});
  it('shows a descriptive share insight without making a value judgement',()=>{const current=record('2026-10-28',120000);const items=buildInsights(current,[],Date.now());expect(items[0].kind).toBe('high_app_share');expect(items[0].description).toContain('descriptive');});
  it('does not create baseline percentage from zero history',()=>{const current=record('2026-10-20',60*60_000);const history=['2026-10-19','2026-10-18','2026-10-17','2026-10-16'].map(d=>record(d,0));const result=buildInsights(current,history,new Date(2026,9,22).getTime());expect(result.some(x=>x.kind==='high_total_usage'||x.kind==='above_baseline')).toBe(false);});
});
