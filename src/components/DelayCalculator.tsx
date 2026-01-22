'use client';

import { formatMs } from '@/lib/calculations';
import { CopyButton } from './CopyButton';

interface DelayCalculatorProps {
  delaySuggestions: Record<string, number>;
}

export function DelayCalculator({ delaySuggestions }: DelayCalculatorProps) {
  const entries = Object.entries(delaySuggestions);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
      <h3 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-white">Delay Times</h3>
      <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
        Use these values for delay effects, reverb pre-delay, and other time-based effects.
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {entries.map(([label, ms]) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-700/50"
          >
            <div className="flex flex-col">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">{label}</span>
              <span className="font-mono text-sm font-semibold text-zinc-900 dark:text-white">
                {formatMs(ms)} ms
              </span>
            </div>
            <CopyButton value={formatMs(ms)} label="" />
          </div>
        ))}
      </div>
    </div>
  );
}
