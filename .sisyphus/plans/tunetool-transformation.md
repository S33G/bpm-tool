# tunetool Transformation Plan

> Transform bpm-tool into **tunetool**: a musician-focused utility suite with BPM Tool as a child section.

## Executive Summary

**Goal**: Rebrand and expand the existing BPM Tool into a multi-tool musician utility called **tunetool**.

**Constraints**:
- No synths / tone generators
- Focus on analysis, visualization, reference, and organization
- Simple playback allowed (reference tones, metronome clicks)

**Current State**:
- Next.js 14 (App Router) + React 18 + Tailwind CSS
- Tone.js for audio playback + @tonejs/midi for MIDI export
- Single-page app at root (`/`)
- Existing: BPM calculator, tap tempo, delay calculator, groove quantizer, MIDI export
- No test infrastructure

---

## Information Architecture

```
tunetool/
  Home (/)           - Tool tiles + quick actions
  BPM Tool (/bpm)    - Existing functionality (migrated)
  Chord Generator (/chords)
  Keyboard Visualizer (/keyboard)
  Pitch Analyzer (/pitch)
  Metronome (/metronome)
  Scale Explorer (/scales)
  Setlist Builder (/setlist)
```

---

## Phase 1: Shell + BPM Migration

### 1.1 Create App Shell

**Files to create**:
- `src/components/layout/AppHeader.tsx` - Shared header with nav + theme toggle
- `src/components/layout/AppFooter.tsx` - Shared footer
- `src/components/layout/ToolLayout.tsx` - Wrapper for tool pages (consistent padding, title)
- `src/components/home/ToolCard.tsx` - Clickable tile for home page

**Modifications**:
- `src/app/layout.tsx` - Update metadata to "tunetool"
- `src/app/page.tsx` - Replace with home dashboard (tool tiles)

### 1.2 Migrate BPM Tool

**Files to create**:
- `src/app/bpm/page.tsx` - Move current page.tsx content here
- `src/app/bpm/layout.tsx` - Optional: BPM-specific metadata

**No breaking changes**: All existing BPM functionality preserved.

### 1.3 Update Branding

- Update `package.json` name to `tunetool`
- Update `README.md`
- Update metadata in `layout.tsx`
- Update `STORAGE_KEYS` prefix in `constants.ts` (backwards-compatible migration)

---

## Phase 2: Chord Generator

### 2.1 Music Theory Library

**Files to create**:
- `src/lib/music/notes.ts` - Note names, MIDI numbers, frequencies
- `src/lib/music/chords.ts` - Chord definitions, intervals, voicings
- `src/lib/music/scales.ts` - Scale definitions (shared with Scale Explorer)

**Core types**:
```typescript
type NoteName = 'C' | 'C#' | 'D' | ... | 'B';
type ChordQuality = 'maj' | 'min' | 'dim' | 'aug' | '7' | 'maj7' | 'min7' | ...;
type Instrument = 'piano' | 'guitar' | 'ukulele' | 'bass';

interface Chord {
  root: NoteName;
  quality: ChordQuality;
  notes: number[]; // MIDI numbers
  name: string; // Display name
}
```

### 2.2 Chord Generator UI

**Files to create**:
- `src/app/chords/page.tsx` - Main chord generator page
- `src/components/chords/ChordSelector.tsx` - Root + quality dropdowns
- `src/components/chords/ChordDisplay.tsx` - Shows selected chord info
- `src/components/chords/ChordExport.tsx` - Download buttons

