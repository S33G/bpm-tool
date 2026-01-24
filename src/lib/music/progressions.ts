import { NoteName, transposeNote } from './notes';
import { ChordQuality, CHORD_DEFINITIONS } from './chords';
import { getDiatonicChords } from './keys';

export interface ProgressionTemplate {
  id: string;
  name: string;
  numerals: string[];
  mode: 'major' | 'minor';
}

export interface ProgressionChord {
  numeral: string;
  root: NoteName;
  quality: ChordQuality;
  symbol: string;
}

export const PROGRESSION_TEMPLATES: ProgressionTemplate[] = [
  { id: 'i-v-vi-iv', name: 'I–V–vi–IV', numerals: ['I', 'V', 'vi', 'IV'], mode: 'major' },
  { id: 'ii-v-i', name: 'ii–V–I', numerals: ['ii', 'V', 'I'], mode: 'major' },
  { id: 'i-vi-iv-v', name: 'I–vi–IV–V', numerals: ['I', 'vi', 'IV', 'V'], mode: 'major' },
  { id: 'i-iv-v', name: 'I–IV–V', numerals: ['I', 'IV', 'V'], mode: 'major' },
  { id: 'i-bVII-iv', name: 'i–bVII–iv', numerals: ['i', 'VII', 'iv'], mode: 'minor' },
  { id: 'i-iv-v', name: 'i–iv–v', numerals: ['i', 'iv', 'v'], mode: 'minor' },
  { id: 'i-vi-III-VII', name: 'i–VI–III–VII', numerals: ['i', 'VI', 'III', 'VII'], mode: 'minor' },
];

const ROMAN_TO_DEGREE: Record<string, number> = {
  I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7,
  i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7,
};

export function buildProgression(key: NoteName, mode: 'major' | 'minor', numerals: string[]): ProgressionChord[] {
  const diatonic = getDiatonicChords(key, mode);
  return numerals.map((numeral) => {
    const cleanNumeral = numeral.replace(/[^IViv]/g, '');
    const degree = ROMAN_TO_DEGREE[cleanNumeral] || 1;
    const chord = diatonic[degree - 1];
    const symbol = `${chord.root}${CHORD_DEFINITIONS[chord.quality].symbol || ''}`;
    return {
      numeral,
      root: chord.root,
      quality: chord.quality,
      symbol,
    };
  });
}
