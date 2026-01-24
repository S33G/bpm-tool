import { ToolCard } from '@/components/home';

const MUSIC_TOOLS = [
  {
    href: '/bpm',
    title: 'BPM Tool',
    description: 'Convert BPM to milliseconds for precise timing of delays, reverbs, and compressors.',
    color: 'blue' as const,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: '/chords',
    title: 'Chord Generator',
    description: 'Build and visualize chords with MIDI export. Select root, quality, and voicing.',
    color: 'purple' as const,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
  },
  {
    href: '/circle',
    title: 'Circle of Fifths',
    description: 'Explore key signatures, relative keys, and diatonic chords.',
    color: 'cyan' as const,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364 6.364l-1.414-1.414M6.05 6.05L4.636 4.636m12.728 0l-1.414 1.414M6.05 17.95l-1.414 1.414" />
      </svg>
    ),
  },
  {
    href: '/scales',
    title: 'Scale Explorer',
    description: 'Browse scales and modes. View intervals and highlight on the keyboard.',
    color: 'cyan' as const,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
  {
    href: '/keyboard',
    title: 'Keyboard Visualizer',
    description: 'Interactive 88-key piano visualization. Highlight chords, scales, and intervals.',
    color: 'green' as const,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
  {
    href: '/fretboard',
    title: 'Fretboard Visualizer',
    description: 'Highlight chords or scales across guitar, bass, ukulele, or banjo.',
    color: 'green' as const,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 4h14v16H5zM9 4v16M15 4v16" />
      </svg>
    ),
  },
  {
    href: '/pitch',
    title: 'Pitch Analyzer',
    description: 'Real-time pitch detection with tuner display and spectrum visualization.',
    color: 'orange' as const,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
  },
  {
    href: '/metronome',
    title: 'Metronome',
    description: 'Visual metronome with tap tempo, time signatures, and fullscreen flash mode.',
    color: 'pink' as const,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    href: '/rhythm',
    title: 'Rhythm Grid',
    description: 'Create step-based drum patterns and export MIDI.',
    color: 'blue' as const,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h4v4H4zM10 6h4v4h-4zM16 6h4v4h-4zM4 12h4v4H4zM10 12h4v4h-4zM16 12h4v4h-4z" />
      </svg>
    ),
  },
  {
    href: '/timer',
    title: 'Practice Timer',
    description: 'Interval-based timer for focused practice sessions.',
    color: 'orange' as const,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: '/keyfinder',
    title: 'Key Finder',
    description: 'Suggest likely keys from a set of notes or chords.',
    color: 'yellow' as const,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a4 4 0 11-8 0 4 4 0 018 0zM12 11v8m0 0l-3-3m3 3l3-3" />
      </svg>
    ),
  },
  {
    href: '/progression',
    title: 'Progression Planner',
    description: 'Build chord progressions from templates or roman numerals.',
    color: 'purple' as const,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h10" />
      </svg>
    ),
  },
  {
    href: '/midi',
    title: 'MIDI Analyzer',
    description: 'Inspect MIDI tempo, duration, tracks, and note density.',
    color: 'cyan' as const,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
      </svg>
    ),
  },
  {
    href: '/setlist',
    title: 'Setlist Builder',
    description: 'Organize songs with BPM, key, and notes. Export to PDF or JSON.',
    color: 'yellow' as const,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    href: '/timing/groove',
    title: 'Groove Quantizer',
    description: 'Swing grids and MIDI export for groove manipulation.',
    color: 'pink' as const,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
      </svg>
    ),
  },
];

const SOUND_TOOLS = [
  {
    href: '/sound/delay',
    title: 'Delay Calculator',
    description: 'Calculate speaker delay times for live sound alignment. Adjust for temperature.',
    color: 'teal' as const,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
      </svg>
    ),
  },
  {
    href: '/sound/room-modes',
    title: 'Room Mode Visualizer',
    description: '3D visualization of standing waves and acoustic treatment placement.',
    color: 'teal' as const,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    href: '/sound/impedance',
    title: 'Impedance Calculator',
    description: 'Check headphone/amp matching and speaker wiring configurations.',
    color: 'teal' as const,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    href: '/sound/limiter',
    title: 'Limiter Calculator',
    description: 'Calculate limiter thresholds to protect speakers from damage.',
    color: 'teal' as const,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

const GEEK_TOOLS = [
  {
    href: '/geeks/lpad',
    title: 'L-Pad Calculator',
    description: 'Calculate resistor values to attenuate drivers without changing impedance.',
    color: 'slate' as const,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
  },
  {
    href: '/geeks/sub-enclosure',
    title: 'Subwoofer Enclosure',
    description: 'Calculate box volume and port tuning from Thiele-Small parameters.',
    color: 'slate' as const,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    href: '/geeks/crossover',
    title: 'Crossover Designer',
    description: 'Design passive crossovers with component values and schematics.',
    color: 'slate' as const,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
  },
];

type ToolColor = 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'cyan' | 'yellow' | 'teal' | 'slate';

interface Tool {
  href: string;
  title: string;
  description: string;
  color: ToolColor;
  icon: React.ReactNode;
}

function CategorySection({ title, description, tools }: { 
  title: string; 
  description: string; 
  tools: Tool[];
}) {
  return (
    <section className="mb-14">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">{title}</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.href} {...tool} />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="mb-14 text-center fade-up">
        <h1 className="mb-4 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
          GrooveLab
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-300">
          Musician utilities for timing, groove, and harmony.
          No synths—just analysis, visualization, and reference tools.
        </p>
      </section>

      <CategorySection 
        title="Music & Timing" 
        description="Theory, visualization, and timing tools for musicians and producers."
        tools={MUSIC_TOOLS} 
      />

      <CategorySection 
        title="Sound Tools" 
        description="Live sound, acoustics, and audio engineering utilities."
        tools={SOUND_TOOLS} 
      />

      <CategorySection 
        title="Geeks" 
        description="DIY audio electronics and speaker building calculators."
        tools={GEEK_TOOLS} 
      />
    </main>
  );
}
