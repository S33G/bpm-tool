# GrooveLab Improvements & Roadmap

## Quick Wins (Integrate into Current Work)

| Task | Priority | When |
|------|----------|------|
| [ ] Unified BPM component with shared state (context/store) | High | Phase 1 Shell |
| [ ] Dark Reader ignore: `<meta name="darkreader-lock">` | Low | Phase 1 |
| [ ] RWD improvements for smaller screens | High | Phase 1 Shell |
| [ ] Accessibility: ARIA labels, keyboard navigation | High | Ongoing |
| [ ] Swing presets: half-time, double-time, triplet feel | Medium | Metronome phase |
| [ ] Detailed tooltips per tool | Medium | Per-tool |

---

## New Category: Sound Tools

Live sound, acoustics, and audio engineering utilities.

**Route**: `/sound/*`

### Tier 1: Core Sound Tools

#### 1. Delay Time Calculator (`/sound/delay`)
**Effort**: S (1-2hr)

Align speakers at different distances (main PA vs delay towers).

**Features**:
- Distance input (meters/feet toggle)
- Temperature adjustment (speed of sound varies: c ≈ 331.3 + 0.606 × Temp°C)
- Output: milliseconds delay
- Presets: "Stage monitor offset", "Delay tower", "Sub alignment"
- Integration: Link to BPM tool for tempo-synced delays

**Formula**: `T(ms) = (Distance / Speed of Sound) × 1000`

---

#### 2. 3D Room Mode Visualizer (`/sound/room-modes`)
**Effort**: M-L (Three.js integration)

Calculate and visualize standing waves in a room.

**Features**:
- Room dimension inputs (L × W × H)
- Calculate axial, tangential, and oblique modes
- **Three.js 3D wireframe** of room
- Color-coded pressure zones (corners = red/high pressure = bass trap placement)
- Frequency list with mode type labels
- Export: PNG snapshot, frequency list CSV

**Formulas**:
- Axial: `f = (c/2) × (n/L)` for each dimension
- Tangential: `f = (c/2) × sqrt((n₁/L)² + (n₂/W)²)`
- Oblique: `f = (c/2) × sqrt((n₁/L)² + (n₂/W)² + (n₃/H)²)`

---

### Tier 2: Advanced Sound Tools

#### 3. Impedance Calculator (`/sound/impedance`)
**Effort**: M (2-4hr per mode)

Two modes for different users.

**Mode A: Headphone Matcher** ("Will it drive?")

*Inputs*:
- Headphone impedance (Ω) — with presets: HD650, DT990, Sundara, LCD-2, etc.
- Sensitivity (dB/mW or dB/V — auto-convert)
- Amp output impedance (Ω) — with presets: JDS Atom, Schiit Magni, THX 789
- Amp power rating (mW @ load)

*Outputs*:
- **Damping Factor**: Load/Source ratio
  - Green (≥8): Good control
  - Yellow (2.5-8): Acceptable
  - Red (<2.5): Potential bass bloat
- **Peak SPL**: Max loudness before clipping
- **Verdict**: Green/Yellow/Red "Will it drive?" indicator

*Key formula* (sensitivity conversion):
```
dB/V = dB/mW - 10 × log₁₀(Impedance/1000)
```

**Mode B: Speaker Wiring Wizard**

*Inputs*:
- Speaker impedance (4Ω, 8Ω, 16Ω)
- Number of speakers (2, 4, 8)
- Topology: Series / Parallel / Series-Parallel

*Outputs*:
- Total system load (Ω)
- Safety warning if <2Ω
- **SVG circuit diagram** — updates in real-time

*Common presets*:
- "Two 8Ω in car" → parallel = 4Ω
- "Four 8Ω PA cabs" → series-parallel = 8Ω

---

#### 4. Limiter Threshold Calculator (`/sound/limiter`)
**Effort**: S (1-2hr)

Protect speakers from damage.

**Inputs**:
- Speaker RMS power rating (watts)
- Speaker impedance (Ω)
- Amp gain (dB)

**Outputs**:
- Max safe voltage (Vrms)
- Limiter threshold (dBu / dBFS)
- Headroom recommendation

**Formula**: `V = sqrt(P × Z)`

---

## New Category: Geeks

Niche tools for DIY audiophiles and electronics hobbyists.

**Route**: `/geeks/*`

### 5. Subwoofer Enclosure Designer (`/geeks/sub-enclosure`)
**Effort**: M

