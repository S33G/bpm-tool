'use client';

import { NoteName } from '@/lib/music';

interface HistoryNote {
  note: NoteName;
  octave: number;
  timestamp: number;
}

interface NoteHistoryProps {
  history: HistoryNote[];
}

export function NoteHistory({ history }: NoteHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="text-center text-sm text-zinc-400">
        No notes detected yet
      </div>
    );
  }
  
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {history.map((item, index) => (
        <div
          key={item.timestamp}
          className={`rounded-lg px-3 py-1 text-sm font-medium transition-opacity ${
            index === history.length - 1
              ? 'bg-blue-500 text-white'
              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300'
          }`}
          style={{ opacity: 0.5 + (index / history.length) * 0.5 }}
        >
          {item.note}{item.octave}
        </div>
      ))}
    </div>
  );
}

export type { HistoryNote };
