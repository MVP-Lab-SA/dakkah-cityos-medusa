import React from 'react'

interface TrustBadge {
  icon?: string
  title: string
  description?: string
  image?: string
}

interface TrustBadgesBlockProps {
  heading?: string
  badges: TrustBadge[]
  layout?: 'row' | 'grid'
  variant?: 'icon' | 'card' | 'minimal'
}

export const TrustBadgesBlock: React.FC<TrustBadgesBlockProps> = (props) => {
  const { heading, description, ...rest } = props;
  const itemsKey = Object.keys(props).find(k => Array.isArray(props[k]));
  const items = itemsKey ? props[itemsKey] : [];
  if ((!items || !items.length) && !heading && !description) return null;
  heading,
  badges,
  layout = 'row',
  variant = 'icon',
}) => {
  const renderBadge = (badge: TrustBadge, index: number) => {
    if (variant === 'card') {
      return (
        <div
          key={index}
          className="flex flex-col items-center text-center p-6 rounded-lg border border-ds-border bg-ds-card"
        >
          {badge.image ? (
            <img loading="lazy" src={badge.image} alt={badge.title} className="w-12 h-12 object-contain mb-3" />
          ) : badge.icon ? (
            <span className="text-3xl mb-3">{badge.icon}</span>
          ) : null}
          <h3 className="font-semibold text-ds-foreground text-sm">{badge.title}</h3>
          {badge.description && (
            <p className="text-xs text-ds-muted-foreground mt-1">{badge.description}</p>
          )}
        </div>
      )
    }

    if (variant === 'minimal') {
      return (
        <div key={index} className="flex items-center gap-2">
          {badge.image ? (
            <img loading="lazy" src={badge.image} alt={badge.title} className="w-5 h-5 object-contain" />
          ) : badge.icon ? (
            <span className="text-sm">{badge.icon}</span>
          ) : null}
          <span className="text-xs font-medium text-ds-muted-foreground">{badge.title}</span>
        </div>
      )
    }

    return (
      <div key={index} className="flex flex-col items-center text-center p-4">
        {badge.image ? (
          <img loading="lazy" src={badge.image} alt={badge.title} className="w-10 h-10 object-contain mb-2" />
        ) : badge.icon ? (
          <span className="text-2xl mb-2">{badge.icon}</span>
        ) : null}
        <h3 className="font-medium text-ds-foreground text-sm">{badge.title}</h3>
        {badge.description && (
          <p className="text-xs text-ds-muted-foreground mt-1">{badge.description}</p>
        )}
      </div>
    )
  }

  return (
    <section className="w-full border-y border-ds-border py-8 px-4">
      <div className="container mx-auto">
        {heading && (
          <h2 className="text-lg font-semibold text-ds-foreground text-center mb-6">
            {heading}
          </h2>
        )}

        {layout === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map(renderBadge)}
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-6">
            {badges.map(renderBadge)}
          </div>
        )}
      </div>
    </section>
  )
}
