'use client';

import { useCallback, useRef, useSyncExternalStore } from 'react';

function getStorageValue<T>(key: string, initialValue: T): T {
  if (typeof window === 'undefined') return initialValue;
  
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch {
    return initialValue;
  }
}

// Store subscribers per key for cross-component updates
const subscribers = new Map<string, Set<() => void>>();

function notifySubscribers(key: string) {
  subscribers.get(key)?.forEach((callback) => callback());
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Use a ref to track the current value for functional updates
  const valueRef = useRef<T>(initialValue);

  const subscribe = useCallback(
    (callback: () => void) => {
      // Subscribe to storage events from other tabs
      const handleStorage = (e: StorageEvent) => {
        if (e.key === key) callback();
      };
      window.addEventListener('storage', handleStorage);

      // Subscribe to updates from same-tab changes
      if (!subscribers.has(key)) {
        subscribers.set(key, new Set());
      }
      subscribers.get(key)!.add(callback);

      return () => {
        window.removeEventListener('storage', handleStorage);
        subscribers.get(key)?.delete(callback);
      };
    },
    [key]
  );

  const getSnapshot = useCallback(() => {
    const value = getStorageValue(key, initialValue);
    valueRef.current = value;
    return JSON.stringify(value);
  }, [key, initialValue]);

  const getServerSnapshot = useCallback(() => {
    return JSON.stringify(initialValue);
  }, [initialValue]);

  const storedValueString = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const storedValue = JSON.parse(storedValueString) as T;

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const currentValue = getStorageValue(key, initialValue);
        const valueToStore = value instanceof Function ? value(currentValue) : value;

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          // Notify all subscribers in the same tab
          notifySubscribers(key);
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, initialValue]
  );

  return [storedValue, setValue];
}
