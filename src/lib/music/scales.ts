import { NoteName, transposeNote, INTERVAL_NAMES } from './notes';

export interface ScaleDefinition {
  name: string;
  intervals: number[];
  category: 'major' | 'minor' | 'modes' | 'pentatonic' | 'japanese' | 'other';
}

export const SCALE_DEFINITIONS: Record<string, ScaleDefinition> = {
  major: { name: 'Major', intervals: [0, 2, 4, 5, 7, 9, 11], category: 'major' },
  naturalMinor: { name: 'Natural Minor', intervals: [0, 2, 3, 5, 7, 8, 10], category: 'minor' },
  harmonicMinor: { name: 'Harmonic Minor', intervals: [0, 2, 3, 5, 7, 8, 11], category: 'minor' },
  melodicMinor: { name: 'Melodic Minor', intervals: [0, 2, 3, 5, 7, 9, 11], category: 'minor' },
  
  dorian: { name: 'Dorian', intervals: [0, 2, 3, 5, 7, 9, 10], category: 'modes' },
  phrygian: { name: 'Phrygian', intervals: [0, 1, 3, 5, 7, 8, 10], category: 'modes' },
  lydian: { name: 'Lydian', intervals: [0, 2, 4, 6, 7, 9, 11], category: 'modes' },
  mixolydian: { name: 'Mixolydian', intervals: [0, 2, 4, 5, 7, 9, 10], category: 'modes' },
  aeolian: { name: 'Aeolian', intervals: [0, 2, 3, 5, 7, 8, 10], category: 'modes' },
  locrian: { name: 'Locrian', intervals: [0, 1, 3, 5, 6, 8, 10], category: 'modes' },
  
  majorPentatonic: { name: 'Major Pentatonic', intervals: [0, 2, 4, 7, 9], category: 'pentatonic' },
  minorPentatonic: { name: 'Minor Pentatonic', intervals: [0, 3, 5, 7, 10], category: 'pentatonic' },
  blues: { name: 'Blues', intervals: [0, 3, 5, 6, 7, 10], category: 'pentatonic' },
  
  hirajoshi: { name: 'Hirajoshi', intervals: [0, 2, 3, 7, 8], category: 'japanese' },
  insen: { name: 'Insen', intervals: [0, 1, 5, 7, 10], category: 'japanese' },
  kumoi: { name: 'Kumoi', intervals: [0, 2, 3, 7, 9], category: 'japanese' },
  yo: { name: 'Yo', intervals: [0, 2, 5, 7, 9], category: 'japanese' },
  ritsu: { name: 'Ritsu', intervals: [0, 2, 5, 7, 9, 11], category: 'japanese' },
  iwato: { name: 'Iwato', intervals: [0, 1, 5, 6, 10], category: 'japanese' },
  
  wholeTone: { name: 'Whole Tone', intervals: [0, 2, 4, 6, 8, 10], category: 'other' },
  diminished: { name: 'Diminished (W-H)', intervals: [0, 2, 3, 5, 6, 8, 9, 11], category: 'other' },
  chromatic: { name: 'Chromatic', intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], category: 'other' },
};

export type ScaleType = keyof typeof SCALE_DEFINITIONS;

export interface Scale {
  root: NoteName;
  type: ScaleType;
  notes: NoteName[];
  intervals: number[];
  name: string;
}

export function buildScale(root: NoteName, type: ScaleType): Scale {
  const definition = SCALE_DEFINITIONS[type];
  const notes = definition.intervals.map(interval => transposeNote(root, interval));
  
  return {
    root,
    type,
    notes,
    intervals: definition.intervals,
    name: `${root} ${definition.name}`,
  };
}

export function getScaleNoteWithInterval(scale: Scale, index: number): { note: NoteName; interval: string } {
  return {
    note: scale.notes[index],
    interval: INTERVAL_NAMES[scale.intervals[index]],
  };
}

export function isNoteInScale(note: NoteName, scale: Scale): boolean {
  return scale.notes.includes(note);
}

export function getScaleCategories(): Array<{ category: string; scales: ScaleType[] }> {
  const categories: Record<string, ScaleType[]> = {};
  
  for (const [key, def] of Object.entries(SCALE_DEFINITIONS)) {
    if (!categories[def.category]) {
      categories[def.category] = [];
    }
    categories[def.category].push(key as ScaleType);
  }
  
  return Object.entries(categories).map(([category, scales]) => ({ category, scales }));
}
