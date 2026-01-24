'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/layout';

const IMPEDANCE_PRESETS = [
  { label: '4Ω', value: 4 },
  { label: '8Ω', value: 8 },
  { label: '16Ω', value: 16 },
];

export default function LimiterThresholdCalculatorPage() {
  const [power, setPower] = useState(100); // watts
  const [impedance, setImpedance] = useState(8); // ohms
  const [ampGain, setAmpGain] = useState(0); // dB

  // Calculate max safe voltage: V = sqrt(P × Z)
  const maxVoltage = Math.sqrt(power * impedance);

  // Calculate dBu: dBu = 20 × log10(Vrms / 0.775)
  const dBu = 20 * Math.log10(maxVoltage / 0.775);

  // dBFS approximation: dBu - 18 (assuming +18dBu = 0dBFS)
  const dBFS = dBu - 18;

  // Limiter threshold accounting for amp gain
  const limiterThresholdDbu = dBu - ampGain;
  const limiterThresholdDbfs = limiterThresholdDbu - 18;

  // Headroom recommendation (typically 3-6dB)
  const recommendedHeadroom = 3;
  const safeThresholdDbu = limiterThresholdDbu - recommendedHeadroom;
  const safeThresholdDbfs = safeThresholdDbu - 18;

  // Safety indicator: green if safe, yellow if marginal, red if risky
  const getSafetyColor = () => {
    if (limiterThresholdDbfs >= -3) return 'green'; // Safe
    if (limiterThresholdDbfs >= -6) return 'yellow'; // Marginal
    return 'red'; // Risky
  };

  const getSafetyLabel = () => {
    if (limiterThresholdDbfs >= -3) return 'Safe';
    if (limiterThresholdDbfs >= -6) return 'Marginal';
    return 'Risky';
  };

  const safetyColor = getSafetyColor();

  return (
    <ToolLayout
      title="Limiter Threshold Calculator"
      description="Calculate safe limiter threshold to protect your speakers from damage. Prevents clipping and ensures speaker longevity."
    >
      {/* Input Section */}
      <section className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <h2 className="mb-6 text-lg font-semibold text-zinc-900 dark:text-white">
          Speaker & Amplifier Settings
        </h2>

        <div className="grid gap-6 sm:grid-cols-3">
          {/* Speaker RMS Power */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Speaker RMS Power
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="10000"
                step="1"
                value={power}
                onChange={(e) => setPower(Math.max(1, parseInt(e.target.value) || 1))}
                className="h-10 flex-1 rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
              />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">W</span>
            </div>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Check your speaker specifications
            </p>
          </div>

          {/* Speaker Impedance */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Speaker Impedance
            </label>
            <div className="flex gap-2">
              <select
                value={impedance}
                onChange={(e) => setImpedance(parseFloat(e.target.value))}
                className="h-10 flex-1 rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
              >
                {IMPEDANCE_PRESETS.map((preset) => (
                  <option key={preset.value} value={preset.value}>
                    {preset.label}
                  </option>
                ))}
              </select>
              <span className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
                Ω
              </span>
            </div>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Common: 4Ω, 8Ω, 16Ω
            </p>
          </div>

          {/* Amplifier Gain */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Amplifier Gain
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="-20"
                max="40"
                step="0.5"
                value={ampGain}
                onChange={(e) => setAmpGain(parseFloat(e.target.value) || 0)}
                className="h-10 flex-1 rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
              />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">dB</span>
            </div>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Preamp or mixer output gain
            </p>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {/* Max Safe Voltage */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
            Max Safe Voltage
          </h3>
          <div className="mb-2 text-4xl font-bold text-zinc-900 dark:text-white">
            {maxVoltage.toFixed(2)}
            <span className="ml-2 text-lg text-zinc-600 dark:text-zinc-400">Vrms</span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Maximum voltage before speaker damage
          </p>
        </section>

        {/* Safety Indicator */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
            Safety Status
          </h3>
          <div className="flex items-center gap-3">
            <div
              className={`h-4 w-4 rounded-full ${
                safetyColor === 'green'
                  ? 'bg-green-500'
                  : safetyColor === 'yellow'
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
              }`}
            />
            <span className="text-2xl font-bold text-zinc-900 dark:text-white">
              {getSafetyLabel()}
            </span>
          </div>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            {safetyColor === 'green'
              ? 'Limiter threshold is well-protected'
              : safetyColor === 'yellow'
                ? 'Consider adding more headroom'
                : 'Increase limiter threshold immediately'}
          </p>
        </section>
      </div>

      {/* Threshold Settings */}
      <section className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <h2 className="mb-6 text-lg font-semibold text-zinc-900 dark:text-white">
          Limiter Threshold Settings
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Absolute Threshold */}
          <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <h4 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Absolute Threshold
            </h4>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">dBu</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {limiterThresholdDbu.toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">dBFS</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {limiterThresholdDbfs.toFixed(1)}
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
              Set your limiter to this threshold to protect speakers
            </p>
          </div>

          {/* Recommended Safe Threshold */}
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-900/20">
            <h4 className="mb-3 text-sm font-semibold text-green-700 dark:text-green-400">
              Recommended Safe Threshold
            </h4>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-green-600 dark:text-green-400">dBu</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-300">
                  {safeThresholdDbu.toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-xs text-green-600 dark:text-green-400">dBFS</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-300">
                  {safeThresholdDbfs.toFixed(1)}
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs text-green-600 dark:text-green-400">
              Includes {recommendedHeadroom}dB safety headroom
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
          How It Works
        </h3>
        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
          <div>
            <h4 className="mb-2 font-semibold text-zinc-800 dark:text-zinc-200">
              Step 1: Calculate Max Safe Voltage
            </h4>
            <div className="rounded-lg bg-zinc-100 p-3 font-mono text-xs dark:bg-zinc-700">
              <p className="text-zinc-900 dark:text-white">V = √(P × Z)</p>
              <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                Where P = power (watts), Z = impedance (ohms)
              </p>
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-semibold text-zinc-800 dark:text-zinc-200">
              Step 2: Convert to dBu
            </h4>
            <div className="rounded-lg bg-zinc-100 p-3 font-mono text-xs dark:bg-zinc-700">
              <p className="text-zinc-900 dark:text-white">dBu = 20 × log₁₀(Vrms / 0.775)</p>
              <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                0.775V is the reference level for dBu
              </p>
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-semibold text-zinc-800 dark:text-zinc-200">
              Step 3: Account for Amplifier Gain
            </h4>
            <div className="rounded-lg bg-zinc-100 p-3 font-mono text-xs dark:bg-zinc-700">
              <p className="text-zinc-900 dark:text-white">
                Limiter Threshold = dBu - Amp Gain
              </p>
              <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                Higher amp gain requires lower limiter threshold
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-900/20">
            <h4 className="mb-2 font-semibold text-blue-900 dark:text-blue-300">
              💡 Pro Tip
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-400">
              Always set your limiter threshold 3-6dB below the calculated maximum to provide
              safety headroom. This prevents accidental clipping and protects your speakers from
              unexpected peaks.
            </p>
          </div>
        </div>
      </section>
    </ToolLayout>
  );
}
