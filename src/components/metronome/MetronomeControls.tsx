'use client';

import { Select } from '@/components/ui';
import { TimeSignature } from '@/lib/metronome';

interface MetronomeControlsProps {
  timeSignature: TimeSignature;
  subdivision: 1 | 2 | 4;
  accentFirst: boolean;
  onTimeSignatureChange: (ts: TimeSignature) => void;
  onSubdivisionChange: (sub: 1 | 2 | 4) => void;
  onAccentFirstChange: (accent: boolean) => void;
}

const timeSignatureOptions: Array<{ value: TimeSignature; label: string }> = [
  { value: '4/4', label: '4/4' },
  { value: '3/4', label: '3/4' },
  { value: '6/8', label: '6/8' },
  { value: '2/4', label: '2/4' },
  { value: '5/4', label: '5/4' },
  { value: '7/8', label: '7/8' },
];

const subdivisionOptions: Array<{ value: string; label: string }> = [
  { value: '1', label: 'Quarter' },
  { value: '2', label: 'Eighth' },
  { value: '4', label: 'Sixteenth' },
];

export function MetronomeControls({
  timeSignature,
  subdivision,
  accentFirst,
  onTimeSignatureChange,
  onSubdivisionChange,
  onAccentFirstChange,
}: MetronomeControlsProps) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <Select
        label="Time Signature"
        value={timeSignature}
        onChange={onTimeSignatureChange}
        options={timeSignatureOptions}
      />
      <Select
        label="Subdivision"
        value={subdivision.toString()}
        onChange={(v) => onSubdivisionChange(parseInt(v) as 1 | 2 | 4)}
        options={subdivisionOptions}
      />
      <label className="flex items-center gap-2 pb-2">
        <input
          type="checkbox"
          checked={accentFirst}
          onChange={(e) => onAccentFirstChange(e.target.checked)}
          className="h-4 w-4 rounded border-zinc-300 accent-blue-500"
        />
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          Accent first beat
        </span>
      </label>
    </div>
  );
}
