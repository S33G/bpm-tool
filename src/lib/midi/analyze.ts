import { Midi } from '@tonejs/midi';
import { NoteName, midiToNoteName } from '@/lib/music';

export interface MidiStats {
  tempo: number;
  durationSeconds: number;
  tracks: number;
  notes: number;
  noteHistogram: Record<NoteName, number>;
  trackSummaries: Array<{ name: string; notes: number; channel: number }>;
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
  const trackSummaries = midi.tracks.map((track) => {
    totalNotes += track.notes.length;
    track.notes.forEach((note) => {
      const name = midiToNoteName(note.midi);
      noteHistogram[name] = (noteHistogram[name] || 0) + 1;
    });
    return {
      name: track.name || 'Untitled',
      notes: track.notes.length,
      channel: track.channel ?? 0,
    };
  });

  return {
    tempo,
    durationSeconds,
    tracks: midi.tracks.length,
    notes: totalNotes,
    noteHistogram,
    trackSummaries,
  };
}
