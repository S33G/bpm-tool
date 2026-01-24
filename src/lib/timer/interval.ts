export interface IntervalConfig {
  workSeconds: number;
  restSeconds: number;
  rounds: number;
}

export interface IntervalState {
  round: number;
  phase: 'work' | 'rest' | 'complete';
  remainingSeconds: number;
}

export function createIntervalState(config: IntervalConfig): IntervalState {
  return {
    round: 1,
    phase: 'work',
    remainingSeconds: config.workSeconds,
  };
}

export function advanceIntervalState(state: IntervalState, config: IntervalConfig): IntervalState {
  if (state.phase === 'complete') return state;

  if (state.phase === 'work') {
    return {
      round: state.round,
      phase: config.restSeconds > 0 ? 'rest' : state.round >= config.rounds ? 'complete' : 'work',
      remainingSeconds: config.restSeconds > 0 ? config.restSeconds : config.workSeconds,
    };
  }

  if (state.phase === 'rest') {
    const nextRound = state.round + 1;
    return {
      round: nextRound,
      phase: nextRound > config.rounds ? 'complete' : 'work',
      remainingSeconds: config.workSeconds,
    };
  }

  return state;
}

export function tickIntervalState(state: IntervalState): IntervalState {
  if (state.phase === 'complete') return state;
  return {
    ...state,
    remainingSeconds: Math.max(0, state.remainingSeconds - 1),
  };
}
