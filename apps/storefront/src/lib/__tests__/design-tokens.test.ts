import { describe, it, expect } from 'vitest'
import { ColorTokens } from '@dakkah-cityos/design-tokens/colors'
import { TypographyTokens } from '@dakkah-cityos/design-tokens/typography'
import { SpacingTokens } from '@dakkah-cityos/design-tokens/spacing'
import { ShadowTokens } from '@dakkah-cityos/design-tokens/shadows'
import { BorderTokens } from '@dakkah-cityos/design-tokens/borders'
import { BreakpointTokens, ContainerTokens, ResponsiveSpacing } from '@dakkah-cityos/design-tokens/breakpoints'
import { MotionTokens } from '@dakkah-cityos/design-tokens/motion'
import { ElevationTokens } from '@dakkah-cityos/design-tokens/elevation'

describe('Design Tokens', () => {
  describe('ColorTokens', () => {
    it('has light and dark modes', () => {
      expect(ColorTokens.light).toBeDefined()
      expect(ColorTokens.dark).toBeDefined()
    })

    it('light mode has all required color keys', () => {
      const requiredKeys = ['primary', 'secondary', 'background', 'foreground', 'destructive', 'success', 'warning', 'info']
      for (const key of requiredKeys) {
        expect(ColorTokens.light).toHaveProperty(key)
      }
    })

    it('dark mode has all required color keys', () => {
      const requiredKeys = ['primary', 'secondary', 'background', 'foreground', 'destructive', 'success', 'warning', 'info']
      for (const key of requiredKeys) {
        expect(ColorTokens.dark).toHaveProperty(key)
      }
    })

    it('color values use hsl format', () => {
      expect(ColorTokens.light.primary).toMatch(/^hsl\(/)
      expect(ColorTokens.dark.primary).toMatch(/^hsl\(/)
    })

    it('light and dark have same keys', () => {
      expect(Object.keys(ColorTokens.light).sort()).toEqual(Object.keys(ColorTokens.dark).sort())
    })
  })

  describe('TypographyTokens', () => {
    it('has fontFamily with sans, display, serif, mono', () => {
      expect(TypographyTokens.fontFamily.sans).toBeDefined()
      expect(TypographyTokens.fontFamily.display).toBeDefined()
      expect(TypographyTokens.fontFamily.serif).toBeDefined()
      expect(TypographyTokens.fontFamily.mono).toBeDefined()
    })

    it('has fontSize from xs to 5xl', () => {
      expect(TypographyTokens.fontSize.xs).toBe('0.75rem')
      expect(TypographyTokens.fontSize.base).toBe('1rem')
      expect(TypographyTokens.fontSize['5xl']).toBe('3rem')
    })

    it('has fontWeight from light to bold', () => {
      expect(TypographyTokens.fontWeight.light).toBe(300)
      expect(TypographyTokens.fontWeight.bold).toBe(700)
    })

    it('has lineHeight values', () => {
      expect(TypographyTokens.lineHeight.normal).toBe('1.5')
      expect(TypographyTokens.lineHeight.tight).toBe('1.25')
    })
  })

  describe('SpacingTokens', () => {
    it('has spacing scale from xs to 4xl', () => {
      expect(SpacingTokens.xs).toBe('0.25rem')
      expect(SpacingTokens.md).toBe('1rem')
      expect(SpacingTokens['4xl']).toBe('6rem')
    })

    it('spacing increases monotonically', () => {
      const values = Object.values(SpacingTokens).map(v => parseFloat(v))
      for (let i = 1; i < values.length; i++) {
        expect(values[i]).toBeGreaterThan(values[i - 1])
      }
    })
  })

  describe('ShadowTokens', () => {
    it('has none shadow', () => {
      expect(ShadowTokens.none).toBe('none')
    })

    it('has inner shadow', () => {
      expect(ShadowTokens.inner).toContain('inset')
    })

    it('has shadow scale from sm to 2xl', () => {
      expect(ShadowTokens.sm).toBeDefined()
      expect(ShadowTokens.md).toBeDefined()
      expect(ShadowTokens.lg).toBeDefined()
      expect(ShadowTokens.xl).toBeDefined()
      expect(ShadowTokens['2xl']).toBeDefined()
    })
  })

  describe('BorderTokens', () => {
    it('has radius scale', () => {
      expect(BorderTokens.radius.none).toBe('0px')
      expect(BorderTokens.radius.full).toBe('9999px')
    })

    it('has width scale', () => {
      expect(BorderTokens.width['0']).toBe('0px')
      expect(BorderTokens.width['1']).toBe('1px')
    })
  })

  describe('BreakpointTokens', () => {
    it('has standard breakpoints', () => {
      expect(BreakpointTokens.sm).toBe('640px')
      expect(BreakpointTokens.md).toBe('768px')
      expect(BreakpointTokens.lg).toBe('1024px')
      expect(BreakpointTokens.xl).toBe('1280px')
    })

    it('breakpoints increase monotonically', () => {
      const values = Object.values(BreakpointTokens).map(v => parseInt(v))
      for (let i = 1; i < values.length; i++) {
        expect(values[i]).toBeGreaterThan(values[i - 1])
      }
    })
  })

  describe('ContainerTokens', () => {
    it('has container sizes matching breakpoints', () => {
      expect(ContainerTokens.sm).toBe('640px')
      expect(ContainerTokens.lg).toBe('1024px')
    })

    it('has padding configuration', () => {
      expect(ContainerTokens.padding.base).toBe('1rem')
    })
  })

  describe('ResponsiveSpacing', () => {
    it('has section spacing', () => {
      expect(ResponsiveSpacing.section.base).toBe('2rem')
    })

    it('has grid spacing', () => {
      expect(ResponsiveSpacing.grid.base).toBe('1rem')
    })
  })

  describe('MotionTokens', () => {
    it('has duration scale', () => {
      expect(MotionTokens.duration.instant).toBe('50ms')
      expect(MotionTokens.duration.fast).toBe('100ms')
      expect(MotionTokens.duration.normal).toBe('200ms')
      expect(MotionTokens.duration.slowest).toBe('1000ms')
    })

    it('has easing functions', () => {
      expect(MotionTokens.easing.linear).toBe('linear')
      expect(MotionTokens.easing.default).toContain('cubic-bezier')
      expect(MotionTokens.easing.spring).toContain('cubic-bezier')
    })

    it('has predefined transitions', () => {
      expect(MotionTokens.transition.fade).toContain('opacity')
      expect(MotionTokens.transition.scale).toContain('transform')
    })
  })

  describe('ElevationTokens', () => {
    it('level 0 is none', () => {
      expect(ElevationTokens[0]).toBe('none')
    })

    it('has levels 1 through 6', () => {
      expect(ElevationTokens[1]).toBeDefined()
      expect(ElevationTokens[6]).toBeDefined()
    })

    it('higher levels have larger shadow values', () => {
      expect(ElevationTokens[6]).toContain('25px')
    })
  })
})
