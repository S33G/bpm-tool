'use client';

import { ValidatedNumberInput } from '@/components/ValidatedNumberInput';

interface TimerControlsProps {
  workSeconds: number;
  restSeconds: number;
  rounds: number;
  isRunning: boolean;
  onWorkChange: (value: number) => void;
  onRestChange: (value: number) => void;
  onRoundsChange: (value: number) => void;
  onToggle: () => void;
  onReset: () => void;
}

export function TimerControls({
  workSeconds,
  restSeconds,
  rounds,
  isRunning,
  onWorkChange,
  onRestChange,
  onRoundsChange,
  onToggle,
  onReset,
}: TimerControlsProps) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="w-32">
        <ValidatedNumberInput
          label="Work (sec)"
          value={workSeconds}
          onChange={onWorkChange}
          min={10}
          max={3600}
          step={1}
          helperText="10–3600"
        />
      </div>
      <div className="w-32">
        <ValidatedNumberInput
          label="Rest (sec)"
          value={restSeconds}
          onChange={onRestChange}
          min={0}
          max={3600}
          step={1}
          helperText="0–3600"
        />
      </div>
      <div className="w-28">
        <ValidatedNumberInput
          label="Rounds"
          value={rounds}
          onChange={onRoundsChange}
          min={1}
          max={20}
          step={1}
          helperText="1–20"
        />
      </div>
      <button
        onClick={onToggle}
        className={`flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-medium text-white ${
          isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isRunning ? 'Pause' : 'Start'}
      </button>
      <button
        onClick={onReset}
        className="flex h-10 items-center gap-2 rounded-lg bg-zinc-200 px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
      >
        Reset
      </button>
    </div>
  );
}
