'use client';

import { Scale, getScaleNoteWithInterval, INTERVAL_NAMES } from '@/lib/music';

interface ScaleDisplayProps {
  scale: Scale;
}

export function ScaleDisplay({ scale }: ScaleDisplayProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          {scale.name}
        </h2>
      </div>
      
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Scale Degrees
        </h3>
        <div className="flex flex-wrap gap-2">
          {scale.notes.map((note, index) => {
            const { interval } = getScaleNoteWithInterval(scale, index);
            return (
              <div
                key={index}
                className="flex flex-col items-center rounded-lg bg-zinc-100 px-4 py-3 dark:bg-zinc-700"
              >
                <span className="text-xl font-bold text-zinc-900 dark:text-white">
                  {note}
                </span>
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                  {interval}
                </span>
                <span className="text-xs text-zinc-500">
                  {index + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      <div>
        <h3 className="mb-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Intervals (semitones from root)
        </h3>
        <div className="flex flex-wrap gap-2">
          {scale.intervals.map((interval, index) => (
            <span
              key={index}
              className="rounded bg-purple-100 px-2 py-1 text-sm font-mono text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
            >
              {interval}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