**Features**:
- Select root note (C, C#, D, ... B)
- Select chord quality (Major, Minor, 7th, Maj7, Min7, Dim, Aug, Sus2, Sus4, Add9, etc.)
- Select voicing/inversion (root, 1st, 2nd)
- Select instrument context (affects MIDI velocity/range)
- Preview on keyboard visualization (reuse from Keyboard Visualizer)
- Download options:
  - MIDI file
  - PNG chord chart
  - PDF sheet

**Filename convention**:
```
{Root}{Quality}_{Instrument}_{Inversion}_{BPM}.mid
Examples:
  Cmaj7_Piano_Root_120.mid
  Gmin_Guitar_1st_90.mid
```

### 2.3 MIDI Export Extension

**Modify**: `src/lib/midi-export.ts`

Add function:
```typescript
export function generateChordMidi(
  chord: Chord,
  bpm: number,
  durationBars: number,
  instrument: Instrument
): Uint8Array
```

---

## Phase 3: Keyboard Visualizer

### 3.1 Piano Component

**Files to create**:
- `src/app/keyboard/page.tsx` - Main keyboard page
- `src/components/keyboard/Piano.tsx` - Interactive 88-key piano
- `src/components/keyboard/PianoKey.tsx` - Individual key component
- `src/components/keyboard/KeyboardControls.tsx` - Range selector, highlight options

**Features**:
- Full 88-key range (or configurable subset)
- Click keys to highlight
- Highlight modes:
  - Single notes
  - Chord tones (from Chord Generator)
  - Scale degrees (from Scale Explorer)
- Color coding by interval/degree
- Export as PNG/SVG

### 3.2 Integration Points

- Chord Generator can "Send to Keyboard" to visualize
- Scale Explorer can highlight scale on keyboard
- Shared state via URL params or context

---

## Phase 4: Pitch Analyzer (Visual Only)

### 4.1 Audio Analysis

**Files to create**:
- `src/lib/audio/pitch-detection.ts` - Web Audio API pitch detection
- `src/lib/audio/spectrum.ts` - FFT analysis utilities

**Dependencies**: No new deps needed (Web Audio API native)

### 4.2 Pitch Analyzer UI

**Files to create**:
- `src/app/pitch/page.tsx` - Main analyzer page
- `src/components/pitch/PitchDisplay.tsx` - Current note + cents deviation
- `src/components/pitch/SpectrumVisualizer.tsx` - FFT bars/waterfall
- `src/components/pitch/NoteHistory.tsx` - Recent detected notes strip
- `src/components/pitch/TunerNeedle.tsx` - Classic tuner UI

**Features**:
- Mic permission handling with graceful fallback
- Real-time pitch detection (note name + octave + cents)
- Spectrum visualization (optional toggle)
- Reference frequency selector (A4 = 440Hz default, adjustable)
- Note history (last 8-12 notes)
- Export snapshot as PNG

---

## Phase 5: Metronome (Visual Only)

### 5.1 Metronome Logic

**Files to create**:
- `src/lib/metronome.ts` - Timing engine (Web Audio scheduler)
- `src/app/metronome/page.tsx` - Main metronome page
- `src/components/metronome/MetronomeDisplay.tsx` - Visual beat indicator
- `src/components/metronome/MetronomeControls.tsx` - BPM, time sig, subdivisions
- `src/components/metronome/BeatGrid.tsx` - Visual grid with accent markers

**Features**:
- BPM input (reuse existing BpmInput component)
- Tap tempo (reuse existing TapTempo)
- Time signature selector (4/4, 3/4, 6/8, etc.)
- Subdivision options (quarter, eighth, sixteenth)
- Accent pattern editor
- **Visual modes**:
  - Fullscreen flash (for silent practice)
  - Beat counter
  - Pendulum animation
- Optional click sound (simple, not a synth)

---

## Phase 6: Scale Explorer

### 6.1 Scale Library

**Reuse**: `src/lib/music/scales.ts` from Phase 2

**Scale types**:
- Major, Minor (natural/harmonic/melodic)
- Modes (Dorian, Phrygian, Lydian, Mixolydian, Aeolian, Locrian)
- Pentatonic (major/minor)
- Blues
- Whole tone, Diminished, Chromatic

### 6.2 Scale Explorer UI

**Files to create**:
- `src/app/scales/page.tsx` - Main scale page
- `src/components/scales/ScaleSelector.tsx` - Root + scale type dropdowns
- `src/components/scales/ScaleDisplay.tsx` - Notes list with intervals
- `src/components/scales/IntervalTrainer.tsx` - Quiz mode (visual only)

**Features**:
- Select root + scale type
- Display notes with interval labels (R, 2, 3, 4, 5, 6, 7)
- Highlight on keyboard (send to Keyboard Visualizer)
- Export as PDF chart

---

## Phase 7: Setlist Builder

### 7.1 Setlist Data Model

**Files to create**:
- `src/lib/setlist/types.ts` - Setlist, Song, Section types
- `src/lib/setlist/storage.ts` - LocalStorage persistence
- `src/lib/setlist/export.ts` - PDF/JSON export

**Types**:
```typescript
interface SetlistItem {
  id: string;
  title: string;
  bpm?: number;
  key?: string;
  timeSignature?: string;
  notes?: string;
  chords?: string[]; // Chord names
}

interface Setlist {
  id: string;
  name: string;
  items: SetlistItem[];
  createdAt: number;
  updatedAt: number;
}
```

### 7.2 Setlist Builder UI

**Files to create**:
- `src/app/setlist/page.tsx` - Main setlist page
- `src/components/setlist/SetlistEditor.tsx` - Drag-and-drop list
- `src/components/setlist/SongCard.tsx` - Individual song item
- `src/components/setlist/SetlistExport.tsx` - Export buttons

**Features**:
- Create/edit setlists
- Add songs with metadata (title, BPM, key, time sig, notes)
- Drag to reorder
- Quick-add from other tools ("Add to Setlist" button in Chord Generator)
- Export:
  - PDF (printable setlist)
  - JSON (for backup/sharing)

---

## Shared Components & Utilities

### New Shared Components
- `src/components/ui/Select.tsx` - Styled dropdown
- `src/components/ui/Modal.tsx` - Confirmation/export dialogs
- `src/components/ui/Tabs.tsx` - Tab navigation within tools
- `src/components/ui/ExportButton.tsx` - Standardized export UI

### New Lib Utilities
- `src/lib/export/png.ts` - Canvas to PNG export
- `src/lib/export/pdf.ts` - PDF generation (use browser print or jsPDF)
- `src/lib/music/index.ts` - Re-export all music theory utils

---

## Implementation Order (Recommended)

| Phase | Deliverable | Effort | Dependencies |
|-------|-------------|--------|--------------|
| 1.1 | App Shell | S | None |
| 1.2 | BPM Migration | S | 1.1 |
| 1.3 | Branding | XS | 1.1 |
| 2.1 | Music Theory Lib | M | None |
| 2.2 | Chord Generator UI | M | 2.1 |
| 2.3 | Chord MIDI Export | S | 2.1 |
| 3.1 | Piano Component | M | None |
| 3.2 | Keyboard Integration | S | 2.2, 3.1 |
| 4.1 | Pitch Detection Lib | M | None |
| 4.2 | Pitch Analyzer UI | M | 4.1 |
| 5.1 | Metronome | M | None |
| 6.1 | Scale Library | S | 2.1 |
| 6.2 | Scale Explorer UI | M | 6.1, 3.1 |
| 7.1 | Setlist Data Model | S | None |
| 7.2 | Setlist Builder UI | M | 7.1 |

**Effort key**: XS = <1hr, S = 1-2hr, M = 2-4hr, L = 4-8hr

---

## MVP Milestone (Recommended First Release)

**Phases 1-3**:
- Home dashboard with tool tiles
- BPM Tool (migrated)
- Chord Generator (full)
- Keyboard Visualizer (full)

This gives a cohesive v1 with three functional tools and the new brand.

---

## Future Ideas (Post-MVP)

- **Chord Detector**: Analyze audio/MIDI to identify chords
- **Groove Library**: Save/share swing patterns
- **Practice Timer**: Interval-based session timer
- **Key Finder**: Suggest likely key from notes
- **Fretboard Visualizer**: Guitar/bass/ukulele diagrams
- **Circle of Fifths**: Interactive theory reference
- **MIDI Input**: Connect MIDI keyboard for visualization

---

## Technical Notes

### No New Major Dependencies Required
- Tone.js already available for audio
- @tonejs/midi already available for MIDI export
- Web Audio API for pitch detection (native)
- Canvas API for PNG export (native)
- Consider jsPDF for PDF export (optional, can use browser print)

### State Management
- Keep using React state + context (no Redux needed)
- URL params for shareable tool states
- LocalStorage for persistence (existing pattern)

### Testing
- No test infra exists; consider adding Vitest for lib functions
- E2E tests (Playwright) for critical flows in future

---

## File Tree (After Full Implementation)

```
src/
  app/
    page.tsx              # Home dashboard
    layout.tsx            # Root layout (updated metadata)
    bpm/
      page.tsx            # BPM Tool
    chords/
      page.tsx            # Chord Generator
    keyboard/
      page.tsx            # Keyboard Visualizer
    pitch/
      page.tsx            # Pitch Analyzer
    metronome/
      page.tsx            # Metronome
    scales/
      page.tsx            # Scale Explorer
    setlist/
      page.tsx            # Setlist Builder
  components/
    layout/
      AppHeader.tsx
      AppFooter.tsx
      ToolLayout.tsx
    home/
      ToolCard.tsx
    chords/
      ChordSelector.tsx
      ChordDisplay.tsx
      ChordExport.tsx
    keyboard/
      Piano.tsx
      PianoKey.tsx
      KeyboardControls.tsx
    pitch/
      PitchDisplay.tsx
      SpectrumVisualizer.tsx
      NoteHistory.tsx
      TunerNeedle.tsx
    metronome/
      MetronomeDisplay.tsx
      MetronomeControls.tsx
      BeatGrid.tsx
    scales/
      ScaleSelector.tsx
      ScaleDisplay.tsx
      IntervalTrainer.tsx
    setlist/
      SetlistEditor.tsx
      SongCard.tsx
      SetlistExport.tsx
    ui/
      Select.tsx
      Modal.tsx
      Tabs.tsx
      ExportButton.tsx
    [existing components...]
  lib/
    music/
      notes.ts
      chords.ts
      scales.ts
      index.ts
    audio/
      pitch-detection.ts
      spectrum.ts
    setlist/
      types.ts
      storage.ts
      export.ts
    export/
      png.ts
      pdf.ts
    metronome.ts
    [existing lib files...]
  hooks/
    [existing hooks...]
  context/
    [existing contexts...]
```

---

## Acceptance Criteria (Per Phase)

### Phase 1
- [ ] Home page shows clickable tool tiles
- [ ] BPM Tool accessible at `/bpm` with all existing functionality
- [ ] Metadata updated to "tunetool"
- [ ] Theme toggle works globally

### Phase 2
- [ ] User can select any root note (12 notes)
- [ ] User can select chord quality (10+ types)
- [ ] User can download MIDI with correct filename
- [ ] User can view chord on mini keyboard preview

### Phase 3
- [ ] 88-key piano renders correctly
- [ ] Keys highlight on hover/click
- [ ] Chord from Chord Generator highlights on keyboard
- [ ] User can export keyboard image as PNG

### Phase 4
- [ ] Mic permission requested gracefully
- [ ] Real-time pitch displayed (note + cents)
- [ ] Spectrum visualizer renders FFT data
- [ ] Works in Chrome, Firefox, Safari

### Phase 5
- [ ] BPM adjustable via input and tap tempo
- [ ] Visual beat indicator synced to tempo
- [ ] Fullscreen flash mode works
- [ ] Time signature changeable

### Phase 6
- [ ] User can select any scale type
- [ ] Scale notes displayed with intervals
- [ ] Scale highlights on Keyboard Visualizer
- [ ] Export as PDF works

### Phase 7
- [ ] User can create/edit setlists
- [ ] Songs reorderable via drag
- [ ] Export to PDF and JSON works
- [ ] Data persists in LocalStorage
