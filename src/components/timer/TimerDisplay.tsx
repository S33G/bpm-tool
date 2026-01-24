'use client';

interface TimerDisplayProps {
  phase: 'work' | 'rest' | 'complete';
  remainingSeconds: number;
  round: number;
  totalRounds: number;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function TimerDisplay({ phase, remainingSeconds, round, totalRounds }: TimerDisplayProps) {
  const phaseLabel = phase === 'work' ? 'Work' : phase === 'rest' ? 'Rest' : 'Complete';

  return (
    <div className="flex flex-col items-center">
      <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {phaseLabel}
      </div>
      <div className="text-6xl font-bold text-zinc-900 dark:text-white">
        {formatTime(remainingSeconds)}
      </div>
      <div className="mt-2 text-sm text-zinc-500">
        Round {phase === 'complete' ? totalRounds : round} / {totalRounds}
      </div>
    </div>
  );
}
