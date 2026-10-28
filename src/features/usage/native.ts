import { Platform, Linking } from 'react-native';
import { requireNativeModule } from 'expo-modules-core';
import type { NativeUsage } from './types';

type AndroidUsageBridge = { getPermissionStatus(): Promise<boolean>; openUsageAccessSettings(): Promise<void>; queryUsage(begin: number, end: number): Promise<NativeUsage> };
export const isAndroid = Platform.OS === 'android';
const bridge = isAndroid ? requireNativeModule<AndroidUsageBridge>('AndroidUsage') : undefined;
export async function getPermissionStatus() { return bridge ? bridge.getPermissionStatus() : false; }
export async function openUsageAccessSettings() {
  if (bridge) return bridge.openUsageAccessSettings();
  return Linking.openSettings();
}
export async function queryUsage(begin: number, end: number): Promise<NativeUsage> {
  if (!isAndroid || !bridge) throw new Error('Usage tracking is available in the Android development build.');
  return bridge.queryUsage(begin, end);
}
