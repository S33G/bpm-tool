import { Midi } from '@tonejs/midi';
import { NoteName, midiToNoteName } from '@/lib/music';

export interface MidiNoteEvent {
  startBar: number;
  durationBars: number;
  midi: number;
  velocity: number;
}

export interface MidiTrackSummary {
  name: string;
  notes: number;
  channel: number;
  noteEvents: MidiNoteEvent[];
}

export interface MidiStats {
  tempo: number;
  durationSeconds: number;
  tracks: number;
  notes: number;
  totalBars: number;
  noteHistogram: Record<NoteName, number>;
  trackSummaries: MidiTrackSummary[];
}

export function analyzeMidi(data: ArrayBuffer): MidiStats {
  const midi = new Midi(new Uint8Array(data));
  const tempo = midi.header.tempos[0]?.bpm || 120;
  const durationSeconds = midi.duration;

  const noteHistogram = {} as Record<NoteName, number>;
  (['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as NoteName[]).forEach((note) => {
    noteHistogram[note] = 0;
  });

  let totalNotes = 0;
  let maxBar = 0;
  const trackSummaries: MidiTrackSummary[] = midi.tracks.map((track) => {
    totalNotes += track.notes.length;
    track.notes.forEach((note) => {
      const name = midiToNoteName(note.midi);
      noteHistogram[name] = (noteHistogram[name] || 0) + 1;
    });
    const noteEvents = track.notes.map((note) => {
      const startBar = midi.header.ticksToMeasures(note.ticks);
      const endBar = midi.header.ticksToMeasures(note.ticks + note.durationTicks);
      maxBar = Math.max(maxBar, endBar);
      return {
        startBar,
        durationBars: Math.max(endBar - startBar, 0.01),
        midi: note.midi,
        velocity: note.velocity,
      };
    });
    return {
      name: track.name || 'Untitled',
      notes: track.notes.length,
      channel: track.channel ?? 0,
      noteEvents,
    };
  });

  const headerBars = midi.header.ticksToMeasures(midi.durationTicks);
  const totalBars = Math.max(1, Math.ceil(Math.max(maxBar, headerBars)));

  return {
    tempo,
    durationSeconds,
    tracks: midi.tracks.length,
    notes: totalNotes,
    totalBars,
    noteHistogram,
    trackSummaries,
  };
}
