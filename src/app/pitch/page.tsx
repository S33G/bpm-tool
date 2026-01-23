'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ToolLayout } from '@/components/layout';
import { PitchDisplay, TunerNeedle, NoteHistory, HistoryNote } from '@/components/pitch';
import { PitchDetector, PitchResult } from '@/lib/audio/pitch-detection';

export default function PitchAnalyzerPage() {
  const [isListening, setIsListening] = useState(false);
  const [pitch, setPitch] = useState<PitchResult | null>(null);
  const [history, setHistory] = useState<HistoryNote[]>([]);
  const [a4, setA4] = useState(440);
  const [error, setError] = useState<string | null>(null);
  
  const detectorRef = useRef<PitchDetector | null>(null);
  const lastNoteRef = useRef<string | null>(null);
  
  const handlePitch = useCallback((result: PitchResult | null) => {
    setPitch(result);
    
    if (result && result.confidence > 0.1) {
      const noteKey = `${result.note}${result.octave}`;
      if (noteKey !== lastNoteRef.current) {
        lastNoteRef.current = noteKey;
        setHistory(prev => {
          const newHistory = [...prev, {
            note: result.note,
            octave: result.octave,
            timestamp: Date.now(),
          }];
          return newHistory.slice(-12);
        });
      }
    }
  }, []);
  
  const startListening = async () => {
    setError(null);
    try {
      detectorRef.current = new PitchDetector(handlePitch, a4);
      await detectorRef.current.start();
      setIsListening(true);
    } catch (err) {
      setError('Microphone access denied. Please allow microphone access to use the pitch analyzer.');
    }
  };
  
  const stopListening = () => {
    if (detectorRef.current) {
      detectorRef.current.stop();
      detectorRef.current = null;
    }
    setIsListening(false);
    setPitch(null);
  };
  
  useEffect(() => {
    if (detectorRef.current) {
      detectorRef.current.setA4(a4);
    }
  }, [a4]);
  
  useEffect(() => {
    return () => {
      if (detectorRef.current) {
        detectorRef.current.stop();
      }
    };
  }, []);
  
  const clearHistory = () => {
    setHistory([]);
    lastNoteRef.current = null;
  };
  
  return (
    <ToolLayout
      title="Pitch Analyzer"
      description="Real-time pitch detection with tuner display. Requires microphone access."
    >
      {error && (
        <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}
      
      <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={isListening ? stopListening : startListening}
              className={`flex h-12 items-center gap-2 rounded-lg px-6 text-sm font-medium transition-colors ${
                isListening
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isListening ? (
                <>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  </svg>
                  Stop
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  Start Listening
                </>
              )}
            </button>
            
            {isListening && (
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
                </span>
                <span className="text-sm text-zinc-500">Listening...</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-zinc-600 dark:text-zinc-400">
              A4 Reference:
            </label>
            <input
              type="number"
              min={400}
              max={480}
              value={a4}
              onChange={(e) => setA4(Math.max(400, Math.min(480, parseInt(e.target.value) || 440)))}
              className="h-10 w-20 rounded-lg border border-zinc-300 bg-white px-3 text-center text-sm dark:border-zinc-600 dark:bg-zinc-800"
            />
            <span className="text-sm text-zinc-500">Hz</span>
          </div>
        </div>
      </section>
      
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
          <h3 className="mb-4 text-center text-lg font-semibold text-zinc-900 dark:text-white">
            Detected Note
          </h3>
          <PitchDisplay pitch={pitch} />
        </section>
        
        <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
          <h3 className="mb-4 text-center text-lg font-semibold text-zinc-900 dark:text-white">
            Tuner
          </h3>
          <TunerNeedle cents={pitch?.cents ?? 0} />
          <p className="mt-4 text-center text-sm text-zinc-500">
            {Math.abs(pitch?.cents ?? 0) < 5 ? 'In tune!' : pitch?.cents && pitch.cents > 0 ? 'Sharp - lower pitch' : pitch?.cents && pitch.cents < 0 ? 'Flat - raise pitch' : 'Play a note'}
          </p>
        </section>
      </div>
      
      <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Note History
          </h3>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              Clear
            </button>
          )}
        </div>
        <NoteHistory history={history} />
      </section>
    </ToolLayout>
  );
}
