'use client';

import { useMemo, useState } from 'react';
import { MidiStats as MidiStatsType } from '@/lib/midi';

interface MidiTimelineProps {
  stats: MidiStatsType;
}

export function MidiTimeline({ stats }: MidiTimelineProps) {
  const barOptions = [8, 16];
  const barWidth = 32;
  const rowHeight = 72;
  const noteHeight = 6;
  const [barsPerSection, setBarsPerSection] = useState(barOptions[0]);
  const totalBars = Math.max(1, stats.totalBars);
  const timelineWidth = totalBars * barWidth;
  const sectionWidth = barsPerSection * barWidth;

  const sections = useMemo(() => {
    const result: Array<{ start: number; end: number; width: number }> = [];
    for (let barIndex = 0; barIndex < totalBars; barIndex += barsPerSection) {
      const barsInSection = Math.min(barsPerSection, totalBars - barIndex);
      result.push({
        start: barIndex + 1,
        end: barIndex + barsInSection,
        width: barsInSection * barWidth,
      });
    }
    return result;
  }, [barsPerSection, barWidth, totalBars]);

  const backgroundImage = useMemo(() => {
    const barLine = `repeating-linear-gradient(to right, transparent 0, transparent ${barWidth - 1}px, var(--bar-line) ${barWidth - 1}px, var(--bar-line) ${barWidth}px)`;
    const sectionLine = `repeating-linear-gradient(to right, transparent 0, transparent ${sectionWidth - 1}px, var(--section-line) ${sectionWidth - 1}px, var(--section-line) ${sectionWidth}px)`;
    return `${barLine}, ${sectionLine}`;
  }, [barWidth, sectionWidth]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-zinc-500">{totalBars} bars total</div>
        <label className="flex items-center gap-2 text-xs font-medium text-zinc-500">
          Bars per section
          <select
            className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700 shadow-sm focus:border-blue-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
            value={barsPerSection}
            onChange={(event) => setBarsPerSection(Number(event.target.value))}
          >
            {barOptions.map((option) => (
              <option key={option} value={option}>
                {option} bars
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="rounded-lg border border-zinc-200 dark:border-zinc-700">
        <div className="flex">
          <div className="w-52 shrink-0 border-r border-zinc-200 dark:border-zinc-700">
            <div className="flex h-8 items-center px-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Track
            </div>
            {stats.trackSummaries.map((track, index) => (
              <div
                key={`${track.name}-${index}`}
                className="flex flex-col justify-center gap-1 border-b border-zinc-200 px-3 text-sm text-zinc-700 dark:border-zinc-700 dark:text-zinc-200"
                style={{ height: rowHeight }}
              >
                <div className="font-medium text-zinc-900 dark:text-white">{track.name}</div>
                <div className="text-xs text-zinc-500">
                  Ch {track.channel + 1} | {track.notes} notes
                </div>
              </div>
            ))}
          </div>

          <div className="flex-1 overflow-x-auto snap-x snap-mandatory">
            <div className="min-w-max">
              <div className="flex h-8 items-center border-b border-zinc-200 bg-zinc-50 text-xs text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900">
                {sections.map((section, index) => (
                  <div
                    key={`section-${section.start}-${index}`}
                    className="flex h-full items-center justify-center border-r border-zinc-200/70 text-[11px] uppercase tracking-wide dark:border-zinc-700/60 snap-start"
                    style={{ width: section.width }}
                  >
                    Bars {section.start}-{section.end}
                  </div>
                ))}
              </div>

              {stats.trackSummaries.map((track, index) => {
                let minMidi = Infinity;
                let maxMidi = -Infinity;
                track.noteEvents.forEach((note) => {
                  minMidi = Math.min(minMidi, note.midi);
                  maxMidi = Math.max(maxMidi, note.midi);
                });
                const hasNotes = Number.isFinite(minMidi) && Number.isFinite(maxMidi);
                const range = hasNotes ? Math.max(1, maxMidi - minMidi) : 1;

                return (
                  <div
                    key={`track-${track.name}-${index}`}
                    className="relative border-b border-zinc-200 bg-zinc-50 [--bar-line:rgba(0,0,0,0.08)] [--section-line:rgba(0,0,0,0.2)] dark:border-zinc-700 dark:bg-zinc-900 dark:[--bar-line:rgba(255,255,255,0.08)] dark:[--section-line:rgba(255,255,255,0.18)]"
                    style={{ width: timelineWidth, height: rowHeight, backgroundImage }}
                  >
                    {track.noteEvents.length === 0 ? (
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-zinc-400">
                        No notes
                      </div>
                    ) : (
                      track.noteEvents.map((note, noteIndex) => {
                        const left = Math.max(note.startBar * barWidth, 0);
                        const width = Math.max(note.durationBars * barWidth, 3);
                        const top = hasNotes
                          ? ((maxMidi - note.midi) / range) * (rowHeight - noteHeight)
                          : (rowHeight - noteHeight) / 2;
                        return (
                          <div
                            key={`note-${note.midi}-${noteIndex}`}
                            className="absolute rounded-sm bg-sky-500/70 shadow-sm dark:bg-sky-400/70"
                            style={{
                              left,
                              top,
                              width,
                              height: noteHeight,
                              opacity: Math.max(0.35, note.velocity),
                            }}
                          />
                        );
                      })
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
