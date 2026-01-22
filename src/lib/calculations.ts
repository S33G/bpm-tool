import { NoteCalculation } from './types';
import { MS_PER_MINUTE, NOTE_VALUES, VARIATION_MULTIPLIERS } from './constants';

/**
 * Calculate the duration in milliseconds for a quarter note at a given BPM
 * Formula: 60,000 ms / BPM = ms per quarter note
 */
export function bpmToQuarterNoteMs(bpm: number): number {
  if (bpm <= 0) return 0;
  return MS_PER_MINUTE / bpm;
}

/**
 * Calculate the duration in milliseconds for any note value at a given BPM
 */
export function bpmToNoteMs(bpm: number, multiplier: number): number {
  return bpmToQuarterNoteMs(bpm) * multiplier;
}

/**
 * Apply a variation (dotted or triplet) to a note duration
 */
export function applyVariation(ms: number, variation: keyof typeof VARIATION_MULTIPLIERS): number {
  return ms * VARIATION_MULTIPLIERS[variation];
}

/**
 * Convert milliseconds to frequency in Hz
 * Formula: 1000 / ms = Hz
 */
export function msToHz(ms: number): number {
  if (ms <= 0) return 0;
  return 1000 / ms;
}

/**
 * Calculate all note values for a given BPM
 */
export function calculateAllNotes(bpm: number): NoteCalculation[] {
  return NOTE_VALUES.map((note) => {
    const straight = bpmToNoteMs(bpm, note.multiplier);
    const dotted = applyVariation(straight, 'dotted');
    const triplet = applyVariation(straight, 'triplet');

    return {
      value: note.value,
      label: note.label,
      straight,
      dotted,
      triplet,
      straightHz: msToHz(straight),
      dottedHz: msToHz(dotted),
      tripletHz: msToHz(triplet),
    };
  });
}

/**
 * Format milliseconds for display (2 decimal places)
 */
export function formatMs(ms: number): string {
  return ms.toFixed(2);
}

/**
 * Format Hz for display (2 decimal places)
 */
export function formatHz(hz: number): string {
  return hz.toFixed(2);
}

/**
 * Calculate BPM from tap intervals
 */
export function calculateBpmFromTaps(tapTimestamps: number[]): number | null {
  if (tapTimestamps.length < 2) return null;

  const intervals: number[] = [];
  for (let i = 1; i < tapTimestamps.length; i++) {
    intervals.push(tapTimestamps[i] - tapTimestamps[i - 1]);
  }

  const averageInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const bpm = MS_PER_MINUTE / averageInterval;

  // Round to nearest integer and clamp
  return Math.round(Math.min(Math.max(bpm, 20), 300));
}

/**
 * Get delay time suggestions for common rhythmic patterns
 */
export function getDelayTimeSuggestions(bpm: number) {
  const quarterNote = bpmToQuarterNoteMs(bpm);

  return {
    '1/4': quarterNote,
    '1/4 dotted': quarterNote * 1.5,
    '1/4 triplet': quarterNote * (2 / 3),
    '1/8': quarterNote * 0.5,
    '1/8 dotted': quarterNote * 0.5 * 1.5,
    '1/8 triplet': quarterNote * 0.5 * (2 / 3),
    '1/16': quarterNote * 0.25,
    '1/16 dotted': quarterNote * 0.25 * 1.5,
    '1/16 triplet': quarterNote * 0.25 * (2 / 3),
  };
}
