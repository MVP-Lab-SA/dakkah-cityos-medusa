import React from 'react'
import { Link } from '@tanstack/react-router'

interface HeroBlockProps {
  heading?: string
  subheading?: string
  image?: {
    url: string
    alt?: string
  }
  cta?: {
    text: string
    url: string
    style?: 'primary' | 'secondary'
  }[]
  branding?: any
}

export const HeroBlock: React.FC<HeroBlockProps> = (props) => {
  const { heading, description, ...rest } = props;
  const itemsKey = Object.keys(props).find(k => Array.isArray(props[k]));
  const items = itemsKey ? props[itemsKey] : [];
  if ((!items || !items.length) && !heading && !description) return null;
  heading,
  subheading,
  image,
  cta,
  branding,
}) => {
  const primaryColor = branding?.theme?.primaryColor || ''

  return (
    <section className="relative w-full min-h-[300px] md:min-h-[400px] lg:min-h-[500px] flex items-center justify-center overflow-hidden">
      {image?.url && (
        <div className="absolute inset-0 z-0">
          <img
            src={image.url}
            alt={image.alt || heading || 'Hero image'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-ds-foreground/40" />
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 md:px-6 py-12 md:py-16 lg:py-20 text-center">
        {heading && (
          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-ds-primary-foreground"
            style={
              branding?.theme?.primaryColor
                ? { color: branding.theme.primaryColor }
                : undefined
            }
          >
            {heading}
          </h1>
        )}

        {subheading && (
          <p className="text-base md:text-xl lg:text-2xl mb-8 text-ds-primary-foreground/90 max-w-3xl mx-auto">
            {subheading}
          </p>
        )}

        {cta && cta.length > 0 && (
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
            {cta.map((button, index) => (
              <Link
                key={index}
                to={button.url}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  button.style === 'primary'
                    ? 'text-ds-primary-foreground shadow-lg hover:shadow-xl'
                    : 'bg-ds-background text-ds-foreground hover:bg-ds-muted'
                }`}
                style={
                  button.style === 'primary' && primaryColor
                    ? { backgroundColor: primaryColor }
                    : undefined
                }
              >
                {button.text}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
