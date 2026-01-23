/**
 * Audio playback engine using Tone.js for groove previews
 */

import * as Tone from 'tone';
import { GrooveType } from './types';

// Synthesizer-based drum sounds (no samples needed)
class DrumKit {
  private kick: Tone.MembraneSynth;
  private snare: Tone.NoiseSynth;
  private hat: Tone.MetalSynth;

  constructor() {
    // Kick drum - membrane synth for thump
    this.kick = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 6,
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 0.4, attackCurve: 'exponential' },
    }).toDestination();

    // Snare - noise synth
    this.snare = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 },
    }).toDestination();

    // Hi-hat - metallic sound
    this.hat = new Tone.MetalSynth({
      envelope: { attack: 0.01, decay: 0.1, release: 0.01 },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5,
    }).toDestination();
  }

  playKick(time: number, velocity: number = 1) {
    // Ensure time is in the future to avoid scheduling errors
    const safeTime = Math.max(time, Tone.now() + 0.01);
    this.kick.triggerAttackRelease('C1', '8n', safeTime, velocity);
  }

  playSnare(time: number, velocity: number = 1) {
    const safeTime = Math.max(time, Tone.now() + 0.01);
    this.snare.triggerAttackRelease('16n', safeTime, velocity);
  }

  playHat(time: number, velocity: number = 1) {
    const safeTime = Math.max(time, Tone.now() + 0.01);
    this.hat.triggerAttackRelease('32n', safeTime, velocity * 0.6);
  }

  dispose() {
    this.kick.dispose();
    this.snare.dispose();
    this.hat.dispose();
  }
}

export class GroovePlayer {
  private drumKit: DrumKit;
  private part: Tone.Part | null = null;
  private currentGroove: GrooveType = 'straight';

  constructor() {
    this.drumKit = new DrumKit();
  }

  /**
   * Start playing a groove pattern
   */
  async play(bpm: number, grooveType: GrooveType, swingPercent: number = 58) {
    // Ensure audio context is started (required by browsers)
    await Tone.start();

    this.stop(); // Stop any existing playback

    this.currentGroove = grooveType;

    const transport = Tone.getTransport();
    transport.bpm.value = bpm;

    // Configure swing for swing groove
    if (grooveType === 'swing') {
      const toneSwing = (swingPercent - 50) / 25; // 0 to 1 range
      transport.swing = toneSwing;
      transport.swingSubdivision = '8n';
    }

    // Create the pattern based on groove type
    const events = this.createPattern(grooveType);

    // Create a part that loops
    this.part = new Tone.Part((time, event) => {
      if (event.type === 'kick') {
        this.drumKit.playKick(time, event.velocity);
      } else if (event.type === 'snare') {
        this.drumKit.playSnare(time, event.velocity);
      } else if (event.type === 'hat') {
        this.drumKit.playHat(time, event.velocity);
      }
    }, events);

    this.part.loop = true;
    this.part.loopEnd = '1m'; // Loop every measure (bar)
    
    // Schedule part to start slightly in the future to avoid timing conflicts
    const startTime = Tone.now() + 0.1;
    this.part.start(0);
    transport.start(startTime);
  }

  /**
   * Stop playback
   */
  stop() {
    const transport = Tone.getTransport();
    
    // Stop and clear part first
    if (this.part) {
      this.part.stop();
      this.part.clear();
      this.part.dispose();
      this.part = null;
    }
    
    // Then stop transport and cancel all events
    transport.stop();
    transport.cancel(0);
    transport.position = 0;
    transport.swing = 0;
  }

  /**
   * Update swing percentage while playing
   */
  updateSwing(swingPercent: number) {
    if (this.currentGroove === 'swing' && Tone.getTransport().state === 'started') {
      const toneSwing = (swingPercent - 50) / 25;
      Tone.getTransport().swing = toneSwing;
    }
  }

  /**
   * Check if currently playing
   */
  isPlaying(): boolean {
    return Tone.getTransport().state === 'started';
  }

  /**
   * Create drum pattern based on groove type
   */
  private createPattern(grooveType: GrooveType) {
    switch (grooveType) {
      case 'straight':
        return this.createStraightPattern();
      case 'swing':
        return this.createSwingPattern();
      case 'triplet':
        return this.createTripletPattern();
    }
  }

  /**
   * Straight pattern: Kick and Snare only (no hats)
   */
  private createStraightPattern() {
    return [
      // Kick on 1 and 3
      { time: '0:0:0', type: 'kick', velocity: 1 },
      { time: '0:2:0', type: 'kick', velocity: 1 },
      // Snare on 2 and 4
      { time: '0:1:0', type: 'snare', velocity: 0.9 },
      { time: '0:3:0', type: 'snare', velocity: 0.9 },
    ];
  }

  /**
   * Swing pattern: Kick and Snare (no hats)
   */
  private createSwingPattern() {
    return [
      // Kick on 1 and 3
      { time: '0:0:0', type: 'kick', velocity: 1 },
      { time: '0:2:0', type: 'kick', velocity: 1 },
      // Snare on 2 and 4
      { time: '0:1:0', type: 'snare', velocity: 0.9 },
      { time: '0:3:0', type: 'snare', velocity: 0.9 },
    ];
  }

  /**
   * Triplet pattern: Only hats on triplets
   */
  private createTripletPattern() {
    const pattern = [];

    // Hats on triplets (3 per beat = 12 per bar)
    for (let beat = 0; beat < 4; beat++) {
      for (let triplet = 0; triplet < 3; triplet++) {
        pattern.push({
          time: `0:${beat}:${triplet}`,
          type: 'hat',
          velocity: triplet === 0 ? 0.8 : 0.6, // Accent first of each triplet
        });
      }
    }

    return pattern;
  }

  /**
   * Clean up resources
   */
  dispose() {
    this.stop();
    this.drumKit.dispose();
  }
}
