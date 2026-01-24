import { NoteName, transposeNote, noteToMidi, INTERVAL_NAMES } from './notes';

export interface ChordDefinition {
  name: string;
  symbol: string;
  intervals: number[];
}

export const CHORD_DEFINITIONS: Record<string, ChordDefinition> = {
  maj: { name: 'Major', symbol: '', intervals: [0, 4, 7] },
  min: { name: 'Minor', symbol: 'm', intervals: [0, 3, 7] },
  dim: { name: 'Diminished', symbol: 'dim', intervals: [0, 3, 6] },
  aug: { name: 'Augmented', symbol: 'aug', intervals: [0, 4, 8] },
  
  maj7: { name: 'Major 7th', symbol: 'maj7', intervals: [0, 4, 7, 11] },
  min7: { name: 'Minor 7th', symbol: 'm7', intervals: [0, 3, 7, 10] },
  dom7: { name: 'Dominant 7th', symbol: '7', intervals: [0, 4, 7, 10] },
  dim7: { name: 'Diminished 7th', symbol: 'dim7', intervals: [0, 3, 6, 9] },
  halfDim7: { name: 'Half-Diminished 7th', symbol: 'm7b5', intervals: [0, 3, 6, 10] },
  minMaj7: { name: 'Minor Major 7th', symbol: 'mMaj7', intervals: [0, 3, 7, 11] },
  augMaj7: { name: 'Augmented Major 7th', symbol: 'augMaj7', intervals: [0, 4, 8, 11] },
  
  sus2: { name: 'Suspended 2nd', symbol: 'sus2', intervals: [0, 2, 7] },
  sus4: { name: 'Suspended 4th', symbol: 'sus4', intervals: [0, 5, 7] },
  
  add9: { name: 'Add 9', symbol: 'add9', intervals: [0, 4, 7, 14] },
  add11: { name: 'Add 11', symbol: 'add11', intervals: [0, 4, 7, 17] },
  
  maj9: { name: 'Major 9th', symbol: 'maj9', intervals: [0, 4, 7, 11, 14] },
  min9: { name: 'Minor 9th', symbol: 'm9', intervals: [0, 3, 7, 10, 14] },
  dom9: { name: 'Dominant 9th', symbol: '9', intervals: [0, 4, 7, 10, 14] },
  
  '6': { name: '6th', symbol: '6', intervals: [0, 4, 7, 9] },
  min6: { name: 'Minor 6th', symbol: 'm6', intervals: [0, 3, 7, 9] },
  
  power: { name: 'Power Chord', symbol: '5', intervals: [0, 7] },
};

export type ChordQuality = keyof typeof CHORD_DEFINITIONS;

export type Inversion = 'root' | 'first' | 'second' | 'third';
export type Voicing = 'close' | 'open' | 'drop2';

export interface Chord {
  root: NoteName;
  quality: ChordQuality;
  inversion: Inversion;
  notes: NoteName[];
  midiNotes: number[];
  name: string;
  symbol: string;
}

export type Instrument = 'piano' | 'guitar' | 'ukulele' | 'bass';

const INSTRUMENT_OCTAVE_RANGES: Record<Instrument, { base: number; range: number }> = {
  piano: { base: 4, range: 2 },
  guitar: { base: 3, range: 2 },
  ukulele: { base: 4, range: 1 },
  bass: { base: 2, range: 2 },
};

function invertChord(intervals: number[], inversion: Inversion): number[] {
  const result = [...intervals];
  const inversions = { root: 0, first: 1, second: 2, third: 3 };
  const inversionCount = Math.min(inversions[inversion], result.length - 1);
  
  for (let i = 0; i < inversionCount; i++) {
    const note = result.shift()!;
    result.push(note + 12);
  }
  
  return result;
}

