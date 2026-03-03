export type RevealCurve = "linear" | "easeOut";

export type ShuffleEffect6Options = {
  durationMs?: number;
  fps?: number;
  charset?: string;
  revealCurve?: RevealCurve;
  seed?: number;
};

export type ShuffleController = {
  play: () => void;
  stop: () => void;
  destroy: () => void;
  isRunning: () => boolean;
};
