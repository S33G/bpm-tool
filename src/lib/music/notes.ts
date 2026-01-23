export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
export type NoteName = typeof NOTE_NAMES[number];

export const ENHARMONIC_MAP: Record<string, NoteName> = {
  'Db': 'C#',
  'Eb': 'D#',
  'Fb': 'E',
  'Gb': 'F#',
  'Ab': 'G#',
  'Bb': 'A#',
  'Cb': 'B',
  'E#': 'F',
  'B#': 'C',
};

export function noteNameToIndex(note: NoteName): number {
  return NOTE_NAMES.indexOf(note);
}

export function indexToNoteName(index: number): NoteName {
  return NOTE_NAMES[((index % 12) + 12) % 12];
}

export function midiToNoteName(midi: number): NoteName {
  return indexToNoteName(midi);
}

export function midiToOctave(midi: number): number {
  return Math.floor(midi / 12) - 1;
}

export function midiToNoteWithOctave(midi: number): string {
  return `${midiToNoteName(midi)}${midiToOctave(midi)}`;
}

export function noteToMidi(note: NoteName, octave: number): number {
  return (octave + 1) * 12 + noteNameToIndex(note);
}

export function midiToFrequency(midi: number, a4 = 440): number {
  return a4 * Math.pow(2, (midi - 69) / 12);
}

export function frequencyToMidi(freq: number, a4 = 440): number {
  return 12 * Math.log2(freq / a4) + 69;
}

export function frequencyToNote(freq: number, a4 = 440): { note: NoteName; octave: number; cents: number } {
  const midi = frequencyToMidi(freq, a4);
  const roundedMidi = Math.round(midi);
  const cents = Math.round((midi - roundedMidi) * 100);
  return {
    note: midiToNoteName(roundedMidi),
    octave: midiToOctave(roundedMidi),
    cents,
  };
}

export function transposeNote(note: NoteName, semitones: number): NoteName {
  const index = noteNameToIndex(note);
  return indexToNoteName(index + semitones);
}

export function getInterval(from: NoteName, to: NoteName): number {
  const fromIdx = noteNameToIndex(from);
  const toIdx = noteNameToIndex(to);
  return ((toIdx - fromIdx) + 12) % 12;
}

export const INTERVAL_NAMES: Record<number, string> = {
  0: 'R',
  1: 'm2',
  2: 'M2',
  3: 'm3',
  4: 'M3',
  5: 'P4',
  6: 'TT',
  7: 'P5',
  8: 'm6',
  9: 'M6',
  10: 'm7',
  11: 'M7',
};
