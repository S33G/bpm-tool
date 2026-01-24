import { ToolCard } from '@/components/home';

const TOOLS = [
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
];

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

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => (
          <ToolCard key={tool.href} {...tool} />
        ))}
      </section>
    </main>
  );
}
