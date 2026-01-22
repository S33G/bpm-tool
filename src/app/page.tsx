'use client';

import { useState } from 'react';
import { BpmInput } from '@/components/BpmInput';
import { TapTempo } from '@/components/TapTempo';
import { NoteGrid } from '@/components/NoteGrid';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ToastContainer } from '@/components/Toast';
import { BookmarkBar } from '@/components/BookmarkBar';
import { GenrePresets } from '@/components/GenrePresets';
import { DelayCalculator } from '@/components/DelayCalculator';
import { FrequencyDisplay } from '@/components/FrequencyDisplay';
import { GrooveQuantizer } from '@/components/GrooveQuantizer';
import { useBpmCalculations } from '@/hooks/useBpmCalculations';
import { DEFAULT_BPM } from '@/lib/constants';

export default function Home() {
  const [bpm, setBpm] = useState(DEFAULT_BPM);
  const [showHz, setShowHz] = useState(false);
  const { notes, delaySuggestions } = useBpmCalculations(bpm);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
            BPM Tool
          </h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Hero Section */}
        <section className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-white">
            BPM to Milliseconds Calculator
          </h2>
          <p className="mx-auto max-w-2xl text-zinc-600 dark:text-zinc-400">
            Precisely time your compressors, limiters, reverbs, delays, and other audio effects.
            Perfect for Ableton, FL Studio, Pro Tools, or any DAW.
          </p>
        </section>

        {/* Controls Section */}
        <section className="mb-8 flex flex-col items-center gap-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800 sm:flex-row sm:justify-center">
          <BpmInput value={bpm} onChange={setBpm} />
          <div className="hidden h-20 w-px bg-zinc-200 dark:bg-zinc-700 sm:block" />
          <TapTempo onBpmDetected={setBpm} />
        </section>

        {/* Genre Presets */}
        <section className="mb-6">
          <GenrePresets currentBpm={bpm} onSelectBpm={setBpm} />
        </section>

        {/* Bookmarks */}
        <section className="mb-8">
          <BookmarkBar currentBpm={bpm} onSelectBpm={setBpm} />
        </section>

        {/* Options */}
        <section className="mb-6 flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <input
              type="checkbox"
              checked={showHz}
              onChange={(e) => setShowHz(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 accent-blue-500"
            />
            Show frequency (Hz)
          </label>
        </section>

        {/* Note Values Grid */}
        <section className="mb-8">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
            Note Values
          </h3>
          <NoteGrid notes={notes} showHz={showHz} />
        </section>

        {/* Frequency Section */}
        <section className="mb-8">
          <FrequencyDisplay notes={notes} />
        </section>

        {/* Delay Calculator */}
        <section className="mb-8">
          <DelayCalculator delaySuggestions={delaySuggestions} />
        </section>

        {/* Groove Quantization */}
        <section className="mb-8">
          <GrooveQuantizer bpm={bpm} />
        </section>

        {/* Info Section */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
          <h3 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-white">
            How it works
          </h3>
          <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
            <p>
              The formula to convert BPM to milliseconds is simple:
            </p>
            <div className="rounded-lg bg-zinc-100 p-4 font-mono dark:bg-zinc-700">
              <p className="text-zinc-900 dark:text-white">60,000 ms / BPM = ms per quarter note</p>
              <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                Example: 60,000 / {bpm} = {(60000 / bpm).toFixed(2)} ms
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h4 className="font-medium text-zinc-800 dark:text-zinc-200">Dotted Notes</h4>
                <p>Multiply by 1.5 (150% of straight note value)</p>
              </div>
              <div>
                <h4 className="font-medium text-zinc-800 dark:text-zinc-200">Triplet Notes</h4>
                <p>Multiply by 2/3 (66.67% of straight note value)</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-6 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        <p>Use these values for sidechaining, reverb decay, delay times, and more.</p>
      </footer>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}
