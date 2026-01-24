'use client';

import { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/layout';

const DRIVER_PRESETS = [
  { name: 'Custom', fs: 28, qts: 0.38, vas: 84 },
  { name: 'Dayton RSS315HF-4', fs: 23.4, qts: 0.49, vas: 136 },
  { name: 'Dayton UM12-22', fs: 22, qts: 0.36, vas: 127 },
  { name: 'SB Acoustics SB29SWNRX-S75-6', fs: 26, qts: 0.32, vas: 145 },
  { name: 'Peerless XXLS 12', fs: 19.5, qts: 0.46, vas: 198 },
  { name: 'Tang Band W8-1772', fs: 32, qts: 0.35, vas: 42 },
  { name: 'Ultimax UM18-22', fs: 18.5, qts: 0.28, vas: 340 },
];

type EnclosureType = 'sealed' | 'ported';

interface CalculationResults {
  boxVolumeLiters: number;
  boxVolumeCuFt: number;
  f3: number;
  portDiameter?: number;
  portLength?: number;
  dimensions: { width: number; height: number; depth: number };
}

function calculateSealed(fs: number, qts: number, vas: number): CalculationResults {
  const qtc = 0.707; // Butterworth alignment for flat response
  const vb = vas / (Math.pow(qtc / qts, 2) - 1);
  const f3 = fs * Math.sqrt(vas / vb + 1);
  
  const volumeCm3 = vb * 1000;
  const depth = Math.cbrt(volumeCm3 / 1.618 / 1.272);
  const width = depth * 1.618;
  const height = depth * 1.272;
  
  return {
    boxVolumeLiters: Math.max(vb, 1),
    boxVolumeCuFt: Math.max(vb * 0.0353147, 0.035),
    f3: Math.max(f3, 10),
    dimensions: {
      width: Math.round(width) / 10,
      height: Math.round(height) / 10,
      depth: Math.round(depth) / 10,
    },
  };
}

function calculatePorted(
  fs: number,
  qts: number,
  vas: number,
  tuningFreq: number
): CalculationResults {
  const vb = 15 * vas * Math.pow(qts, 3.3);
  const fb = tuningFreq;
  
  const PORT_DIAMETER_CM = 10;
  const NUM_PORTS = 1;
  // Lv = (23562.5 × Dv² × N) / (Fb² × Vb) - 0.825 × Dv
  const lv = (23562.5 * Math.pow(PORT_DIAMETER_CM, 2) * NUM_PORTS) / (Math.pow(fb, 2) * vb) - 0.825 * PORT_DIAMETER_CM;
  
  const f3 = fb * 0.9;
  
  const volumeCm3 = vb * 1000;
  const depth = Math.cbrt(volumeCm3 / 1.618 / 1.272);
  const width = depth * 1.618;
  const height = depth * 1.272;
  
  return {
    boxVolumeLiters: Math.max(vb, 1),
    boxVolumeCuFt: Math.max(vb * 0.0353147, 0.035),
    f3: Math.max(f3, 10),
    portDiameter: PORT_DIAMETER_CM,
    portLength: Math.max(lv, 5),
    dimensions: {
      width: Math.round(width) / 10,
      height: Math.round(height) / 10,
      depth: Math.round(depth) / 10,
    },
  };
}

function BoxDiagram({
  type,
  dimensions,
  portDiameter,
  portLength,
}: {
  type: EnclosureType;
  dimensions: { width: number; height: number; depth: number };
  portDiameter?: number;
  portLength?: number;
}) {
  const { width, height, depth } = dimensions;
  const svgWidth = 320;
  const svgHeight = 280;
  const boxWidth = 180;
  const boxHeight = 140;
  const perspective = 50;
  
  const x = 60;
  const y = 60;
  
  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="w-full max-w-md mx-auto"
      style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}
    >
      <defs>
        <linearGradient id="boxFront" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e1e1e" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>
        <linearGradient id="boxTop" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2a2a2a" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </linearGradient>
        <linearGradient id="boxSide" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#151515" />
          <stop offset="100%" stopColor="#0d0d0d" />
        </linearGradient>
        <radialGradient id="wooferCone" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3a3a3a" />
          <stop offset="60%" stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </radialGradient>
        <radialGradient id="dustCap" cx="40%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#4a4a4a" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </radialGradient>
        <filter id="innerShadow">
          <feOffset dx="0" dy="2" />
          <feGaussianBlur stdDeviation="3" result="offset-blur" />
          <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
          <feFlood floodColor="black" floodOpacity="0.5" result="color" />
          <feComposite operator="in" in="color" in2="inverse" result="shadow" />
          <feComposite operator="over" in="shadow" in2="SourceGraphic" />
        </filter>
      </defs>
      
      {/* Top face */}
      <polygon
        points={`${x},${y} ${x + boxWidth},${y} ${x + boxWidth + perspective},${y - perspective} ${x + perspective},${y - perspective}`}
        fill="url(#boxTop)"
        stroke="#333"
        strokeWidth="1"
      />
      
      {/* Right side face */}
      <polygon
        points={`${x + boxWidth},${y} ${x + boxWidth + perspective},${y - perspective} ${x + boxWidth + perspective},${y + boxHeight - perspective} ${x + boxWidth},${y + boxHeight}`}
        fill="url(#boxSide)"
        stroke="#333"
        strokeWidth="1"
      />
      
      {/* Front face */}
      <rect
        x={x}
        y={y}
        width={boxWidth}
        height={boxHeight}
        fill="url(#boxFront)"
        stroke="#333"
        strokeWidth="1.5"
        rx="2"
      />
      
      {/* Woofer cutout */}
      <circle
        cx={x + boxWidth / 2}
        cy={y + boxHeight / 2}
        r={45}
        fill="url(#wooferCone)"
        filter="url(#innerShadow)"
      />
      
      {/* Woofer surround */}
      <circle
        cx={x + boxWidth / 2}
        cy={y + boxHeight / 2}
        r={45}
        fill="none"
        stroke="#2a2a2a"
        strokeWidth="8"
      />
      
      {/* Woofer cone rings */}
      <circle
        cx={x + boxWidth / 2}
        cy={y + boxHeight / 2}
        r={35}
        fill="none"
        stroke="#252525"
        strokeWidth="1"
      />
      <circle
        cx={x + boxWidth / 2}
        cy={y + boxHeight / 2}
        r={25}
        fill="none"
        stroke="#252525"
        strokeWidth="1"
      />
      
      {/* Dust cap */}
      <circle
        cx={x + boxWidth / 2}
        cy={y + boxHeight / 2}
        r={15}
        fill="url(#dustCap)"
      />
      
      {/* Port for ported enclosure */}
      {type === 'ported' && (
        <>
          <rect
            x={x + boxWidth - 35}
            y={y + boxHeight - 40}
            width={25}
            height={25}
            rx="12.5"
            fill="#050505"
            stroke="#222"
            strokeWidth="2"
          />
          <ellipse
            cx={x + boxWidth - 22.5}
            cy={y + boxHeight - 27.5}
            rx="8"
            ry="8"
            fill="#000"
          />
        </>
      )}
      
      {/* Dimension lines */}
      {/* Width */}
      <line x1={x} y1={y + boxHeight + 25} x2={x + boxWidth} y2={y + boxHeight + 25} stroke="#f97316" strokeWidth="1.5" />
      <line x1={x} y1={y + boxHeight + 20} x2={x} y2={y + boxHeight + 30} stroke="#f97316" strokeWidth="1.5" />
      <line x1={x + boxWidth} y1={y + boxHeight + 20} x2={x + boxWidth} y2={y + boxHeight + 30} stroke="#f97316" strokeWidth="1.5" />
      <text x={x + boxWidth / 2} y={y + boxHeight + 42} textAnchor="middle" className="fill-orange-500 text-xs font-medium">
        {width.toFixed(1)} cm
      </text>
      
      {/* Height */}
      <line x1={x - 25} y1={y} x2={x - 25} y2={y + boxHeight} stroke="#f97316" strokeWidth="1.5" />
      <line x1={x - 30} y1={y} x2={x - 20} y2={y} stroke="#f97316" strokeWidth="1.5" />
      <line x1={x - 30} y1={y + boxHeight} x2={x - 20} y2={y + boxHeight} stroke="#f97316" strokeWidth="1.5" />
      <text x={x - 35} y={y + boxHeight / 2} textAnchor="middle" className="fill-orange-500 text-xs font-medium" transform={`rotate(-90, ${x - 35}, ${y + boxHeight / 2})`}>
        {height.toFixed(1)} cm
      </text>
      
      {/* Depth */}
      <line x1={x + boxWidth + 8} y1={y - 8} x2={x + boxWidth + perspective + 8} y2={y - perspective - 8} stroke="#f97316" strokeWidth="1.5" />
      <text x={x + boxWidth + perspective / 2 + 20} y={y - perspective / 2 - 5} textAnchor="middle" className="fill-orange-500 text-xs font-medium">
        {depth.toFixed(1)} cm
      </text>
      
      {/* Port dimensions for ported */}
      {type === 'ported' && portDiameter && portLength && (
        <text x={x + boxWidth - 22.5} y={y + boxHeight + 10} textAnchor="middle" className="fill-cyan-400 text-[10px] font-medium">
          ⌀{portDiameter.toFixed(0)}cm × {portLength.toFixed(1)}cm
        </text>
      )}
    </svg>
  );
}

