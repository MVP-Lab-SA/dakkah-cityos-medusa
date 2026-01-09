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
  const primaryColor = branding?.theme?.primaryColor || '#000000'

  return (
    <section
      className="py-20"
      style={backgroundColor ? { backgroundColor } : { backgroundColor: '#f9fafb' }}
    >
      <div className="container mx-auto px-4 text-center">
        {heading && (
          <h2 className="text-4xl font-bold mb-6">{heading}</h2>
        )}

        {description && (
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {description}
          </p>
        )}

        {buttons && buttons.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center">
            {buttons.map((button, index) => (
              <Link
                key={index}
                to={button.url}
                className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                  button.style === 'primary'
                    ? 'text-white shadow-lg hover:shadow-xl'
                    : 'bg-white text-gray-900 hover:bg-gray-100 border border-gray-300'
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
