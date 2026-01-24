'use client';

import { ProgressionChord } from '@/lib/music';

interface ProgressionPreviewProps {
  chords: ProgressionChord[];
}

export function ProgressionPreview({ chords }: ProgressionPreviewProps) {
  if (chords.length === 0) {
    return (
      <div className="text-center text-sm text-zinc-500">
        Select a template to preview the progression.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {chords.map((chord, index) => (
        <div
          key={`${chord.numeral}-${index}`}
          className="flex flex-col items-center rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800"
        >
          <span className="text-xs text-zinc-500">{chord.numeral}</span>
          <span className="text-lg font-semibold text-zinc-900 dark:text-white">{chord.symbol}</span>
        </div>
      ))}
    </div>
  );
}