Calculate box volume and port tuning for DIY subwoofers.

**Inputs**:
- Thiele-Small parameters: Fs, Qts, Vas
- Target tuning frequency (e.g., 35Hz)
- Enclosure type: Sealed / Ported / Bandpass

**Outputs**:
- Required box volume (liters / ft³)
- Port dimensions (diameter × length)
- Frequency response curve (estimated)
- Cut sheet with dimensions

---

### 6. Passive Crossover Designer (`/geeks/crossover`)
**Effort**: M-L

Design 2-way or 3-way passive crossovers.

**Inputs**:
- Crossover frequency
- Driver impedances
- Filter type: Butterworth / Linkwitz-Riley
- Order: 1st, 2nd, 3rd, 4th

**Outputs**:
- Capacitor and inductor values
- Schematic diagram (SVG)
- Component shopping list

---

### 7. L-Pad Attenuator Calculator (`/geeks/lpad`)
**Effort**: S

Match tweeter volume to woofer without changing impedance.

**Inputs**:
- Driver impedance (Ω)
- Desired attenuation (dB)

**Outputs**:
- Series resistor value
- Parallel resistor value
- Circuit diagram

---

## Updated Information Architecture

```
GrooveLab/
  Home (/)                    → Tool tiles, categorized

  [Music & Timing]
    /bpm                      → BPM Tool (existing)
    /chords                   → Chord Generator
    /keyboard                 → Keyboard Visualizer  
    /pitch                    → Pitch Analyzer
    /metronome                → Metronome
    /scales                   → Scale Explorer
    /setlist                  → Setlist Builder

  [Sound Tools]
    /sound/delay              → Delay Time Calculator
    /sound/room-modes         → 3D Room Mode Visualizer
    /sound/impedance          → Impedance Calculator
    /sound/limiter            → Limiter Threshold Calculator

  [Geeks]
    /geeks/sub-enclosure      → Subwoofer Enclosure Designer
    /geeks/crossover          → Passive Crossover Designer
    /geeks/lpad               → L-Pad Calculator
```

---

## Implementation Priority

| # | Tool | Category | Effort | Dependencies |
|---|------|----------|--------|--------------|
| 1 | Complete tunetool MVP (Phases 1-3) | — | — | — |
| 2 | Delay Time Calculator | Sound | S | None |
| 3 | Limiter Threshold Calculator | Sound | S | None |
| 4 | Impedance Calculator (Mode A) | Sound | M | None |
| 5 | Impedance Calculator (Mode B) | Sound | M | None |
| 6 | 3D Room Mode Visualizer | Sound | L | Three.js |
| 7 | L-Pad Calculator | Geeks | S | None |
| 8 | Subwoofer Enclosure Designer | Geeks | M | None |
| 9 | Passive Crossover Designer | Geeks | L | None |

---

## UI/UX Notes

### Home Page Layout
```
[Music & Timing]  ← Primary row, current accent color
  [BPM] [Chords] [Keyboard] [Pitch] [Metronome] [Scales] [Setlist]

[Sound Tools]     ← Secondary row, different accent (e.g., cyan/teal)
  [Delay] [Room Modes] [Impedance] [Limiter]

[Geeks]           ← Tertiary row, muted/gray accent
  [Sub Enclosure] [Crossover] [L-Pad]
```

### Design Principles
- **Quick Mode by default**: Minimal inputs, instant result
- **Advanced toggle**: Reveals all parameters for power users
- **Mobile-first**: Many users check specs on phone at stores
- **Visual feedback**: Gauges, diagrams, color-coded verdicts over raw numbers

---

## Technical Notes

### New Dependencies
| Tool | Dependency | Notes |
|------|------------|-------|
| Room Mode Visualizer | `three` + `@react-three/fiber` | 3D rendering |
| All others | None | Pure math + SVG |

### Shared Components Needed
- `src/components/ui/Gauge.tsx` — Damping factor, SPL meters
- `src/components/ui/CircuitDiagram.tsx` — SVG wiring diagrams
- `src/components/ui/UnitToggle.tsx` — Metric/imperial, dB/mW vs dB/V
- `src/components/sound/PresetSelector.tsx` — Headphone/amp presets

### Data Files
- `src/data/headphone-presets.json` — HD650, DT990, Sundara, etc.
- `src/data/amp-presets.json` — JDS Atom, Magni, THX 789, etc.
