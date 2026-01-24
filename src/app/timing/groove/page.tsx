'use client';

import { useState } from 'react';
import { BpmInput } from '@/components/BpmInput';
import { TapTempo } from '@/components/TapTempo';
import { GrooveQuantizer } from '@/components/GrooveQuantizer';
import { ToastContainer } from '@/components/Toast';
import { ToolLayout } from '@/components/layout';
import { DEFAULT_BPM } from '@/lib/constants';

export default function GrooveQuantizerPage() {
  const [bpm, setBpm] = useState(DEFAULT_BPM);

  return (
    <ToolLayout
      title="Groove Quantizer"
      description="Dial in swing timing and visualize groove grids with precise timing offsets."
    >
      <section className="mb-8 flex flex-col items-center gap-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800 sm:flex-row sm:justify-center">
        <BpmInput value={bpm} onChange={setBpm} />
        <div className="hidden h-20 w-px bg-zinc-200 dark:bg-zinc-700 sm:block" />
        <TapTempo onBpmDetected={setBpm} />
      </section>

      <section className="mb-8">
        <GrooveQuantizer bpm={bpm} />
      </section>

      <ToastContainer />
    </ToolLayout>
  );
}
