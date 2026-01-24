'use client';

import { NoteName, getCircleOfFifths, getEnharmonicSpelling } from '@/lib/music';

interface CircleWheelProps {
  mode: 'major' | 'minor';
  selectedKey: NoteName | null;
  onKeySelect: (key: NoteName) => void;
  preferFlats: boolean;
}

export function CircleWheel({ mode, selectedKey, onKeySelect, preferFlats }: CircleWheelProps) {
  const keys = getCircleOfFifths(mode);
  const relativeKeys = getCircleOfFifths(mode === 'major' ? 'minor' : 'major');
  
  const size = 400;
  const center = size / 2;
  const outerRadius = 170;
  const innerRadius = 120;
  const relativeRadius = 85;
  
  const getPosition = (index: number, radius: number) => {
    const angle = (index * 30 - 90) * (Math.PI / 180);
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };
  
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="w-full max-w-md mx-auto"
    >
      <circle
        cx={center}
        cy={center}
        r={outerRadius + 15}
        className="fill-zinc-100 dark:fill-zinc-800"
      />
      <circle
        cx={center}
        cy={center}
        r={innerRadius - 15}
        className="fill-zinc-50 dark:fill-zinc-900"
      />
      
      {keys.map((key: NoteName, index: number) => {
        const pos = getPosition(index, outerRadius);
        const isSelected = selectedKey === key;
        const displayKey = getEnharmonicSpelling(key, preferFlats);
        
        return (
          <g key={`outer-${index}`} onClick={() => onKeySelect(key)} className="cursor-pointer">
            <circle
              cx={pos.x}
              cy={pos.y}
              r={22}
              className={`transition-colors ${
                isSelected
                  ? 'fill-blue-500'
                  : 'fill-white dark:fill-zinc-700 hover:fill-blue-100 dark:hover:fill-blue-900'
              } stroke-zinc-300 dark:stroke-zinc-600`}
              strokeWidth={1}
            />
            <text
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className={`text-sm font-bold select-none ${
                isSelected ? 'fill-white' : 'fill-zinc-900 dark:fill-white'
              }`}
            >
              {displayKey}
            </text>
          </g>
        );
      })}
      
      {relativeKeys.map((key: NoteName, index: number) => {
        const pos = getPosition(index, relativeRadius);
        const displayKey = getEnharmonicSpelling(key, preferFlats);
        const isRelativeSelected = selectedKey && relativeKeys[keys.indexOf(selectedKey)] === key;
        
        return (
          <g key={`inner-${index}`}>
            <text
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className={`text-xs select-none ${
                isRelativeSelected
                  ? 'fill-blue-500 font-bold'
                  : 'fill-zinc-500 dark:fill-zinc-400'
              }`}
            >
              {displayKey}m
            </text>
          </g>
        );
      })}
      
      <text
        x={center}
        y={center - 10}
        textAnchor="middle"
        className="fill-zinc-400 text-xs"
      >
        {mode === 'major' ? 'Major' : 'Minor'}
      </text>
      <text
        x={center}
        y={center + 10}
        textAnchor="middle"
        className="fill-zinc-400 text-xs"
      >
        Keys
      </text>
    </svg>
  );
}
