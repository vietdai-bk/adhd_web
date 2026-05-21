/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class ADHDAmbientSynthesizer {
  private audioCtx: AudioContext | null = null;
  private noiseNode: AudioWorkletNode | ScriptProcessorNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private noiseGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private isRunning: boolean = false;

  public start() {
    if (this.isRunning) return;

    try {
      // Create audio context
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContextClass();

      // Master volume
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(0.18, this.audioCtx.currentTime); // keep it gentle
      this.masterGain.connect(this.audioCtx.destination);

      // 1. Binaural Sound Engine (Deep calming resonance)
      // Carries 120Hz and 130Hz frequencies -> 10Hz Alpha difference to soothe mental drift
      this.droneOsc1 = this.audioCtx.createOscillator();
      this.droneOsc1.type = "sine";
      this.droneOsc1.frequency.setValueAtTime(120, this.audioCtx.currentTime);

      this.droneOsc2 = this.audioCtx.createOscillator();
      this.droneOsc2.type = "sine";
      this.droneOsc2.frequency.setValueAtTime(130, this.audioCtx.currentTime);

      // Add dynamic modulation for a "breathing lofi" pad feel
      const modulator = this.audioCtx.createOscillator();
      modulator.type = "sine";
      modulator.frequency.setValueAtTime(0.2, this.audioCtx.currentTime); // extremely slow modulation

      const modulatorGain = this.audioCtx.createGain();
      modulatorGain.gain.setValueAtTime(2, this.audioCtx.currentTime);

      modulator.connect(modulatorGain);
      modulatorGain.connect(this.droneOsc1.frequency); // Modulates the frequency slightly over time

      this.droneGain = this.audioCtx.createGain();
      this.droneGain.gain.setValueAtTime(0.4, this.audioCtx.currentTime);

      this.droneOsc1.connect(this.droneGain);
      this.droneOsc2.connect(this.droneGain);
      this.droneGain.connect(this.masterGain);

      // Start drone oscillators
      this.droneOsc1.start();
      this.droneOsc2.start();
      modulator.start();

      // 2. Brown/Pink Noise Engine (Simulates lofi rain/warm vinyl friction)
      const bufferSize = 2 * this.audioCtx.sampleRate;
      const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      // Generate Pink Noise approximation for sensory comfort
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        b6 = white * 0.115926;
        output[i] = pink * 0.11; // scale down
      }

      const noiseSource = this.audioCtx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      // Filter to make it warmer/lofi (High cut filter filter out harsh high frequencies)
      const lpFilter = this.audioCtx.createBiquadFilter();
      lpFilter.type = "lowpass";
      lpFilter.frequency.setValueAtTime(650, this.audioCtx.currentTime); // filters crackle

      this.noiseGain = this.audioCtx.createGain();
      this.noiseGain.gain.setValueAtTime(0.5, this.audioCtx.currentTime);

      noiseSource.connect(lpFilter);
      lpFilter.connect(this.noiseGain);
      this.noiseGain.connect(this.masterGain);

      noiseSource.start();

      this.isRunning = true;
    } catch (e) {
      console.error("Failed to start Web Audio Synths:", e);
    }
  }

  public stop() {
    if (!this.isRunning) return;

    try {
      if (this.droneOsc1) {
        this.droneOsc1.stop();
        this.droneOsc1.disconnect();
      }
      if (this.droneOsc2) {
        this.droneOsc2.stop();
        this.droneOsc2.disconnect();
      }
      if (this.noiseNode) {
        this.noiseNode.disconnect();
      }
      if (this.masterGain) {
        this.masterGain.disconnect();
      }
      if (this.audioCtx) {
        this.audioCtx.close();
      }
    } catch (e) {
      console.error("Error stopping synth:", e);
    } finally {
      this.droneOsc1 = null;
      this.droneOsc2 = null;
      this.noiseGain = null;
      this.droneGain = null;
      this.masterGain = null;
      this.audioCtx = null;
      this.isRunning = false;
    }
  }

  public setVolume(level: number) {
    if (this.masterGain && this.audioCtx) {
      // safe range [0, 1]
      const clamped = Math.max(0, Math.min(1, level));
      this.masterGain.gain.setValueAtTime(clamped * 0.3, this.audioCtx.currentTime);
    }
  }
}

export const ambientSynth = new ADHDAmbientSynthesizer();
