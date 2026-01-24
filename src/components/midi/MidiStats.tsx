'use client';

import { MidiStats as MidiStatsType } from '@/lib/midi';

interface MidiStatsProps {
  stats: MidiStatsType;
}

export function MidiStats({ stats }: MidiStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
        <div className="text-xs text-zinc-500">Tempo</div>
        <div className="text-2xl font-bold text-zinc-900 dark:text-white">{Math.round(stats.tempo)} BPM</div>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
        <div className="text-xs text-zinc-500">Duration</div>
        <div className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.durationSeconds.toFixed(1)}s</div>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
        <div className="text-xs text-zinc-500">Tracks</div>
        <div className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.tracks}</div>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
        <div className="text-xs text-zinc-500">Notes</div>
        <div className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.notes}</div>
      </div>
    </div>
  );
}
