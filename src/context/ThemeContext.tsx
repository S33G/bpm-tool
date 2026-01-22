'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useSyncExternalStore, useCallback } from 'react';
import { Theme } from '@/lib/types';
import { STORAGE_KEYS } from '@/lib/constants';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  const stored = localStorage.getItem(STORAGE_KEYS.THEME) as Theme | null;
  if (stored && ['light', 'dark', 'system'].includes(stored)) {
    return stored;
  }
  return 'system';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize with a function to read from localStorage synchronously
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  
  // Use useSyncExternalStore for system theme preference
  const subscribe = useCallback((callback: () => void) => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', callback);
    return () => mediaQuery.removeEventListener('change', callback);
  }, []);

  const getSnapshot = useCallback(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }, []);

  const getServerSnapshot = useCallback(() => {
    return true; // Default to dark on server
  }, []);

  const systemPrefersDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Calculate resolved theme
  const resolvedTheme: 'light' | 'dark' = theme === 'system' 
    ? (systemPrefersDark ? 'dark' : 'light')
    : theme;

  // Update document class for Tailwind dark mode
  useEffect(() => {
    if (resolvedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [resolvedTheme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
