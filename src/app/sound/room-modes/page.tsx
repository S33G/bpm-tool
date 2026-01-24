'use client';

import { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/layout';
import dynamic from 'next/dynamic';

const RoomVisualization = dynamic(() => import('@/components/sound/RoomVisualization'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900">
      <span className="text-zinc-500">Loading 3D visualization...</span>
    </div>
  ),
});

interface RoomMode {
  frequency: number;
  type: 'axial' | 'tangential' | 'oblique';
  indices: [number, number, number];
  dimension: string;
}

function calculateRoomModes(
  length: number,
  width: number,
  height: number,
  speedOfSound: number = 343
): RoomMode[] {
  const modes: RoomMode[] = [];
  const maxOrder = 4;

  for (let nx = 0; nx <= maxOrder; nx++) {
    for (let ny = 0; ny <= maxOrder; ny++) {
      for (let nz = 0; nz <= maxOrder; nz++) {
        if (nx === 0 && ny === 0 && nz === 0) continue;

        const freq =
          (speedOfSound / 2) *
          Math.sqrt(
            Math.pow(nx / length, 2) +
            Math.pow(ny / width, 2) +
            Math.pow(nz / height, 2)
          );

        if (freq > 300) continue;

        const nonZeroCount = [nx, ny, nz].filter((n) => n > 0).length;
        let type: 'axial' | 'tangential' | 'oblique';
        let dimension = '';

        if (nonZeroCount === 1) {
          type = 'axial';
          if (nx > 0) dimension = 'Length';
          else if (ny > 0) dimension = 'Width';
          else dimension = 'Height';
        } else if (nonZeroCount === 2) {
          type = 'tangential';
          const dims: string[] = [];
          if (nx > 0) dims.push('L');
          if (ny > 0) dims.push('W');
          if (nz > 0) dims.push('H');
          dimension = dims.join('-');
        } else {
          type = 'oblique';
          dimension = 'L-W-H';
        }

        modes.push({
          frequency: freq,
          type,
          indices: [nx, ny, nz],
          dimension,
        });
      }
    }
  }

  return modes.sort((a, b) => a.frequency - b.frequency);
}

function getModeTypeColor(type: 'axial' | 'tangential' | 'oblique'): string {
  switch (type) {
    case 'axial':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    case 'tangential':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'oblique':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
  }
}

