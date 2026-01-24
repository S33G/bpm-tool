'use client';

import { NoteName, midiToNoteName } from '@/lib/music';
import { FretNote } from '@/lib/music/fretboards';

interface FretboardProps {
  tuning: number[];
  frets: number;
  highlightedNotes: NoteName[];
  showAllNotes?: boolean;
  highlightColor?: string;
  startFret?: number;
  endFret?: number;
}

const FRET_MARKERS = [3, 5, 7, 9, 12, 15, 17, 19, 21];
const DOUBLE_MARKERS = [12, 24];

export function Fretboard({
  tuning,
  frets,
  highlightedNotes,
  showAllNotes = false,
  highlightColor = 'blue',
  startFret = 0,
  endFret,
}: FretboardProps) {
  const displayFrets = endFret ?? Math.min(frets, 15);
  const fretCount = displayFrets - startFret;
  
  const stringSpacing = 30;
  const fretSpacing = 60;
  const nutWidth = startFret === 0 ? 8 : 0;
  const padding = 40;
  
  const width = fretCount * fretSpacing + nutWidth + padding * 2;
  const height = (tuning.length - 1) * stringSpacing + padding * 2;
  
  const getX = (fret: number) => padding + nutWidth + (fret - startFret) * fretSpacing;
  const getY = (string: number) => padding + string * stringSpacing;
  
  const isHighlighted = (note: NoteName) => highlightedNotes.includes(note);
  
  const colorMap: Record<string, string> = {
    blue: '#3b82f6',
    purple: '#8b5cf6',
    green: '#22c55e',
    orange: '#f97316',
  };
  
  const fillColor = colorMap[highlightColor] || colorMap.blue;
  
  return (
    <div className="overflow-x-auto">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="mx-auto"
      >
        {startFret === 0 && (
          <rect
            x={padding}
            y={padding - 5}
            width={nutWidth}
            height={(tuning.length - 1) * stringSpacing + 10}
            className="fill-zinc-800 dark:fill-zinc-200"
            rx={2}
          />
        )}
        
        {Array.from({ length: fretCount + 1 }, (_, i) => i + startFret).map((fret) => (
          <line
            key={`fret-${fret}`}
            x1={getX(fret)}
            y1={padding - 5}
            x2={getX(fret)}
            y2={height - padding + 5}
            className="stroke-zinc-300 dark:stroke-zinc-600"
            strokeWidth={fret === 0 ? 0 : 2}
          />
        ))}
        
        {tuning.map((_, stringIndex) => (
          <line
            key={`string-${stringIndex}`}
            x1={padding + nutWidth}
            y1={getY(stringIndex)}
            x2={width - padding}
            y2={getY(stringIndex)}
            className="stroke-zinc-400 dark:stroke-zinc-500"
            strokeWidth={1 + stringIndex * 0.3}
          />
        ))}
        
        {FRET_MARKERS.filter(f => f > startFret && f <= displayFrets).map((fret) => {
          const isDouble = DOUBLE_MARKERS.includes(fret);
          const x = getX(fret) - fretSpacing / 2;
          const centerY = height / 2;
          
          return isDouble ? (
            <g key={`marker-${fret}`}>
              <circle cx={x} cy={centerY - 20} r={6} className="fill-zinc-200 dark:fill-zinc-700" />
              <circle cx={x} cy={centerY + 20} r={6} className="fill-zinc-200 dark:fill-zinc-700" />
            </g>
          ) : (
            <circle key={`marker-${fret}`} cx={x} cy={centerY} r={6} className="fill-zinc-200 dark:fill-zinc-700" />
          );
        })}
        
        {tuning.map((stringMidi, stringIndex) =>
          Array.from({ length: fretCount + 1 }, (_, i) => {
            const fret = i + startFret;
            const note = midiToNoteName(stringMidi + fret);
            const highlighted = isHighlighted(note);
            
            if (!highlighted && !showAllNotes) return null;
            
            const x = fret === startFret ? padding + nutWidth / 2 : getX(fret) - fretSpacing / 2;
            const y = getY(stringIndex);
            
            return (
              <g key={`note-${stringIndex}-${fret}`}>
                <circle
                  cx={x}
                  cy={y}
                  r={12}
                  fill={highlighted ? fillColor : 'transparent'}
                  className={highlighted ? '' : 'stroke-zinc-300 dark:stroke-zinc-600'}
                  strokeWidth={highlighted ? 0 : 1}
                />
                {(highlighted || showAllNotes) && (
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={10}
                    fontWeight="bold"
                    className={highlighted ? 'fill-white' : 'fill-zinc-500 dark:fill-zinc-400'}
                  >
                    {note}
                  </text>
                )}
              </g>
            );
          })
        )}
        
        {Array.from({ length: fretCount }, (_, i) => {
          const fret = i + startFret + 1;
          return (
            <text
              key={`fret-num-${fret}`}
              x={getX(fret) - fretSpacing / 2}
              y={height - 10}
              textAnchor="middle"
              fontSize={10}
              className="fill-zinc-400"
            >
              {fret}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
