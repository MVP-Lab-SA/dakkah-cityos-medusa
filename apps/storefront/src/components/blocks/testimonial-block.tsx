import React from 'react'
import { Rating } from '../ui/rating'

interface Testimonial {
  quote: string
  author: string
  role?: string
  company?: string
  avatar?: {
    url: string
    alt?: string
  }
  rating?: number
}

interface TestimonialBlockProps {
  heading?: string
  testimonials: Testimonial[]
  layout?: 'grid' | 'carousel' | 'stacked'
  columns?: 1 | 2 | 3
  showRating?: boolean
}

export const TestimonialBlock: React.FC<TestimonialBlockProps> = (props) => {
  const { heading, description, ...rest } = props;
  const itemsKey = Object.keys(props).find(k => Array.isArray(props[k]));
  const items = itemsKey ? props[itemsKey] : [];
  if ((!items || !items.length) && !heading && !description) return null;
  heading,
  testimonials,
  layout = 'grid',
  columns = 3,
  showRating = true,
}) => {
  if (!testimonials || !testimonials.length) return null

  const [activeIndex, setActiveIndex] = React.useState(0)

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  }

  const renderTestimonial = (testimonial: Testimonial, index: number) => (
    <div
      key={index}
      className="flex flex-col gap-4 rounded-lg border border-ds-border bg-ds-card p-6"
    >
      {showRating && testimonial.rating !== undefined && (
        <Rating value={testimonial.rating} size="sm" />
      )}
      <blockquote className="flex-1 text-sm md:text-base text-ds-foreground leading-relaxed">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <div className="flex items-center gap-3">
        {testimonial.avatar?.url && (
          <img
            src={testimonial.avatar.url}
            alt={testimonial.avatar.alt || testimonial.author}
            className="w-10 h-10 rounded-full object-cover"
          />
        )}
        <div>
          <p className="text-sm font-semibold text-ds-foreground">
            {testimonial.author}
          </p>
          {(testimonial.role || testimonial.company) && (
            <p className="text-xs text-ds-muted-foreground">
              {testimonial.role}
              {testimonial.role && testimonial.company && ' at '}
              {testimonial.company}
            </p>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        {heading && (
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-ds-foreground text-center mb-8 md:mb-12">
            {heading}
          </h2>
        )}

        {layout === 'grid' && (
          <div className={`grid gap-6 ${gridCols[columns]}`}>
            {testimonials.map((t, i) => renderTestimonial(t, i))}
          </div>
        )}

        {layout === 'stacked' && (
          <div className="flex flex-col gap-6 max-w-3xl mx-auto">
            {testimonials.map((t, i) => renderTestimonial(t, i))}
          </div>
        )}

        {layout === 'carousel' && (
          <div className="max-w-3xl mx-auto">
            {testimonials.length > 0 && renderTestimonial(testimonials[activeIndex], activeIndex)}
            {testimonials.length > 1 && (
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                  className="p-2 rounded-full border border-ds-border text-ds-muted-foreground hover:text-ds-foreground hover:bg-ds-muted transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveIndex(i)}
                      className={`w-2 h-2 rounded-full transition-colors ${i === activeIndex ? 'bg-ds-primary' : 'bg-ds-muted'}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveIndex((prev) => (prev + 1) % testimonials.length)}
                  className="p-2 rounded-full border border-ds-border text-ds-muted-foreground hover:text-ds-foreground hover:bg-ds-muted transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
