'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ToolLayout } from '@/components/layout';
import { BpmInput } from '@/components/BpmInput';
import { TapTempo } from '@/components/TapTempo';
import { MetronomeDisplay, MetronomeControls } from '@/components/metronome';
import { MetronomeEngine, TimeSignature } from '@/lib/metronome';
import { DEFAULT_BPM } from '@/lib/constants';

export default function MetronomePage() {
  const [bpm, setBpm] = useState(DEFAULT_BPM);
  const [timeSignature, setTimeSignature] = useState<TimeSignature>('4/4');
  const [subdivision, setSubdivision] = useState<1 | 2 | 4>(1);
  const [accentFirst, setAccentFirst] = useState(true);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [flashActive, setFlashActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const metronomeRef = useRef<MetronomeEngine | null>(null);
  
  const handleTick = useCallback((beat: number, _subdivision: number, isAccent: boolean) => {
    setCurrentBeat(beat);
    if (isAccent || _subdivision === 0) {
      setFlashActive(true);
      setTimeout(() => setFlashActive(false), 50);
    }
  }, []);
  
  const togglePlay = () => {
    if (isPlaying) {
      metronomeRef.current?.stop();
      metronomeRef.current = null;
      setIsPlaying(false);
      setCurrentBeat(0);
    } else {
      metronomeRef.current = new MetronomeEngine(
        { bpm, timeSignature, subdivision, accentFirst },
        handleTick
      );
      metronomeRef.current.start();
      setIsPlaying(true);
    }
  };
  
  useEffect(() => {
    if (metronomeRef.current) {
      metronomeRef.current.updateConfig({ bpm, timeSignature, subdivision, accentFirst });
    }
  }, [bpm, timeSignature, subdivision, accentFirst]);
  
  useEffect(() => {
    return () => {
      metronomeRef.current?.stop();
    };
  }, []);
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
  
  return (
    <ToolLayout
      title="Metronome"
      description="Visual metronome with tap tempo, time signatures, and fullscreen flash mode."
    >
      {isFullscreen && flashActive && (
        <div className="fixed inset-0 z-50 bg-blue-500 pointer-events-none" />
      )}
      
      <section className="mb-8 flex flex-col items-center gap-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800 sm:flex-row sm:justify-center">
        <BpmInput value={bpm} onChange={setBpm} />
        <div className="hidden h-20 w-px bg-zinc-200 dark:bg-zinc-700 sm:block" />
        <TapTempo onBpmDetected={setBpm} />
      </section>
      
      <section className="mb-8 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
        <MetronomeControls
          timeSignature={timeSignature}
          subdivision={subdivision}
          accentFirst={accentFirst}
          onTimeSignatureChange={setTimeSignature}
          onSubdivisionChange={setSubdivision}
          onAccentFirstChange={setAccentFirst}
        />
      </section>
      
      <section className="mb-8 rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-700 dark:bg-zinc-800">
        <div className={`transition-opacity ${flashActive && !isFullscreen ? 'opacity-50' : 'opacity-100'}`}>
          <MetronomeDisplay
            currentBeat={currentBeat}
            timeSignature={timeSignature}
            isPlaying={isPlaying}
          />
        </div>
        
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={togglePlay}
            className={`flex h-14 items-center gap-2 rounded-xl px-8 text-lg font-semibold transition-colors ${
              isPlaying
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isPlaying ? (
              <>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
                Stop
              </>
            ) : (
              <>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Start
              </>
            )}
          </button>
          
          <button
            onClick={toggleFullscreen}
            className="flex h-14 items-center gap-2 rounded-xl bg-zinc-200 px-6 text-zinc-700 transition-colors hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isFullscreen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              )}
            </svg>
            {isFullscreen ? 'Exit' : 'Fullscreen'}
          </button>
        </div>
      </section>
      
      <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
        <h3 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-white">
          Tips
        </h3>
        <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
          <li>Use <strong>Fullscreen</strong> mode for visual-only practice (screen flashes on beats)</li>
          <li>Press <strong>Space</strong> to tap tempo when not focused on an input</li>
          <li>The <strong>accent</strong> on beat 1 helps you track the downbeat</li>
        </ul>
      </section>
    </ToolLayout>
  );
}
