'use client';

import { ScaleType, SCALE_DEFINITIONS } from '@/lib/music';

interface KeyInputProps {
  value: string;
  scaleTypes: ScaleType[];
  onChange: (value: string) => void;
  onScaleTypesChange: (types: ScaleType[]) => void;
}

const DEFAULT_SCALE_TYPES: ScaleType[] = ['major', 'naturalMinor', 'dorian', 'mixolydian'];

export function KeyInput({ value, scaleTypes, onChange, onScaleTypesChange }: KeyInputProps) {
  const toggleScaleType = (type: ScaleType) => {
    if (scaleTypes.includes(type)) {
      onScaleTypesChange(scaleTypes.filter((t) => t !== type));
    } else {
      onScaleTypesChange([...scaleTypes, type]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Notes or chords (comma or space separated)
        </label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="C E G A"
          rows={2}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800"
        />
      </div>
      <div>
        <div className="mb-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Scales to check
        </div>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_SCALE_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700">
              <input
                type="checkbox"
                checked={scaleTypes.includes(type)}
                onChange={() => toggleScaleType(type)}
                className="h-4 w-4 rounded border-zinc-300 accent-blue-500"
              />
              {SCALE_DEFINITIONS[type].name}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
