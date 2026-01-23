import { frequencyToNote, NoteName } from '@/lib/music';

export interface PitchResult {
  frequency: number;
  note: NoteName;
  octave: number;
  cents: number;
  confidence: number;
}

export function autoCorrelate(
  buffer: Float32Array<ArrayBuffer>,
  sampleRate: number
): number {
  const SIZE = buffer.length;
  const MAX_SAMPLES = Math.floor(SIZE / 2);
  let bestOffset = -1;
  let bestCorrelation = 0;
  let foundGoodCorrelation = false;
  const correlations = new Array(MAX_SAMPLES);
  
  let rms = 0;
  for (let i = 0; i < SIZE; i++) {
    const val = buffer[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / SIZE);
  
  if (rms < 0.01) return -1;
  
  let lastCorrelation = 1;
  for (let offset = 0; offset < MAX_SAMPLES; offset++) {
    let correlation = 0;
    for (let i = 0; i < MAX_SAMPLES; i++) {
      correlation += Math.abs(buffer[i] - buffer[i + offset]);
    }
    correlation = 1 - correlation / MAX_SAMPLES;
    correlations[offset] = correlation;
    
    if (correlation > 0.9 && correlation > lastCorrelation) {
      foundGoodCorrelation = true;
      if (correlation > bestCorrelation) {
        bestCorrelation = correlation;
        bestOffset = offset;
      }
    } else if (foundGoodCorrelation) {
      const shift = (correlations[bestOffset + 1] - correlations[bestOffset - 1]) / correlations[bestOffset];
      return sampleRate / (bestOffset + 8 * shift);
    }
    lastCorrelation = correlation;
  }
  
  if (bestCorrelation > 0.01) {
    return sampleRate / bestOffset;
  }
  
  return -1;
}

export function detectPitch(
  buffer: Float32Array<ArrayBuffer>,
  sampleRate: number,
  a4: number = 440
): PitchResult | null {
  const frequency = autoCorrelate(buffer, sampleRate);
  
  if (frequency === -1 || frequency < 20 || frequency > 4200) {
    return null;
  }
  
  const { note, octave, cents } = frequencyToNote(frequency, a4);
  
  let rms = 0;
  for (let i = 0; i < buffer.length; i++) {
    rms += buffer[i] * buffer[i];
  }
  rms = Math.sqrt(rms / buffer.length);
  const confidence = Math.min(1, rms * 10);
  
  return {
    frequency,
    note,
    octave,
    cents,
    confidence,
  };
}

export class PitchDetector {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private dataArray: Float32Array<ArrayBuffer> | null = null;
  private isRunning = false;
  private a4: number;
  private onPitch: (result: PitchResult | null) => void;
  private animationId: number | null = null;
  
  constructor(onPitch: (result: PitchResult | null) => void, a4: number = 440) {
    this.onPitch = onPitch;
    this.a4 = a4;
  }
  
  async start(): Promise<void> {
    if (this.isRunning) return;
    
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      source.connect(this.analyser);
      
      this.dataArray = new Float32Array(this.analyser.fftSize);
      this.isRunning = true;
      this.detect();
    } catch (error) {
      throw new Error('Microphone access denied');
    }
  }
  
  stop(): void {
    this.isRunning = false;
    
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.analyser = null;
    this.dataArray = null;
  }
  
  setA4(freq: number): void {
    this.a4 = freq;
  }
  
  private detect = (): void => {
    if (!this.isRunning || !this.analyser || !this.dataArray || !this.audioContext) return;
    
    this.analyser.getFloatTimeDomainData(this.dataArray);
    const result = detectPitch(this.dataArray, this.audioContext.sampleRate, this.a4);
    this.onPitch(result);
    
    this.animationId = requestAnimationFrame(this.detect);
  };
}
