'use client';

import { RhythmPattern, RhythmTrack } from '@/lib/rhythm';
import { StepToggle } from './StepToggle';

interface RhythmGridProps {
  pattern: RhythmPattern;
  onToggleStep: (track: RhythmTrack, index: number) => void;
  onToggleAccent: (track: RhythmTrack, index: number) => void;
}

const TRACK_LABELS: Record<RhythmTrack, string> = {
  kick: 'Kick',
  snare: 'Snare',
  hat: 'Hat',
  clap: 'Clap',
  perc: 'Perc',
};

export function RhythmGrid({ pattern, onToggleStep, onToggleAccent }: RhythmGridProps) {
  const tracks = Object.keys(pattern.tracks) as RhythmTrack[];
  const steps = Array.from({ length: pattern.steps }, (_, i) => i);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 pl-20">
        {steps.map((step) => (
          <div key={step} className="h-6 w-8 text-center text-xs text-zinc-400">
            {step + 1}
          </div>
        ))}
      </div>
      {tracks.map((track) => (
        <div key={track} className="flex items-center gap-2">
          <div className="w-16 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            {TRACK_LABELS[track]}
          </div>
          <div className="flex gap-2">
            {pattern.tracks[track].map((step, index) => (
              <StepToggle
                key={`${track}-${index}`}
                active={step.active}
                accent={step.accent}
                index={index}
                onToggle={() => onToggleStep(track, index)}
                onAccentToggle={() => onToggleAccent(track, index)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
