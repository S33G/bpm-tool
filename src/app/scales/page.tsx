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
  SCALE_DEFINITIONS 
} from '@/lib/music';

export default function ScaleExplorerPage() {
  const [root, setRoot] = useState<NoteName>('C');
  const [scaleType, setScaleType] = useState<ScaleType>('major');
  
  const scale = buildScale(root, scaleType);
  
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
