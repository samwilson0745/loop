import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { initializeDatabase } from '@/features/usage/database';

export default function RootLayout() {
  useEffect(() => { initializeDatabase().catch(console.error); }, []);
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F5F6F2' } }} />;
}