export function buildChord(
  root: NoteName,
  quality: ChordQuality,
  inversion: Inversion = 'root',
  instrument: Instrument = 'piano'
): Chord {
  const definition = CHORD_DEFINITIONS[quality];
  const invertedIntervals = invertChord(definition.intervals, inversion);
  
  const notes = invertedIntervals.map(interval => transposeNote(root, interval % 12));
  
  const { base: baseOctave } = INSTRUMENT_OCTAVE_RANGES[instrument];
  const midiNotes = invertedIntervals.map(interval => {
    const octaveOffset = Math.floor(interval / 12);
    return noteToMidi(transposeNote(root, interval % 12), baseOctave + octaveOffset);
  });
  
  const symbol = `${root}${definition.symbol}`;
  const inversionLabel = inversion === 'root' ? '' : ` (${inversion} inversion)`;
  
  return {
    root,
    quality,
    inversion,
    notes,
    midiNotes,
    name: `${root} ${definition.name}${inversionLabel}`,
    symbol: symbol + inversionLabel,
  };
}

export interface ChordVoicingOptions {
  voicing?: Voicing;
  bassNote?: NoteName | null;
  octaveShift?: number;
}

function resolveBassMidi(bassNote: NoteName, referenceMidi: number): number {
  let octave = Math.floor(referenceMidi / 12) - 2;
  let midi = noteToMidi(bassNote, octave);
  while (midi >= referenceMidi) {
    octave -= 1;
    midi = noteToMidi(bassNote, octave);
  }
  return midi;
}

export function applyChordVoicing(chord: Chord, options: ChordVoicingOptions = {}): Chord {
  const { voicing = 'close', bassNote, octaveShift = 0 } = options;
  let midiNotes = [...chord.midiNotes].sort((a, b) => a - b);

  if (voicing === 'open') {
    midiNotes = midiNotes.map((note, index) => (index % 2 === 1 ? note + 12 : note));
  } else if (voicing === 'drop2' && midiNotes.length >= 3) {
    const dropIndex = midiNotes.length - 2;
    midiNotes[dropIndex] -= 12;
    midiNotes = midiNotes.sort((a, b) => a - b);
  }

  if (octaveShift !== 0) {
    midiNotes = midiNotes.map((note) => note + octaveShift * 12);
  }

  let symbol = chord.symbol;
  if (bassNote && bassNote !== chord.root) {
    symbol = `${symbol}/${bassNote}`;
    const bassMidi = resolveBassMidi(bassNote, midiNotes[0]);
    midiNotes = [bassMidi, ...midiNotes];
  }

  return {
    ...chord,
    midiNotes,
    symbol,
  };
}

export function getChordNoteWithInterval(chord: Chord, index: number): { note: NoteName; interval: string } {
  const definition = CHORD_DEFINITIONS[chord.quality];
  const interval = definition.intervals[index % definition.intervals.length];
  return {
    note: chord.notes[index],
    interval: INTERVAL_NAMES[interval % 12],
  };
}

export function getChordCategories(): Array<{ category: string; chords: ChordQuality[] }> {
  return [
    { category: 'Triads', chords: ['maj', 'min', 'dim', 'aug'] },
    { category: '7th Chords', chords: ['maj7', 'min7', 'dom7', 'dim7', 'halfDim7', 'minMaj7'] },
    { category: 'Suspended', chords: ['sus2', 'sus4'] },
    { category: 'Extended', chords: ['add9', 'add11', 'maj9', 'min9', 'dom9'] },
    { category: '6th Chords', chords: ['6', 'min6'] },
    { category: 'Power', chords: ['power'] },
  ];
}

export function generateChordFilename(
  chord: Chord,
  instrument: Instrument,
  bpm: number,
  voicing: Voicing = 'close',
  bassNote?: NoteName | null
): string {
  const inversionSuffix = chord.inversion === 'root' ? 'Root' : 
    chord.inversion === 'first' ? '1st' : 
    chord.inversion === 'second' ? '2nd' : '3rd';
  
  const sanitizedQuality = CHORD_DEFINITIONS[chord.quality].symbol || 'maj';
  const instrumentCapitalized = instrument.charAt(0).toUpperCase() + instrument.slice(1);
  const voicingLabel = voicing === 'close' ? 'Close' : voicing === 'open' ? 'Open' : 'Drop2';
  const bassLabel = bassNote ? `_${bassNote}` : '';
  
  return `${chord.root}${sanitizedQuality}_${instrumentCapitalized}_${inversionSuffix}_${voicingLabel}${bassLabel}_${bpm}.mid`;
}
