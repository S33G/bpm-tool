'use client';

import { NoteName, NOTE_NAMES } from '@/lib/music';

interface MiniKeyboardProps {
  highlightedNotes: NoteName[];
  startOctave?: number;
  octaves?: number;
}

const WHITE_KEYS: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const BLACK_KEY_POSITIONS: Record<NoteName, number | null> = {
  'C': null, 'C#': 0.65, 'D': null, 'D#': 1.65, 'E': null,
  'F': null, 'F#': 3.65, 'G': null, 'G#': 4.65, 'A': null, 'A#': 5.65, 'B': null,
};

export function MiniKeyboard({ 
  highlightedNotes, 
  startOctave = 4, 
  octaves = 2 
}: MiniKeyboardProps) {
  const whiteKeyWidth = 32;
  const blackKeyWidth = 20;
  const whiteKeyHeight = 80;
  const blackKeyHeight = 50;
  
  const totalWhiteKeys = WHITE_KEYS.length * octaves;
  const totalWidth = totalWhiteKeys * whiteKeyWidth;
  
  const isHighlighted = (note: NoteName) => highlightedNotes.includes(note);
  
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-100 p-4 dark:border-zinc-700 dark:bg-zinc-800">
      <svg
        width={totalWidth}
        height={whiteKeyHeight + 10}
        viewBox={`0 0 ${totalWidth} ${whiteKeyHeight + 10}`}
        className="mx-auto"
      >
        {Array.from({ length: octaves }).flatMap((_, octaveIdx) =>
          WHITE_KEYS.map((note, keyIdx) => {
            const x = (octaveIdx * WHITE_KEYS.length + keyIdx) * whiteKeyWidth;
            const highlighted = isHighlighted(note);
            return (
              <rect
                key={`white-${octaveIdx}-${keyIdx}`}
                x={x + 1}
                y={5}
                width={whiteKeyWidth - 2}
                height={whiteKeyHeight}
                rx={4}
                className={`${
                  highlighted
                    ? 'fill-blue-500'
                    : 'fill-white dark:fill-zinc-200'
                } stroke-zinc-300 dark:stroke-zinc-600`}
                strokeWidth={1}
              />
            );
          })
        )}
        
        {Array.from({ length: octaves }).flatMap((_, octaveIdx) =>
          NOTE_NAMES.filter(note => BLACK_KEY_POSITIONS[note] !== null).map((note) => {
            const pos = BLACK_KEY_POSITIONS[note]!;
            const x = (octaveIdx * WHITE_KEYS.length + pos) * whiteKeyWidth;
            const highlighted = isHighlighted(note);
            return (
              <rect
                key={`black-${octaveIdx}-${note}`}
                x={x}
                y={5}
                width={blackKeyWidth}
                height={blackKeyHeight}
                rx={3}
                className={`${
                  highlighted
                    ? 'fill-blue-600'
                    : 'fill-zinc-800 dark:fill-zinc-900'
                }`}
              />
            );
          })
        )}
      </svg>
    </div>
  );
}
