'use client';

import { MidiStats as MidiStatsType } from '@/lib/midi';

interface MidiTimelineProps {
  stats: MidiStatsType;
}

export function MidiTimeline({ stats }: MidiTimelineProps) {
  return (
    <div className="space-y-2">
      {stats.trackSummaries.map((track, index) => (
        <div
          key={`${track.name}-${index}`}
          className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800"
        >
          <div>
            <div className="font-medium text-zinc-900 dark:text-white">{track.name}</div>
            <div className="text-xs text-zinc-500">Channel {track.channel + 1}</div>
          </div>
          <div className="text-sm text-zinc-500">{track.notes} notes</div>
        </div>
      ))}
    </div>
  );
}
