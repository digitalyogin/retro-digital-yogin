// 8-bit sound effects generator using Web Audio API
let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// Beep sound for typing characters
export const playKeyBeep = () => {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(800 + Math.random() * 400, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.02);
  } catch (e) {
    // Audio not supported or blocked
  }
};

// Success sound for login
export const playSuccessSound = () => {
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    notes.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
      
      gain.gain.setValueAtTime(0.05, ctx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.15);
      
      oscillator.start(ctx.currentTime + i * 0.1);
      oscillator.stop(ctx.currentTime + i * 0.1 + 0.15);
    });
  } catch (e) {
    // Audio not supported or blocked
  }
};

// Error sound for invalid commands
export const playErrorSound = () => {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(150, ctx.currentTime);
    oscillator.frequency.setValueAtTime(100, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  } catch (e) {
    // Audio not supported or blocked
  }
};

// Boot sound sequence
export const playBootSound = () => {
  try {
    const ctx = getAudioContext();
    const frequencies = [200, 300, 400, 600, 800, 1000, 1200, 1600];
    
    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.05);
      
      gain.gain.setValueAtTime(0.03, ctx.currentTime + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.05 + 0.08);
      
      oscillator.start(ctx.currentTime + i * 0.05);
      oscillator.stop(ctx.currentTime + i * 0.05 + 0.08);
    });
  } catch (e) {
    // Audio not supported or blocked
  }
};

// Lightcycle whoosh sound
export const playLightcycleSound = () => {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(100, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.5);
    
    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.setValueAtTime(0.06, ctx.currentTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  } catch (e) {
    // Audio not supported or blocked
  }
};

// Glitch sound effect
export const playGlitchSound = () => {
  try {
    const ctx = getAudioContext();
    
    for (let i = 0; i < 5; i++) {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      
      oscillator.type = Math.random() > 0.5 ? 'square' : 'sawtooth';
      oscillator.frequency.setValueAtTime(Math.random() * 1000 + 200, ctx.currentTime + i * 0.05);
      
      gain.gain.setValueAtTime(0.04, ctx.currentTime + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.05 + 0.03);
      
      oscillator.start(ctx.currentTime + i * 0.05);
      oscillator.stop(ctx.currentTime + i * 0.05 + 0.03);
    }
  } catch (e) {
    // Audio not supported or blocked
  }
};
