/**
 * Groove quantization calculations for swing and timing offsets
 */

export interface SwingTiming {
  onBeatMs: number;      // Duration of "on" beat note
  offBeatMs: number;     // Duration of "off" beat note
  offsetMs: number;      // How much the off-beat is delayed
  offsetPercent: number; // Offset as % of subdivision
}

export interface GridNote {
  position: number;      // Position in the bar (0-1, where 1 = end of bar)
  timeMs: number;        // Time in milliseconds from start
  label: string;         // Note label (e.g., "1", "1+", "2")
  type: 'straight' | 'swing' | 'triplet';
}

/**
 * Calculate swing timing for a given subdivision
 * @param subdivisionMs - Duration of the subdivision in ms (e.g., 1/8 note duration)
 * @param swingPercent - Swing percentage (50 = straight, 66.67 = triplet feel)
 * @returns Swing timing information
 */
export function calculateSwingTiming(subdivisionMs: number, swingPercent: number): SwingTiming {
  // Clamp swing percent between 50 and 75
  const swing = Math.max(50, Math.min(75, swingPercent));
  
  // For a pair of notes (on-beat and off-beat)
  // Total duration is subdivisionMs * 2
  const totalPairMs = subdivisionMs * 2;
  
  // Calculate ratio: swing% determines how the pair is divided
  // 50% = 1:1 (equal)
  // 66.67% = 2:1 (triplet)
  const ratio = swing / (100 - swing);
  
  // Calculate durations
  const onBeatMs = (totalPairMs * ratio) / (1 + ratio);
  const offBeatMs = totalPairMs - onBeatMs;
  
  // Offset is the difference from straight timing
  const offsetMs = onBeatMs - subdivisionMs;
  const offsetPercent = (offsetMs / subdivisionMs) * 100;
  
  return {
    onBeatMs,
    offBeatMs,
    offsetMs,
    offsetPercent,
  };
}

/**
 * Generate grid notes for a visual timeline
 * @param barDurationMs - Duration of one bar in ms (4 quarter notes)
 * @param subdivision - Which subdivision to show (8, 16, 32)
 * @param swingPercent - Swing percentage for swing grid
 * @returns Array of grid notes for straight, swing, and triplet
 */
export function generateGridNotes(
  barDurationMs: number,
  subdivision: 8 | 16 | 32,
  swingPercent: number
): { straight: GridNote[]; swing: GridNote[]; triplet: GridNote[] } {
  const subdivisionMs = barDurationMs / subdivision;
  const swingTiming = calculateSwingTiming(subdivisionMs, swingPercent);
  
  const straight: GridNote[] = [];
  const swing: GridNote[] = [];
  const triplet: GridNote[] = [];
  
  // Generate straight notes (evenly spaced)
  for (let i = 0; i <= subdivision; i++) {
    straight.push({
      position: i / subdivision,
      timeMs: i * subdivisionMs,
      label: getNoteLabel(i, subdivision),
      type: 'straight',
    });
  }
  
  // Generate swing notes (alternating on-beat/off-beat)
  let currentTimeMs = 0;
  for (let i = 0; i <= subdivision; i++) {
    swing.push({
      position: currentTimeMs / barDurationMs,
      timeMs: currentTimeMs,
      label: getNoteLabel(i, subdivision),
      type: 'swing',
    });
    
    // Alternate between on-beat and off-beat durations
    if (i % 2 === 0) {
      currentTimeMs += swingTiming.onBeatMs;
    } else {
      currentTimeMs += swingTiming.offBeatMs;
    }
  }
  
  // Generate triplet notes (3 notes per beat, so 12 per bar for 1/8 triplets)
  const tripletCount = (subdivision / 8) * 12; // 12 triplets per bar for 1/8, etc.
  const tripletMs = barDurationMs / tripletCount;
  for (let i = 0; i <= tripletCount; i++) {
    triplet.push({
      position: i / tripletCount,
      timeMs: i * tripletMs,
      label: getTripletLabel(i),
      type: 'triplet',
    });
  }
  
  return { straight, swing, triplet };
}

/**
 * Get note label for straight/swing grid
 */
function getNoteLabel(index: number, subdivision: 8 | 16 | 32): string {
  const beatsPerBar = 4;
  const notesPerBeat = subdivision / beatsPerBar;
  
  const beat = Math.floor(index / notesPerBeat) + 1;
  const subBeat = index % notesPerBeat;
  
  if (subBeat === 0) {
    return beat.toString();
  } else if (subdivision === 8) {
    return `${beat}+`;
  } else if (subdivision === 16) {
    return subBeat === 1 ? `${beat}e` : subBeat === 2 ? `${beat}+` : `${beat}a`;
  } else {
    // For 1/32, use numbers
    return `${beat}.${subBeat}`;
  }
}

/**
 * Get note label for triplet grid
 */
function getTripletLabel(index: number): string {
  const beat = Math.floor(index / 3) + 1;
  const tripletPos = index % 3;
  
  if (tripletPos === 0) {
    return beat.toString();
  } else if (tripletPos === 1) {
    return `${beat}t`;
  } else {
    return `${beat}t+`;
  }
}

/**
 * Get common swing presets (MPC-style)
 */
export const SWING_PRESETS = [
  { name: 'Straight', percent: 50 },
  { name: 'MPC 54%', percent: 54 },
  { name: 'MPC 58%', percent: 58 },
  { name: 'MPC 62%', percent: 62 },
  { name: 'Triplet', percent: 66.67 },
] as const;
