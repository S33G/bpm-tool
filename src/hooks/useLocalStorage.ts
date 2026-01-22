'use client';

import { useState, useCallback, useSyncExternalStore } from 'react';

function getStorageValue<T>(key: string, initialValue: T): T {
  if (typeof window === 'undefined') return initialValue;
  
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch {
    return initialValue;
  }
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Use useSyncExternalStore to properly sync with localStorage
  const subscribe = useCallback(
    (callback: () => void) => {
      const handleStorage = (e: StorageEvent) => {
        if (e.key === key) callback();
      };
      window.addEventListener('storage', handleStorage);
      return () => window.removeEventListener('storage', handleStorage);
    },
    [key]
  );

  const getSnapshot = useCallback(() => {
    return JSON.stringify(getStorageValue(key, initialValue));
  }, [key, initialValue]);

  const getServerSnapshot = useCallback(() => {
    return JSON.stringify(initialValue);
  }, [initialValue]);

  const storedValueString = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const storedValue = JSON.parse(storedValueString) as T;

  // Local state for immediate updates
  const [localValue, setLocalValue] = useState<T>(storedValue);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(localValue) : value;
        setLocalValue(valueToStore);

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, localValue]
  );

  return [localValue, setValue];
}
