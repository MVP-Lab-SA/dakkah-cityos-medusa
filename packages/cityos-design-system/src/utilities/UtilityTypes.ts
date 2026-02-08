import type React from "react"

export type Responsive<T> = T | {
  base?: T
  sm?: T
  md?: T
  lg?: T
  xl?: T
  "2xl"?: T
}

export interface WithRTL<T> {
  value: T
  rtl?: T
}

export interface WithAccessibility {
  ariaLabel?: string
  ariaDescribedBy?: string
  ariaLabelledBy?: string
  ariaLive?: "off" | "polite" | "assertive"
  ariaExpanded?: boolean
  ariaHidden?: boolean
  ariaDisabled?: boolean
  role?: string
  tabIndex?: number
}

export interface WithAnimation {
  animate?: boolean
  animationDuration?: number
  animationDelay?: number
  animationTimingFunction?: "ease" | "ease-in" | "ease-out" | "ease-in-out" | "linear"
  transition?: string
}

export interface WithThemeOverride {
  colorScheme?: "light" | "dark"
  themeOverrides?: Record<string, string>
}

export type PropsWithAs<P, T extends React.ElementType> = P & {
  as?: T
} & Omit<React.ComponentPropsWithoutRef<T>, keyof P | "as">

export type PolymorphicRef<T extends React.ElementType> = React.ComponentPropsWithRef<T>["ref"]

export type PolymorphicComponentProps<
  T extends React.ElementType,
  Props = Record<string, never>
> = Props & {
  as?: T
} & Omit<React.ComponentPropsWithoutRef<T>, keyof Props | "as">

export type MergeProps<A, B> = Omit<A, keyof B> & B

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  { [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>> }[Keys]

export type RequireExactlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  { [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>> }[Keys]
