import type { ShuffleEffect6Options } from "./types";

export const DEFAULT_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}<>?/";

export const DEFAULT_EFFECT6_OPTIONS: Required<Omit<ShuffleEffect6Options, "seed">> = {
  durationMs: 1200,
  fps: 30,
  charset: DEFAULT_CHARSET,
  revealCurve: "easeOut",
};