export default function SubEnclosureDesignerPage() {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [fs, setFs] = useState(DRIVER_PRESETS[0].fs);
  const [qts, setQts] = useState(DRIVER_PRESETS[0].qts);
  const [vas, setVas] = useState(DRIVER_PRESETS[0].vas);
  const [tuningFreq, setTuningFreq] = useState(35);
  const [enclosureType, setEnclosureType] = useState<EnclosureType>('ported');

  const handlePresetChange = (index: number) => {
    setSelectedPreset(index);
    if (index > 0) {
      const preset = DRIVER_PRESETS[index];
      setFs(preset.fs);
      setQts(preset.qts);
      setVas(preset.vas);
    }
  };

  const results = useMemo(() => {
    if (enclosureType === 'sealed') {
      return calculateSealed(fs, qts, vas);
    }
    return calculatePorted(fs, qts, vas, tuningFreq);
  }, [fs, qts, vas, tuningFreq, enclosureType]);

  const inputClass =
    'h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all';

  return (
    <ToolLayout
      title="Subwoofer Enclosure Designer"
      description="Calculate optimal box volume and port tuning for DIY subwoofer builds using Thiele-Small parameters."
    >
      <section className="mb-8 rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white p-6 shadow-sm dark:border-zinc-700 dark:from-zinc-800 dark:to-zinc-900">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Driver Preset
              </label>
              <select
                value={selectedPreset}
                onChange={(e) => handlePresetChange(Number(e.target.value))}
                className={`${inputClass} w-full cursor-pointer`}
              >
                {DRIVER_PRESETS.map((preset, i) => (
                  <option key={preset.name} value={i}>
                    {preset.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white/50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Thiele-Small Parameters
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    Fs (Hz)
                  </label>
                  <input
                    type="number"
                    value={fs}
                    onChange={(e) => {
                      setFs(Number(e.target.value));
                      setSelectedPreset(0);
                    }}
                    min={10}
                    max={100}
                    step={0.1}
                    className={`${inputClass} w-full`}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    Qts
                  </label>
                  <input
                    type="number"
                    value={qts}
                    onChange={(e) => {
                      setQts(Number(e.target.value));
                      setSelectedPreset(0);
                    }}
                    min={0.1}
                    max={1.5}
                    step={0.01}
                    className={`${inputClass} w-full`}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    Vas (L)
                  </label>
                  <input
                    type="number"
                    value={vas}
                    onChange={(e) => {
                      setVas(Number(e.target.value));
                      setSelectedPreset(0);
                    }}
                    min={1}
                    max={1000}
                    step={1}
                    className={`${inputClass} w-full`}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Enclosure Type
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setEnclosureType('sealed')}
                  className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                    enclosureType === 'sealed'
                      ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400'
                      : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600'
                  }`}
                >
                  <span className="block text-lg mb-1">📦</span>
                  Sealed
                </button>
                <button
                  onClick={() => setEnclosureType('ported')}
                  className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                    enclosureType === 'ported'
                      ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400'
                      : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600'
                  }`}
                >
                  <span className="block text-lg mb-1">🔊</span>
                  Ported
                </button>
              </div>
            </div>

            {enclosureType === 'ported' && (
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Target Tuning Frequency (Hz)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    value={tuningFreq}
                    onChange={(e) => setTuningFreq(Number(e.target.value))}
                    min={20}
                    max={60}
                    step={1}
                    className="flex-1 accent-orange-500"
                  />
                  <input
                    type="number"
                    value={tuningFreq}
                    onChange={(e) => setTuningFreq(Number(e.target.value))}
                    min={20}
                    max={60}
                    className={`${inputClass} w-20 text-center`}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex-1 rounded-xl border border-zinc-200 bg-gradient-to-br from-zinc-900 to-black p-6 dark:border-zinc-600">
              <h3 className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-zinc-400">
                Calculated Enclosure
              </h3>
              
              <BoxDiagram
                type={enclosureType}
                dimensions={results.dimensions}
                portDiameter={results.portDiameter}
                portLength={results.portLength}
              />
              
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-zinc-800/50 p-3 text-center">
                  <div className="text-2xl font-bold text-white">
                    {results.boxVolumeLiters.toFixed(1)}
                    <span className="ml-1 text-sm font-normal text-zinc-400">L</span>
                  </div>
                  <div className="text-xs text-zinc-500">Box Volume</div>
                </div>
                <div className="rounded-lg bg-zinc-800/50 p-3 text-center">
                  <div className="text-2xl font-bold text-white">
                    {results.boxVolumeCuFt.toFixed(2)}
                    <span className="ml-1 text-sm font-normal text-zinc-400">ft³</span>
                  </div>
                  <div className="text-xs text-zinc-500">Box Volume</div>
                </div>
                <div className="rounded-lg bg-zinc-800/50 p-3 text-center">
                  <div className="text-2xl font-bold text-orange-400">
                    {results.f3.toFixed(1)}
                    <span className="ml-1 text-sm font-normal text-zinc-400">Hz</span>
                  </div>
                  <div className="text-xs text-zinc-500">F3 (-3dB Point)</div>
                </div>
                {enclosureType === 'ported' && results.portLength && (
                  <div className="rounded-lg bg-zinc-800/50 p-3 text-center">
                    <div className="text-2xl font-bold text-cyan-400">
                      {results.portLength.toFixed(1)}
                      <span className="ml-1 text-sm font-normal text-zinc-400">cm</span>
                    </div>
                    <div className="text-xs text-zinc-500">Port Length (⌀10cm)</div>
                  </div>
                )}
                {enclosureType === 'sealed' && (
                  <div className="rounded-lg bg-zinc-800/50 p-3 text-center">
                    <div className="text-2xl font-bold text-emerald-400">0.707</div>
                    <div className="text-xs text-zinc-500">Qtc (Butterworth)</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
          Understanding Thiele-Small Parameters
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-700/50">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/20 text-sm font-bold text-orange-600 dark:text-orange-400">
                Fs
              </span>
              <span className="font-medium text-zinc-900 dark:text-white">Resonant Frequency</span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              The frequency at which the driver naturally resonates in free air. Lower Fs generally means deeper bass extension. Measured in Hertz (Hz).
            </p>
          </div>
          <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-700/50">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/20 text-sm font-bold text-orange-600 dark:text-orange-400">
                Qts
              </span>
              <span className="font-medium text-zinc-900 dark:text-white">Total Q Factor</span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Represents the damping of the driver. Lower Qts (0.2-0.4) suits ported boxes, higher Qts (0.4-0.7) works well in sealed enclosures.
            </p>
          </div>
          <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-700/50">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/20 text-sm font-bold text-orange-600 dark:text-orange-400">
                Vas
              </span>
              <span className="font-medium text-zinc-900 dark:text-white">Equivalent Air Volume</span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              The volume of air that has the same compliance (springiness) as the driver&apos;s suspension. Larger Vas typically requires larger enclosures.
            </p>
          </div>
          <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-700/50">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/20 text-sm font-bold text-cyan-600 dark:text-cyan-400">
                F3
              </span>
              <span className="font-medium text-zinc-900 dark:text-white">-3dB Point</span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              The frequency where output drops 3dB below the reference level. This is the practical low-frequency limit of the system.
            </p>
          </div>
          <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-700/50">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                Fb
              </span>
              <span className="font-medium text-zinc-900 dark:text-white">Tuning Frequency</span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              For ported enclosures, this is the frequency at which the port resonates. Lower tuning extends bass but requires longer ports.
            </p>
          </div>
          <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-700/50">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20 text-sm font-bold text-purple-600 dark:text-purple-400">
                Qtc
              </span>
              <span className="font-medium text-zinc-900 dark:text-white">System Q</span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              The Q of the driver in the sealed box. 0.707 (Butterworth) gives maximally flat response. Higher values boost bass but reduce accuracy.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-zinc-100 p-4 dark:bg-zinc-700">
          <h4 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Calculation Formulas
          </h4>
          <div className="grid gap-4 font-mono text-sm sm:grid-cols-2">
            <div>
              <p className="mb-1 text-xs font-sans font-medium text-zinc-500 dark:text-zinc-400">Sealed Box Volume:</p>
              <p className="text-zinc-800 dark:text-zinc-200">Vb = Vas / ((Qtc/Qts)² - 1)</p>
            </div>
            <div>
              <p className="mb-1 text-xs font-sans font-medium text-zinc-500 dark:text-zinc-400">Sealed F3:</p>
              <p className="text-zinc-800 dark:text-zinc-200">F3 = Fs × √(Vas/Vb + 1)</p>
            </div>
            <div>
              <p className="mb-1 text-xs font-sans font-medium text-zinc-500 dark:text-zinc-400">Ported Box Volume:</p>
              <p className="text-zinc-800 dark:text-zinc-200">Vb ≈ 15 × Vas × Qts^3.3</p>
            </div>
            <div>
              <p className="mb-1 text-xs font-sans font-medium text-zinc-500 dark:text-zinc-400">Port Length:</p>
              <p className="text-zinc-800 dark:text-zinc-200">Lv = (23562.5×Dv²×N)/(Fb²×Vb) - 0.825×Dv</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/50 dark:bg-amber-900/20">
        <h4 className="mb-2 flex items-center gap-2 font-semibold text-amber-800 dark:text-amber-300">
          <span>💡</span> Design Tips
        </h4>
        <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-400">
          <li>• <strong>Sealed boxes</strong> are simpler to build and offer tighter, more accurate bass with better transient response.</li>
          <li>• <strong>Ported boxes</strong> are more efficient and extend lower, but require precise port tuning and are larger.</li>
          <li>• Add 10-15% to calculated volume to account for driver displacement and bracing.</li>
          <li>• Use 18-25mm MDF or plywood for enclosure walls. Brace internally for rigidity.</li>
          <li>• Round port edges or use flared ports to reduce turbulence noise at high volumes.</li>
        </ul>
      </section>
    </ToolLayout>
  );
}
