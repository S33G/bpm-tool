'use client';

import { Select } from '@/components/ui';

interface KeyboardControlsProps {
  startOctave: number;
  octaveCount: number;
  onStartOctaveChange: (octave: number) => void;
  onOctaveCountChange: (count: number) => void;
}

const octaveOptions = [0, 1, 2, 3, 4, 5, 6, 7].map(o => ({ 
  value: o.toString(), 
  label: `C${o}` 
}));

const countOptions = [1, 2, 3, 4, 5, 6, 7].map(c => ({ 
  value: c.toString(), 
  label: `${c} octave${c > 1 ? 's' : ''}` 
}));

export function KeyboardControls({
  startOctave,
  octaveCount,
  onStartOctaveChange,
  onOctaveCountChange,
}: KeyboardControlsProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <Select
        label="Start Octave"
        value={startOctave.toString()}
        onChange={(v) => onStartOctaveChange(parseInt(v))}
        options={octaveOptions}
      />
      <Select
        label="Octaves"
        value={octaveCount.toString()}
        onChange={(v) => onOctaveCountChange(parseInt(v))}
        options={countOptions}
      />
    </div>
  );
}
