import { NoteName, noteToMidi, midiToNoteName } from './notes';

export type FretboardInstrument = 'guitar' | 'bass' | 'ukulele' | 'banjo';

export interface StringTuning {
  name: string;
  strings: number[];
}

export interface InstrumentConfig {
  name: string;
  strings: number;
  frets: number;
  tunings: Record<string, StringTuning>;
  defaultTuning: string;
}

export const INSTRUMENTS: Record<FretboardInstrument, InstrumentConfig> = {
  guitar: {
    name: 'Guitar',
    strings: 6,
    frets: 22,
    defaultTuning: 'standard',
    tunings: {
      standard: { name: 'Standard (EADGBE)', strings: [40, 45, 50, 55, 59, 64] },
      dropD: { name: 'Drop D (DADGBE)', strings: [38, 45, 50, 55, 59, 64] },
      openG: { name: 'Open G (DGDGBD)', strings: [38, 43, 50, 55, 59, 62] },
      openD: { name: 'Open D (DADF#AD)', strings: [38, 45, 50, 54, 57, 62] },
      dadgad: { name: 'DADGAD', strings: [38, 45, 50, 55, 57, 62] },
    },
  },
  bass: {
    name: 'Bass',
    strings: 4,
    frets: 20,
    defaultTuning: 'standard',
    tunings: {
      standard: { name: 'Standard (EADG)', strings: [28, 33, 38, 43] },
      dropD: { name: 'Drop D (DADG)', strings: [26, 33, 38, 43] },
      fiveString: { name: '5-String (BEADG)', strings: [23, 28, 33, 38, 43] },
    },
  },
  ukulele: {
    name: 'Ukulele',
    strings: 4,
    frets: 15,
    defaultTuning: 'standard',
    tunings: {
      standard: { name: 'Standard (GCEA)', strings: [55, 60, 64, 69] },
      lowG: { name: 'Low G (gCEA)', strings: [43, 60, 64, 69] },
      baritone: { name: 'Baritone (DGBE)', strings: [50, 55, 59, 64] },
    },
  },
  banjo: {
    name: 'Banjo',
    strings: 5,
    frets: 22,
    defaultTuning: 'standard',
    tunings: {
      standard: { name: 'Open G (gDGBD)', strings: [62, 50, 55, 59, 62] },
      doubleC: { name: 'Double C (gCGCD)', strings: [62, 48, 55, 60, 62] },
    },
  },
};

export interface FretNote {
  string: number;
  fret: number;
  midi: number;
  note: NoteName;
}

export function getFretNote(stringMidi: number, fret: number): FretNote {
  const midi = stringMidi + fret;
  return {
    string: 0,
    fret,
    midi,
    note: midiToNoteName(midi),
  };
}

export function getAllFretNotes(
  tuning: number[],
  frets: number
): FretNote[][] {
  return tuning.map((stringMidi, stringIndex) =>
    Array.from({ length: frets + 1 }, (_, fret) => ({
      string: stringIndex,
      fret,
      midi: stringMidi + fret,
      note: midiToNoteName(stringMidi + fret),
    }))
  );
}

export function findNotePositions(
  tuning: number[],
  frets: number,
  targetNotes: NoteName[]
): FretNote[] {
  const positions: FretNote[] = [];
  
  tuning.forEach((stringMidi, stringIndex) => {
    for (let fret = 0; fret <= frets; fret++) {
      const note = midiToNoteName(stringMidi + fret);
      if (targetNotes.includes(note)) {
        positions.push({
          string: stringIndex,
          fret,
          midi: stringMidi + fret,
          note,
        });
      }
    }
  });
  
  return positions;
}

export function getChordDiagram(
  tuning: number[],
  chordNotes: NoteName[],
  maxFret: number = 5
): (number | null)[] {
  return tuning.map((stringMidi) => {
    for (let fret = 0; fret <= maxFret; fret++) {
      const note = midiToNoteName(stringMidi + fret);
      if (chordNotes.includes(note)) {
        return fret;
      }
    }
    return null;
  });
}
