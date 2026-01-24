/**
 * MIDI export functionality for groove patterns
 */

import { Midi } from '@tonejs/midi';
import { GrooveType } from './types';
import { RhythmPattern } from './rhythm/grid';

interface DrumNote {
  time: number;    // Time in seconds
  pitch: number;   // MIDI note number
  velocity: number; // Note velocity (0-127)
  duration: number; // Note duration in seconds
}

// General MIDI drum map
const DRUM_NOTES = {
  KICK: 36,      // C1
  SNARE: 38,     // D1
  CLOSED_HAT: 42, // F#1
  OPEN_HAT: 46,  // A#1
  CRASH: 49,     // C#2
} as const;

/**
 * Generate a simple drum pattern with the specified groove
 * @param bpm - Tempo in beats per minute
 * @param grooveType - Type of groove (straight, swing, triplet)
 * @param swingPercent - Swing percentage (only used for 'swing' type)
 * @param bars - Number of bars to generate
 * @returns MIDI file as Uint8Array
 */
export function generateDrumMidi(
  bpm: number,
  grooveType: GrooveType,
  swingPercent: number = 58,
  bars: number = 4
): Uint8Array {
  const midi = new Midi();
  midi.header.setTempo(bpm);
  
  // Create a drum track
  const track = midi.addTrack();
  track.name = `${grooveType.charAt(0).toUpperCase() + grooveType.slice(1)} Groove`;
  track.channel = 9; // MIDI channel 10 (0-indexed as 9) for drums
  
  const notes = generateDrumNotes(bpm, grooveType, swingPercent, bars);
  
  // Add notes to track
  notes.forEach((note) => {
    track.addNote({
      midi: note.pitch,
      time: note.time,
      duration: note.duration,
      velocity: note.velocity,
    });
  });
  
  return midi.toArray();
}

/**
 * Generate drum notes based on groove type
 */
function generateDrumNotes(
  bpm: number,
  grooveType: GrooveType,
  swingPercent: number,
  bars: number
): DrumNote[] {
  const notes: DrumNote[] = [];
  const quarterNoteTime = 60 / bpm; // Duration of quarter note in seconds
  const barTime = quarterNoteTime * 4;
  
  for (let bar = 0; bar < bars; bar++) {
    const barStartTime = bar * barTime;
    
    switch (grooveType) {
      case 'straight':
        notes.push(...generateStraightPattern(barStartTime, quarterNoteTime));
        break;
      case 'swing':
        notes.push(...generateSwingPattern(barStartTime, quarterNoteTime, swingPercent));
        break;
      case 'triplet':
        notes.push(...generateTripletPattern(barStartTime, quarterNoteTime));
        break;
    }
  }
  
  return notes;
}

/**
 * Generate straight (no swing) drum pattern
 * Pattern: Kick on 1 & 3, Snare on 2 & 4, Hi-hats on 8th notes
 */
function generateStraightPattern(barStart: number, quarterNote: number): DrumNote[] {
  const notes: DrumNote[] = [];
  const eighthNote = quarterNote / 2;
  const noteDuration = 0.1; // Short note duration
  
  // Kick on beats 1 and 3
  notes.push({ time: barStart, pitch: DRUM_NOTES.KICK, velocity: 100, duration: noteDuration });
  notes.push({ time: barStart + quarterNote * 2, pitch: DRUM_NOTES.KICK, velocity: 100, duration: noteDuration });
  
  // Snare on beats 2 and 4
  notes.push({ time: barStart + quarterNote, pitch: DRUM_NOTES.SNARE, velocity: 90, duration: noteDuration });
  notes.push({ time: barStart + quarterNote * 3, pitch: DRUM_NOTES.SNARE, velocity: 90, duration: noteDuration });
  
  // Hi-hats on every 8th note
  for (let i = 0; i < 8; i++) {
    const velocity = i % 2 === 0 ? 80 : 60; // Accent on downbeats
    notes.push({
      time: barStart + eighthNote * i,
      pitch: DRUM_NOTES.CLOSED_HAT,
      velocity,
      duration: noteDuration,
    });
  }
  
  return notes;
}

/**
 * Generate swing drum pattern
 * Pattern: Same as straight but with swing applied to hi-hats
 */
