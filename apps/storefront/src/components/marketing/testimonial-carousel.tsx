import { useState, useEffect } from "react"
import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"

interface Testimonial {
  id: string
  author: string
  role?: string
  avatar?: string
  content: string
  rating?: number
}

interface TestimonialCarouselProps {
  locale?: string
  className?: string
  testimonials?: Testimonial[]
  title?: string
  autoPlay?: boolean
  autoPlayInterval?: number
}

export function TestimonialCarousel({
  locale: localeProp,
  className = "",
  testimonials = [],
  title,
  autoPlay = false,
  autoPlayInterval = 5000,
}: TestimonialCarouselProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [activeIndex, setActiveIndex] = useState(0)

  const safeIndex = testimonials.length > 0 ? activeIndex % testimonials.length : 0

  useEffect(() => {
    if (!autoPlay || testimonials.length <= 1) return
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, autoPlayInterval)
    return () => clearInterval(timer)
  }, [autoPlay, testimonials.length, autoPlayInterval])

  if (testimonials.length === 0) return null

  const current = testimonials[safeIndex]

  return (
    <div className={className}>
      {title && (
        <h3 className="text-lg font-semibold text-ds-text text-center mb-6">{title}</h3>
      )}

      <div className="relative bg-ds-card border border-ds-border rounded-xl p-6 sm:p-8">
        <svg className="absolute top-4 start-4 w-8 h-8 text-ds-primary/20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>

        <div className="text-center pt-6">
          {current.rating !== undefined && (
            <div className="flex items-center justify-center gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < current.rating! ? "text-ds-warning" : "text-ds-border"}`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
          )}

          <blockquote className="text-sm sm:text-base text-ds-text leading-relaxed max-w-lg mx-auto">
            &ldquo;{current.content}&rdquo;
          </blockquote>

          <div className="mt-4 flex items-center justify-center gap-3">
            {current.avatar ? (
              <img loading="lazy" src={current.avatar} alt={current.author} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-ds-primary/10 flex items-center justify-center text-ds-primary font-semibold text-sm">
                {current.author.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="text-start">
              <p className="text-sm font-medium text-ds-text">{current.author}</p>
              {current.role && <p className="text-xs text-ds-muted">{current.role}</p>}
            </div>
          </div>
        </div>

        {testimonials.length > 1 && (
          <>
            <button
              onClick={() => setActiveIndex((safeIndex - 1 + testimonials.length) % testimonials.length)}
              className="absolute start-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-ds-accent border border-ds-border text-ds-muted hover:text-ds-text transition-colors"
              aria-label={t(locale, "blocks.previous_slide")}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setActiveIndex((safeIndex + 1) % testimonials.length)}
              className="absolute end-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-ds-accent border border-ds-border text-ds-muted hover:text-ds-text transition-colors"
              aria-label={t(locale, "blocks.next_slide")}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {testimonials.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === safeIndex ? "bg-ds-primary" : "bg-ds-border hover:bg-ds-muted"
              }`}
              aria-label={`${t(locale, "blocks.go_to_slide")} ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
