'use client';

import { useEffect, useMemo, useState } from 'react';
import { ToolLayout } from '@/components/layout';
import { TimerControls, TimerDisplay } from '@/components/timer';
import { IntervalConfig, createIntervalState, tickIntervalState, advanceIntervalState } from '@/lib/timer';

export default function PracticeTimerPage() {
  const [workSeconds, setWorkSeconds] = useState(60 * 5);
  const [restSeconds, setRestSeconds] = useState(60);
  const [rounds, setRounds] = useState(4);
  const [isRunning, setIsRunning] = useState(false);

  const config: IntervalConfig = useMemo(() => ({
    workSeconds,
    restSeconds,
    rounds,
  }), [workSeconds, restSeconds, rounds]);

  const [state, setState] = useState(() => createIntervalState(config));

  useEffect(() => {
    setState(createIntervalState(config));
  }, [config]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setState((prev) => {
        if (prev.remainingSeconds > 0) {
          return tickIntervalState(prev);
        }
        const nextState = advanceIntervalState(prev, config);
        if (nextState.phase === 'complete') {
          setIsRunning(false);
        }
        return nextState;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, config]);

  const handleReset = () => {
    setIsRunning(false);
    setState(createIntervalState(config));
  };

  return (
    <ToolLayout
      title="Practice Timer"
      description="Interval-based practice timer with work/rest rounds."
    >
      <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <TimerControls
          workSeconds={workSeconds}
          restSeconds={restSeconds}
          rounds={rounds}
          isRunning={isRunning}
          onWorkChange={setWorkSeconds}
          onRestChange={setRestSeconds}
          onRoundsChange={setRounds}
          onToggle={() => setIsRunning((prev) => !prev)}
          onReset={handleReset}
        />
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-700 dark:bg-zinc-800">
        <TimerDisplay
          phase={state.phase}
          remainingSeconds={state.remainingSeconds}
          round={state.round}
          totalRounds={rounds}
        />
      </section>
    </ToolLayout>
  );
}
