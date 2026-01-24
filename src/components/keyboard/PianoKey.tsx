'use client';

import { midiToNoteWithOctave } from '@/lib/music';

interface PianoKeyProps {
  midi: number;
  x: number;
  y: number;
  width: number;
  height: number;
  isBlack: boolean;
  isHighlighted: boolean;
  highlightColor: string;
  onClick?: (midi: number) => void;
  showLabel?: boolean;
  labelOverride?: string;
  bottomLabelOverride?: string;
}

const HIGHLIGHT_COLORS: Record<string, { fill: string; text: string }> = {
  blue: { fill: '#3b82f6', text: '#ffffff' },
  purple: { fill: '#8b5cf6', text: '#ffffff' },
  green: { fill: '#22c55e', text: '#ffffff' },
  orange: { fill: '#f97316', text: '#ffffff' },
  pink: { fill: '#ec4899', text: '#ffffff' },
  cyan: { fill: '#06b6d4', text: '#ffffff' },
  yellow: { fill: '#eab308', text: '#000000' },
};

export function PianoKey({
  midi,
  x,
  y,
  width,
  height,
  isBlack,
  isHighlighted,
  highlightColor,
  onClick,
  showLabel = true,
  labelOverride,
  bottomLabelOverride,
}: PianoKeyProps) {
  const colors = HIGHLIGHT_COLORS[highlightColor] || { fill: highlightColor, text: '#ffffff' };
  
  const getFill = () => {
    if (isHighlighted) return colors.fill;
    return isBlack ? '#1f2937' : '#ffffff';
  };
  
  const getStroke = () => {
    return isBlack ? 'none' : '#d1d5db';
  };
  
  const label = bottomLabelOverride || midiToNoteWithOctave(midi);
  const highlightLabel = labelOverride || label.replace(/\d/, '');
  
  return (
    <g
      onClick={() => onClick?.(midi)}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={isBlack ? 2 : 3}
        fill={getFill()}
        stroke={getStroke()}
        strokeWidth={1}
        className="transition-colors duration-100"
      />
      {showLabel && !isBlack && (
        <text
          x={x + width / 2}
          y={height + 14}
          textAnchor="middle"
          fontSize={Math.min(10, width * 0.35)}
          className={`select-none ${isHighlighted ? 'fill-blue-600 dark:fill-blue-400' : 'fill-zinc-500 dark:fill-zinc-400'}`}
        >
          {label}
        </text>
      )}
      {isHighlighted && (
        <text
          x={x + width / 2}
          y={isBlack ? height - 8 : height - 15}
          textAnchor="middle"
          fontSize={Math.min(10, width * 0.35)}
          fill={isBlack ? colors.text : colors.text}
          className="select-none font-bold"
        >
          {highlightLabel}
        </text>
      )}
    </g>
  );
}
