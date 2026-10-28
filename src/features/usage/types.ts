export type Quality = 'partial' | 'unknown';
export type AppUsage = { packageName: string; displayName: string; durationMs: number; share: number };
export type UsageSession = { packageName: string; displayName: string; start: number; end: number; durationMs: number };
export type UsageEvent = { packageName: string; eventType: string; timestamp: number };
export type DayUsage = { dateKey: string; totalMs: number; apps: AppUsage[]; sessions: UsageSession[]; events: UsageEvent[]; quality: Quality; refreshedAt: number; error?: string };
export type Insight = { id: string; kind: string; title: string; description: string; priority: 'informational' | 'review' | 'recurring'; currentValue?: number; baselineValue?: number; differenceValue?: number; differencePercent?: number; comparisonDays?: number };
export type NativeUsage = { permission: boolean; apps: { packageName: string; displayName: string; durationMs: number }[]; events: UsageEvent[] };
