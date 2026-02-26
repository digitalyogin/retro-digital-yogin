// 8-bit sound effects generator using Web Audio API
let audioContext: AudioContext | null = null;

const getAudioContext = async (): Promise<AudioContext> => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
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
  if (!isSoundEnabled()) return;
  try {
    const ctx = await getAudioContext();
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

// Sound toggle
let soundEnabled = localStorage.getItem('soundEnabled') !== 'false';

export const isSoundEnabled = (): boolean => soundEnabled;

export const toggleSound = (): boolean => {
  soundEnabled = !soundEnabled;
  localStorage.setItem('soundEnabled', String(soundEnabled));
  return soundEnabled;
};

// CRT transition sound - static noise + power down beep
export const playCrtTransitionSound = async () => {
  if (!isSoundEnabled()) return;
  try {
    const ctx = await getAudioContext();

    // White noise burst (static)
    const bufferSize = ctx.sampleRate * 0.3;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    const noiseGain = ctx.createGain();
    noiseSource.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseGain.gain.setValueAtTime(0.035, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    noiseSource.start(ctx.currentTime);
    noiseSource.stop(ctx.currentTime + 0.3);

    // Descending CRT power-down tone
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.4);
    oscGain.gain.setValueAtTime(0.04, ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);

    // High-pitch zap
    const zap = ctx.createOscillator();
    const zapGain = ctx.createGain();
    zap.connect(zapGain);
    zapGain.connect(ctx.destination);
    zap.type = 'square';
    zap.frequency.setValueAtTime(4000, ctx.currentTime + 0.05);
    zap.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);
    zapGain.gain.setValueAtTime(0.02, ctx.currentTime + 0.05);
    zapGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    zap.start(ctx.currentTime + 0.05);
    zap.stop(ctx.currentTime + 0.2);
  } catch (e) {
    console.log('Audio error:', e);
  }
};

// CRT power-on sound
export const playCrtPowerOnSound = async () => {
  if (!isSoundEnabled()) return;
  try {
    const ctx = await getAudioContext();

    // Rising tone
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(60, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.3);
    oscGain.gain.setValueAtTime(0.03, ctx.currentTime);
    oscGain.gain.setValueAtTime(0.04, ctx.currentTime + 0.15);
    oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);

    // Static crackle
    const bufferSize = ctx.sampleRate * 0.15;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    const noiseGain = ctx.createGain();
    noiseSource.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseGain.gain.setValueAtTime(0.025, ctx.currentTime + 0.25);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    noiseSource.start(ctx.currentTime + 0.25);
    noiseSource.stop(ctx.currentTime + 0.4);
  } catch (e) {
    console.log('Audio error:', e);
  }
};