export const ACCENTS = {
  blue: "#0077b6",
  sea: "#1f7a66",
  sky: "#4fa9d9",
  deep: "#0b3a53",
} as const;
export type Accent = keyof typeof ACCENTS;
