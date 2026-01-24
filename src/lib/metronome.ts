export type TimeSignature = '4/4' | '3/4' | '6/8' | '2/4' | '5/4' | '7/8';

export interface MetronomeConfig {
  bpm: number;
  timeSignature: TimeSignature;
  subdivision: 1 | 2 | 4;
  accentFirst: boolean;
  accentPattern?: boolean[];
}

export interface MetronomeState {
  isPlaying: boolean;
  currentBeat: number;
  currentSubdivision: number;
}

const TIME_SIGNATURE_BEATS: Record<TimeSignature, number> = {
  '4/4': 4,
  '3/4': 3,
  '6/8': 6,
  '2/4': 2,
  '5/4': 5,
  '7/8': 7,
};

export function getBeatsPerMeasure(timeSignature: TimeSignature): number {
  return TIME_SIGNATURE_BEATS[timeSignature];
}

export class MetronomeEngine {
  private audioContext: AudioContext | null = null;
  private nextNoteTime = 0;
  private currentBeat = 0;
  private currentSubdivision = 0;
  private schedulerId: number | null = null;
  private isPlaying = false;
  
  private config: MetronomeConfig;
  private onTick: (beat: number, subdivision: number, isAccent: boolean) => void;
  
  constructor(
    config: MetronomeConfig,
    onTick: (beat: number, subdivision: number, isAccent: boolean) => void
  ) {
    this.config = config;
    this.onTick = onTick;
  }
  
  updateConfig(config: Partial<MetronomeConfig>): void {
    this.config = { ...this.config, ...config };
  }
  
  start(): void {
    if (this.isPlaying) return;
    
    this.audioContext = new AudioContext();
    this.isPlaying = true;
    this.currentBeat = 0;
    this.currentSubdivision = 0;
    this.nextNoteTime = this.audioContext.currentTime;
    this.schedule();
  }
  
  stop(): void {
    this.isPlaying = false;
    if (this.schedulerId) {
      clearTimeout(this.schedulerId);
      this.schedulerId = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
  
  private schedule = (): void => {
    if (!this.isPlaying || !this.audioContext) return;
    
    const lookAhead = 0.1;
    const scheduleAheadTime = 0.05;
    
    while (this.nextNoteTime < this.audioContext.currentTime + lookAhead) {
      this.scheduleNote();
      this.advanceNote();
    }
    
    this.schedulerId = window.setTimeout(this.schedule, scheduleAheadTime * 1000);
  };
  
  private scheduleNote(): void {
    if (!this.audioContext) return;
    
    const isAccent = this.currentSubdivision === 0 && (
      this.config.accentPattern
        ? this.config.accentPattern[this.currentBeat]
        : this.config.accentFirst && this.currentBeat === 0
    );
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    
    const isMainBeat = this.currentSubdivision === 0;
    osc.frequency.value = isAccent ? 1000 : isMainBeat ? 800 : 600;
    
    gain.gain.setValueAtTime(isAccent ? 0.5 : isMainBeat ? 0.3 : 0.15, this.nextNoteTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.nextNoteTime + 0.05);
    
    osc.start(this.nextNoteTime);
    osc.stop(this.nextNoteTime + 0.05);
    
    const scheduledBeat = this.currentBeat;
    const scheduledSub = this.currentSubdivision;
    const scheduledAccent = isAccent;
    
    const delay = (this.nextNoteTime - this.audioContext.currentTime) * 1000;
    setTimeout(() => {
      this.onTick(scheduledBeat, scheduledSub, scheduledAccent);
    }, Math.max(0, delay));
  }
  
  private advanceNote(): void {
    const beatDuration = 60.0 / this.config.bpm;
    const subdivisionDuration = beatDuration / this.config.subdivision;
    
    this.nextNoteTime += subdivisionDuration;
    
    this.currentSubdivision++;
    if (this.currentSubdivision >= this.config.subdivision) {
      this.currentSubdivision = 0;
      this.currentBeat++;
      
      const beatsPerMeasure = getBeatsPerMeasure(this.config.timeSignature);
      if (this.currentBeat >= beatsPerMeasure) {
        this.currentBeat = 0;
      }
    }
  }
}
