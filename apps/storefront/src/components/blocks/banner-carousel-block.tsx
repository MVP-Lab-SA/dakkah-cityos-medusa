import React, { useState, useEffect, useCallback } from 'react'
import { Link } from '@tanstack/react-router'

interface SlideItem {
  heading?: string
  subheading?: string
  image: {
    url: string
    alt?: string
  }
  overlay?: 'none' | 'light' | 'dark' | 'gradient'
  cta?: {
    text: string
    url: string
    style?: 'primary' | 'secondary'
  }[]
  alignment?: 'left' | 'center' | 'right'
}

interface BannerCarouselBlockProps {
  slides: SlideItem[]
  autoplay?: boolean
  interval?: number
  showDots?: boolean
  showArrows?: boolean
  height?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const heightClasses: Record<string, string> = {
  sm: 'h-[300px] md:h-[400px]',
  md: 'h-[400px] md:h-[500px]',
  lg: 'h-[500px] md:h-[600px]',
  xl: 'h-[600px] md:h-[700px]',
  full: 'h-screen',
}

const overlayClasses: Record<string, string> = {
  none: '',
  light: 'bg-ds-background/30',
  dark: 'bg-ds-foreground/50',
  gradient: 'bg-gradient-to-t from-ds-foreground/60 to-transparent',
}

const alignmentClasses: Record<string, string> = {
  left: 'items-start text-left',
  center: 'items-center text-center',
  right: 'items-end text-right',
}

export const BannerCarouselBlock: React.FC<BannerCarouselBlockProps> = ({
  slides,
  autoplay = true,
  interval = 5000,
  showDots = true,
  showArrows = true,
  height = 'lg',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  useEffect(() => {
    if (!autoplay || slides.length <= 1) return
    const timer = setInterval(goToNext, interval)
    return () => clearInterval(timer)
  }, [autoplay, interval, goToNext, slides.length])

  if (!slides || slides.length === 0) return null

  const hClass = heightClasses[height] || heightClasses.lg

  return (
    <section className={`relative w-full overflow-hidden ${hClass}`}>
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={slide.image.url}
            alt={slide.image.alt || slide.heading || `Slide ${index + 1}`}
            className="w-full h-full object-cover"
          />

          {slide.overlay && slide.overlay !== 'none' && (
            <div className={`absolute inset-0 ${overlayClasses[slide.overlay]}`} />
          )}

          <div className="absolute inset-0 z-20 flex items-center">
            <div className="container mx-auto px-4 md:px-6">
              <div
                className={`flex flex-col ${
                  alignmentClasses[slide.alignment || 'center']
                } max-w-3xl ${
                  slide.alignment === 'right' ? 'ml-auto' : slide.alignment === 'left' ? '' : 'mx-auto'
                }`}
              >
                {slide.heading && (
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-ds-primary-foreground mb-4 drop-shadow-md">
                    {slide.heading}
                  </h2>
                )}
                {slide.subheading && (
                  <p className="text-lg md:text-xl text-ds-primary-foreground/90 mb-6 drop-shadow-md max-w-2xl">
                    {slide.subheading}
                  </p>
                )}
                {slide.cta && slide.cta.length > 0 && (
                  <div className="flex flex-wrap gap-4">
                    {slide.cta.map((button, btnIdx) => (
                      <Link
                        key={btnIdx}
                        to={button.url}
                        className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                          button.style === 'secondary'
                            ? 'bg-ds-background text-ds-foreground hover:bg-ds-muted'
                            : 'bg-ds-primary text-ds-primary-foreground hover:opacity-90'
                        }`}
                      >
                        {button.text}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {showArrows && slides.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-ds-background/80 text-ds-foreground hover:bg-ds-background transition-colors"
            aria-label="Previous slide"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 4l-6 6 6 6" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-ds-background/80 text-ds-foreground hover:bg-ds-background transition-colors"
            aria-label="Next slide"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 4l6 6-6 6" />
            </svg>
          </button>
        </>
      )}

      {showDots && slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex
                  ? 'bg-ds-primary'
                  : 'bg-ds-background/60 hover:bg-ds-background'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
