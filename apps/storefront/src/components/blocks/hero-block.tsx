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

export const HeroBlock: React.FC<HeroBlockProps> = ({
  heading,
  subheading,
  image,
  cta,
  branding,
}) => {
  const primaryColor = branding?.theme?.primaryColor || '#000000'
  const secondaryColor = branding?.theme?.secondaryColor || '#666666'

  return (
    <section className="relative w-full min-h-[500px] flex items-center justify-center overflow-hidden">
      {image?.url && (
        <div className="absolute inset-0 z-0">
          <img
            src={image.url}
            alt={image.alt || heading || 'Hero image'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        {heading && (
          <h1
            className="text-5xl md:text-6xl font-bold mb-6 text-white"
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
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            {subheading}
          </p>
        )}

        {cta && cta.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center">
            {cta.map((button, index) => (
              <Link
                key={index}
                to={button.url}
                className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                  button.style === 'primary'
                    ? 'text-white shadow-lg hover:shadow-xl'
                    : 'bg-white text-gray-900 hover:bg-gray-100'
                }`}
                style={
                  button.style === 'primary'
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
