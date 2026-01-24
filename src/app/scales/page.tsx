'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/layout';
import { ScaleSelector, ScaleDisplay } from '@/components/scales';
import { Piano } from '@/components/keyboard';
import { 
  NoteName, 
  ScaleType, 
  buildScale,
  noteToMidi,
  SCALE_DEFINITIONS,
  INTERVAL_NAMES
} from '@/lib/music';
import { printElementHtml } from '@/lib/export';

export default function ScaleExplorerPage() {
  const [root, setRoot] = useState<NoteName>('C');
  const [scaleType, setScaleType] = useState<ScaleType>('major');
  
  const scale = buildScale(root, scaleType);
  const formula = scale.intervals.map((interval) => INTERVAL_NAMES[interval]).join(' - ');
  
  const startMidi = noteToMidi('C', 3);
  const endMidi = noteToMidi('B', 5);
  
  return (
    <ToolLayout
      title="Scale Explorer"
      description="Browse scales and modes. View intervals and visualize on the keyboard."
    >
      <section className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <ScaleSelector
          root={root}
          scaleType={scaleType}
          onRootChange={setRoot}
          onScaleTypeChange={setScaleType}
        />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Formula: <span className="font-mono text-zinc-900 dark:text-zinc-200">{formula}</span>
          </div>
          <button
            onClick={() => {
              const html = `
                <h1>${scale.name}</h1>
                <p><strong>Formula:</strong> ${formula}</p>
                <p><strong>Notes:</strong> ${scale.notes.join(', ')}</p>
                <p><strong>Intervals:</strong> ${scale.intervals.join(', ')}</p>
              `;
              printElementHtml(`${scale.name} Scale`, html);
            }}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
          >
            Export PDF
          </button>
        </div>
      </section>
      
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <ScaleDisplay scale={scale} />
        
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
            Keyboard View
          </h3>
          <Piano
            startMidi={startMidi}
            endMidi={endMidi}
            highlightedNotes={scale.notes}
            highlightColor="purple"
            showLabels={true}
          />
        </div>
      </div>
      
      <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
          Scale Reference
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(SCALE_DEFINITIONS)
            .filter(([_, def]) => def.category === SCALE_DEFINITIONS[scaleType].category)
            .map(([key, def]) => (
              <button
                key={key}
                onClick={() => setScaleType(key as ScaleType)}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  key === scaleType
                    ? 'border-purple-500 bg-purple-50 dark:border-purple-400 dark:bg-purple-900/20'
                    : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600'
                }`}
              >
                <div className="font-medium text-zinc-900 dark:text-white">
                  {def.name}
                </div>
                <div className="mt-1 text-xs text-zinc-500">
                  {def.intervals.join(' - ')}
                </div>
              </button>
            ))}
        </div>
      </section>
    </ToolLayout>
  );
}
