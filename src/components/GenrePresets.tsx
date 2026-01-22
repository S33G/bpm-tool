'use client';

import { GENRE_PRESETS } from '@/lib/constants';

interface GenrePresetsProps {
  currentBpm: number;
  onSelectBpm: (bpm: number) => void;
}

export function GenrePresets({ currentBpm, onSelectBpm }: GenrePresetsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Genres:</span>
      <div className="flex flex-wrap gap-2">
        {GENRE_PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => onSelectBpm(preset.bpm)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              currentBpm === preset.bpm
                ? 'bg-blue-500 text-white'
                : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600'
            }`}
          >
            {preset.name} ({preset.bpm})
          </button>
        ))}
      </div>
    </div>
  );
}
