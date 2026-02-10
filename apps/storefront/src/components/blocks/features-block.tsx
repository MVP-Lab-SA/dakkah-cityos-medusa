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
    <section className="py-16">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
        )}

        <div className={`grid gap-8 ${gridCols[columns]}`}>
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              {feature.icon && (
                <div className="text-4xl mb-4">{feature.icon}</div>
              )}
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-ds-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
