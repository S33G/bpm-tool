'use client';

import { useState, useEffect, useRef } from 'react';
import { calculateSwingTiming, generateGridNotes, SWING_PRESETS } from '@/lib/groove';
import { formatMs } from '@/lib/calculations';
import { generateDrumMidi, downloadMidiFile } from '@/lib/midi-export';
import { GroovePlayer } from '@/lib/audio-playback';
import { useToast } from '@/context/ToastContext';

interface GrooveQuantizerProps {
  bpm: number;
}

export function GrooveQuantizer({ bpm }: GrooveQuantizerProps) {
  const [swingPercent, setSwingPercent] = useState(58);
  const [subdivision, setSubdivision] = useState<8 | 16 | 32>(16);
  const [playingGroove, setPlayingGroove] = useState<'straight' | 'swing' | 'triplet' | null>(null);
  const { showToast } = useToast();
  const playerRef = useRef<GroovePlayer | null>(null);
  const playbackDisabled = true;
  const playbackTooltip = 'Coming soon';

  // Initialize audio player
  useEffect(() => {
    playerRef.current = new GroovePlayer();
    return () => {
      playerRef.current?.dispose();
    };
  }, []);

  // Calculate bar duration (4 quarter notes)
  const quarterNoteMs = 60000 / bpm;
  const barDurationMs = quarterNoteMs * 4;
  const subdivisionMs = barDurationMs / subdivision;

  // Calculate swing timing
  const swingTiming = calculateSwingTiming(subdivisionMs, swingPercent);

  // Generate grid notes for visualization
  const gridNotes = generateGridNotes(barDurationMs, subdivision, swingPercent);

  // Audio playback handlers
  const handlePlayToggle = async (grooveType: 'straight' | 'swing' | 'triplet') => {
    if (!playerRef.current) return;

    try {
      if (playingGroove === grooveType) {
        // Stop if clicking the same groove
        playerRef.current.stop();
        setPlayingGroove(null);
      } else {
        // Stop any currently playing groove and start new one
        // Always pass the current swingPercent, even for non-swing grooves
        await playerRef.current.play(bpm, grooveType, swingPercent);
        setPlayingGroove(grooveType);
      }
    } catch (error) {
      showToast('Failed to play audio', 'error');
      console.error('Playback error:', error);
    }
  };

  // Stop playback when BPM changes
  useEffect(() => {
    const currentGroove = playingGroove;
    if (currentGroove) {
      playerRef.current?.stop();
      // Use a ref or callback to avoid setState in effect
      Promise.resolve().then(() => setPlayingGroove(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bpm]);

  // Update swing in real-time when slider changes (if swing groove is playing)
  useEffect(() => {
    if (playingGroove === 'swing' && playerRef.current) {
      playerRef.current.updateSwing(swingPercent);
    }
  }, [swingPercent, playingGroove]);

  // MIDI export handlers
  const handleExportMidi = (grooveType: 'straight' | 'swing' | 'triplet') => {
    try {
      const midiData = generateDrumMidi(bpm, grooveType, swingPercent, 4);
      const swingStr = swingPercent.toFixed(1).replace(/\.?0+$/, '');
      const filename = `${grooveType}_${bpm}bpm_${swingStr}swing.mid`;
      downloadMidiFile(midiData, filename);
      showToast(`Exported ${grooveType} groove MIDI`);
    } catch (error) {
      showToast('Failed to export MIDI', 'error');
      console.error('MIDI export error:', error);
    }
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
      <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
        Groove Quantization
      </h3>

      {/* Subdivision selector */}
      <div className="mb-4 flex items-center gap-4">
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Division:</span>
        <div className="flex gap-2">
          {[8, 16, 32].map((div) => (
            <button
              key={div}
              onClick={() => setSubdivision(div as 8 | 16 | 32)}
              className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                subdivision === div
                  ? 'bg-blue-500 text-white'
                  : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600'
              }`}
            >
              1/{div}
            </button>
          ))}
        </div>
      </div>

      {/* Swing slider */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="swing-slider" className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Swing Amount
          </label>
          <span className="font-mono text-sm font-semibold text-zinc-900 dark:text-white">
            {swingPercent.toFixed(1)}%
          </span>
        </div>
        <input
          id="swing-slider"
          type="range"
          min="50"
          max="75"
          step="0.1"
          value={swingPercent}
          onChange={(e) => setSwingPercent(parseFloat(e.target.value))}
          className="w-full accent-blue-500"
        />

        {/* Preset buttons */}
        <div className="mt-2 flex flex-wrap gap-2">
          {SWING_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => setSwingPercent(preset.percent)}
              className="rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Timeline */}
      <div className="mb-6">
        <h4 className="mb-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Visual Timeline (1 bar @ {bpm} BPM)
        </h4>
        <div className="space-y-6">
          {/* Straight grid */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Straight</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePlayToggle('straight')}
                  disabled={playbackDisabled}
                  title={playbackDisabled ? playbackTooltip : undefined}
                  aria-disabled={playbackDisabled}
                  className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
                    playbackDisabled
                      ? 'cursor-not-allowed bg-zinc-200/70 text-zinc-400 dark:bg-zinc-700/70 dark:text-zinc-500'
                      : ''
                  } ${
                    playingGroove === 'straight'
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600'
                  }`}
                >
                  {playingGroove === 'straight' ? (
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                  {playingGroove === 'straight' ? 'Stop' : 'Play'}
                </button>
                <button
                  onClick={() => handleExportMidi('straight')}
                  className="flex items-center gap-1 rounded bg-zinc-200 px-2 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  MIDI
                </button>
              </div>
            </div>
            <div className="relative h-8 rounded-lg bg-zinc-100 dark:bg-zinc-700/50">
              {gridNotes.straight.map((note, i) => (
                <div
                  key={`straight-${i}`}
                  className="absolute top-0 h-full w-0.5 bg-zinc-400 dark:bg-zinc-500"
                  style={{ left: `${note.position * 100}%` }}
                >
                  {i % (subdivision / 4) === 0 && (
                    <span className="absolute -top-6 -translate-x-1/2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      {note.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Swing grid */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                Swing ({swingPercent.toFixed(1)}%)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePlayToggle('swing')}
                  disabled={playbackDisabled}
                  title={playbackDisabled ? playbackTooltip : undefined}
                  aria-disabled={playbackDisabled}
                  className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
                    playbackDisabled
                      ? 'cursor-not-allowed bg-blue-100/70 text-blue-300 dark:bg-blue-900/30 dark:text-blue-500'
                      : ''
                  } ${
                    playingGroove === 'swing'
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900/70'
                  }`}
                >
                  {playingGroove === 'swing' ? (
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                  {playingGroove === 'swing' ? 'Stop' : 'Play'}
                </button>
                <button
                  onClick={() => handleExportMidi('swing')}
                  className="flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900/70"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  MIDI
                </button>
              </div>
            </div>
            <div className="relative h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              {gridNotes.swing.map((note, i) => (
                <div
                  key={`swing-${i}`}
                  className="absolute top-0 h-full w-0.5 bg-blue-500 dark:bg-blue-400"
                  style={{ left: `${note.position * 100}%` }}
                >
                  {i % (subdivision / 4) === 0 && (
                    <span className="absolute -top-6 -translate-x-1/2 text-xs font-medium text-blue-600 dark:text-blue-400">
                      {note.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Triplet grid */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <span className="text-xs font-medium text-purple-600 dark:text-purple-400">Triplet (66.67%)</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePlayToggle('triplet')}
                  disabled={playbackDisabled}
                  title={playbackDisabled ? playbackTooltip : undefined}
                  aria-disabled={playbackDisabled}
                  className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
                    playbackDisabled
                      ? 'cursor-not-allowed bg-purple-100/70 text-purple-300 dark:bg-purple-900/30 dark:text-purple-500'
                      : ''
                  } ${
                    playingGroove === 'triplet'
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:hover:bg-purple-900/70'
                  }`}
                >
                  {playingGroove === 'triplet' ? (
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                  {playingGroove === 'triplet' ? 'Stop' : 'Play'}
                </button>
                <button
                  onClick={() => handleExportMidi('triplet')}
                  className="flex items-center gap-1 rounded bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700 transition-colors hover:bg-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:hover:bg-purple-900/70"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  MIDI
                </button>
              </div>
            </div>
            <div className="relative h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              {gridNotes.triplet.map((note, i) => (
                <div
                  key={`triplet-${i}`}
                  className="absolute top-0 h-full w-0.5 bg-purple-500 dark:bg-purple-400"
                  style={{ left: `${note.position * 100}%` }}
                >
                  {i % 3 === 0 && (
                    <span className="absolute -top-6 -translate-x-1/2 text-xs font-medium text-purple-600 dark:text-purple-400">
                      {note.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timing information */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Timing Details</h4>

        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-700/50">
            <div className="text-xs text-zinc-500 dark:text-zinc-400">On-beat duration</div>
            <div className="font-mono text-sm font-semibold text-zinc-900 dark:text-white">
              {formatMs(swingTiming.onBeatMs)} ms
            </div>
          </div>

          <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-700/50">
            <div className="text-xs text-zinc-500 dark:text-zinc-400">Off-beat duration</div>
            <div className="font-mono text-sm font-semibold text-zinc-900 dark:text-white">
              {formatMs(swingTiming.offBeatMs)} ms
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
            <div className="text-xs text-blue-600 dark:text-blue-400">Offset from straight</div>
            <div className="font-mono text-sm font-semibold text-zinc-900 dark:text-white">
              +{formatMs(swingTiming.offsetMs)} ms
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
            <div className="text-xs text-blue-600 dark:text-blue-400">Offset percentage</div>
            <div className="font-mono text-sm font-semibold text-zinc-900 dark:text-white">
              {swingTiming.offsetPercent.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="rounded-lg bg-zinc-50 p-3 text-xs text-zinc-600 dark:bg-zinc-700/50 dark:text-zinc-400">
          <p>
            <strong>How it works:</strong> At {swingPercent.toFixed(1)}% swing, every other 1/{subdivision} note
            is delayed by {formatMs(swingTiming.offsetMs)} ms, creating a {swingPercent < 60 ? 'subtle' : swingPercent < 65 ? 'moderate' : 'heavy'} shuffle feel.
          </p>
        </div>
      </div>
    </div>
  );
}
