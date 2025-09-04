import { useEffect, useRef } from 'react';
import localforage from 'localforage';

export const usePersistence = <T>(key: string, value: T, dependencies: any[] = []) => {
  const hasLoaded = useRef(false);
  
  // Save to storage whenever value changes (but not on initial load)
  useEffect(() => {
    if (!hasLoaded.current) return;
    
    const saveValue = async () => {
      try {
        await localforage.setItem(key, value);
      } catch (error) {
        console.error(`Error saving ${key}:`, error);
      }
    };
    
    saveValue();
  }, dependencies);
  
  // Load from storage on mount
  const loadValue = async (): Promise<T | null> => {
    try {
      const stored = await localforage.getItem<T>(key);
      hasLoaded.current = true;
      return stored;
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
      hasLoaded.current = true;
      return null;
    }
  };
  
  return { loadValue };
};

// Specialized hooks for different timer types
export const useStopwatchPersistence = (time: number, laps: number[], isRunning: boolean) => {
  return usePersistence('stopwatch-state', { time, laps, isRunning }, [time, laps, isRunning]);
};

export const useCountdownPersistence = (initialTime: number, time: number, isRunning: boolean) => {
  return usePersistence('countdown-state', { initialTime, time, isRunning }, [initialTime, time, isRunning]);
};

export const useRaceTimersPersistence = (lanes: any[]) => {
  return usePersistence('race-timers-state', { lanes }, [lanes]);
};

export const useTallyCountersPersistence = (counters: any[]) => {
  return usePersistence('tally-counters-state', { counters }, [counters]);
};