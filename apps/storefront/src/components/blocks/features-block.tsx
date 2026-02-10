import React from 'react'

interface Feature {
  icon?: string
  title: string
  description: string
}

interface FeaturesBlockProps {
  title?: string
  features: Feature[]
  columns?: 2 | 3 | 4
}

export const FeaturesBlock: React.FC<FeaturesBlockProps> = ({
  title,
  features,
  columns = 3,
}) => {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        {title && (
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-ds-foreground">{title}</h2>
        )}

        <div className={`grid grid-cols-1 gap-4 md:gap-6 lg:gap-8 ${gridCols[columns]}`}>
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              {feature.icon && (
                <div className="text-4xl mb-4">{feature.icon}</div>
              )}
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-ds-foreground">{feature.title}</h3>
              <p className="text-sm md:text-base text-ds-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
