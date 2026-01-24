'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/layout';

const IMPEDANCE_PRESETS = [4, 6, 8, 16];

export default function LPadAttenuatorPage() {
  const [impedance, setImpedance] = useState(8);
  const [attenuation, setAttenuation] = useState(6);
  const [customImpedance, setCustomImpedance] = useState('');

  const calculateLPad = () => {
    const z = customImpedance ? parseFloat(customImpedance) : impedance;
    if (!z || z <= 0) return { r1: 0, r2: 0 };

    const ratio = Math.pow(10, attenuation / 20);
    const r1 = (z * (ratio - 1)) / ratio;
    const r2 = (z * ratio) / (ratio - 1);

    return {
      r1: Math.round(r1 * 100) / 100,
      r2: Math.round(r2 * 100) / 100,
    };
  };

  const { r1, r2 } = calculateLPad();
  const activeImpedance = customImpedance ? parseFloat(customImpedance) : impedance;

  return (
    <ToolLayout
      title="L-Pad Attenuator Calculator"
      description="Calculate resistor values for L-pad attenuators used to match tweeter impedance to woofer impedance in speaker systems."
    >
      <section className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <label className="mb-3 block text-sm font-medium text-zinc-900 dark:text-white">
              Driver Impedance (Ω)
            </label>
            <div className="mb-4 flex gap-2">
              {IMPEDANCE_PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setImpedance(preset);
                    setCustomImpedance('');
                  }}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    !customImpedance && impedance === preset
                      ? 'bg-blue-500 text-white'
                      : 'border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600'
                  }`}
                >
                  {preset}Ω
                </button>
              ))}
            </div>
            <input
              type="number"
              value={customImpedance}
              onChange={(e) => setCustomImpedance(e.target.value)}
              placeholder="Custom value"
              className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-zinc-900 dark:text-white">
              Attenuation: {attenuation} dB
            </label>
            <input
              type="range"
              min="0"
              max="20"
              step="0.1"
              value={attenuation}
              onChange={(e) => setAttenuation(parseFloat(e.target.value))}
              className="mb-4 w-full"
            />
            <input
              type="number"
              value={attenuation}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && val >= 0 && val <= 20) {
                  setAttenuation(val);
                }
              }}
              min="0"
              max="20"
              step="0.1"
              className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
            />
          </div>
        </div>
      </section>

      <section className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <h2 className="mb-6 text-lg font-semibold text-zinc-900 dark:text-white">
          Resistor Values
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-700">
            <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">
              Series Resistor (R1)
            </p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {r1.toFixed(2)} Ω
            </p>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              Connected in series with input
            </p>
          </div>

          <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-700">
            <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">
              Parallel Resistor (R2)
            </p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {r2.toFixed(2)} Ω
            </p>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              Connected to ground
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <h2 className="mb-6 text-lg font-semibold text-zinc-900 dark:text-white">
          Circuit Diagram
        </h2>
        <div className="flex justify-center overflow-x-auto">
          <svg
            viewBox="0 0 500 300"
            className="w-full max-w-2xl"
            style={{ minWidth: '400px' }}
          >
            <rect
              width="500"
              height="300"
              fill="transparent"
              className="dark:fill-zinc-700"
            />

            <text
              x="20"
              y="150"
              fontSize="14"
              fontWeight="bold"
              className="fill-zinc-900 dark:fill-white"
            >
              Input
            </text>

            <line
              x1="60"
              y1="150"
              x2="100"
              y2="150"
              stroke="currentColor"
              strokeWidth="2"
              className="stroke-zinc-900 dark:stroke-white"
            />

            <rect
              x="100"
              y="140"
              width="80"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="stroke-blue-600 dark:stroke-blue-400"
            />
            <text
              x="140"
              y="160"
              fontSize="12"
              fontWeight="bold"
              textAnchor="middle"
              className="fill-blue-600 dark:fill-blue-400"
            >
              R1
            </text>

            <line
              x1="180"
              y1="150"
              x2="220"
              y2="150"
              stroke="currentColor"
              strokeWidth="2"
              className="stroke-zinc-900 dark:stroke-white"
            />

            <circle
              cx="220"
              cy="150"
              r="4"
              className="fill-zinc-900 dark:fill-white"
            />

            <text
              x="240"
              y="155"
              fontSize="14"
              fontWeight="bold"
              className="fill-zinc-900 dark:fill-white"
            >
              Output
            </text>

            <line
              x1="220"
              y1="150"
              x2="220"
              y2="180"
              stroke="currentColor"
              strokeWidth="2"
              className="stroke-green-600 dark:stroke-green-400"
            />

            <rect
              x="210"
              y="180"
              width="20"
              height="60"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="stroke-green-600 dark:stroke-green-400"
            />

            <text
              x="245"
              y="215"
              fontSize="12"
              fontWeight="bold"
              className="fill-green-600 dark:fill-green-400"
            >
              R2
            </text>

            <line
              x1="220"
              y1="240"
              x2="220"
              y2="260"
              stroke="currentColor"
              strokeWidth="2"
              className="stroke-zinc-900 dark:stroke-white"
            />

            <line
              x1="200"
              y1="260"
              x2="240"
              y2="260"
              stroke="currentColor"
              strokeWidth="2"
              className="stroke-zinc-900 dark:stroke-white"
            />
            <line
              x1="207"
              y1="267"
              x2="233"
              y2="267"
              stroke="currentColor"
              strokeWidth="2"
              className="stroke-zinc-900 dark:stroke-white"
            />
            <line
              x1="213"
              y1="274"
              x2="227"
              y2="274"
              stroke="currentColor"
              strokeWidth="2"
              className="stroke-zinc-900 dark:stroke-white"
            />

            <text
              x="250"
              y="280"
              fontSize="12"
              className="fill-zinc-600 dark:fill-zinc-400"
            >
              GND
            </text>

            <text
              x="220"
              y="30"
              fontSize="12"
              fontWeight="bold"
              textAnchor="middle"
              className="fill-zinc-600 dark:fill-zinc-400"
            >
              Driver: {activeImpedance}Ω
            </text>

            <text
              x="220"
              y="50"
              fontSize="12"
              fontWeight="bold"
              textAnchor="middle"
              className="fill-zinc-600 dark:fill-zinc-400"
            >
              Attenuation: {attenuation}dB
            </text>
          </svg>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
          What is an L-Pad Attenuator?
        </h2>
        <div className="space-y-4 text-sm text-zinc-700 dark:text-zinc-300">
          <p>
            An L-pad attenuator is a passive network used to reduce the output level of a driver
            (typically a tweeter) while maintaining impedance matching with the rest of the speaker
            system. It's called an "L-pad" because the resistors form an L-shape in the circuit.
          </p>

          <h3 className="font-semibold text-zinc-900 dark:text-white">Common Applications:</h3>
          <ul className="list-inside list-disc space-y-2 pl-2">
            <li>
              <strong>Tweeter Level Matching:</strong> Reduces tweeter output to match woofer
              sensitivity
            </li>
            <li>
              <strong>Impedance Preservation:</strong> Maintains constant impedance across the
              frequency range
            </li>
            <li>
              <strong>Crossover Networks:</strong> Part of passive crossover designs in speaker
              systems
            </li>
          </ul>

          <h3 className="font-semibold text-zinc-900 dark:text-white">How It Works:</h3>
          <ul className="list-inside list-disc space-y-2 pl-2">
            <li>
              <strong>R1 (Series):</strong> Reduces the signal level by dropping voltage across
              the series resistor
            </li>
            <li>
              <strong>R2 (Parallel):</strong> Provides a return path to ground and maintains
              impedance matching
            </li>
            <li>
              The combination ensures both attenuation and impedance matching simultaneously
            </li>
          </ul>

          <h3 className="font-semibold text-zinc-900 dark:text-white">Formulas:</h3>
          <div className="space-y-2 rounded-lg bg-zinc-50 p-3 font-mono text-xs dark:bg-zinc-700">
            <p>ratio = 10^(attenuation_dB / 20)</p>
            <p>R1 = Z × (ratio - 1) / ratio</p>
            <p>R2 = Z × ratio / (ratio - 1)</p>
          </div>

          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Where Z is the driver impedance in ohms and attenuation is in decibels.
          </p>
        </div>
      </section>
    </ToolLayout>
  );
}
