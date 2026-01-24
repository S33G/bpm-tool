'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';

const NAV_ITEMS = [
  { href: '/bpm', label: 'BPM Tool', category: 'Timing' },
  { href: '/metronome', label: 'Metronome', category: 'Timing' },
  { href: '/rhythm', label: 'Rhythm', category: 'Timing' },
  { href: '/timing/groove', label: 'Groove Quantizer', category: 'Timing' },
  { href: '/timer', label: 'Timer', category: 'Timing' },
  { href: '/chords', label: 'Chords', category: 'Chords & Scales' },
  { href: '/scales', label: 'Scales', category: 'Chords & Scales' },
  { href: '/circle', label: 'Circle', category: 'Chords & Scales' },
  { href: '/progression', label: 'Progression', category: 'Chords & Scales' },
  { href: '/keyboard', label: 'Keyboard', category: 'Keyboard & Fretboard' },
  { href: '/fretboard', label: 'Fretboard', category: 'Keyboard & Fretboard' },
  { href: '/pitch', label: 'Pitch', category: 'Keyboard & Fretboard' },
  { href: '/keyfinder', label: 'Key Finder', category: 'Keyboard & Fretboard' },
  { href: '/setlist', label: 'Setlist', category: 'Utility' },
  { href: '/midi', label: 'MIDI', category: 'Utility' },
  { href: '/geeks/crossover', label: 'Crossover', category: 'Geeks' },
  { href: '/geeks/lpad', label: 'L-Pad', category: 'Geeks' },
  { href: '/geeks/sub-enclosure', label: 'Sub-Enclosure', category: 'Geeks' },
  { href: '/sound/delay', label: 'Delay', category: 'Sound Tools' },
  { href: '/sound/impedance', label: 'Impedance', category: 'Sound Tools' },
  { href: '/sound/limiter', label: 'Limiter', category: 'Sound Tools' },
  { href: '/sound/room-modes', label: 'Room Modes', category: 'Sound Tools' },
] as const;

export function AppHeader() {
  const pathname = usePathname();
  const categories = [...new Set(NAV_ITEMS.map((item) => item.category))];
  const dropdownRefs = useRef<HTMLDetailsElement[]>([]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-white/70 shadow-sm backdrop-blur-xl fade-up dark:border-white/10 dark:bg-zinc-950/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-xl font-semibold tracking-tight text-zinc-900 transition-all hover:-translate-y-0.5 hover:text-blue-600 dark:text-white dark:hover:text-blue-300"
            >
              GrooveLab
            </Link>
            <span className="inline-flex items-center rounded-full bg-amber-100/80 px-2.5 py-0.5 text-xs font-semibold text-amber-800 ring-1 ring-amber-200/50 dark:bg-amber-900/30 dark:text-amber-300 dark:ring-amber-800/50">
              Beta
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-3">
            {categories.map((category, categoryIndex) => {
              const items = NAV_ITEMS.filter((item) => item.category === category);
              const isCategoryActive = items.some((item) => item.href === pathname);
              return (
                <details
                  key={category}
                  className="group relative"
                  ref={(element) => {
                    if (element) {
                      dropdownRefs.current[categoryIndex] = element;
                    }
                  }}
                  onToggle={(event) => {
                    const target = event.currentTarget;
                    if (!target.open) {
                      return;
                    }
                    dropdownRefs.current.forEach((detail, detailIndex) => {
                      if (detail && detailIndex !== categoryIndex) {
                        detail.open = false;
                      }
                    });
                  }}
                >
                  <summary
                    className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 list-none hover:-translate-y-0.5 ${
                      isCategoryActive
                        ? 'bg-blue-100 text-blue-700 shadow-sm dark:bg-blue-900/30 dark:text-blue-300'
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/80 dark:hover:text-white'
                    }`}
                  >
                    {category}
                    <svg
                      className="h-4 w-4 transition-transform group-open:rotate-180"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </summary>
                  <div className="absolute left-0 top-full mt-2 w-56 origin-top-left rounded-xl border border-white/70 bg-white/90 p-2 shadow-xl shadow-zinc-900/10 opacity-0 scale-95 translate-y-2 transition duration-200 ease-out group-open:opacity-100 group-open:scale-100 group-open:translate-y-0 motion-reduce:transition-none dark:border-white/10 dark:bg-zinc-900/90 dark:shadow-black/40">
                    {items.map(({ href, label }) => {
                      const isActive = pathname === href;
                      return (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => {
                            const dropdown = dropdownRefs.current[categoryIndex];
                            if (dropdown) {
                              dropdown.open = false;
                            }
                          }}
                          className={`block rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                            isActive
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 hover:translate-x-0.5 dark:text-zinc-300 dark:hover:bg-zinc-800/80 dark:hover:text-white'
                          }`}
                        >
                          {label}
                        </Link>
                      );
                    })}
                  </div>
                </details>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <MobileNav pathname={pathname} />
        </div>
      </div>
    </header>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  return (
    <div className="md:hidden">
      <details className="group relative">
        <summary className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-white/80 text-zinc-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white dark:bg-zinc-800/80 dark:text-zinc-200 dark:hover:bg-zinc-800 list-none">
          <svg className="h-5 w-5 group-open:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg className="h-5 w-5 hidden group-open:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </summary>
        <div className="absolute right-0 top-full mt-2 w-60 origin-top-right rounded-xl border border-white/70 bg-white/90 p-3 shadow-xl shadow-zinc-900/10 opacity-0 scale-95 translate-y-2 transition duration-200 ease-out group-open:opacity-100 group-open:scale-100 group-open:translate-y-0 motion-reduce:transition-none dark:border-white/10 dark:bg-zinc-900/90 dark:shadow-black/40">
          {(() => {
            const categories = [...new Set(NAV_ITEMS.map(item => item.category))];
            return categories.map((category) => (
              <div key={category} className="mb-3 last:mb-0">
                <div className="px-2 py-1 text-xs font-semibold text-zinc-500 uppercase tracking-wide dark:text-zinc-400">
                  {category}
                </div>
                {NAV_ITEMS.filter(item => item.category === category).map(({ href, label }) => {
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white'
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
            ));
          })()}
        </div>
      </details>
    </div>
  );
}
