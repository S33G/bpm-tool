'use client';

import { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/layout';
import { ValidatedNumberInput } from '@/components/ValidatedNumberInput';

const PRESETS = {
  'Stage monitor offset': 5,
  'Delay tower': 25,
  'Sub alignment': 3,
};

export default function DelayCalculatorPage() {
  const [distance, setDistance] = useState(10);
  const [unit, setUnit] = useState<'meters' | 'feet'>('meters');
  const [temperature, setTemperature] = useState(20);
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  // Convert distance to meters if needed
  const distanceInMeters = useMemo(() => {
    return unit === 'feet' ? distance * 0.3048 : distance;
  }, [distance, unit]);

  // Calculate speed of sound: c = 331.3 + (0.606 × temperature_celsius)
  const speedOfSound = useMemo(() => {
    return 331.3 + 0.606 * temperature;
  }, [temperature]);

  // Calculate delay time: T(ms) = (Distance / Speed of Sound) × 1000
  const delayTime = useMemo(() => {
    if (distanceInMeters <= 0) return 0;
    return (distanceInMeters / speedOfSound) * 1000;
  }, [distanceInMeters, speedOfSound]);

  const handlePresetSelect = (presetName: string) => {
    const presetDistance = PRESETS[presetName as keyof typeof PRESETS];
    setDistance(presetDistance);
    setSelectedPreset(presetName);
  };

  const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setDistance(Math.max(0, value));
    setSelectedPreset('');
  };

  const handleUnitChange = () => {
    // Convert distance when switching units
    if (unit === 'meters') {
      setDistance(parseFloat((distance / 0.3048).toFixed(2)));
      setUnit('feet');
    } else {
      setDistance(parseFloat((distance * 0.3048).toFixed(2)));
      setUnit('meters');
    }
    setSelectedPreset('');
  };

  return (
    <ToolLayout
      title="Delay Time Calculator"
      description="Calculate speaker delay times for live sound alignment. Accounts for distance and temperature variations in the speed of sound."
    >
      {/* Input Section */}
      <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <div className="space-y-6">
          {/* Distance Input */}
          <div>
            <label className="mb-3 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Distance
            </label>
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="number"
                  value={distance}
                  onChange={handleDistanceChange}
                  min="0"
                  step="0.1"
                  className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                  placeholder="Enter distance"
                />
              </div>
              <button
                onClick={handleUnitChange}
                className="rounded-lg border border-zinc-300 bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
              >
                {unit === 'meters' ? 'meters' : 'feet'}
              </button>
            </div>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              {unit === 'meters' ? '1 foot = 0.3048 meters' : '1 meter = 3.28084 feet'}
            </p>
          </div>

          {/* Temperature Slider */}
          <div>
            <label className="mb-3 flex items-center justify-between text-sm font-medium text-zinc-700 dark:text-zinc-300">
              <span>Temperature</span>
              <span className="text-base font-semibold text-blue-600 dark:text-blue-400">
                {temperature}°C
              </span>
            </label>
            <input
              type="range"
              min="-20"
              max="50"
              value={temperature}
              onChange={(e) => setTemperature(parseInt(e.target.value, 10))}
              className="w-full accent-blue-500"
            />
            <div className="mt-2 flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>-20°C</span>
              <span>50°C</span>
            </div>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              Speed of sound: {speedOfSound.toFixed(1)} m/s
            </p>
          </div>

          {/* Presets */}
          <div>
            <label className="mb-3 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Quick Presets
            </label>
            <div className="grid gap-2 sm:grid-cols-3">
              {Object.entries(PRESETS).map(([name, value]) => (
                <button
                  key={name}
                  onClick={() => handlePresetSelect(name)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    selectedPreset === name
                      ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900 dark:text-blue-200'
                      : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600'
                  }`}
                >
                  {name}
                  <span className="ml-1 text-xs opacity-75">({value}m)</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Result Section */}
      <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <div className="text-center">
          <p className="mb-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Delay Time
          </p>
          <div className="mb-4 text-5xl font-bold text-blue-600 dark:text-blue-400">
            {delayTime.toFixed(2)}
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">milliseconds</p>
          <div className="mt-4 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-700">
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Distance: {distance.toFixed(2)} {unit === 'meters' ? 'm' : 'ft'} ({distanceInMeters.toFixed(2)} m)
            </p>
            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
              Speed of sound: {speedOfSound.toFixed(1)} m/s at {temperature}°C
            </p>
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
          How it works
        </h3>
        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
          <p>
            In live sound, speakers at different distances from the audience need to be delayed to maintain phase alignment. This calculator determines the exact delay needed based on distance and environmental conditions.
          </p>

          <div>
            <h4 className="font-medium text-zinc-800 dark:text-zinc-200">Formula</h4>
            <div className="mt-2 rounded-lg bg-zinc-100 p-3 font-mono text-xs dark:bg-zinc-700">
              <p className="text-zinc-900 dark:text-white">T(ms) = (Distance / Speed of Sound) × 1000</p>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Speed of sound: c = 331.3 + (0.606 × Temperature°C)
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-zinc-800 dark:text-zinc-200">Temperature Effect</h4>
            <p>
              The speed of sound varies with temperature. At 20°C (68°F), sound travels at approximately 343 m/s. Warmer air increases the speed, colder air decreases it. This affects delay calculations, especially for outdoor events.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-zinc-800 dark:text-zinc-200">Common Use Cases</h4>
            <ul className="mt-2 space-y-1 list-inside list-disc">
              <li><strong>Stage monitor offset:</strong> Delay for monitor speakers near the stage (typically 5-10m)</li>
              <li><strong>Delay tower:</strong> Delay for speakers at the back of the venue (typically 20-40m)</li>
              <li><strong>Sub alignment:</strong> Delay for subwoofers to align with main speakers (typically 1-5m)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-zinc-800 dark:text-zinc-200">Example</h4>
            <p className="mt-2">
              A speaker 10 meters away at 20°C requires a delay of approximately {((10 / 343) * 1000).toFixed(2)} ms to align with the main speaker.
            </p>
          </div>
        </div>
      </section>
    </ToolLayout>
  );
}
