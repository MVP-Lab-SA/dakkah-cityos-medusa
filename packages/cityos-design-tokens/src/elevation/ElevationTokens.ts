export const ElevationTokens = {
  0: "none",
  1: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  2: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  3: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  4: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  5: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  6: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
} as const

export type ElevationLevel = keyof typeof ElevationTokens
