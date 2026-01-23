'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/layout';
import { ChordSelector, ChordDisplay, MiniKeyboard } from '@/components/chords';
import { 
  NoteName, 
  ChordQuality, 
  Inversion, 
  Instrument,
  buildChord,
  generateChordFilename 
} from '@/lib/music';
import { generateChordMidi, downloadMidiFile } from '@/lib/midi-export';
import { DEFAULT_BPM } from '@/lib/constants';

export default function ChordGeneratorPage() {
  const [root, setRoot] = useState<NoteName>('C');
  const [quality, setQuality] = useState<ChordQuality>('maj');
  const [inversion, setInversion] = useState<Inversion>('root');
  const [instrument, setInstrument] = useState<Instrument>('piano');
  const [bpm, setBpm] = useState(DEFAULT_BPM);
  
  const chord = buildChord(root, quality, inversion, instrument);
  
  const handleDownloadMidi = () => {
    const midiData = generateChordMidi(chord.midiNotes, bpm);
    const filename = generateChordFilename(chord, instrument, bpm);
    downloadMidiFile(midiData, filename);
  };
  
  return (
    <ToolLayout
      title="Chord Generator"
      description="Build and visualize chords. Select root note, chord type, and voicing. Export as MIDI."
    >
      <section className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <ChordSelector
          root={root}
          quality={quality}
          inversion={inversion}
          instrument={instrument}
          onRootChange={setRoot}
          onQualityChange={setQuality}
          onInversionChange={setInversion}
          onInstrumentChange={setInstrument}
        />
      </section>
      
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <ChordDisplay chord={chord} />
        
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
            Keyboard Preview
          </h3>
          <MiniKeyboard highlightedNotes={chord.notes} />
        </div>
      </div>
      
      <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
          Export
        </h3>
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              BPM (for MIDI)
            </label>
            <input
              type="number"
              min={20}
              max={300}
              value={bpm}
              onChange={(e) => setBpm(Math.max(20, Math.min(300, parseInt(e.target.value) || 120)))}
              className="h-10 w-24 rounded-lg border border-zinc-300 bg-white px-3 text-center text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
            />
          </div>
          <button
            onClick={handleDownloadMidi}
            className="flex h-10 items-center gap-2 rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download MIDI
          </button>
        </div>
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
          Filename: <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-700">{generateChordFilename(chord, instrument, bpm)}</code>
        </p>
      </section>
    </ToolLayout>
  );
}
