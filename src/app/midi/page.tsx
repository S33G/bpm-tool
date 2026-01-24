'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/layout';
import { MidiUploader, MidiStats, MidiTimeline } from '@/components/midi';
import { analyzeMidi, MidiStats as MidiStatsType } from '@/lib/midi';

export default function MidiAnalyzerPage() {
  const [stats, setStats] = useState<MidiStatsType | null>(null);

  const handleLoad = (data: ArrayBuffer) => {
    const result = analyzeMidi(data);
    setStats(result);
  };

  return (
    <ToolLayout
      title="MIDI Analyzer"
      description="Analyze MIDI files for tempo, duration, track count, and note density."
    >
      <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <MidiUploader onLoad={handleLoad} />
      </section>

      {stats ? (
        <>
          <section className="mb-6">
            <MidiStats stats={stats} />
          </section>
          <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
            <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Tracks</h3>
            <MidiTimeline stats={stats} />
          </section>
        </>
      ) : (
        <div className="text-center text-sm text-zinc-500">
          Upload a MIDI file to analyze.
        </div>
      )}
    </ToolLayout>
  );
}
