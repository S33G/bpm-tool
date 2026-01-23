'use client';

import { TimeSignature, getBeatsPerMeasure } from '@/lib/metronome';

interface MetronomeDisplayProps {
  currentBeat: number;
  timeSignature: TimeSignature;
  isPlaying: boolean;
}

export function MetronomeDisplay({ 
  currentBeat, 
  timeSignature,
  isPlaying 
}: MetronomeDisplayProps) {
  const beatsPerMeasure = getBeatsPerMeasure(timeSignature);
  
  return (
    <div className="flex justify-center gap-3">
      {Array.from({ length: beatsPerMeasure }).map((_, index) => {
        const isActive = isPlaying && currentBeat === index;
        const isFirst = index === 0;
        
        return (
          <div
            key={index}
            className={`flex h-16 w-16 items-center justify-center rounded-xl text-2xl font-bold transition-all duration-100 ${
              isActive
                ? isFirst
                  ? 'scale-110 bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                  : 'scale-105 bg-zinc-700 text-white dark:bg-zinc-300 dark:text-zinc-900'
                : 'bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400'
            }`}
          >
            {index + 1}
          </div>
        );
      })}
    </div>
  );
}
