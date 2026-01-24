'use client';

import { KeyCandidate, SCALE_DEFINITIONS } from '@/lib/music';

interface KeyResultsProps {
  candidates: KeyCandidate[];
}

export function KeyResults({ candidates }: KeyResultsProps) {
  if (candidates.length === 0) {
    return (
      <div className="text-center text-sm text-zinc-500">
        Enter some notes to see matching keys.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {candidates.slice(0, 8).map((candidate, index) => (
        <div
          key={`${candidate.key}-${candidate.scaleType}-${index}`}
          className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800"
        >
          <div>
            <div className="text-lg font-semibold text-zinc-900 dark:text-white">
              {candidate.key} {SCALE_DEFINITIONS[candidate.scaleType].name}
            </div>
            <div className="text-xs text-zinc-500">
              Matches {candidate.matches} / {candidate.total}
            </div>
          </div>
          <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {(candidate.score * 100).toFixed(0)}%
          </div>
        </div>
      ))}
    </div>
  );
}
