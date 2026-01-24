'use client';

interface SpectrumVisualizerProps {
  spectrum: Float32Array | null;
}

export function SpectrumVisualizer({ spectrum }: SpectrumVisualizerProps) {
  if (!spectrum) {
    return (
      <div className="text-center text-sm text-zinc-400">
        No spectrum data yet
      </div>
    );
  }

  const bars = 32;
  const step = Math.floor(spectrum.length / bars);
  const values = Array.from({ length: bars }, (_, i) => {
    const value = spectrum[i * step] || -120;
    const normalized = Math.min(1, Math.max(0, (value + 120) / 120));
    return normalized;
  });

  return (
    <div className="flex h-32 items-end gap-1">
      {values.map((value, index) => (
        <div
          key={index}
          className="flex-1 rounded-sm bg-blue-500"
          style={{ height: `${Math.max(4, value * 100)}%`, opacity: 0.4 + value * 0.6 }}
        />
      ))}
    </div>
  );
}
