'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/layout';
import { Fretboard, FretboardControls } from '@/components/fretboard';
import { Select, SelectGroup } from '@/components/ui';
import { 
  NoteName, 
  NOTE_NAMES,
  ChordQuality,
  ScaleType,
  buildChord,
  buildScale,
  getChordCategories,
  getScaleCategories,
  CHORD_DEFINITIONS,
  SCALE_DEFINITIONS,
} from '@/lib/music';
import { FretboardInstrument, INSTRUMENTS } from '@/lib/music/fretboards';

type HighlightMode = 'chord' | 'scale' | 'none';

const noteOptions = NOTE_NAMES.map(note => ({ value: note, label: note }));

const chordGroups = getChordCategories().map(({ category, chords }) => ({
  label: category,
  options: chords.map(q => ({
    value: q,
    label: CHORD_DEFINITIONS[q].name,
  })),
}));

const scaleGroups = getScaleCategories().map(({ category, scales }) => ({
  label: category.charAt(0).toUpperCase() + category.slice(1),
  options: scales.map(s => ({
    value: s,
    label: SCALE_DEFINITIONS[s].name,
  })),
}));

export default function FretboardVisualizerPage() {
  const [instrument, setInstrument] = useState<FretboardInstrument>('guitar');
  const [tuningKey, setTuningKey] = useState('standard');
  const [showAllNotes, setShowAllNotes] = useState(false);
  
  const [highlightMode, setHighlightMode] = useState<HighlightMode>('scale');
  const [root, setRoot] = useState<NoteName>('C');
  const [chordQuality, setChordQuality] = useState<ChordQuality>('maj');
  const [scaleType, setScaleType] = useState<ScaleType>('majorPentatonic');
  
  const config = INSTRUMENTS[instrument];
  const tuning = config.tunings[tuningKey]?.strings || config.tunings[config.defaultTuning].strings;
  
  const getHighlightedNotes = (): NoteName[] => {
    switch (highlightMode) {
      case 'chord':
        return buildChord(root, chordQuality).notes;
      case 'scale':
        return buildScale(root, scaleType).notes;
      default:
        return [];
    }
  };
  
  const highlightedNotes = getHighlightedNotes();
  
  const handleInstrumentChange = (newInstrument: FretboardInstrument) => {
    setInstrument(newInstrument);
    setTuningKey(INSTRUMENTS[newInstrument].defaultTuning);
  };
  
  return (
    <ToolLayout
      title="Fretboard Visualizer"
      description="Visualize scales and chords on guitar, bass, ukulele, or banjo fretboard."
    >
      <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <FretboardControls
          instrument={instrument}
          tuning={tuningKey}
          showAllNotes={showAllNotes}
          onInstrumentChange={handleInstrumentChange}
          onTuningChange={setTuningKey}
          onShowAllNotesChange={setShowAllNotes}
        />
      </section>
      
      <section className="mb-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
        <div className="mb-4 flex flex-wrap items-end gap-4">
          <Select
            label="Highlight"
            value={highlightMode}
            onChange={(v) => setHighlightMode(v as HighlightMode)}
            options={[
              { value: 'none', label: 'None' },
              { value: 'chord', label: 'Chord' },
              { value: 'scale', label: 'Scale' },
            ]}
          />
          
          {highlightMode !== 'none' && (
            <Select
              label="Root"
              value={root}
              onChange={setRoot}
              options={noteOptions}
            />
          )}
          
          {highlightMode === 'chord' && (
            <SelectGroup
              label="Chord Type"
              value={chordQuality}
              onChange={setChordQuality}
              groups={chordGroups}
            />
          )}
          
          {highlightMode === 'scale' && (
            <SelectGroup
              label="Scale Type"
              value={scaleType}
              onChange={setScaleType}
              groups={scaleGroups}
            />
          )}
        </div>
        
        {highlightMode !== 'none' && (
          <div className="mb-4 text-center">
            <span className="text-lg font-semibold text-zinc-900 dark:text-white">
              {highlightMode === 'chord' 
                ? `${root}${CHORD_DEFINITIONS[chordQuality].symbol || ''}`
                : `${root} ${SCALE_DEFINITIONS[scaleType].name}`
              }
            </span>
            <span className="ml-2 text-sm text-zinc-500">
              ({highlightedNotes.join(' - ')})
            </span>
          </div>
        )}
        
        <Fretboard
          tuning={tuning}
          frets={config.frets}
          highlightedNotes={highlightedNotes}
          showAllNotes={showAllNotes}
          highlightColor={highlightMode === 'chord' ? 'blue' : 'purple'}
        />
      </section>
      
      <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
        <h3 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-white">
          Current Tuning
        </h3>
        <div className="flex flex-wrap gap-2">
          {tuning.map((midi, i) => (
            <div
              key={i}
              className="flex flex-col items-center rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-700"
            >
              <span className="text-xs text-zinc-500">String {tuning.length - i}</span>
              <span className="font-bold text-zinc-900 dark:text-white">
                {NOTE_NAMES[midi % 12]}
              </span>
            </div>
          ))}
        </div>
      </section>
    </ToolLayout>
  );
}
