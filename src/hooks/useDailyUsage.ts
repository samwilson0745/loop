import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { loadDay } from '@/features/usage/service';
import type { DayUsage } from '@/features/usage/types';
export function useDailyUsage(key:string){const [data,setData]=useState<DayUsage>();const [loading,setLoading]=useState(true);const [refreshing,setRefreshing]=useState(false);const refresh=useCallback(async(force=true)=>{if(force)setRefreshing(true);try{setData(await loadDay(key,force));}finally{setLoading(false);setRefreshing(false);}},[key]);useEffect(()=>{setLoading(true);void refresh(false);const sub=AppState.addEventListener('change',state=>{if(state==='active')void refresh(true);});return()=>sub.remove();},[refresh]);return {data,loading,refresh,refreshing};}
