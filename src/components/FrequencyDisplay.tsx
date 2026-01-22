'use client';

import { NoteCalculation } from '@/lib/types';
import { formatHz } from '@/lib/calculations';
import { CopyButton } from './CopyButton';

interface FrequencyDisplayProps {
  notes: NoteCalculation[];
}

export function FrequencyDisplay({ notes }: FrequencyDisplayProps) {
  // Show frequency for common note values (1/4, 1/8, 1/16)
  const commonNotes = notes.filter((n) => ['1/4', '1/8', '1/16'].includes(n.value));

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
      <h3 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-white">Frequency (Hz)</h3>
      <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
        LFO rates, filter modulation, and other frequency-based parameters.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {commonNotes.map((note) => (
          <div
            key={note.value}
            className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-600"
          >
            <div className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {note.value} ({note.label})
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Straight</span>
                <div className="flex items-center gap-1">
                  <span className="font-mono text-sm font-semibold">{formatHz(note.straightHz)} Hz</span>
                  <CopyButton value={formatHz(note.straightHz)} label="" className="h-5" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-500">Dotted</span>
                <div className="flex items-center gap-1">
                  <span className="font-mono text-sm font-semibold">{formatHz(note.dottedHz)} Hz</span>
                  <CopyButton value={formatHz(note.dottedHz)} label="" className="h-5" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-purple-500">Triplet</span>
                <div className="flex items-center gap-1">
                  <span className="font-mono text-sm font-semibold">{formatHz(note.tripletHz)} Hz</span>
                  <CopyButton value={formatHz(note.tripletHz)} label="" className="h-5" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
