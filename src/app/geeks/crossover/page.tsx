'use client';

import { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/layout';

const IMPEDANCE_PRESETS = [4, 6, 8, 16];
const FILTER_TYPES = ['Butterworth', 'Linkwitz-Riley'] as const;
const FILTER_ORDERS = [
  { value: 1, label: '1st Order (6dB/oct)' },
  { value: 2, label: '2nd Order (12dB/oct)' },
  { value: 3, label: '3rd Order (18dB/oct)' },
] as const;

type FilterType = (typeof FILTER_TYPES)[number];

interface CrossoverComponent {
  type: 'capacitor' | 'inductor';
  value: number;
  unit: string;
  position: 'series' | 'parallel';
  section: 'high-pass' | 'low-pass';
}

// Standard E12 capacitor values (µF)
const E12_CAPS = [
  0.1, 0.12, 0.15, 0.18, 0.22, 0.27, 0.33, 0.39, 0.47, 0.56, 0.68, 0.82,
  1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2,
  10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82, 100,
];

// Standard inductor values (mH)
const STANDARD_INDUCTORS = [
  0.1, 0.12, 0.15, 0.18, 0.22, 0.27, 0.33, 0.39, 0.47, 0.56, 0.68, 0.82,
  1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2, 10,
];

function findNearestStandard(value: number, standards: number[]): number {
  return standards.reduce((prev, curr) =>
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
  );
}

function formatValue(value: number, unit: string): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)} ${unit === 'µF' ? 'mF' : 'H'}`;
  }
  if (value < 0.1) {
    return `${(value * 1000).toFixed(1)} ${unit === 'µF' ? 'nF' : 'µH'}`;
  }
  return `${value.toFixed(2)} ${unit}`;
}

export default function CrossoverDesignerPage() {
  const [frequency, setFrequency] = useState(3000);
  const [impedance, setImpedance] = useState(8);
  const [customImpedance, setCustomImpedance] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('Butterworth');
  const [filterOrder, setFilterOrder] = useState(2);

  const activeImpedance = customImpedance ? parseFloat(customImpedance) : impedance;

  const components = useMemo(() => {
    const z = activeImpedance;
    const fc = frequency;
    if (!z || z <= 0 || !fc || fc <= 0) return [];

    const twoPiFc = 2 * Math.PI * fc;
    const result: CrossoverComponent[] = [];

    if (filterOrder === 1) {
      // 1st order - same for both types
      const c = 1 / (twoPiFc * z) * 1e6; // µF
      const l = z / twoPiFc * 1000; // mH

      result.push({
        type: 'capacitor',
        value: c,
        unit: 'µF',
        position: 'series',
        section: 'high-pass',
      });
      result.push({
        type: 'inductor',
        value: l,
        unit: 'mH',
        position: 'series',
        section: 'low-pass',
      });
    } else if (filterOrder === 2) {
      if (filterType === 'Butterworth') {
        // Butterworth 2nd order
        const sqrt2 = Math.sqrt(2);
        const c = 1 / (twoPiFc * z * sqrt2) * 1e6; // µF
        const l = (z * sqrt2) / twoPiFc * 1000; // mH

        // High-pass: series cap, parallel inductor
        result.push({
          type: 'capacitor',
          value: c,
          unit: 'µF',
          position: 'series',
          section: 'high-pass',
        });
        result.push({
          type: 'inductor',
          value: l,
          unit: 'mH',
          position: 'parallel',
          section: 'high-pass',
        });

        // Low-pass: series inductor, parallel cap
        result.push({
          type: 'inductor',
          value: l,
          unit: 'mH',
          position: 'series',
          section: 'low-pass',
        });
        result.push({
          type: 'capacitor',
          value: c,
          unit: 'µF',
          position: 'parallel',
          section: 'low-pass',
        });
      } else {
        // Linkwitz-Riley 2nd order (cascaded Butterworth)
        const c = 1 / (twoPiFc * z) * 1e6; // µF
        const l = z / twoPiFc * 1000; // mH

        result.push({
          type: 'capacitor',
          value: c,
          unit: 'µF',
          position: 'series',
          section: 'high-pass',
        });
        result.push({
          type: 'inductor',
          value: l,
          unit: 'mH',
          position: 'parallel',
          section: 'high-pass',
        });

        result.push({
          type: 'inductor',
          value: l,
          unit: 'mH',
          position: 'series',
          section: 'low-pass',
        });
        result.push({
          type: 'capacitor',
          value: c,
          unit: 'µF',
          position: 'parallel',
          section: 'low-pass',
        });
      }
    } else if (filterOrder === 3) {
      // 3rd order Butterworth coefficients
      const c1 = 1 / (twoPiFc * z) * 1e6;
      const c2 = 1 / (3 * twoPiFc * z) * 1e6;
      const l1 = z / twoPiFc * 1000;
      const l2 = (3 * z) / twoPiFc * 1000;

      if (filterType === 'Butterworth') {
        // High-pass: C1 series, L1 parallel, C2 series
        result.push({ type: 'capacitor', value: c2, unit: 'µF', position: 'series', section: 'high-pass' });
        result.push({ type: 'inductor', value: l2, unit: 'mH', position: 'parallel', section: 'high-pass' });
        result.push({ type: 'capacitor', value: c1, unit: 'µF', position: 'series', section: 'high-pass' });

        // Low-pass: L1 series, C1 parallel, L2 series
        result.push({ type: 'inductor', value: l2, unit: 'mH', position: 'series', section: 'low-pass' });
        result.push({ type: 'capacitor', value: c2, unit: 'µF', position: 'parallel', section: 'low-pass' });
        result.push({ type: 'inductor', value: l1, unit: 'mH', position: 'series', section: 'low-pass' });
      } else {
        // Linkwitz-Riley 3rd order (similar structure, different Q)
        const lrC1 = 2 / (3 * twoPiFc * z) * 1e6;
        const lrC2 = 1 / (3 * twoPiFc * z) * 1e6;
        const lrL1 = (3 * z) / (2 * twoPiFc) * 1000;
        const lrL2 = (3 * z) / twoPiFc * 1000;

        result.push({ type: 'capacitor', value: lrC2, unit: 'µF', position: 'series', section: 'high-pass' });
        result.push({ type: 'inductor', value: lrL2, unit: 'mH', position: 'parallel', section: 'high-pass' });
        result.push({ type: 'capacitor', value: lrC1, unit: 'µF', position: 'series', section: 'high-pass' });

        result.push({ type: 'inductor', value: lrL2, unit: 'mH', position: 'series', section: 'low-pass' });
        result.push({ type: 'capacitor', value: lrC2, unit: 'µF', position: 'parallel', section: 'low-pass' });
        result.push({ type: 'inductor', value: lrL1, unit: 'mH', position: 'series', section: 'low-pass' });
      }
    }

    return result;
  }, [activeImpedance, frequency, filterType, filterOrder]);

  const highPassComponents = components.filter((c) => c.section === 'high-pass');
  const lowPassComponents = components.filter((c) => c.section === 'low-pass');

  const shoppingList = useMemo(() => {
    return components.map((c) => {
      const standardValue =
        c.type === 'capacitor'
          ? findNearestStandard(c.value, E12_CAPS)
          : findNearestStandard(c.value, STANDARD_INDUCTORS);
      return {
        ...c,
        calculatedValue: c.value,
        standardValue,
      };
    });
  }, [components]);

  return (
    <ToolLayout
      title="Passive Crossover Designer"
      description="Design 2-way passive crossovers with Butterworth or Linkwitz-Riley filters. Calculate component values and view circuit schematics."
    >
      {/* Input Section */}
      <section className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Crossover Frequency */}
          <div>
            <label className="mb-3 block text-sm font-medium text-zinc-900 dark:text-white">
              Crossover Frequency (Hz)
            </label>
            <input
              type="number"
              value={frequency}
              onChange={(e) => setFrequency(Math.max(20, parseInt(e.target.value) || 20))}
              min="20"
              max="20000"
              className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {[1000, 2000, 3000, 4000, 5000].map((f) => (
                <button
                  key={f}
                  onClick={() => setFrequency(f)}
                  className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                    frequency === f
                      ? 'bg-amber-500 text-white'
                      : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600'
                  }`}
                >
                  {f >= 1000 ? `${f / 1000}kHz` : `${f}Hz`}
                </button>
              ))}
            </div>
          </div>

          {/* Driver Impedance */}
          <div>
            <label className="mb-3 block text-sm font-medium text-zinc-900 dark:text-white">
              Driver Impedance (Ω)
            </label>
            <div className="mb-3 flex gap-2">
              {IMPEDANCE_PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setImpedance(preset);
                    setCustomImpedance('');
                  }}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    !customImpedance && impedance === preset
                      ? 'bg-amber-500 text-white'
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
              placeholder="Custom impedance"
              className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          {/* Filter Type */}
          <div>
            <label className="mb-3 block text-sm font-medium text-zinc-900 dark:text-white">
              Filter Type
            </label>
            <div className="flex gap-2">
              {FILTER_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    filterType === type
                      ? 'bg-amber-500 text-white'
                      : 'border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Order */}
          <div>
            <label className="mb-3 block text-sm font-medium text-zinc-900 dark:text-white">
              Filter Order
            </label>
            <div className="flex flex-col gap-2">
              {FILTER_ORDERS.map((order) => (
                <button
                  key={order.value}
                  onClick={() => setFilterOrder(order.value)}
                  className={`rounded-lg px-4 py-2 text-left text-sm font-medium transition-colors ${
                    filterOrder === order.value
                      ? 'bg-amber-500 text-white'
                      : 'border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600'
                  }`}
                >
                  {order.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Component Values Section */}
      <section className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <h2 className="mb-6 text-lg font-semibold text-zinc-900 dark:text-white">
          Component Values
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {/* High-Pass Section */}
          <div className="rounded-xl bg-gradient-to-br from-rose-50 to-orange-50 p-5 dark:from-rose-900/20 dark:to-orange-900/20">
            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-rose-700 dark:text-rose-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              High-Pass (Tweeter)
            </h3>
            <div className="space-y-3">
              {highPassComponents.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-white/80 px-4 py-3 dark:bg-zinc-800/80"
                >
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {c.type === 'capacitor' ? 'C' : 'L'}
                    {Math.floor(i / 2) + 1} ({c.position})
                  </span>
                  <span className="text-lg font-bold text-rose-600 dark:text-rose-400">
                    {formatValue(c.value, c.unit)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Low-Pass Section */}
          <div className="rounded-xl bg-gradient-to-br from-sky-50 to-indigo-50 p-5 dark:from-sky-900/20 dark:to-indigo-900/20">
            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-sky-700 dark:text-sky-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              Low-Pass (Woofer)
            </h3>
            <div className="space-y-3">
              {lowPassComponents.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-white/80 px-4 py-3 dark:bg-zinc-800/80"
                >
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {c.type === 'capacitor' ? 'C' : 'L'}
                    {Math.floor(i / 2) + 1} ({c.position})
                  </span>
                  <span className="text-lg font-bold text-sky-600 dark:text-sky-400">
                    {formatValue(c.value, c.unit)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Circuit Diagram */}
      <section className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <h2 className="mb-6 text-lg font-semibold text-zinc-900 dark:text-white">
          Circuit Schematic
        </h2>
        <div className="flex justify-center overflow-x-auto">
          <svg
            viewBox="0 0 700 400"
            className="w-full max-w-4xl"
            style={{ minWidth: '500px' }}
          >
            {/* Title */}
            <text
              x="350"
              y="25"
              fontSize="14"
              fontWeight="bold"
              textAnchor="middle"
              className="fill-zinc-700 dark:fill-zinc-300"
            >
              {filterType} {filterOrder === 1 ? '1st' : filterOrder === 2 ? '2nd' : '3rd'} Order Crossover @ {frequency >= 1000 ? `${frequency / 1000}kHz` : `${frequency}Hz`} / {activeImpedance}Ω
            </text>

            {/* Input */}
            <text x="20" y="200" fontSize="12" fontWeight="bold" className="fill-zinc-900 dark:fill-white">
              INPUT
            </text>
            <line x1="60" y1="195" x2="100" y2="195" stroke="currentColor" strokeWidth="2" className="stroke-zinc-700 dark:stroke-zinc-300" />

            {/* Split point */}
            <circle cx="100" cy="195" r="4" className="fill-zinc-700 dark:fill-zinc-300" />
            <line x1="100" y1="195" x2="100" y2="100" stroke="currentColor" strokeWidth="2" className="stroke-zinc-700 dark:stroke-zinc-300" />
            <line x1="100" y1="195" x2="100" y2="290" stroke="currentColor" strokeWidth="2" className="stroke-zinc-700 dark:stroke-zinc-300" />

            {/* HIGH-PASS SECTION */}
            <text x="350" y="55" fontSize="11" fontWeight="bold" textAnchor="middle" className="fill-rose-600 dark:fill-rose-400">
              HIGH-PASS (TWEETER)
            </text>

            {filterOrder === 1 ? (
              <>
                {/* 1st order: just series capacitor */}
                <line x1="100" y1="100" x2="150" y2="100" stroke="currentColor" strokeWidth="2" className="stroke-zinc-700 dark:stroke-zinc-300" />
                {/* Capacitor symbol */}
                <line x1="150" y1="85" x2="150" y2="115" stroke="currentColor" strokeWidth="2" className="stroke-rose-500" />
                <line x1="160" y1="85" x2="160" y2="115" stroke="currentColor" strokeWidth="2" className="stroke-rose-500" />
                <text x="155" y="75" fontSize="10" textAnchor="middle" className="fill-rose-600 dark:fill-rose-400">
                  C1
                </text>
                <text x="155" y="130" fontSize="9" textAnchor="middle" className="fill-zinc-600 dark:fill-zinc-400">
                  {formatValue(highPassComponents[0]?.value || 0, 'µF')}
                </text>
                <line x1="160" y1="100" x2="500" y2="100" stroke="currentColor" strokeWidth="2" className="stroke-zinc-700 dark:stroke-zinc-300" />
              </>
            ) : filterOrder === 2 ? (
              <>
                {/* 2nd order: series cap, parallel inductor */}
                <line x1="100" y1="100" x2="150" y2="100" stroke="currentColor" strokeWidth="2" className="stroke-zinc-700 dark:stroke-zinc-300" />
                {/* Capacitor */}
                <line x1="150" y1="85" x2="150" y2="115" stroke="currentColor" strokeWidth="2" className="stroke-rose-500" />
                <line x1="160" y1="85" x2="160" y2="115" stroke="currentColor" strokeWidth="2" className="stroke-rose-500" />
                <text x="155" y="75" fontSize="10" textAnchor="middle" className="fill-rose-600 dark:fill-rose-400">C1</text>
                <text x="155" y="130" fontSize="9" textAnchor="middle" className="fill-zinc-600 dark:fill-zinc-400">
                  {formatValue(highPassComponents[0]?.value || 0, 'µF')}
                </text>
                <line x1="160" y1="100" x2="280" y2="100" stroke="currentColor" strokeWidth="2" className="stroke-zinc-700 dark:stroke-zinc-300" />
                
                {/* Junction */}
                <circle cx="280" cy="100" r="3" className="fill-zinc-700 dark:fill-zinc-300" />
                
                {/* Parallel inductor to ground */}
                <line x1="280" y1="100" x2="280" y2="120" stroke="currentColor" strokeWidth="2" className="stroke-rose-500" />
                {/* Inductor coils */}
                <path d="M280,120 Q290,125 280,135 Q270,145 280,150 Q290,155 280,165" fill="none" stroke="currentColor" strokeWidth="2" className="stroke-rose-500" />
                <line x1="280" y1="165" x2="280" y2="180" stroke="currentColor" strokeWidth="2" className="stroke-zinc-700 dark:stroke-zinc-300" />
                <text x="300" y="145" fontSize="10" className="fill-rose-600 dark:fill-rose-400">L1</text>
                <text x="300" y="160" fontSize="9" className="fill-zinc-600 dark:fill-zinc-400">
                  {formatValue(highPassComponents[1]?.value || 0, 'mH')}
                </text>
                {/* Ground */}
                <line x1="265" y1="180" x2="295" y2="180" stroke="currentColor" strokeWidth="2" className="stroke-zinc-700 dark:stroke-zinc-300" />
                <line x1="270" y1="185" x2="290" y2="185" stroke="currentColor" strokeWidth="1.5" className="stroke-zinc-700 dark:stroke-zinc-300" />
                <line x1="275" y1="190" x2="285" y2="190" stroke="currentColor" strokeWidth="1" className="stroke-zinc-700 dark:stroke-zinc-300" />
                
                <line x1="280" y1="100" x2="500" y2="100" stroke="currentColor" strokeWidth="2" className="stroke-zinc-700 dark:stroke-zinc-300" />
              </>
            ) : (
              <>
                {/* 3rd order: C1 series, L1 parallel, C2 series */}
                <line x1="100" y1="100" x2="130" y2="100" stroke="currentColor" strokeWidth="2" className="stroke-zinc-700 dark:stroke-zinc-300" />
                {/* C1 */}
                <line x1="130" y1="85" x2="130" y2="115" stroke="currentColor" strokeWidth="2" className="stroke-rose-500" />
                <line x1="140" y1="85" x2="140" y2="115" stroke="currentColor" strokeWidth="2" className="stroke-rose-500" />
                <text x="135" y="75" fontSize="9" textAnchor="middle" className="fill-rose-600 dark:fill-rose-400">C1</text>
                <text x="135" y="130" fontSize="8" textAnchor="middle" className="fill-zinc-600 dark:fill-zinc-400">
                  {formatValue(highPassComponents[0]?.value || 0, 'µF')}
                </text>
                <line x1="140" y1="100" x2="220" y2="100" stroke="currentColor" strokeWidth="2" className="stroke-zinc-700 dark:stroke-zinc-300" />
                
                {/* Junction 1 */}
                <circle cx="220" cy="100" r="3" className="fill-zinc-700 dark:fill-zinc-300" />
                
                {/* L1 parallel */}
                <line x1="220" y1="100" x2="220" y2="115" stroke="currentColor" strokeWidth="2" className="stroke-rose-500" />
                <path d="M220,115 Q230,120 220,130 Q210,140 220,145" fill="none" stroke="currentColor" strokeWidth="2" className="stroke-rose-500" />
                <line x1="220" y1="145" x2="220" y2="160" stroke="currentColor" strokeWidth="2" className="stroke-zinc-700 dark:stroke-zinc-300" />
                <text x="238" y="135" fontSize="9" className="fill-rose-600 dark:fill-rose-400">L1</text>
                <text x="238" y="148" fontSize="8" className="fill-zinc-600 dark:fill-zinc-400">
                  {formatValue(highPassComponents[1]?.value || 0, 'mH')}
                </text>
                <line x1="205" y1="160" x2="235" y2="160" stroke="currentColor" strokeWidth="2" className="stroke-zinc-700 dark:stroke-zinc-300" />
                <line x1="210" y1="165" x2="230" y2="165" stroke="currentColor" strokeWidth="1.5" className="stroke-zinc-700 dark:stroke-zinc-300" />
                
                <line x1="220" y1="100" x2="300" y2="100" stroke="currentColor" strokeWidth="2" className="stroke-zinc-700 dark:stroke-zinc-300" />
                
                {/* C2 */}
                <line x1="300" y1="85" x2="300" y2="115" stroke="currentColor" strokeWidth="2" className="stroke-rose-500" />
                <line x1="310" y1="85" x2="310" y2="115" stroke="currentColor" strokeWidth="2" className="stroke-rose-500" />
                <text x="305" y="75" fontSize="9" textAnchor="middle" className="fill-rose-600 dark:fill-rose-400">C2</text>
                <text x="305" y="130" fontSize="8" textAnchor="middle" className="fill-zinc-600 dark:fill-zinc-400">
                  {formatValue(highPassComponents[2]?.value || 0, 'µF')}
                </text>
                <line x1="310" y1="100" x2="500" y2="100" stroke="currentColor" strokeWidth="2" className="stroke-zinc-700 dark:stroke-zinc-300" />
              </>
            )}

            {/* Tweeter symbol */}
            <circle cx="520" cy="100" r="20" fill="none" stroke="currentColor" strokeWidth="2" className="stroke-rose-500" />
            <text x="520" y="105" fontSize="10" textAnchor="middle" className="fill-rose-600 dark:fill-rose-400">TW</text>
            <line x1="540" y1="100" x2="580" y2="100" stroke="currentColor" strokeWidth="2" className="stroke-zinc-700 dark:stroke-zinc-300" />
            <line x1="580" y1="100" x2="580" y2="290" stroke="currentColor" strokeWidth="2" className="stroke-zinc-700 dark:stroke-zinc-300" />

            {/* LOW-PASS SECTION */}
            <text x="350" y="250" fontSize="11" fontWeight="bold" textAnchor="middle" className="fill-sky-600 dark:fill-sky-400">
              LOW-PASS (WOOFER)
            </text>

            {filterOrder === 1 ? (
              <>
                {/* 1st order: just series inductor */}
                <line x1="100" y1="290" x2="150" y2="290" stroke="currentColor" strokeWidth="2" className="stroke-zinc-700 dark:stroke-zinc-300" />
                {/* Inductor */}
                <path d="M150,290 Q160,280 170,290 Q180,300 190,290 Q200,280 210,290" fill="none" stroke="currentColor" strokeWidth="2" className="stroke-sky-500" />
                <text x="180" y="275" fontSize="10" textAnchor="middle" className="fill-sky-600 dark:fill-sky-400">L1</text>
                <text x="180" y="315" fontSize="9" textAnchor="middle" className="fill-zinc-600 dark:fill-zinc-400">
                  {formatValue(lowPassComponents[0]?.value || 0, 'mH')}
                </text>
                <line x1="210" y1="290" x2="500" y2="290" stroke="currentColor" strokeWidth="2" className="stroke-zinc-700 dark:stroke-zinc-300" />
              </>
            ) : filterOrder === 2 ? (
              <>
                {/* 2nd order: series inductor, parallel cap */}
                <line x1="100" y1="290" x2="150" y2="290" stroke="currentColor" strokeWidth="2" className="stroke-zinc-700 dark:stroke-zinc-300" />
                {/* Inductor */}
                <path d="M150,290 Q160,280 170,290 Q180,300 190,290 Q200,280 210,290" fill="none" stroke="currentColor" strokeWidth="2" className="stroke-sky-500" />
                <text x="180" y="275" fontSize="10" textAnchor="middle" className="fill-sky-600 dark:fill-sky-400">L1</text>
                <text x="180" y="315" fontSize="9" textAnchor="middle" className="fill-zinc-600 dark:fill-zinc-400">
                  {formatValue(lowPassComponents[0]?.value || 0, 'mH')}
                </text>
                <line x1="210" y1="290" x2="280" y2="290" stroke="currentColor" strokeWidth="2" className="stroke-zinc-700 dark:stroke-zinc-300" />
                
                {/* Junction */}
                <circle cx="280" cy="290" r="3" className="fill-zinc-700 dark:fill-zinc-300" />
                
                {/* Parallel capacitor to ground */}
                <line x1="280" y1="290" x2="280" y2="320" stroke="currentColor" strokeWidth="2" className="stroke-sky-500" />
                <line x1="270" y1="320" x2="290" y2="320" stroke="currentColor" strokeWidth="2" className="stroke-sky-500" />
                <line x1="270" y1="330" x2="290" y2="330" stroke="currentColor" strokeWidth="2" className="stroke-sky-500" />
                <line x1="280" y1="330" x2="280" y2="350" stroke="currentColor" strokeWidth="2" className="stroke-zinc-700 dark:stroke-zinc-300" />
                <text x="300" y="330" fontSize="10" className="fill-sky-600 dark:fill-sky-400">C1</text>
                <text x="300" y="345" fontSize="9" className="fill-zinc-600 dark:fill-zinc-400">
                  {formatValue(lowPassComponents[1]?.value || 0, 'µF')}
                </text>
                {/* Ground */}
                <line x1="265" y1="350" x2="295" y2="350" stroke="currentColor" strokeWidth="2" className="stroke-zinc-700 dark:stroke-zinc-300" />
                <line x1="270" y1="355" x2="290" y2="355" stroke="currentColor" strokeWidth="1.5" className="stroke-zinc-700 dark:stroke-zinc-300" />
                <line x1="275" y1="360" x2="285" y2="360" stroke="currentColor" strokeWidth="1" className="stroke-zinc-700 dark:stroke-zinc-300" />
                
                <line x1="280" y1="290" x2="500" y2="290" stroke="currentColor" strokeWidth="2" className="stroke-zinc-700 dark:stroke-zinc-300" />
              </>
            ) : (
              <>
                {/* 3rd order: L1 series, C1 parallel, L2 series */}
                <line x1="100" y1="290" x2="130" y2="290" stroke="currentColor" strokeWidth="2" className="stroke-zinc-700 dark:stroke-zinc-300" />
                {/* L1 */}
                <path d="M130,290 Q140,280 150,290 Q160,300 170,290" fill="none" stroke="currentColor" strokeWidth="2" className="stroke-sky-500" />
                <text x="150" y="275" fontSize="9" textAnchor="middle" className="fill-sky-600 dark:fill-sky-400">L1</text>
                <text x="150" y="310" fontSize="8" textAnchor="middle" className="fill-zinc-600 dark:fill-zinc-400">
                  {formatValue(lowPassComponents[0]?.value || 0, 'mH')}
                </text>
                <line x1="170" y1="290" x2="220" y2="290" stroke="currentColor" strokeWidth="2" className="stroke-zinc-700 dark:stroke-zinc-300" />
                
                {/* Junction */}
                <circle cx="220" cy="290" r="3" className="fill-zinc-700 dark:fill-zinc-300" />
                
                {/* C1 parallel */}
                <line x1="220" y1="290" x2="220" y2="315" stroke="currentColor" strokeWidth="2" className="stroke-sky-500" />
                <line x1="210" y1="315" x2="230" y2="315" stroke="currentColor" strokeWidth="2" className="stroke-sky-500" />
                <line x1="210" y1="325" x2="230" y2="325" stroke="currentColor" strokeWidth="2" className="stroke-sky-500" />
                <line x1="220" y1="325" x2="220" y2="345" stroke="currentColor" strokeWidth="2" className="stroke-zinc-700 dark:stroke-zinc-300" />
                <text x="238" y="325" fontSize="9" className="fill-sky-600 dark:fill-sky-400">C1</text>
                <text x="238" y="340" fontSize="8" className="fill-zinc-600 dark:fill-zinc-400">
                  {formatValue(lowPassComponents[1]?.value || 0, 'µF')}
                </text>
                <line x1="205" y1="345" x2="235" y2="345" stroke="currentColor" strokeWidth="2" className="stroke-zinc-700 dark:stroke-zinc-300" />
                <line x1="210" y1="350" x2="230" y2="350" stroke="currentColor" strokeWidth="1.5" className="stroke-zinc-700 dark:stroke-zinc-300" />
                
                <line x1="220" y1="290" x2="280" y2="290" stroke="currentColor" strokeWidth="2" className="stroke-zinc-700 dark:stroke-zinc-300" />
                
                {/* L2 */}
                <path d="M280,290 Q290,280 300,290 Q310,300 320,290" fill="none" stroke="currentColor" strokeWidth="2" className="stroke-sky-500" />
                <text x="300" y="275" fontSize="9" textAnchor="middle" className="fill-sky-600 dark:fill-sky-400">L2</text>
                <text x="300" y="310" fontSize="8" textAnchor="middle" className="fill-zinc-600 dark:fill-zinc-400">
                  {formatValue(lowPassComponents[2]?.value || 0, 'mH')}
                </text>
                <line x1="320" y1="290" x2="500" y2="290" stroke="currentColor" strokeWidth="2" className="stroke-zinc-700 dark:stroke-zinc-300" />
              </>
            )}

            {/* Woofer symbol */}
            <circle cx="520" cy="290" r="20" fill="none" stroke="currentColor" strokeWidth="2" className="stroke-sky-500" />
            <text x="520" y="295" fontSize="10" textAnchor="middle" className="fill-sky-600 dark:fill-sky-400">WF</text>
            <line x1="540" y1="290" x2="580" y2="290" stroke="currentColor" strokeWidth="2" className="stroke-zinc-700 dark:stroke-zinc-300" />

            {/* Common ground return */}
            <text x="600" y="200" fontSize="10" className="fill-zinc-600 dark:fill-zinc-400">GND</text>
            <line x1="580" y1="290" x2="620" y2="290" stroke="currentColor" strokeWidth="2" className="stroke-zinc-700 dark:stroke-zinc-300" />
            <line x1="620" y1="100" x2="620" y2="290" stroke="currentColor" strokeWidth="2" className="stroke-zinc-700 dark:stroke-zinc-300" />
            <line x1="580" y1="100" x2="620" y2="100" stroke="currentColor" strokeWidth="2" className="stroke-zinc-700 dark:stroke-zinc-300" />
          </svg>
        </div>
      </section>

      {/* Shopping List */}
      <section className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <h2 className="mb-6 text-lg font-semibold text-zinc-900 dark:text-white">
          Component Shopping List
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="pb-3 font-medium text-zinc-600 dark:text-zinc-400">Component</th>
                <th className="pb-3 font-medium text-zinc-600 dark:text-zinc-400">Section</th>
                <th className="pb-3 font-medium text-zinc-600 dark:text-zinc-400">Calculated</th>
                <th className="pb-3 font-medium text-zinc-600 dark:text-zinc-400">Standard Value</th>
                <th className="pb-3 font-medium text-zinc-600 dark:text-zinc-400">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
              {shoppingList.map((item, i) => (
                <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-700/50">
                  <td className="py-3 font-medium text-zinc-900 dark:text-white">
                    {item.type === 'capacitor' ? 'Capacitor' : 'Inductor'} {Math.floor(i / 2) + 1}
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        item.section === 'high-pass'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                          : 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400'
                      }`}
                    >
                      {item.section === 'high-pass' ? 'High-Pass' : 'Low-Pass'}
                    </span>
                  </td>
                  <td className="py-3 text-zinc-600 dark:text-zinc-400">
                    {formatValue(item.calculatedValue, item.unit)}
                  </td>
                  <td className="py-3 font-semibold text-amber-600 dark:text-amber-400">
                    {formatValue(item.standardValue, item.unit)}
                  </td>
                  <td className="py-3 text-zinc-500 dark:text-zinc-500">
                    {item.type === 'capacitor' ? 'Film/Polypropylene' : 'Air Core'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
          Standard values are from E12 series for capacitors and common inductor values. For best results, use film or polypropylene capacitors and air-core inductors rated for audio applications.
        </p>
      </section>

      {/* Info Section */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
          About Passive Crossovers
        </h2>
        <div className="space-y-4 text-sm text-zinc-700 dark:text-zinc-300">
          <p>
            A passive crossover divides the audio signal between drivers using inductors and capacitors. Unlike active crossovers, they require no power and are placed between the amplifier and speakers.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-700">
              <h3 className="mb-2 font-semibold text-zinc-900 dark:text-white">Butterworth</h3>
              <p className="text-xs">
                Maximally flat frequency response in the passband. -3dB at crossover point. Good phase response but drivers are 90° out of phase at crossover.
              </p>
            </div>
            <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-700">
              <h3 className="mb-2 font-semibold text-zinc-900 dark:text-white">Linkwitz-Riley</h3>
              <p className="text-xs">
                -6dB at crossover point, sums to flat response. Drivers are in-phase at crossover. Preferred for most speaker designs due to better summing behavior.
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
            <h3 className="mb-2 font-semibold text-amber-800 dark:text-amber-400">Filter Order Guide</h3>
            <ul className="space-y-1 text-xs text-amber-700 dark:text-amber-300">
              <li><strong>1st Order (6dB/oct):</strong> Gentle slope, wide overlap between drivers. Simple but requires careful driver matching.</li>
              <li><strong>2nd Order (12dB/oct):</strong> Most common. Good balance of complexity and performance.</li>
              <li><strong>3rd Order (18dB/oct):</strong> Steeper slope, better driver isolation. More components, more complex.</li>
            </ul>
          </div>

          <div className="space-y-2 rounded-lg bg-zinc-100 p-3 font-mono text-xs dark:bg-zinc-700">
            <p className="font-semibold text-zinc-900 dark:text-white">Formulas (2nd Order):</p>
            <p>Butterworth: C = 1/(2π×fc×Z×√2), L = (Z×√2)/(2π×fc)</p>
            <p>Linkwitz-Riley: C = 1/(2π×fc×Z), L = Z/(2π×fc)</p>
          </div>
        </div>
      </section>
    </ToolLayout>
  );
}
