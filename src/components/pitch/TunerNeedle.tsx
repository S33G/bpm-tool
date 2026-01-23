'use client';

interface TunerNeedleProps {
  cents: number;
}

export function TunerNeedle({ cents }: TunerNeedleProps) {
  const clampedCents = Math.max(-50, Math.min(50, cents));
  const rotation = (clampedCents / 50) * 45;
  
  const getColor = () => {
    const absCents = Math.abs(cents);
    if (absCents < 5) return '#22c55e';
    if (absCents < 15) return '#eab308';
    return '#ef4444';
  };
  
  return (
    <div className="relative mx-auto h-32 w-64">
      <svg viewBox="0 0 200 100" className="h-full w-full">
        <path
          d="M 10 90 A 90 90 0 0 1 190 90"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-zinc-200 dark:text-zinc-700"
        />
        
        {[-50, -25, 0, 25, 50].map((tick) => {
          const angle = ((tick / 50) * 45 - 90) * (Math.PI / 180);
          const x1 = 100 + 75 * Math.cos(angle);
          const y1 = 90 + 75 * Math.sin(angle);
          const x2 = 100 + 85 * Math.cos(angle);
          const y2 = 90 + 85 * Math.sin(angle);
          return (
            <g key={tick}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeWidth="2"
                className="text-zinc-400 dark:text-zinc-500"
              />
              <text
                x={100 + 65 * Math.cos(angle)}
                y={90 + 65 * Math.sin(angle)}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="10"
                className="fill-zinc-500"
              >
                {tick}
              </text>
            </g>
          );
        })}
        
        <line
          x1="100"
          y1="90"
          x2="100"
          y2="20"
          stroke={getColor()}
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${rotation}, 100, 90)`}
          style={{ transition: 'transform 0.1s ease-out' }}
        />
        
        <circle cx="100" cy="90" r="6" fill={getColor()} />
      </svg>
    </div>
  );
}
