// Note value types
export type NoteValue = '1/1' | '1/2' | '1/4' | '1/8' | '1/16' | '1/32' | '1/64' | '1/128';

export type NoteVariation = 'straight' | 'dotted' | 'triplet';

export interface NoteInfo {
  value: NoteValue;
  label: string;
  multiplier: number;
}

export interface NoteCalculation {
  value: NoteValue;
  label: string;
  straight: number;
  dotted: number;
  triplet: number;
  straightHz: number;
  dottedHz: number;
  tripletHz: number;
}

export interface Bookmark {
  id: string;
  bpm: number;
  name?: string;
  createdAt: number;
}

export type Theme = 'light' | 'dark' | 'system';

export type GrooveType = 'straight' | 'swing' | 'triplet';
