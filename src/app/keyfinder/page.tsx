'use client';

import { useMemo, useState } from 'react';
import { ToolLayout } from '@/components/layout';
import { KeyInput, KeyResults } from '@/components/keyfinder';
import { parseNotesInput, findLikelyKeys, ScaleType } from '@/lib/music';

export default function KeyFinderPage() {
  const [input, setInput] = useState('C E G A');
  const [scaleTypes, setScaleTypes] = useState<ScaleType[]>(['major', 'naturalMinor', 'dorian', 'mixolydian']);

  const notes = useMemo(() => parseNotesInput(input), [input]);
  const candidates = useMemo(() => findLikelyKeys(notes, scaleTypes), [notes, scaleTypes]);

  return (
    <ToolLayout
      title="Key Finder"
      description="Suggest likely keys based on a set of notes or chords."
    >
      <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <KeyInput value={input} scaleTypes={scaleTypes} onChange={setInput} onScaleTypesChange={setScaleTypes} />
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
        <KeyResults candidates={candidates} />
      </section>
    </ToolLayout>
  );
}
