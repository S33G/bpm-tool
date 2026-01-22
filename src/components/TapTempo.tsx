'use client';

import { useEffect } from 'react';
import { useTapTempo } from '@/hooks/useTapTempo';

interface TapTempoProps {
  onBpmDetected: (bpm: number) => void;
}

export function TapTempo({ onBpmDetected }: TapTempoProps) {
  const { tap, bpm, tapCount, reset } = useTapTempo(onBpmDetected);

  // Handle keyboard tap (spacebar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if not focused on an input
      if (e.code === 'Space' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        tap();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tap]);

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={tap}
        className="relative flex h-20 w-32 items-center justify-center rounded-xl bg-blue-500 text-lg font-semibold text-white shadow-lg transition-all hover:bg-blue-600 active:scale-95 active:bg-blue-700"
        aria-label="Tap tempo"
      >
        TAP
        {tapCount > 0 && (
          <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 text-xs text-white dark:bg-zinc-200 dark:text-zinc-800">
            {tapCount}
          </span>
        )}
      </button>
      <div className="flex flex-col items-center gap-1">
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          {bpm ? `${bpm} BPM detected` : 'Tap or press Space'}
        </span>
        {tapCount > 0 && (
          <button
            onClick={reset}
            className="text-xs text-zinc-400 underline hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
