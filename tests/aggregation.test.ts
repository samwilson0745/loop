import { describe, expect, it } from 'vitest';
import { aggregateApps, deriveSessions } from '../src/features/usage/aggregation';

describe('usage aggregation',()=>{
  it('merges package rows, drops invalid durations, and computes shares',()=>{
    const rows=aggregateApps([{packageName:'a',displayName:'Alpha',durationMs:60000},{packageName:'a',displayName:'Alpha',durationMs:30000},{packageName:'b',durationMs:30000},{packageName:'x',durationMs:-1}]);
    expect(rows.map(x=>x.packageName)).toEqual(['a','b']); expect(rows[0].share).toBeCloseTo(.75);
  });
  it('sorts, pairs duplicate foreground events, and ignores unmatched backgrounds',()=>{
    const events=[{packageName:'a',eventType:'BACKGROUND',timestamp:3000},{packageName:'a',eventType:'FOREGROUND',timestamp:1000},{packageName:'a',eventType:'FOREGROUND',timestamp:1200},{packageName:'a',eventType:'BACKGROUND',timestamp:3000}];
    expect(deriveSessions(events,new Map([['a','Alpha']]))).toEqual([{packageName:'a',displayName:'Alpha',start:1000,end:3000,durationMs:2000}]);
  });
});
