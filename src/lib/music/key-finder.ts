import { NoteName, NOTE_NAMES, ENHARMONIC_MAP } from './notes';
import { SCALE_DEFINITIONS, ScaleType } from './scales';

export interface KeyCandidate {
  key: NoteName;
  scaleType: ScaleType;
  score: number;
  matches: number;
  total: number;
}

export function normalizeNoteName(input: string): NoteName | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const upper = trimmed.toUpperCase();
  const normalized = upper.replace('H', 'B');
  const withSharp = normalized.replace('♯', '#').replace('♭', 'b');
  const canonical = ENHARMONIC_MAP[withSharp] || withSharp;
  return (NOTE_NAMES as readonly string[]).includes(canonical) ? (canonical as NoteName) : null;
}

export function parseNotesInput(input: string): NoteName[] {
  return input
    .split(/[,\s]+/)
    .map((token) => normalizeNoteName(token))
    .filter((note): note is NoteName => !!note);
}

export function findLikelyKeys(notes: NoteName[], scaleTypes: ScaleType[] = ['major', 'naturalMinor', 'dorian', 'mixolydian']): KeyCandidate[] {
  if (notes.length === 0) return [];

  const uniqueNotes = Array.from(new Set(notes));
  const candidates: KeyCandidate[] = [];

  NOTE_NAMES.forEach((key) => {
    scaleTypes.forEach((scaleType) => {
      const scaleNotes = SCALE_DEFINITIONS[scaleType].intervals.map((i) => NOTE_NAMES[(NOTE_NAMES.indexOf(key) + i) % 12]);
      const matches = uniqueNotes.filter((note) => scaleNotes.includes(note)).length;
      const score = matches / uniqueNotes.length;
      candidates.push({
        key,
        scaleType,
        score,
        matches,
        total: uniqueNotes.length,
      });
    });
  });

  return candidates
    .filter((candidate) => candidate.matches > 0)
    .sort((a, b) => b.score - a.score || b.matches - a.matches);
}
