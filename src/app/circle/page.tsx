'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/layout';
import { CircleWheel, CircleLegend } from '@/components/circle';
import { NoteName } from '@/lib/music';

export default function CircleOfFifthsPage() {
  const [mode, setMode] = useState<'major' | 'minor'>('major');
  const [selectedKey, setSelectedKey] = useState<NoteName | null>('C');
  const [preferFlats, setPreferFlats] = useState(false);
  
  return (
    <ToolLayout
      title="Circle of Fifths"
      description="Interactive circle showing key signatures, relative keys, and diatonic chords."
    >
      <section className="mb-6 flex flex-wrap items-center justify-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <div className="flex rounded-lg bg-zinc-100 p-1 dark:bg-zinc-700">
          <button
            onClick={() => setMode('major')}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              mode === 'major'
                ? 'bg-white text-zinc-900 shadow dark:bg-zinc-600 dark:text-white'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            Major
          </button>
          <button
            onClick={() => setMode('minor')}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              mode === 'minor'
                ? 'bg-white text-zinc-900 shadow dark:bg-zinc-600 dark:text-white'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            Minor
          </button>
        </div>
        
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input
            type="checkbox"
            checked={preferFlats}
            onChange={(e) => setPreferFlats(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 accent-blue-500"
          />
          Prefer flats
        </label>
      </section>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
          <CircleWheel
            mode={mode}
            selectedKey={selectedKey}
            onKeySelect={setSelectedKey}
            preferFlats={preferFlats}
          />
        </section>
        
        <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
          <CircleLegend
            selectedKey={selectedKey}
            mode={mode}
            preferFlats={preferFlats}
          />
        </section>
      </div>
      
      <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
        <h3 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-white">
          How to Use
        </h3>
        <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
          <li><strong>Clockwise</strong> = add sharps (move by 5ths: C → G → D → A...)</li>
          <li><strong>Counter-clockwise</strong> = add flats (move by 4ths: C → F → Bb → Eb...)</li>
          <li><strong>Inner ring</strong> = relative minor keys (same key signature)</li>
          <li><strong>Adjacent keys</strong> = closely related, good for modulation</li>
        </ul>
      </section>
    </ToolLayout>
  );
}
