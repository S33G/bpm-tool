'use client';

import { NoteCalculation } from '@/lib/types';
import { formatMs, formatHz } from '@/lib/calculations';
import { CopyButton } from './CopyButton';

interface NoteCardProps {
  note: NoteCalculation;
  showHz?: boolean;
}

export function NoteCard({ note, showHz = false }: NoteCardProps) {
  return (
    <div className="flex flex-col rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <span className="text-lg font-bold text-zinc-900 dark:text-white">{note.value}</span>
          <span className="ml-2 text-sm text-zinc-500 dark:text-zinc-400">{note.label}</span>
        </div>
      </div>

      {/* Values */}
      <div className="space-y-2">
        {/* Straight */}
        <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-700/50">
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Straight</span>
            <span className="font-mono text-sm font-semibold text-zinc-900 dark:text-white">
              {formatMs(note.straight)} ms
            </span>
            {showHz && (
              <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                {formatHz(note.straightHz)} Hz
              </span>
            )}
          </div>
          <CopyButton value={formatMs(note.straight)} label="" />
        </div>

        {/* Dotted */}
        <div className="flex items-center justify-between rounded-lg bg-blue-50 px-3 py-2 dark:bg-blue-900/20">
          <div className="flex flex-col">
            <span className="text-xs text-blue-600 dark:text-blue-400">Dotted</span>
            <span className="font-mono text-sm font-semibold text-zinc-900 dark:text-white">
              {formatMs(note.dotted)} ms
            </span>
            {showHz && (
              <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                {formatHz(note.dottedHz)} Hz
              </span>
            )}
          </div>
          <CopyButton value={formatMs(note.dotted)} label="" />
        </div>

        {/* Triplet */}
        <div className="flex items-center justify-between rounded-lg bg-purple-50 px-3 py-2 dark:bg-purple-900/20">
          <div className="flex flex-col">
            <span className="text-xs text-purple-600 dark:text-purple-400">Triplet</span>
            <span className="font-mono text-sm font-semibold text-zinc-900 dark:text-white">
              {formatMs(note.triplet)} ms
            </span>
            {showHz && (
              <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                {formatHz(note.tripletHz)} Hz
              </span>
            )}
          </div>
          <CopyButton value={formatMs(note.triplet)} label="" />
        </div>
      </div>
    </div>
  );
}
