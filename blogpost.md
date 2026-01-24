# GrooveLab: rebranding a BPM tool into a full music utility suite

February 2026

I built BPM Tool because I was tired of pausing a session to do tempo math. It started as a fast, single-screen utility. Then I kept adding the things I always reach for: swing grids, groove playback, chord and scale helpers, and a setlist page. At that point, the name stopped fitting.

GrooveLab is the rebrand and the reset: same core idea, wider scope.

## What it is

GrooveLab is a collection of musician utilities for timing, groove, and harmony. It’s still the “what is a dotted eighth at 128 BPM?” tool, but now it also covers:

- Groove quantization with swing grids and MIDI export
- Rhythm grid, metronome, and practice timer
- Chords, scales, circle of fifths, progression planner
- Keyboard and fretboard visualizers
- Pitch and MIDI analyzers
- Setlist builder for gig prep

## Why the rebrand

“BPM Tool” worked when the app was basically a calculator. Once the toolset expanded into harmony, visualizers, and organization, the name undersold it. I wanted a name that signaled “lab” — a place to poke around timing, groove, and theory — without feeling like a DAW or a plugin suite.

The rebrand also forced a cleanup pass: metadata, copy, navigation, and storage keys all had to be aligned so the app felt coherent again.

## How it works (and what was tricky)

### Swing math that stays musical

Swing looks simple but it’s easy to make the feel drift. I keep the total duration fixed and shift the off-beat:

```ts
const swing = Math.max(50, Math.min(75, swingPercent)) / 100;
const ratio = swing / (1 - swing);
const pairDuration = quarterNote;
const onBeatDuration = (pairDuration * ratio) / (1 + ratio);
const offBeatDuration = pairDuration - onBeatDuration;
```

This keeps the groove tight while letting the swing range from straight to triplet feel.

### Navigation that scales

Once the app passed a handful of tools, a flat nav was noisy. The fix was to group by category and collapse into dropdowns:

```tsx
const categories = [...new Set(NAV_ITEMS.map((item) => item.category))];
return categories.map((category) => (
  <details key={category}>
    <summary>{category}</summary>
    {NAV_ITEMS.filter((item) => item.category === category).map((item) => (
      <Link key={item.href} href={item.href}>{item.label}</Link>
    ))}
  </details>
));
```

It’s simple, but it made the header usable again.

### Rebrand without breaking user data

Renaming the app meant local storage keys had to change. I picked a clean new namespace:

```ts
export const STORAGE_KEYS = {
  BOOKMARKS: 'groovelab-bookmarks',
  THEME: 'groovelab-theme',
  LAST_BPM: 'groovelab-last-bpm',
  SETLISTS: 'groovelab-setlists',
} as const;
```

This resets existing saved data, which is acceptable in a small personal tool, but it’s the kind of detail that matters once people use it regularly.

### App Router and page boundaries

Splitting tools into dedicated pages kept load times clean, but meant deciding what lives where. Groove Quantizer, for example, used to sit inside the BPM tool; it now lives under a Timing route so the BPM page stays focused.

## What I learned

Scope creep is real, but sometimes it’s also the product. The challenge is giving that growth a structure so it still feels intentional. Rebranding to GrooveLab wasn’t just a name change. It was a chance to make the whole toolset feel like a single system again.

The goal stays the same: translate musical intent into usable numbers, visuals, and files — fast enough to keep the creative flow moving.
