'use client';

import { useMemo } from 'react';
import { calculateAllNotes, getDelayTimeSuggestions } from '@/lib/calculations';
import { NoteCalculation } from '@/lib/types';

interface UseBpmCalculationsReturn {
  notes: NoteCalculation[];
  delaySuggestions: ReturnType<typeof getDelayTimeSuggestions>;
}

export function useBpmCalculations(bpm: number): UseBpmCalculationsReturn {
  const notes = useMemo(() => calculateAllNotes(bpm), [bpm]);
  const delaySuggestions = useMemo(() => getDelayTimeSuggestions(bpm), [bpm]);

  return {
    notes,
    delaySuggestions,
  };
}
