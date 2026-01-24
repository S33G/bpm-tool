'use client';

import { getBeatsPerMeasure, TimeSignature } from '@/lib/metronome';

interface BeatGridProps {
  timeSignature: TimeSignature;
  accentPattern: boolean[];
  onAccentChange: (pattern: boolean[]) => void;
}

export function BeatGrid({ timeSignature, accentPattern, onAccentChange }: BeatGridProps) {
  const beats = getBeatsPerMeasure(timeSignature);
  const pattern = accentPattern.length === beats ? accentPattern : Array.from({ length: beats }, (_, i) => i === 0);

  const toggle = (index: number) => {
    const next = [...pattern];
    next[index] = !next[index];
    onAccentChange(next);
  };

  return (
    <div className="flex gap-2">
      {pattern.map((accent, index) => (
        <button
          key={index}
          onClick={() => toggle(index)}
          className={`h-10 w-10 rounded-lg text-sm font-semibold transition-colors ${
            accent
              ? 'bg-blue-500 text-white'
              : 'bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300'
          }`}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
}
