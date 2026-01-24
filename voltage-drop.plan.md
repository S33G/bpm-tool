## Plan: Voltage Drop Calculator for Cable Distances

This feature adds professional-grade voltage drop calculations for both **mains electrical wiring** (UK/US compliance) and **audio speaker systems**, addressing safety regulations and audio performance respectively.

***

## Part 1: Mains Wiring Calculator (BS7671 & NEC Compliant)

### Core Formula & Logic

**BS7671 (UK) Formula:**
\[ V_{drop} = \frac{(mV/A/m) \times I_b \times L}{1000} \]

Where:
- **mV/A/m** = Voltage drop per amp per meter (from cable specification tables) [headphones](https://headphones.com/pages/headphones-power-calculator)
- **$I_b$** = Design current (Amps)
- **L** = Cable length in meters (one-way distance)
- Result is divided by 1000 to convert millivolts to volts [audiovolt.co](https://www.audiovolt.co.uk/pages/speaker-impedance-calculator)

**NEC (US) Formula:**
\[ V_{drop} = \frac{2 \times K \times I \times L}{CMA} \]

For three-phase:
\[ V_{drop} = \frac{1.732 \times K \times I \times L}{CMA} \]

Where:
- **K** = Resistivity constant (12.9 for copper, 21.2 for aluminum at 75°C) [expertce](https://expertce.com/learn-articles/how-to-calculate-voltage-drop-nec/)
- **I** = Load current (Amps)
- **L** = One-way length (feet)
- **CMA** = Circular mil area of conductor [calculator](https://www.calculator.net/voltage-drop-calculator.html)

### Compliance Limits

| Region/Standard | Lighting Circuits | Power Circuits | Total System |
|----------------|-------------------|----------------|--------------|
| **UK (BS7671)** | 3% (6.9V @ 230V) | 5% (11.5V @ 230V) | N/A  [ashleyedison](https://www.ashleyedison.com/2023/01/16/minimising-severe-voltage-drop/) |
| **US (NEC)** | 3% recommended | 3% branch circuit | 5% feeder + branch  [electricalaxis](http://www.electricalaxis.com/2015/03/voltage-drop-calculation-based-on.html) |
| **IEC 60364** | 3% | 5% | N/A  [ashleyedison](https://www.ashleyedison.com/2023/01/16/minimising-severe-voltage-drop/) |

### UI Features - Mode A: UK (BS7671)

**Input Section:**
1. **System Type:** Dropdown (Single-phase 230V / Three-phase 400V)
2. **Circuit Type:** Radio buttons (Lighting / Power / Motor)
3. **Cable Specification:**
   - Cable Standard: Dropdown (BS6004 PVC / BS5467 Armoured SWA / MI Cable)
   - Cable Size: Dropdown (1.0mm² / 1.5mm² / 2.5mm² / 4mm² / 6mm² ... up to 120mm²)
   - Number of Cores: Auto-populated based on system type
4. **Installation Method:** Dropdown (Clipped direct / In conduit / Buried / In trunking)
   - *Why it matters:* Affects the mV/A/m value from Appendix 4 tables [headphones](https://headphones.com/pages/headphones-power-calculator)
5. **Load Details:**
   - Design Current ($I_b$): Number input (Amps) OR Power input (kW) with auto-calculation
   - Cable Length: Number input (meters, one-way distance)

**Auto-Population Data Table (Hidden Backend):**
Create a JSON database replicating BS7671 Appendix 4 voltage drop tables:
```json
{
  "BS6004_PVC_70C": {
    "1.5mm2_2core": {"single_phase_mV": 29, "three_phase_mV": 29},
    "2.5mm2_2core": {"single_phase_mV": 18, "three_phase_mV": 18},
    "4.0mm2_2core": {"single_phase_mV": 11, "three_phase_mV": 11}
  }
}
```

**Output Section:**
1. **Actual Voltage Drop:** Display in Volts and as **percentage** (color-coded)
   - Green: < 3% (lighting) or < 5% (power)
   - Amber: 3-5% (lighting) or 5-7% (power)
   - Red: Exceeds limits [the-regs.co](https://the-regs.co.uk/blog/?p=481)
2. **Terminal Voltage:** Show actual voltage at load end (e.g., "218.5V at appliance")
3. **Maximum Permissible Length:** Calculate backwards—"With this cable, max safe distance is 47m"
4. **Regulation Reference:** Display relevant clause (e.g., "BS7671:2018 Regulation 525.01.02") [audiovolt.co](https://www.audiovolt.co.uk/pages/speaker-impedance-calculator)

### UI Features - Mode B: US (NEC)

**Input Section:**
1. **System Voltage:** Dropdown (120V Single / 240V Single / 208V Three-phase / 480V Three-phase)
2. **Circuit Classification:** Radio (Branch / Feeder / Combined)
3. **Conductor Details:**
   - Material: Copper / Aluminum
   - Wire Size: AWG dropdown (#14 to 4/0 AWG) with auto-lookup of CMA values
   - Temperature Rating: 60°C / 75°C / 90°C (affects K factor)
4. **Load & Distance:**
   - Load Current: Amps
   - Cable Run: Feet (one-way)

**Output Section:**
- Voltage Drop (V and %)
- Pass/Fail against NEC recommendations (3% or 5%) [electricalaxis](http://www.electricalaxis.com/2015/03/voltage-drop-calculation-based-on.html)
- Suggested wire gauge upgrade if failing

### Advanced Features

**1. Correction Factor Integration:**
BS7671 requires derating for:
- **Ambient Temperature:** If > 30°C, multiply current by correction factor [knowledge.bsigroup](https://knowledge.bsigroup.com/products/electric-cables-thermosetting-insulated-armoured-cables-of-rated-voltages-of-600-1-000-v-and-1-900-3-300-v-for-fixed-installations-specification)
- **Grouping:** Multiple cables bundled together generate heat

Add checkbox: "Apply correction factors" → Opens modal with sliders.

**2. Loop Impedance Check (UK):**
For protective device coordination, also calculate $Z_s$ (earth fault loop impedance). Display warning if voltage drop indicates cable too thin for circuit breaker discrimination.

**3. Multi-Drop Circuits:**
Allow users to add multiple "legs" (e.g., distribution board to sub-board to final circuit). Calculate cumulative voltage drop. [audiovolt.co](https://www.audiovolt.co.uk/pages/speaker-impedance-calculator)

***

## Part 2: Speaker Wiring Calculator

### The Audio Challenge
Unlike mains wiring (where voltage drop causes inefficiency), speaker cable drop affects **damping factor** and causes audible bass distortion. [eevblog](https://www.eevblog.com/forum/projects/speaker-wire-and-calculating-guage/)

### Core Formula

**Power Loss Percentage:**
\[ \text{Power Loss} = \frac{2 \times R_{cable}}{Z_{speaker}} \times 100 \]

Where:
- **$R_{cable}$** = Cable resistance ($\Omega$) = $\rho \times \frac{L}{A}$
  - $\rho$ = Resistivity of copper (0.0171 $\Omega$·mm²/m at 20°C)
  - $L$ = Total cable length (to speaker and back)
  - $A$ = Cross-sectional area (mm²)
- **$Z_{speaker}$** = Speaker impedance (4Ω, 6Ω, 8Ω, 16Ω)

**Damping Factor at Speaker:**
\[ DF_{speaker} = \frac{Z_{speaker}}{R_{amp} + R_{cable}} \]

Where:
- **$R_{amp}$** = Amplifier output impedance (typically 0.05Ω for solid-state, 1-4Ω for tube amps) [bcae1](https://www.bcae1.com/dampfact.htm)

### UI Features

**Input Section:**
1. **Amplifier Output Impedance:** Presets (Solid-state / Tube / Custom)
2. **Speaker Impedance:** Radio buttons (4Ω / 6Ω / 8Ω / 16Ω)
3. **Cable Specification:**
   - **Option A:** Select gauge (AWG: 12, 14, 16, 18 | Metric: 0.5mm², 1.0mm², 1.5mm², 2.5mm²)
   - **Option B:** Enter custom strand count (e.g., "16/0.2mm" = 16 strands of 0.2mm diameter)
4. **Cable Length:** Meters/Feet (to ONE speaker—calculator doubles it automatically)
5. **Number of Speakers:** For parallel wiring scenarios

**Output Section:**
1. **Cable Resistance:** Display total DC resistance in ohms (e.g., "0.08Ω")
2. **Power Loss:** Percentage of amplifier power wasted as heat in cable
   - **Rule of Thumb:** Keep below 5% (industry standard) [eevblog](https://www.eevblog.com/forum/projects/speaker-wire-and-calculating-guage/)
   - Color-coded gauge: Green < 5%, Amber 5-10%, Red > 10%
3. **Damping Factor:** Numerical value with context
   - Display: "Damping Factor: 53 (Excellent control)"
   - Guide: DF > 20 = Tight bass | DF 10-20 = Adequate | DF < 10 = Loose/boomy  [bcae1](https://www.bcae1.com/dampfact.htm)
4. **Voltage Drop Under Load:** Show actual voltage sag during musical peaks
   - Example: "At 100W output, cable drops 1.4V (speaker receives 98.6V)"

### Advanced Features

**1. Bi-Wire / Bi-Amp Mode:**
Calculate separate runs for LF (woofer) and HF (tweeter) sections of speaker.

**2. Wire Upgrade Recommender:**
If power loss exceeds threshold, display: "Upgrade to 12AWG would reduce loss to 2.3%"

**3. Temperature Compensation:**
Add checkbox for outdoor/high-power installations where cable heats up. Copper resistance increases ~0.4% per °C. [eevblog](https://www.eevblog.com/forum/projects/speaker-wire-and-calculating-guage/)

***

## Part 3: Technical Implementation

### Tech Stack
- **Frontend:** React with TypeScript (for strong typing of cable specifications)
- **State Management:** Zustand (lightweight, perfect for calculator apps)
- **Validation:** Zod schema validation for inputs
- **UI Components:** Radix UI primitives with Tailwind CSS

### Data Storage Strategy

**Cable Specification Database:**
Create `cableSpecs.json` with structure:
```json
{
  "uk_standards": {
    "BS6004": [...],
    "BS5467": [...]
  },
  "us_awg": {
    "copper": {"14": {"cma": 4110, "resistance_ohm_per_kft": 2.525}},
    "aluminum": {...}
  },
  "speaker_cable": {
    "12awg": {"area_mm2": 3.31, "resistance_ohm_per_m": 0.00516}
  }
}
```

**Regulatory Limits:**
Hardcode compliance thresholds but allow users to toggle "Strict Mode" (3%) vs "Standard Mode" (5%).

### Calculation Engine

Create separate modules:
- `voltDropBS7671.ts` — UK mains calculations
- `voltDropNEC.ts` — US mains calculations
- `speakerCableLoss.ts` — Audio calculations

Each exports a pure function that takes input object, returns output object with all derived values.

### Visual Enhancements

**1. Live Cable Thickness Visualizer:**
SVG illustration showing cable cross-section that scales as user changes gauge selection.

**2. Distance Slider with "Danger Zones":**
Interactive slider where background color changes from green → amber → red as length increases beyond safe limits.

**3. Comparison Mode:**
Side-by-side cards comparing two cable options (e.g., "1.5mm² vs 2.5mm²") with cost-benefit analysis.

***

## Relevant British Standards Beyond BS7671

- **BS 6004** — PVC insulated cables for electric power and lighting [elandcables](https://www.elandcables.com/electrical-cable-and-accessories/cables-by-standard/bs5467-cable)
- **BS 5467** — Armoured cables (SWA) for underground/industrial use, rated 600/1000V and 1900/3300V [bhuwalcables](https://www.bhuwalcables.com/electrical-cable-power-cable-standard/bs5467-cable.html)
- **BS EN 60228** — Conductors of insulated cables (defines conductor classes and resistance values) [clevelandcable](https://www.clevelandcable.com/BS5467-3300v-3core-mains-cable-xlpe-swa-pvc-16mm-400mm)
- **BS EN 60332** — Fire propagation testing standards [clevelandcable](https://www.clevelandcable.com/BS5467-3300v-3core-mains-cable-xlpe-swa-pvc-16mm-400mm)