function generateSwingPattern(barStart: number, quarterNote: number, swingPercent: number): DrumNote[] {
  const notes: DrumNote[] = [];
  const noteDuration = 0.1;
  
  // Calculate swing timing
  const swing = Math.max(50, Math.min(75, swingPercent)) / 100;
  const ratio = swing / (1 - swing);
  const pairDuration = quarterNote;
  const onBeatDuration = (pairDuration * ratio) / (1 + ratio);
  const offBeatDuration = pairDuration - onBeatDuration;
  
  // Kick on beats 1 and 3 (no swing)
  notes.push({ time: barStart, pitch: DRUM_NOTES.KICK, velocity: 100, duration: noteDuration });
  notes.push({ time: barStart + quarterNote * 2, pitch: DRUM_NOTES.KICK, velocity: 100, duration: noteDuration });
  
  // Snare on beats 2 and 4 (no swing)
  notes.push({ time: barStart + quarterNote, pitch: DRUM_NOTES.SNARE, velocity: 90, duration: noteDuration });
  notes.push({ time: barStart + quarterNote * 3, pitch: DRUM_NOTES.SNARE, velocity: 90, duration: noteDuration });
  
  // Hi-hats with swing
  let currentTime = barStart;
  for (let i = 0; i < 8; i++) {
    const velocity = i % 2 === 0 ? 80 : 60;
    notes.push({
      time: currentTime,
      pitch: DRUM_NOTES.CLOSED_HAT,
      velocity,
      duration: noteDuration,
    });
    
    // Alternate between on-beat and off-beat durations
    currentTime += i % 2 === 0 ? onBeatDuration : offBeatDuration;
  }
  
  return notes;
}

/**
 * Generate triplet drum pattern
 * Pattern: Kick/snare on quarter notes, hi-hats on triplets
 */
function generateTripletPattern(barStart: number, quarterNote: number): DrumNote[] {
  const notes: DrumNote[] = [];
  const tripletDuration = quarterNote / 3;
  const noteDuration = 0.1;
  
  // Kick on beats 1 and 3
  notes.push({ time: barStart, pitch: DRUM_NOTES.KICK, velocity: 100, duration: noteDuration });
  notes.push({ time: barStart + quarterNote * 2, pitch: DRUM_NOTES.KICK, velocity: 100, duration: noteDuration });
  
  // Snare on beats 2 and 4
  notes.push({ time: barStart + quarterNote, pitch: DRUM_NOTES.SNARE, velocity: 90, duration: noteDuration });
  notes.push({ time: barStart + quarterNote * 3, pitch: DRUM_NOTES.SNARE, velocity: 90, duration: noteDuration });
  
  // Hi-hats on triplets (12 per bar)
  for (let i = 0; i < 12; i++) {
    const velocity = i % 3 === 0 ? 80 : 60; // Accent first of each triplet
    notes.push({
      time: barStart + tripletDuration * i,
      pitch: DRUM_NOTES.CLOSED_HAT,
      velocity,
      duration: noteDuration,
    });
  }
  
  return notes;
}

export function downloadMidiFile(midiData: Uint8Array, filename: string) {
  const blob = new Blob([midiData as BlobPart], { type: 'audio/midi' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateChordMidi(
  midiNotes: number[],
  bpm: number,
  durationBars: number = 1,
  velocity: number = 80
): Uint8Array {
  const midi = new Midi();
  midi.header.setTempo(bpm);
  
  const track = midi.addTrack();
  track.name = 'Chord';
  track.channel = 0;
  
  const quarterNoteTime = 60 / bpm;
  const barTime = quarterNoteTime * 4;
  const totalDuration = barTime * durationBars;
  
  midiNotes.forEach((note) => {
    track.addNote({
      midi: note,
      time: 0,
      duration: totalDuration - 0.05,
      velocity: velocity / 127,
    });
  });
  
  return midi.toArray();
}

export function generateRhythmMidi(
  pattern: RhythmPattern,
  bpm: number,
  bars: number = 1
): Uint8Array {
  const midi = new Midi();
  midi.header.setTempo(bpm);

  const track = midi.addTrack();
  track.name = 'Rhythm Grid';
  track.channel = 9;

  const quarterNoteTime = 60 / bpm;
  const barTime = quarterNoteTime * 4;
  const stepTime = barTime / pattern.steps;

  const drumMap: Record<string, number> = {
    kick: 36,
    snare: 38,
    hat: 42,
    clap: 39,
    perc: 46,
  };

  for (let bar = 0; bar < bars; bar++) {
    const barStart = bar * barTime;
    Object.entries(pattern.tracks).forEach(([trackName, steps]) => {
      const midiNote = drumMap[trackName] ?? 36;
      steps.forEach((step, index) => {
        if (!step.active) return;
        track.addNote({
          midi: midiNote,
          time: barStart + index * stepTime,
          duration: stepTime * 0.8,
          velocity: step.accent ? Math.min(1, step.velocity + 0.2) : step.velocity,
        });
      });
    });
  }

  return midi.toArray();
}
