import { Setlist } from './types';
import { STORAGE_KEYS } from '@/lib/constants';

export function loadSetlists(): Setlist[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETLISTS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveSetlists(setlists: Setlist[]): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(STORAGE_KEYS.SETLISTS, JSON.stringify(setlists));
}

export function findSetlist(setlists: Setlist[], id: string): Setlist | undefined {
  return setlists.find(s => s.id === id);
}

export function updateSetlist(setlists: Setlist[], updated: Setlist): Setlist[] {
  return setlists.map(s => s.id === updated.id ? { ...updated, updatedAt: Date.now() } : s);
}

export function deleteSetlist(setlists: Setlist[], id: string): Setlist[] {
  return setlists.filter(s => s.id !== id);
}