export default function RoomModesPage() {
  const [length, setLength] = useState(5.0);
  const [width, setWidth] = useState(4.0);
  const [height, setHeight] = useState(2.8);
  const [unit, setUnit] = useState<'meters' | 'feet'>('meters');
  const [monitorWidth, setMonitorWidth] = useState(0.8);
  const [showReflections, setShowReflections] = useState(true);
  const [showTypes, setShowTypes] = useState({
    axial: true,
    tangential: true,
    oblique: false,
  });

  const toMeters = (value: number) => (unit === 'feet' ? value * 0.3048 : value);
  
  const modes = useMemo(() => {
    return calculateRoomModes(
      toMeters(length),
      toMeters(width),
      toMeters(height)
    );
  }, [length, width, height, unit]);

  const filteredModes = useMemo(() => {
    return modes.filter((mode) => showTypes[mode.type]);
  }, [modes, showTypes]);

  const roomVolume = toMeters(length) * toMeters(width) * toMeters(height);
  const schroederFreq = 2000 * Math.sqrt(0.05 / roomVolume);

  return (
    <ToolLayout
      title="Room Mode Visualizer"
      description="Calculate and visualize standing waves in your room. Place bass traps at pressure zones."
    >
      <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Room Dimensions</h2>
          <div className="flex rounded-lg border border-zinc-300 dark:border-zinc-600">
            <button
              onClick={() => setUnit('meters')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                unit === 'meters'
                  ? 'bg-teal-500 text-white'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700'
              } rounded-l-md`}
            >
              Meters
            </button>
            <button
              onClick={() => setUnit('feet')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                unit === 'feet'
                  ? 'bg-teal-500 text-white'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700'
              } rounded-r-md`}
            >
              Feet
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Length ({unit})
            </label>
            <input
              type="number"
              value={length}
              onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
              step="0.1"
              min="1"
              max="50"
              className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Width ({unit})
            </label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
              step="0.1"
              min="1"
              max="50"
              className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Height ({unit})
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
              step="0.1"
              min="1"
              max="20"
              className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
            />
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Monitor Gap (meters)
            </label>
            <input
              type="number"
              value={monitorWidth}
              onChange={(e) => setMonitorWidth(Math.max(0.2, Math.min(1.2, parseFloat(e.target.value) || 0.2)))}
              step="0.01"
              min="0.2"
              max="1.2"
              className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Monitor Gap ({monitorWidth.toFixed(2)} m)
            </label>
            <input
              type="range"
              value={monitorWidth}
              onChange={(e) => setMonitorWidth(parseFloat(e.target.value))}
              min="0.2"
              max="1.2"
              step="0.01"
              className="mt-3 w-full"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Presets
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { name: 'Small Bedroom', l: 4, w: 3.5, h: 2.4 },
              { name: 'Home Studio', l: 5, w: 4, h: 2.8 },
              { name: 'Control Room', l: 6, w: 5, h: 3 },
              { name: 'Live Room', l: 8, w: 6, h: 3.5 },
            ].map((preset) => (
              <button
                key={preset.name}
                onClick={() => {
                  setUnit('meters');
                  setLength(preset.l);
                  setWidth(preset.w);
                  setHeight(preset.h);
                }}
                className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">3D Room View</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Red corners indicate high pressure zones — ideal for bass trap placement
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowReflections((prev) => !prev)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  showReflections
                    ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'
                    : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500'
                }`}
              >
                Reflections
              </button>
              {(['axial', 'tangential', 'oblique'] as const).map((type) => (
                <button
                  key={`view-${type}`}
                  onClick={() =>
                    setShowTypes((prev) => ({ ...prev, [type]: !prev[type] }))
                  }
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                    showTypes[type]
                      ? getModeTypeColor(type)
                      : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="h-[400px] bg-zinc-50 dark:bg-zinc-900">
          <RoomVisualization
            length={toMeters(length)}
            width={toMeters(width)}
            height={toMeters(height)}
            monitorWidth={monitorWidth}
            showModes={showTypes}
            showReflections={showReflections}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Room Modes</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Schroeder frequency: ~{schroederFreq.toFixed(0)} Hz
            </p>
          </div>
          <div className="flex gap-2">
            {(['axial', 'tangential', 'oblique'] as const).map((type) => (
              <button
                key={type}
                onClick={() =>
                  setShowTypes((prev) => ({ ...prev, [type]: !prev[type] }))
                }
                className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                  showTypes[type]
                    ? getModeTypeColor(type)
                    : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="pb-2 font-medium text-zinc-600 dark:text-zinc-400">Frequency</th>
                <th className="pb-2 font-medium text-zinc-600 dark:text-zinc-400">Type</th>
                <th className="pb-2 font-medium text-zinc-600 dark:text-zinc-400">Mode (nx,ny,nz)</th>
                <th className="pb-2 font-medium text-zinc-600 dark:text-zinc-400">Dimension</th>
              </tr>
            </thead>
            <tbody>
              {filteredModes.slice(0, 20).map((mode, index) => (
                <tr
                  key={index}
                  className="border-b border-zinc-100 dark:border-zinc-700/50"
                >
                  <td className="py-2 font-mono text-zinc-900 dark:text-white">
                    {mode.frequency.toFixed(1)} Hz
                  </td>
                  <td className="py-2">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-xs font-medium capitalize ${getModeTypeColor(
                        mode.type
                      )}`}
                    >
                      {mode.type}
                    </span>
                  </td>
                  <td className="py-2 font-mono text-zinc-600 dark:text-zinc-400">
                    ({mode.indices.join(', ')})
                  </td>
                  <td className="py-2 text-zinc-600 dark:text-zinc-400">{mode.dimension}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredModes.length > 20 && (
            <p className="mt-2 text-sm text-zinc-500">
              Showing first 20 of {filteredModes.length} modes
            </p>
          )}
        </div>

        <div className="mt-6 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
          <h3 className="mb-2 font-medium text-zinc-900 dark:text-white">Mode Types</h3>
          <ul className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="font-medium text-red-600 dark:text-red-400">Axial:</span> Strongest
              modes, occur between parallel walls. Prioritize treating these.
            </li>
            <li>
              <span className="font-medium text-yellow-600 dark:text-yellow-400">Tangential:</span>{' '}
              Medium strength, involve four surfaces.
            </li>
            <li>
              <span className="font-medium text-green-600 dark:text-green-400">Oblique:</span>{' '}
              Weakest modes, involve all six surfaces.
            </li>
          </ul>
        </div>
      </section>
    </ToolLayout>
  );
}
