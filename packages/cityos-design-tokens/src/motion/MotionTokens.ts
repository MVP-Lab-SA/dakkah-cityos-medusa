export const MotionTokens = {
  duration: {
    instant: "50ms",
    fast: "100ms",
    normal: "200ms",
    slow: "300ms",
    slower: "500ms",
    slowest: "1000ms",
  },
  easing: {
    default: "cubic-bezier(0.4, 0, 0.2, 1)",
    linear: "linear",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "cubic-bezier(0.68, -0.6, 0.32, 1.6)",
    bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
  transition: {
    fade: "opacity var(--motion-duration-normal, 200ms) var(--motion-easing-default)",
    scale: "transform var(--motion-duration-normal, 200ms) var(--motion-easing-default)",
    slide: "transform var(--motion-duration-slow, 300ms) var(--motion-easing-easeOut)",
    color: "color var(--motion-duration-fast, 100ms) var(--motion-easing-default), background-color var(--motion-duration-fast, 100ms) var(--motion-easing-default)",
    all: "all var(--motion-duration-normal, 200ms) var(--motion-easing-default)",
  },
} as const

export type MotionDuration = keyof typeof MotionTokens.duration
export type MotionEasing = keyof typeof MotionTokens.easing
