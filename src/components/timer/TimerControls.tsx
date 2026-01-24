'use client';

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
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Work (sec)</label>
        <input
          type="number"
          min={10}
          max={3600}
          value={workSeconds}
          onChange={(e) => onWorkChange(parseInt(e.target.value, 10) || 0)}
          className="h-10 w-28 rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-600 dark:bg-zinc-800"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Rest (sec)</label>
        <input
          type="number"
          min={0}
          max={3600}
          value={restSeconds}
          onChange={(e) => onRestChange(parseInt(e.target.value, 10) || 0)}
          className="h-10 w-28 rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-600 dark:bg-zinc-800"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Rounds</label>
        <input
          type="number"
          min={1}
          max={20}
          value={rounds}
          onChange={(e) => onRoundsChange(parseInt(e.target.value, 10) || 1)}
          className="h-10 w-24 rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-600 dark:bg-zinc-800"
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
