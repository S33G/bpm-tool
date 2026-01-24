'use client';

import { useMemo, useState } from 'react';
import { ToolLayout } from '@/components/layout';
import { RhythmGrid } from '@/components/rhythm';
import { Select } from '@/components/ui';
import { BpmInput } from '@/components/BpmInput';
import { DEFAULT_BPM } from '@/lib/constants';
import { RhythmPattern, createEmptyPattern, toggleStep, setStepAccent, RhythmTrack } from '@/lib/rhythm';
import { generateRhythmMidi, downloadMidiFile } from '@/lib/midi-export';

const stepOptions = [16, 32, 64].map((steps) => ({ value: steps.toString(), label: `${steps} steps` }));
const barOptions = [1, 2, 4, 8].map((bars) => ({ value: bars.toString(), label: `${bars} bars` }));

export default function RhythmGridPage() {
  const [steps, setSteps] = useState(16);
  const [bars, setBars] = useState(1);
  const [bpm, setBpm] = useState(DEFAULT_BPM);
  const [pattern, setPattern] = useState<RhythmPattern>(() => createEmptyPattern(16));

  const handleStepsChange = (value: string) => {
    const newSteps = parseInt(value, 10);
    setSteps(newSteps);
    setPattern(createEmptyPattern(newSteps));
  };

  const handleToggleStep = (track: RhythmTrack, index: number) => {
    setPattern((prev) => toggleStep(prev, track, index));
  };

  const handleToggleAccent = (track: RhythmTrack, index: number) => {
    setPattern((prev) => setStepAccent(prev, track, index, !prev.tracks[track][index].accent));
  };

  const handleExport = () => {
    const midiData = generateRhythmMidi(pattern, bpm, bars);
    downloadMidiFile(midiData, `rhythm_${steps}steps_${bpm}bpm.mid`);
  };

  return (
    <ToolLayout
      title="Rhythm Grid Builder"
      description="Build rhythmic patterns with a step grid. Export to MIDI for drum programming."
    >
      <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <div className="flex flex-wrap items-end gap-6">
          <BpmInput value={bpm} onChange={setBpm} />
          <Select label="Steps" value={steps.toString()} onChange={handleStepsChange} options={stepOptions} />
          <Select label="Bars" value={bars.toString()} onChange={(v) => setBars(parseInt(v, 10))} options={barOptions} />
          <button
            onClick={handleExport}
            className="flex h-10 items-center gap-2 rounded-lg bg-blue-500 px-4 text-sm font-medium text-white hover:bg-blue-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export MIDI
          </button>
        </div>
        <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
          Click to toggle steps. Shift-click to add accents.
        </p>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
        <RhythmGrid pattern={pattern} onToggleStep={handleToggleStep} onToggleAccent={handleToggleAccent} />
      </section>
    </ToolLayout>
  );
}
