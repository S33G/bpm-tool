import { NoteInfo } from './types';

export const MS_PER_MINUTE = 60000;

export const DEFAULT_BPM = 140;
export const MIN_BPM = 20;
export const MAX_BPM = 300;

export const NOTE_VALUES: NoteInfo[] = [
  { value: '1/1', label: 'Whole', multiplier: 4 },
  { value: '1/2', label: 'Half', multiplier: 2 },
  { value: '1/4', label: 'Quarter', multiplier: 1 },
  { value: '1/8', label: '8th', multiplier: 0.5 },
  { value: '1/16', label: '16th', multiplier: 0.25 },
  { value: '1/32', label: '32nd', multiplier: 0.125 },
  { value: '1/64', label: '64th', multiplier: 0.0625 },
  { value: '1/128', label: '128th', multiplier: 0.03125 },
];

export const VARIATION_MULTIPLIERS = {
  straight: 1,
  dotted: 1.5,
  triplet: 2 / 3,
} as const;

export const STORAGE_KEYS = {
  BOOKMARKS: 'groovelab-bookmarks',
  THEME: 'groovelab-theme',
  LAST_BPM: 'groovelab-last-bpm',
  SETLISTS: 'groovelab-setlists',
} as const;

export const TAP_TEMPO_TIMEOUT = 2000; // Reset after 2 seconds of no taps
export const TAP_TEMPO_MIN_TAPS = 2; // Minimum taps needed to calculate BPM
export const TAP_TEMPO_MAX_TAPS = 8; // Maximum taps to average

export const GENRE_PRESETS = [
  { name: 'Pop', bpm: 120 },
  { name: 'House', bpm: 128 },
  { name: 'Garage', bpm: 135 },
  { name: 'Dubstep', bpm: 140 },
  { name: 'Drum & Bass', bpm: 174 },
  { name: 'Gabber', bpm: 190 },
] as const;
