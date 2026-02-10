import React from 'react'
import { Link } from '@tanstack/react-router'

interface CTABlockProps {
  heading?: string
  description?: string
  buttons?: {
    text: string
    url: string
    style?: 'primary' | 'secondary'
  }[]
  backgroundColor?: string
  branding?: any
}

export const CTABlock: React.FC<CTABlockProps> = ({
  heading,
  description,
  buttons,
  backgroundColor,
  branding,
}) => {
  const primaryColor = branding?.theme?.primaryColor || ''

  return (
    <section
      className={`py-12 md:py-16 lg:py-20 ${backgroundColor ? '' : 'bg-ds-muted'}`}
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <div className="container mx-auto px-4 md:px-6 text-center">
        {heading && (
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-ds-foreground">{heading}</h2>
        )}

        {description && (
          <p className="text-base md:text-xl text-ds-muted-foreground mb-8 max-w-3xl mx-auto">
            {description}
          </p>
        )}

        {buttons && buttons.length > 0 && (
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
            {buttons.map((button, index) => (
              <Link
                key={index}
                to={button.url}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  button.style === 'primary'
                    ? 'text-ds-primary-foreground shadow-lg hover:shadow-xl'
                    : 'bg-ds-background text-ds-foreground hover:bg-ds-muted border border-ds-border'
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
