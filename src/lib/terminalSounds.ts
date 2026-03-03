import { getUserPreferences } from "@/lib/preferences/storage";

// 8-bit sound effects generator using Web Audio API
let audioContext: AudioContext | null = null;

const isSoundEnabled = () => {
  return getUserPreferences().terminalSoundsEnabled;
};

type AudioWindow = Window & typeof globalThis & {
  webkitAudioContext?: typeof AudioContext;
};

const getAudioContext = async (): Promise<AudioContext | null> => {
  if (typeof window === "undefined" || !isSoundEnabled()) return null;
  const audioWindow = window as AudioWindow;

  if (!audioContext) {
    const AudioContextCtor = audioWindow.AudioContext || audioWindow.webkitAudioContext;
    if (!AudioContextCtor) return null;
    audioContext = new AudioContextCtor();
  }
  
  // Resume audio context if suspended (browser autoplay policy)
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }
  
  return audioContext;
};

// Beep sound for typing characters
export const playKeyBeep = async () => {
  try {
    const ctx = await getAudioContext();
    if (!ctx) return;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(800 + Math.random() * 400, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.03);
  } catch (e) {
    console.log('Audio error:', e);
  }
};

// Success sound for login
export const playSuccessSound = async () => {
  try {
    const ctx = await getAudioContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    notes.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
      
      gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.15);
      
      oscillator.start(ctx.currentTime + i * 0.1);
      oscillator.stop(ctx.currentTime + i * 0.1 + 0.15);
    });
  } catch (e) {
    console.log('Audio error:', e);
  }
};

// Error sound for invalid commands
export const playErrorSound = async () => {
  try {
    const ctx = await getAudioContext();
    if (!ctx) return;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(150, ctx.currentTime);
    oscillator.frequency.setValueAtTime(80, ctx.currentTime + 0.15);
    
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  } catch (e) {
    console.log('Audio error:', e);
  }
};

// Boot sound sequence
export const playBootSound = async () => {
  try {
    const ctx = await getAudioContext();
    if (!ctx) return;
    const frequencies = [200, 300, 400, 600, 800, 1000, 1200, 1600];
    
    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.06);
      
      gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.06 + 0.1);
      
      oscillator.start(ctx.currentTime + i * 0.06);
      oscillator.stop(ctx.currentTime + i * 0.06 + 0.1);
    });
  } catch (e) {
    console.log('Audio error:', e);
  }
};

// Lightcycle whoosh sound
export const playLightcycleSound = async () => {
  try {
    const ctx = await getAudioContext();
    if (!ctx) return;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(100, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.5);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  } catch (e) {
    console.log('Audio error:', e);
  }
};

// Glitch sound effect
export const playGlitchSound = async () => {
  try {
    const ctx = await getAudioContext();
    if (!ctx) return;
    
    for (let i = 0; i < 8; i++) {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      
      oscillator.type = Math.random() > 0.5 ? 'square' : 'sawtooth';
      oscillator.frequency.setValueAtTime(Math.random() * 1500 + 200, ctx.currentTime + i * 0.04);
      
      gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.04 + 0.05);
      
      oscillator.start(ctx.currentTime + i * 0.04);
      oscillator.stop(ctx.currentTime + i * 0.04 + 0.05);
    }
  } catch (e) {
    console.log('Audio error:', e);
  }
};

// Arcade game sound (coin insert)
export const playArcadeSound = async () => {
  try {
    const ctx = await getAudioContext();
    if (!ctx) return;
    const notes = [1200, 1600, 1400, 1800];
    
    notes.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
      
      gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.12);
      
      oscillator.start(ctx.currentTime + i * 0.1);
      oscillator.stop(ctx.currentTime + i * 0.1 + 0.12);
    });
  } catch (e) {
    console.log('Audio error:', e);
  }
};

// Hacker mode sound (Matrix-like digital rain)
export const playHackerSound = async () => {
  try {
    const ctx = await getAudioContext();
    if (!ctx) return;
    
    for (let i = 0; i < 15; i++) {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(200 + Math.random() * 800, ctx.currentTime + i * 0.08);
      
      gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.1);
      
      oscillator.start(ctx.currentTime + i * 0.08);
      oscillator.stop(ctx.currentTime + i * 0.08 + 0.1);
    }
  } catch (e) {
    console.log('Audio error:', e);
  }
};

// CRT toggle sound
export const playCRTSound = async () => {
  try {
    const ctx = await getAudioContext();
    if (!ctx) return;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(120, ctx.currentTime);
    oscillator.frequency.setValueAtTime(80, ctx.currentTime + 0.15);
    
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.25);
  } catch (e) {
    console.log('Audio error:', e);
  }
};

// Theme change sound
export const playThemeSound = async () => {
  try {
    const ctx = await getAudioContext();
    if (!ctx) return;
    const notes = [400, 600, 800, 1000, 800];
    
    notes.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
      
      gain.gain.setValueAtTime(0.18, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.1);
      
      oscillator.start(ctx.currentTime + i * 0.08);
      oscillator.stop(ctx.currentTime + i * 0.08 + 0.1);
    });
  } catch (e) {
    console.log('Audio error:', e);
  }
};

// Play a WAV file from public/sounds with soft volume
const playWavSound = async (fileName: string, volume = 0.3) => {
  if (!isSoundEnabled()) return;
  try {
    const audio = new Audio(`/sounds/${fileName}`);
    audio.volume = volume;
    await audio.play();
  } catch (e) {
    console.log('Audio error:', e);
  }
};

// Command Center open sound
export const playCmdOpenSound = () => playWavSound("Rainbow4.wav", 0.25);

// Command Center AI submit sound
export const playCmdSubmitSound = () => playWavSound("Rainbow5.wav", 0.25);

// Command Center AI response sound
export const playCmdResponseSound = () => playWavSound("Rainbow6.wav", 0.25);
