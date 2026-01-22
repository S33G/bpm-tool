'use client';

import { useState, useCallback, useRef } from 'react';
import { calculateBpmFromTaps } from '@/lib/calculations';
import { TAP_TEMPO_TIMEOUT, TAP_TEMPO_MAX_TAPS } from '@/lib/constants';

interface UseTapTempoReturn {
  tap: () => void;
  bpm: number | null;
  tapCount: number;
  reset: () => void;
}

export function useTapTempo(onBpmDetected?: (bpm: number) => void): UseTapTempoReturn {
  const [tapTimestamps, setTapTimestamps] = useState<number[]>([]);
  const [bpm, setBpm] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const reset = useCallback(() => {
    setTapTimestamps([]);
    setBpm(null);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const tap = useCallback(() => {
    const now = Date.now();

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout to reset after inactivity
    timeoutRef.current = setTimeout(reset, TAP_TEMPO_TIMEOUT);

    setTapTimestamps((prev) => {
      // Keep only the last MAX_TAPS timestamps
      const newTimestamps = [...prev, now].slice(-TAP_TEMPO_MAX_TAPS);

      // Calculate BPM from new timestamps
      const calculatedBpm = calculateBpmFromTaps(newTimestamps);
      if (calculatedBpm !== null) {
        setBpm(calculatedBpm);
        onBpmDetected?.(calculatedBpm);
      }

      return newTimestamps;
    });
  }, [onBpmDetected, reset]);

  return {
    tap,
    bpm,
    tapCount: tapTimestamps.length,
    reset,
  };
}
