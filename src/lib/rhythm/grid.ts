export type RhythmTrack = 'kick' | 'snare' | 'hat' | 'clap' | 'perc';

export interface RhythmStep {
  active: boolean;
  velocity: number;
  accent: boolean;
}

export interface RhythmPattern {
  steps: number;
  tracks: Record<RhythmTrack, RhythmStep[]>;
}

export const DEFAULT_TRACKS: RhythmTrack[] = ['kick', 'snare', 'hat', 'clap', 'perc'];

export function createEmptyPattern(steps: number, tracks: RhythmTrack[] = DEFAULT_TRACKS): RhythmPattern {
  const pattern: RhythmPattern = {
    steps,
    tracks: {} as Record<RhythmTrack, RhythmStep[]>,
  };

  tracks.forEach((track) => {
    pattern.tracks[track] = Array.from({ length: steps }, () => ({
      active: false,
      velocity: 0.8,
      accent: false,
    }));
  });

  return pattern;
}

export function toggleStep(pattern: RhythmPattern, track: RhythmTrack, index: number): RhythmPattern {
  const newPattern: RhythmPattern = {
    ...pattern,
    tracks: { ...pattern.tracks },
  };

  const steps = [...newPattern.tracks[track]];
  const step = steps[index];
  steps[index] = { ...step, active: !step.active };
  newPattern.tracks[track] = steps;

  return newPattern;
}

export function setStepAccent(pattern: RhythmPattern, track: RhythmTrack, index: number, accent: boolean): RhythmPattern {
  const newPattern: RhythmPattern = {
    ...pattern,
    tracks: { ...pattern.tracks },
  };

  const steps = [...newPattern.tracks[track]];
  const step = steps[index];
  steps[index] = { ...step, accent };
  newPattern.tracks[track] = steps;

  return newPattern;
}

export function setStepVelocity(pattern: RhythmPattern, track: RhythmTrack, index: number, velocity: number): RhythmPattern {
  const newPattern: RhythmPattern = {
    ...pattern,
    tracks: { ...pattern.tracks },
  };

  const steps = [...newPattern.tracks[track]];
  const step = steps[index];
  steps[index] = { ...step, velocity: Math.max(0.1, Math.min(1, velocity)) };
  newPattern.tracks[track] = steps;

  return newPattern;
}

export function clonePattern(pattern: RhythmPattern): RhythmPattern {
  return {
    steps: pattern.steps,
    tracks: Object.fromEntries(
      Object.entries(pattern.tracks).map(([track, steps]) => [
        track,
        steps.map((step) => ({ ...step })),
      ])
    ) as Record<RhythmTrack, RhythmStep[]>,
  };
}
