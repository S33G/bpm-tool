'use client';

import { Chord, getChordNoteWithInterval } from '@/lib/music';

interface ChordDisplayProps {
  chord: Chord;
}

export function ChordDisplay({ chord }: ChordDisplayProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
      <div className="mb-4 text-center">
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
          {chord.symbol}
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {chord.name}
        </p>
      </div>
      
      <div className="mb-4">
        <h3 className="mb-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Notes
        </h3>
        <div className="flex flex-wrap gap-2">
          {chord.notes.map((note, index) => {
            const { interval } = getChordNoteWithInterval(chord, index);
            return (
              <div
                key={index}
                className="flex flex-col items-center rounded-lg bg-zinc-100 px-4 py-2 dark:bg-zinc-700"
              >
                <span className="text-lg font-bold text-zinc-900 dark:text-white">
                  {note}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {interval}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      <div>
        <h3 className="mb-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          MIDI Notes
        </h3>
        <div className="flex flex-wrap gap-2">
          {chord.midiNotes.map((midi, index) => (
            <span
              key={index}
              className="rounded bg-blue-100 px-2 py-1 text-sm font-mono text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
            >
              {midi}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
