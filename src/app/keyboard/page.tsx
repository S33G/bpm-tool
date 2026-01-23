'use client';

import { useState, useRef } from 'react';
import { ToolLayout } from '@/components/layout';
import { Piano, KeyboardControls } from '@/components/keyboard';
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
  noteToMidi,
} from '@/lib/music';

type HighlightMode = 'none' | 'chord' | 'scale' | 'custom';

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

export default function KeyboardVisualizerPage() {
  const [startOctave, setStartOctave] = useState(3);
  const [octaveCount, setOctaveCount] = useState(4);
  const [highlightMode, setHighlightMode] = useState<HighlightMode>('chord');
  
  const [root, setRoot] = useState<NoteName>('C');
  const [chordQuality, setChordQuality] = useState<ChordQuality>('maj');
  const [scaleType, setScaleType] = useState<ScaleType>('major');
  
  const [customNotes, setCustomNotes] = useState<number[]>([]);
  
  const startMidi = noteToMidi('C', startOctave);
  const endMidi = noteToMidi('B', startOctave + octaveCount - 1);
  
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
  
  const getHighlightedMidi = (): number[] => {
    if (highlightMode === 'custom') {
      return customNotes;
    }
    return [];
  };
  
  const handleKeyClick = (midi: number) => {
    if (highlightMode === 'custom') {
      setCustomNotes(prev => 
        prev.includes(midi) 
          ? prev.filter(n => n !== midi)
          : [...prev, midi]
      );
    }
  };
  
  const clearCustomNotes = () => setCustomNotes([]);
  
  const highlightedNotes = getHighlightedNotes();
  const highlightedMidi = getHighlightedMidi();
  
  const getTitle = (): string => {
    switch (highlightMode) {
      case 'chord':
        return `${root}${CHORD_DEFINITIONS[chordQuality].symbol || ''} - ${CHORD_DEFINITIONS[chordQuality].name}`;
      case 'scale':
        return `${root} ${SCALE_DEFINITIONS[scaleType].name}`;
      case 'custom':
        return `Custom Selection (${customNotes.length} notes)`;
      default:
        return 'No Selection';
    }
  };
  
  return (
    <ToolLayout
      title="Keyboard Visualizer"
      description="Interactive piano keyboard. Visualize chords, scales, or click to highlight custom notes."
    >
      <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <div className="mb-4 flex flex-wrap items-end gap-4">
          <KeyboardControls
            startOctave={startOctave}
            octaveCount={octaveCount}
            onStartOctaveChange={setStartOctave}
            onOctaveCountChange={setOctaveCount}
          />
          <Select
            label="Highlight Mode"
            value={highlightMode}
            onChange={(v) => setHighlightMode(v as HighlightMode)}
            options={[
              { value: 'none', label: 'None' },
              { value: 'chord', label: 'Chord' },
              { value: 'scale', label: 'Scale' },
              { value: 'custom', label: 'Custom (Click)' },
            ]}
          />
        </div>
        
        {(highlightMode === 'chord' || highlightMode === 'scale') && (
          <div className="flex flex-wrap gap-4">
            <Select
              label="Root Note"
              value={root}
              onChange={setRoot}
              options={noteOptions}
            />
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
        )}
        
        {highlightMode === 'custom' && customNotes.length > 0 && (
          <button
            onClick={clearCustomNotes}
            className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400"
          >
            Clear selection
          </button>
        )}
      </section>
      
      <section className="mb-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
        <h3 className="mb-4 text-center text-xl font-semibold text-zinc-900 dark:text-white">
          {getTitle()}
        </h3>
        <Piano
          startMidi={startMidi}
          endMidi={endMidi}
          highlightedNotes={highlightedNotes}
          highlightedMidi={highlightedMidi}
          onKeyClick={handleKeyClick}
          showLabels={octaveCount <= 4}
        />
      </section>
      
      {highlightMode !== 'none' && (highlightedNotes.length > 0 || highlightedMidi.length > 0) && (
        <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
          <h3 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-white">
            Notes
          </h3>
          <div className="flex flex-wrap gap-2">
            {highlightMode === 'custom' 
              ? customNotes.sort((a, b) => a - b).map(midi => (
                  <span key={midi} className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    {midi}
                  </span>
                ))
              : highlightedNotes.map((note, i) => (
                  <span key={i} className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    {note}
                  </span>
                ))
            }
          </div>
        </section>
      )}
    </ToolLayout>
  );
}
