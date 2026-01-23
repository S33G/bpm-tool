'use client';

import { PitchResult } from '@/lib/audio/pitch-detection';

interface PitchDisplayProps {
  pitch: PitchResult | null;
}

export function PitchDisplay({ pitch }: PitchDisplayProps) {
  if (!pitch) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
        <span className="text-6xl font-bold">—</span>
        <span className="mt-2 text-sm">No pitch detected</span>
      </div>
    );
  }
  
  const centsColor = Math.abs(pitch.cents) < 10 
    ? 'text-green-500' 
    : Math.abs(pitch.cents) < 25 
      ? 'text-yellow-500' 
      : 'text-red-500';
  
  return (
    <div className="flex flex-col items-center py-8">
      <div className="mb-2 text-7xl font-bold text-zinc-900 dark:text-white">
        {pitch.note}
        <span className="text-3xl text-zinc-500">{pitch.octave}</span>
      </div>
      <div className={`text-2xl font-semibold ${centsColor}`}>
        {pitch.cents > 0 ? '+' : ''}{pitch.cents} cents
      </div>
      <div className="mt-2 text-sm text-zinc-500">
        {pitch.frequency.toFixed(1)} Hz
      </div>
    </div>
  );
}
