import { NoteName, NOTE_NAMES, transposeNote } from './notes';
import { ChordQuality } from './chords';

export interface KeySignature {
  key: NoteName;
  mode: 'major' | 'minor';
  sharps: number;
  flats: number;
  accidentals: NoteName[];
  relativeMinor?: NoteName;
  relativeMajor?: NoteName;
  parallelMinor?: NoteName;
  parallelMajor?: NoteName;
}

export interface DiatonicChord {
  degree: number;
  roman: string;
  root: NoteName;
  quality: ChordQuality;
}

const CIRCLE_OF_FIFTHS_MAJOR: NoteName[] = [
  'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#',
  'F', 'A#', 'D#', 'G#'
];

const CIRCLE_OF_FIFTHS_MINOR: NoteName[] = [
  'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#',
  'D', 'G', 'C', 'F'
];

const KEY_SIGNATURES: Record<NoteName, { sharps: number; flats: number; accidentals: NoteName[] }> = {
  'C': { sharps: 0, flats: 0, accidentals: [] },
  'G': { sharps: 1, flats: 0, accidentals: ['F#'] },
  'D': { sharps: 2, flats: 0, accidentals: ['F#', 'C#'] },
  'A': { sharps: 3, flats: 0, accidentals: ['F#', 'C#', 'G#'] },
  'E': { sharps: 4, flats: 0, accidentals: ['F#', 'C#', 'G#', 'D#'] },
  'B': { sharps: 5, flats: 0, accidentals: ['F#', 'C#', 'G#', 'D#', 'A#'] },
  'F#': { sharps: 6, flats: 0, accidentals: ['F#', 'C#', 'G#', 'D#', 'A#', 'E'] },
  'C#': { sharps: 7, flats: 0, accidentals: ['F#', 'C#', 'G#', 'D#', 'A#', 'E', 'B'] },
  'F': { sharps: 0, flats: 1, accidentals: ['A#'] },
  'A#': { sharps: 0, flats: 2, accidentals: ['A#', 'D#'] },
  'D#': { sharps: 0, flats: 3, accidentals: ['A#', 'D#', 'G#'] },
  'G#': { sharps: 0, flats: 4, accidentals: ['A#', 'D#', 'G#', 'C#'] },
};

const MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
const MINOR_SCALE_INTERVALS = [0, 2, 3, 5, 7, 8, 10];

const MAJOR_DIATONIC_QUALITIES: ChordQuality[] = ['maj', 'min', 'min', 'maj', 'maj', 'min', 'dim'];
const MAJOR_ROMAN_NUMERALS = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];

const MINOR_DIATONIC_QUALITIES: ChordQuality[] = ['min', 'dim', 'maj', 'min', 'min', 'maj', 'maj'];
const MINOR_ROMAN_NUMERALS = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];

export function getKeySignature(key: NoteName, mode: 'major' | 'minor'): KeySignature {
  const majorKey = mode === 'major' ? key : transposeNote(key, 3);
  const sig = KEY_SIGNATURES[majorKey] || { sharps: 0, flats: 0, accidentals: [] };
  
  const relativeMinor = mode === 'major' ? transposeNote(key, -3) : undefined;
  const relativeMajor = mode === 'minor' ? transposeNote(key, 3) : undefined;
  const parallelMinor = mode === 'major' ? key : undefined;
  const parallelMajor = mode === 'minor' ? key : undefined;
  
  return {
    key,
    mode,
    sharps: sig.sharps,
    flats: sig.flats,
    accidentals: sig.accidentals,
    relativeMinor,
    relativeMajor,
    parallelMinor,
    parallelMajor,
  };
}

export function getDiatonicChords(key: NoteName, mode: 'major' | 'minor'): DiatonicChord[] {
  const intervals = mode === 'major' ? MAJOR_SCALE_INTERVALS : MINOR_SCALE_INTERVALS;
  const qualities = mode === 'major' ? MAJOR_DIATONIC_QUALITIES : MINOR_DIATONIC_QUALITIES;
  const numerals = mode === 'major' ? MAJOR_ROMAN_NUMERALS : MINOR_ROMAN_NUMERALS;
  
  return intervals.map((interval, index) => ({
    degree: index + 1,
    roman: numerals[index],
    root: transposeNote(key, interval),
    quality: qualities[index],
  }));
}

export function getCircleOfFifths(mode: 'major' | 'minor'): NoteName[] {
  return mode === 'major' ? CIRCLE_OF_FIFTHS_MAJOR : CIRCLE_OF_FIFTHS_MINOR;
}

export function getCirclePosition(key: NoteName, mode: 'major' | 'minor'): number {
  const circle = getCircleOfFifths(mode);
  return circle.indexOf(key);
}

export function getEnharmonicSpelling(note: NoteName, preferFlats: boolean): string {
  const flatSpellings: Record<NoteName, string> = {
    'C': 'C', 'C#': 'Db', 'D': 'D', 'D#': 'Eb', 'E': 'E',
    'F': 'F', 'F#': 'Gb', 'G': 'G', 'G#': 'Ab', 'A': 'A',
    'A#': 'Bb', 'B': 'B',
  };
  
  if (preferFlats && note.includes('#')) {
    return flatSpellings[note];
  }
  return note;
}

export function formatKeyName(key: NoteName, mode: 'major' | 'minor', preferFlats: boolean = false): string {
  const spelled = getEnharmonicSpelling(key, preferFlats);
  return `${spelled} ${mode === 'major' ? 'Major' : 'Minor'}`;
}
