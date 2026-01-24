'use client';

import { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/layout';

const HEADPHONE_PRESETS = [
  { name: 'HD650', impedance: 300, sensitivity: 103, unit: 'dB/mW' as const },
  { name: 'DT990', impedance: 250, sensitivity: 96, unit: 'dB/mW' as const },
  { name: 'Sundara', impedance: 37, sensitivity: 94, unit: 'dB/mW' as const },
  { name: 'LCD-2', impedance: 70, sensitivity: 101, unit: 'dB/mW' as const },
];

const AMP_PRESETS = [
  { name: 'JDS Atom', outputImpedance: 1, power: 1000, load: 32 },
  { name: 'Schiit Magni', outputImpedance: 0.3, power: 410, load: 32 },
  { name: 'THX 789', outputImpedance: 1, power: 6000, load: 32 },
];

const SPEAKER_IMPEDANCES = [4, 8, 16];
const SPEAKER_COUNTS = [2, 4, 8];
const TOPOLOGIES = ['Series', 'Parallel', 'Series-Parallel'] as const;

type SensitivityUnit = 'dB/mW' | 'dB/V';
type Topology = typeof TOPOLOGIES[number];

function convertSensitivity(value: number, fromUnit: SensitivityUnit, impedance: number): number {
  if (fromUnit === 'dB/mW') {
    // dB/V = dB/mW - 10 × log10(Impedance/1000)
    return value - 10 * Math.log10(impedance / 1000);
  } else {
    // dB/mW = dB/V + 10 × log10(Impedance/1000)
    return value + 10 * Math.log10(impedance / 1000);
  }
}

function calculateDampingFactor(loadImpedance: number, sourceImpedance: number): number {
  if (sourceImpedance === 0) return Infinity;
  return loadImpedance / sourceImpedance;
}

function calculatePeakSPL(sensitivityDbMw: number, powerMw: number): number {
  return sensitivityDbMw + 10 * Math.log10(powerMw);
}

function calculateSpeakerImpedance(
  speakerZ: number,
  count: number,
  topology: Topology
): number {
  if (count === 1) return speakerZ;
  
  switch (topology) {
    case 'Series':
      return speakerZ * count;
    case 'Parallel':
      return speakerZ / count;
    case 'Series-Parallel':
      // For series-parallel, we assume pairs in series, then parallel
      // e.g., 4 speakers: 2 pairs in series (2Z each), then parallel = Z
      // e.g., 8 speakers: 4 pairs in series (2Z each), then parallel = Z/2
      const pairsInSeries = Math.floor(count / 2);
      const seriesZ = speakerZ * 2;
      return seriesZ / pairsInSeries;
    default:
      return speakerZ;
  }
}

function getDampingColor(df: number): { bg: string; text: string; label: string } {
  if (df >= 8) return { bg: 'bg-emerald-500', text: 'text-emerald-500', label: 'Excellent' };
  if (df >= 2.5) return { bg: 'bg-amber-500', text: 'text-amber-500', label: 'Acceptable' };
  return { bg: 'bg-red-500', text: 'text-red-500', label: 'Poor' };
}

function getVerdict(df: number, peakSpl: number): { color: string; text: string; icon: string } {
  const dfOk = df >= 2.5;
  const splOk = peakSpl >= 110;
  
  if (dfOk && splOk) {
    return { color: 'bg-emerald-500', text: 'Yes! Great match', icon: '✓' };
  } else if (dfOk || splOk) {
    return { color: 'bg-amber-500', text: 'Maybe - Check specs', icon: '~' };
  }
  return { color: 'bg-red-500', text: 'Not recommended', icon: '✗' };
}

function SpeakerDiagram({ count, topology, impedance }: { count: number; topology: Topology; impedance: number }) {
  const totalZ = calculateSpeakerImpedance(impedance, count, topology);
  
  if (topology === 'Series') {
    const speakers = Array.from({ length: count }, (_, i) => i);
    const width = 60 + count * 80;
    return (
      <svg viewBox={`0 0 ${width} 120`} className="w-full max-w-lg mx-auto" style={{ maxHeight: '140px' }}>
        {/* Input line */}
        <line x1="10" y1="60" x2="40" y2="60" stroke="currentColor" strokeWidth="2" className="text-zinc-400" />
        <circle cx="10" cy="60" r="4" fill="currentColor" className="text-amber-500" />
        <text x="10" y="45" textAnchor="middle" className="text-xs fill-zinc-500">+</text>
        
        {/* Speakers in series */}
        {speakers.map((_, i) => (
          <g key={i} transform={`translate(${40 + i * 80}, 0)`}>
            {/* Connection line */}
            {i > 0 && <line x1="-40" y1="60" x2="0" y2="60" stroke="currentColor" strokeWidth="2" className="text-zinc-400" />}
            {/* Speaker symbol */}
            <rect x="0" y="45" width="40" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500" />
            <text x="20" y="65" textAnchor="middle" className="text-xs fill-zinc-600 dark:fill-zinc-300">{impedance}Ω</text>
            {/* Output line */}
            <line x1="40" y1="60" x2="80" y2="60" stroke="currentColor" strokeWidth="2" className="text-zinc-400" />
          </g>
        ))}
        
        {/* Output terminal */}
        <circle cx={width - 10} cy="60" r="4" fill="currentColor" className="text-zinc-500" />
        <text x={width - 10} y="45" textAnchor="middle" className="text-xs fill-zinc-500">-</text>
        
        {/* Total impedance label */}
        <text x={width / 2} y="105" textAnchor="middle" className="text-sm font-medium fill-zinc-700 dark:fill-zinc-200">
          Total: {totalZ.toFixed(1)}Ω
        </text>
      </svg>
    );
  }
  
  if (topology === 'Parallel') {
    const speakers = Array.from({ length: count }, (_, i) => i);
    const height = 40 + count * 50;
    return (
      <svg viewBox={`0 0 200 ${height}`} className="w-full max-w-xs mx-auto" style={{ maxHeight: '220px' }}>
        {/* Input line */}
        <line x1="10" y1={height / 2} x2="40" y2={height / 2} stroke="currentColor" strokeWidth="2" className="text-zinc-400" />
        <circle cx="10" cy={height / 2} r="4" fill="currentColor" className="text-amber-500" />
        <text x="10" y={height / 2 - 15} textAnchor="middle" className="text-xs fill-zinc-500">+</text>
        
        {/* Vertical bus bars */}
        <line x1="40" y1="30" x2="40" y2={height - 30} stroke="currentColor" strokeWidth="2" className="text-zinc-400" />
        <line x1="160" y1="30" x2="160" y2={height - 30} stroke="currentColor" strokeWidth="2" className="text-zinc-400" />
        
        {/* Speakers in parallel */}
        {speakers.map((_, i) => {
          const y = 30 + i * 50 + 25;
          return (
            <g key={i}>
              <line x1="40" y1={y} x2="60" y2={y} stroke="currentColor" strokeWidth="2" className="text-zinc-400" />
              <rect x="60" y={y - 15} width="80" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500" />
              <text x="100" y={y + 5} textAnchor="middle" className="text-xs fill-zinc-600 dark:fill-zinc-300">{impedance}Ω</text>
              <line x1="140" y1={y} x2="160" y2={y} stroke="currentColor" strokeWidth="2" className="text-zinc-400" />
            </g>
          );
        })}
        
        {/* Output line */}
        <line x1="160" y1={height / 2} x2="190" y2={height / 2} stroke="currentColor" strokeWidth="2" className="text-zinc-400" />
        <circle cx="190" cy={height / 2} r="4" fill="currentColor" className="text-zinc-500" />
        <text x="190" y={height / 2 - 15} textAnchor="middle" className="text-xs fill-zinc-500">-</text>
      </svg>
    );
  }
  
  const pairs = Math.floor(count / 2);
  const pairArray = Array.from({ length: pairs }, (_, i) => i);
  const height = 40 + pairs * 70;
  
  return (
    <svg viewBox={`0 0 280 ${height}`} className="w-full max-w-md mx-auto" style={{ maxHeight: '280px' }}>
      {/* Input line */}
      <line x1="10" y1={height / 2} x2="40" y2={height / 2} stroke="currentColor" strokeWidth="2" className="text-zinc-400" />
      <circle cx="10" cy={height / 2} r="4" fill="currentColor" className="text-amber-500" />
      <text x="10" y={height / 2 - 15} textAnchor="middle" className="text-xs fill-zinc-500">+</text>
      
      {/* Vertical bus bars */}
      <line x1="40" y1="30" x2="40" y2={height - 30} stroke="currentColor" strokeWidth="2" className="text-zinc-400" />
      <line x1="240" y1="30" x2="240" y2={height - 30} stroke="currentColor" strokeWidth="2" className="text-zinc-400" />
      
      {/* Series pairs in parallel */}
      {pairArray.map((_, i) => {
        const y = 30 + i * 70 + 35;
        return (
          <g key={i}>
            <line x1="40" y1={y} x2="60" y2={y} stroke="currentColor" strokeWidth="2" className="text-zinc-400" />
            {/* First speaker */}
            <rect x="60" y={y - 15} width="60" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500" />
            <text x="90" y={y + 5} textAnchor="middle" className="text-xs fill-zinc-600 dark:fill-zinc-300">{impedance}Ω</text>
            {/* Connection */}
            <line x1="120" y1={y} x2="140" y2={y} stroke="currentColor" strokeWidth="2" className="text-zinc-400" />
            {/* Second speaker */}
            <rect x="140" y={y - 15} width="60" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500" />
            <text x="170" y={y + 5} textAnchor="middle" className="text-xs fill-zinc-600 dark:fill-zinc-300">{impedance}Ω</text>
            <line x1="200" y1={y} x2="240" y2={y} stroke="currentColor" strokeWidth="2" className="text-zinc-400" />
          </g>
        );
      })}
      
      {/* Output line */}
      <line x1="240" y1={height / 2} x2="270" y2={height / 2} stroke="currentColor" strokeWidth="2" className="text-zinc-400" />
      <circle cx="270" cy={height / 2} r="4" fill="currentColor" className="text-zinc-500" />
      <text x="270" y={height / 2 - 15} textAnchor="middle" className="text-xs fill-zinc-500">-</text>
    </svg>
  );
}

export default function ImpedanceCalculatorPage() {
  const [mode, setMode] = useState<'headphone' | 'speaker'>('headphone');
  
  const [headphoneImpedance, setHeadphoneImpedance] = useState(300);
  const [sensitivity, setSensitivity] = useState(103);
  const [sensitivityUnit, setSensitivityUnit] = useState<SensitivityUnit>('dB/mW');
  const [ampOutputImpedance, setAmpOutputImpedance] = useState(1);
  const [ampPower, setAmpPower] = useState(1000);
  const [ampPowerLoad, setAmpPowerLoad] = useState(32);
  
  const [speakerImpedance, setSpeakerImpedance] = useState(8);
  const [speakerCount, setSpeakerCount] = useState(2);
  const [topology, setTopology] = useState<Topology>('Series');
  
  const headphoneCalcs = useMemo(() => {
    const sensitivityDbMw = sensitivityUnit === 'dB/mW' 
      ? sensitivity 
      : convertSensitivity(sensitivity, 'dB/V', headphoneImpedance);
    
    const dampingFactor = calculateDampingFactor(headphoneImpedance, ampOutputImpedance);
    
    const scaledPower = ampPower * (ampPowerLoad / headphoneImpedance);
    const peakSpl = calculatePeakSPL(sensitivityDbMw, Math.max(scaledPower, 0.1));
    
    return {
      dampingFactor,
      dampingColor: getDampingColor(dampingFactor),
      peakSpl,
      verdict: getVerdict(dampingFactor, peakSpl),
    };
  }, [headphoneImpedance, sensitivity, sensitivityUnit, ampOutputImpedance, ampPower, ampPowerLoad]);
  
  const speakerCalcs = useMemo(() => {
    const totalImpedance = calculateSpeakerImpedance(speakerImpedance, speakerCount, topology);
    const isSafe = totalImpedance >= 2;
    
    return {
      totalImpedance,
      isSafe,
    };
  }, [speakerImpedance, speakerCount, topology]);
  
  const handleHeadphonePreset = (preset: typeof HEADPHONE_PRESETS[0]) => {
    setHeadphoneImpedance(preset.impedance);
    setSensitivity(preset.sensitivity);
    setSensitivityUnit(preset.unit);
  };
  
  const handleAmpPreset = (preset: typeof AMP_PRESETS[0]) => {
    setAmpOutputImpedance(preset.outputImpedance);
    setAmpPower(preset.power);
    setAmpPowerLoad(preset.load);
  };
  
  const toggleSensitivityUnit = () => {
    const newUnit = sensitivityUnit === 'dB/mW' ? 'dB/V' : 'dB/mW';
    const converted = convertSensitivity(sensitivity, sensitivityUnit, headphoneImpedance);
    setSensitivity(Math.round(converted * 10) / 10);
    setSensitivityUnit(newUnit);
  };
  
  const inputClass = "h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500";
  const selectClass = "h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer";
  
  return (
    <ToolLayout
      title="Impedance Calculator"
      description="Match headphones to amps and calculate speaker wiring configurations"
    >
      <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('headphone')}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              mode === 'headphone'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              Headphone Matcher
            </span>
          </button>
          <button
            onClick={() => setMode('speaker')}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              mode === 'speaker'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              Speaker Wiring Wizard
            </span>
          </button>
        </div>
      </section>
      
      {mode === 'headphone' && (
        <div className="space-y-6">
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">1</span>
              Headphone
            </h3>
            
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Preset
              </label>
              <select
                onChange={(e) => {
                  const preset = HEADPHONE_PRESETS.find(p => p.name === e.target.value);
                  if (preset) handleHeadphonePreset(preset);
                }}
                className={`${selectClass} w-full`}
                defaultValue=""
              >
                <option value="" disabled>Select a headphone...</option>
                {HEADPHONE_PRESETS.map(preset => (
                  <option key={preset.name} value={preset.name}>
                    {preset.name} ({preset.impedance}Ω, {preset.sensitivity} {preset.unit})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Impedance (Ω)
                </label>
                <input
                  type="number"
                  min={1}
                  max={1000}
                  value={headphoneImpedance}
                  onChange={(e) => setHeadphoneImpedance(Math.max(1, parseInt(e.target.value) || 1))}
                  className={`${inputClass} w-full`}
                />
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Sensitivity
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={70}
                    max={130}
                    step={0.1}
                    value={sensitivity}
                    onChange={(e) => setSensitivity(parseFloat(e.target.value) || 100)}
                    className={`${inputClass} flex-1`}
                  />
                  <button
                    onClick={toggleSensitivityUnit}
                    className="rounded-lg border border-zinc-300 bg-zinc-50 px-3 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                  >
                    {sensitivityUnit}
                  </button>
                </div>
              </div>
            </div>
          </section>
          
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">2</span>
              Amplifier
            </h3>
            
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Preset
              </label>
              <select
                onChange={(e) => {
                  const preset = AMP_PRESETS.find(p => p.name === e.target.value);
                  if (preset) handleAmpPreset(preset);
                }}
                className={`${selectClass} w-full`}
                defaultValue=""
              >
                <option value="" disabled>Select an amp...</option>
                {AMP_PRESETS.map(preset => (
                  <option key={preset.name} value={preset.name}>
                    {preset.name} ({preset.outputImpedance}Ω output, {preset.power}mW @ {preset.load}Ω)
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Output Impedance (Ω)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  value={ampOutputImpedance}
                  onChange={(e) => setAmpOutputImpedance(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={`${inputClass} w-full`}
                />
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Power (mW)
                </label>
                <input
                  type="number"
                  min={1}
                  max={10000}
                  value={ampPower}
                  onChange={(e) => setAmpPower(Math.max(1, parseInt(e.target.value) || 1))}
                  className={`${inputClass} w-full`}
                />
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  @ Load (Ω)
                </label>
                <input
                  type="number"
                  min={1}
                  max={600}
                  value={ampPowerLoad}
                  onChange={(e) => setAmpPowerLoad(Math.max(1, parseInt(e.target.value) || 1))}
                  className={`${inputClass} w-full`}
                />
              </div>
            </div>
          </section>
          
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">3</span>
              Results
            </h3>
            
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-600 dark:bg-zinc-700/50">
                <div className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">Damping Factor</div>
                <div className="flex items-center gap-3">
                  <span className={`h-3 w-3 rounded-full ${headphoneCalcs.dampingColor.bg}`}></span>
                  <span className="text-2xl font-bold text-zinc-900 dark:text-white">
                    {headphoneCalcs.dampingFactor === Infinity ? '∞' : headphoneCalcs.dampingFactor.toFixed(1)}
                  </span>
                </div>
                <div className={`mt-1 text-sm ${headphoneCalcs.dampingColor.text}`}>
                  {headphoneCalcs.dampingColor.label}
                </div>
              </div>
              
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-600 dark:bg-zinc-700/50">
                <div className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">Peak SPL</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-zinc-900 dark:text-white">
                    {headphoneCalcs.peakSpl.toFixed(1)}
                  </span>
                  <span className="text-sm text-zinc-500">dB</span>
                </div>
                <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {headphoneCalcs.peakSpl >= 115 ? 'Plenty of headroom' : headphoneCalcs.peakSpl >= 110 ? 'Adequate' : 'May lack power'}
                </div>
              </div>
              
              <div className={`rounded-xl p-4 ${headphoneCalcs.verdict.color}`}>
                <div className="mb-2 text-sm font-medium text-white/80">Will it drive?</div>
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-lg font-bold text-white">
                    {headphoneCalcs.verdict.icon}
                  </span>
                  <span className="text-lg font-bold text-white">
                    {headphoneCalcs.verdict.text}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              <strong>Tip:</strong> Damping factor ≥8 is ideal for tight bass control. Peak SPL ≥110dB ensures enough headroom for dynamic music.
            </div>
          </section>
        </div>
      )}
      
      {mode === 'speaker' && (
        <div className="space-y-6">
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">1</span>
              Configuration
            </h3>
            
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Speaker Impedance
                </label>
                <div className="flex gap-2">
                  {SPEAKER_IMPEDANCES.map(z => (
                    <button
                      key={z}
                      onClick={() => setSpeakerImpedance(z)}
                      className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                        speakerImpedance === z
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-zinc-300 bg-white text-zinc-700 hover:border-blue-300 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {z}Ω
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Number of Speakers
                </label>
                <div className="flex gap-2">
                  {SPEAKER_COUNTS.map(n => (
                    <button
                      key={n}
                      onClick={() => setSpeakerCount(n)}
                      className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                        speakerCount === n
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-zinc-300 bg-white text-zinc-700 hover:border-blue-300 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Wiring Topology
                </label>
                <select
                  value={topology}
                  onChange={(e) => setTopology(e.target.value as Topology)}
                  className={`${selectClass} w-full`}
                >
                  {TOPOLOGIES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>
          
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">2</span>
              Circuit Diagram
            </h3>
            
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-600 dark:bg-zinc-700/50">
              <SpeakerDiagram 
                count={speakerCount} 
                topology={topology} 
                impedance={speakerImpedance} 
              />
            </div>
          </section>
          
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">3</span>
              Results
            </h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className={`rounded-xl border p-4 ${
                speakerCalcs.isSafe 
                  ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/30' 
                  : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30'
              }`}>
                <div className={`mb-2 text-sm font-medium ${
                  speakerCalcs.isSafe ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  Total System Load
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-bold ${
                    speakerCalcs.isSafe ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'
                  }`}>
                    {speakerCalcs.totalImpedance.toFixed(1)}
                  </span>
                  <span className={`text-lg ${
                    speakerCalcs.isSafe ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                  }`}>Ω</span>
                </div>
              </div>
              
              <div className={`rounded-xl p-4 ${
                speakerCalcs.isSafe ? 'bg-emerald-500' : 'bg-red-500'
              }`}>
                <div className="mb-2 text-sm font-medium text-white/80">Safety Status</div>
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-lg font-bold text-white">
                    {speakerCalcs.isSafe ? '✓' : '!'}
                  </span>
                  <span className="text-lg font-bold text-white">
                    {speakerCalcs.isSafe ? 'Safe for most amps' : 'Dangerously low!'}
                  </span>
                </div>
              </div>
            </div>
            
            {!speakerCalcs.isSafe && (
              <div className="mt-4 rounded-lg bg-red-100 p-4 text-red-800 dark:bg-red-900/50 dark:text-red-200">
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <strong className="font-semibold">Warning:</strong> Impedance below 2Ω can damage most amplifiers. 
                    Consider using a different wiring topology or fewer speakers.
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              <strong>Tip:</strong> Most amplifiers are rated for 4Ω minimum. Check your amp&apos;s specifications before wiring speakers below 4Ω.
            </div>
          </section>
        </div>
      )}
    </ToolLayout>
  );
}
