'use client';

import { 
  NoteName, 
  getKeySignature, 
  getDiatonicChords,
  formatKeyName,
  CHORD_DEFINITIONS,
  DiatonicChord,
} from '@/lib/music';

interface CircleLegendProps {
  selectedKey: NoteName | null;
  mode: 'major' | 'minor';
  preferFlats: boolean;
}

export function CircleLegend({ selectedKey, mode, preferFlats }: CircleLegendProps) {
  if (!selectedKey) {
    return (
      <div className="text-center text-zinc-500 py-8">
        Click a key on the circle to see details
      </div>
    );
  }
  
  const keySignature = getKeySignature(selectedKey, mode);
  const diatonicChords = getDiatonicChords(selectedKey, mode);
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">
          {formatKeyName(selectedKey, mode, preferFlats)}
        </h3>
        <p className="text-sm text-zinc-500 mt-1">
          {keySignature.sharps > 0 && `${keySignature.sharps} sharp${keySignature.sharps > 1 ? 's' : ''}`}
          {keySignature.flats > 0 && `${keySignature.flats} flat${keySignature.flats > 1 ? 's' : ''}`}
          {keySignature.sharps === 0 && keySignature.flats === 0 && 'No sharps or flats'}
        </p>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
          Related Keys
        </h4>
        <div className="flex flex-wrap gap-2">
          {keySignature.relativeMinor && (
            <span className="rounded-lg bg-purple-100 px-3 py-1 text-sm text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
              Relative: {keySignature.relativeMinor}m
            </span>
          )}
          {keySignature.relativeMajor && (
            <span className="rounded-lg bg-purple-100 px-3 py-1 text-sm text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
              Relative: {keySignature.relativeMajor}
            </span>
          )}
          {keySignature.parallelMinor && (
            <span className="rounded-lg bg-cyan-100 px-3 py-1 text-sm text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400">
              Parallel: {keySignature.parallelMinor}m
            </span>
          )}
          {keySignature.parallelMajor && (
            <span className="rounded-lg bg-cyan-100 px-3 py-1 text-sm text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400">
              Parallel: {keySignature.parallelMajor}
            </span>
          )}
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
          Diatonic Chords
        </h4>
        <div className="grid grid-cols-7 gap-2">
          {diatonicChords.map((chord: DiatonicChord) => (
            <div
              key={chord.degree}
              className="flex flex-col items-center rounded-lg bg-zinc-100 p-2 dark:bg-zinc-700"
            >
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {chord.roman}
              </span>
              <span className="font-bold text-zinc-900 dark:text-white">
                {chord.root}
              </span>
              <span className="text-xs text-zinc-500">
                {CHORD_DEFINITIONS[chord.quality].symbol || 'maj'}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {keySignature.accidentals.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
            Accidentals
          </h4>
          <div className="flex flex-wrap gap-2">
            {keySignature.accidentals.map((note: NoteName, i: number) => (
              <span
                key={i}
                className="rounded bg-zinc-200 px-2 py-1 text-sm font-mono dark:bg-zinc-700"
              >
                {note}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
