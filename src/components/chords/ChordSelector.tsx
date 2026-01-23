'use client';

import { Select, SelectGroup } from '@/components/ui';
import { 
  NOTE_NAMES, 
  NoteName, 
  ChordQuality, 
  Inversion, 
  Instrument,
  CHORD_DEFINITIONS,
  getChordCategories 
} from '@/lib/music';

interface ChordSelectorProps {
  root: NoteName;
  quality: ChordQuality;
  inversion: Inversion;
  instrument: Instrument;
  onRootChange: (root: NoteName) => void;
  onQualityChange: (quality: ChordQuality) => void;
  onInversionChange: (inversion: Inversion) => void;
  onInstrumentChange: (instrument: Instrument) => void;
}

const noteOptions = NOTE_NAMES.map(note => ({ value: note, label: note }));

const chordGroups = getChordCategories().map(({ category, chords }) => ({
  label: category,
  options: chords.map(q => ({
    value: q,
    label: CHORD_DEFINITIONS[q].name,
  })),
}));

const inversionOptions: Array<{ value: Inversion; label: string }> = [
  { value: 'root', label: 'Root Position' },
  { value: 'first', label: '1st Inversion' },
  { value: 'second', label: '2nd Inversion' },
  { value: 'third', label: '3rd Inversion' },
];

const instrumentOptions: Array<{ value: Instrument; label: string }> = [
  { value: 'piano', label: 'Piano' },
  { value: 'guitar', label: 'Guitar' },
  { value: 'ukulele', label: 'Ukulele' },
  { value: 'bass', label: 'Bass' },
];

export function ChordSelector({
  root,
  quality,
  inversion,
  instrument,
  onRootChange,
  onQualityChange,
  onInversionChange,
  onInstrumentChange,
}: ChordSelectorProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Select
        label="Root Note"
        value={root}
        onChange={onRootChange}
        options={noteOptions}
      />
      <SelectGroup
        label="Chord Type"
        value={quality}
        onChange={onQualityChange}
        groups={chordGroups}
      />
      <Select
        label="Inversion"
        value={inversion}
        onChange={onInversionChange}
        options={inversionOptions}
      />
      <Select
        label="Instrument"
        value={instrument}
        onChange={onInstrumentChange}
        options={instrumentOptions}
      />
    </div>
  );
}
