'use client';

import { Select } from '@/components/ui';
import { FretboardInstrument, INSTRUMENTS } from '@/lib/music/fretboards';

interface FretboardControlsProps {
  instrument: FretboardInstrument;
  tuning: string;
  showAllNotes: boolean;
  onInstrumentChange: (instrument: FretboardInstrument) => void;
  onTuningChange: (tuning: string) => void;
  onShowAllNotesChange: (show: boolean) => void;
}

const instrumentOptions: Array<{ value: FretboardInstrument; label: string }> = [
  { value: 'guitar', label: 'Guitar' },
  { value: 'bass', label: 'Bass' },
  { value: 'ukulele', label: 'Ukulele' },
  { value: 'banjo', label: 'Banjo' },
];

export function FretboardControls({
  instrument,
  tuning,
  showAllNotes,
  onInstrumentChange,
  onTuningChange,
  onShowAllNotesChange,
}: FretboardControlsProps) {
  const config = INSTRUMENTS[instrument];
  const tuningOptions = Object.entries(config.tunings).map(([key, value]) => ({
    value: key,
    label: value.name,
  }));
  
  return (
    <div className="flex flex-wrap items-end gap-4">
      <Select
        label="Instrument"
        value={instrument}
        onChange={onInstrumentChange}
        options={instrumentOptions}
      />
      <Select
        label="Tuning"
        value={tuning}
        onChange={onTuningChange}
        options={tuningOptions}
      />
      <label className="flex items-center gap-2 pb-2">
        <input
          type="checkbox"
          checked={showAllNotes}
          onChange={(e) => onShowAllNotesChange(e.target.checked)}
          className="h-4 w-4 rounded border-zinc-300 accent-blue-500"
        />
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          Show all notes
        </span>
      </label>
    </div>
  );
}
