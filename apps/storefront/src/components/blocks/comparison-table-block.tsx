import React from 'react'
import { Link } from '@tanstack/react-router'
import { t } from '@/lib/i18n'

interface ComparisonItem {
  id: string
  name: string
  image?: {
    url: string
    alt?: string
  }
  price?: string
  values: Record<string, boolean | string>
  cta?: {
    text: string
    url: string
  }
}

interface ComparisonTableBlockProps {
  heading?: string
  description?: string
  features: string[]
  items: ComparisonItem[]
  highlightedItem?: string
  locale?: string
}

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-ds-primary mx-auto">
    <path d="M5 10l3.5 3.5L15 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-ds-muted-foreground mx-auto">
    <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const ComparisonTableBlock: React.FC<ComparisonTableBlockProps> = (props) => {
  const { heading, description, ...rest } = props;
  const itemsKey = Object.keys(props).find(k => Array.isArray(props[k]));
  const items = itemsKey ? props[itemsKey] : [];
  if ((!items || !items.length) && !heading && !description) return null;
  heading,
  description,
  features,
  items,
  highlightedItem,
  locale = 'en',
}) => {
  if (!features || !items || items.length === 0) return null

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        {heading && (
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-ds-foreground mb-4 text-center">
            {heading}
          </h2>
        )}
        {description && (
          <p className="text-ds-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            {description}
          </p>
        )}

        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr>
                <th className="sticky start-0 z-10 bg-ds-background p-4 text-start text-sm font-semibold text-ds-foreground border-b border-ds-border min-w-[160px]">
                  {t(locale, 'blocks.feature')}
                </th>
                {items.map((item) => (
                  <th
                    key={item.id}
                    className={`p-4 text-center border-b border-ds-border min-w-[140px] ${
                      highlightedItem === item.id
                        ? 'bg-ds-primary/10'
                        : 'bg-ds-background'
                    }`}
                  >
                    {item.image?.url && (
                      <img
                        src={item.image.url}
                        alt={item.image.alt || item.name}
                        className="w-12 h-12 rounded-lg object-cover mx-auto mb-2"
                      />
                    )}
                    <div className="text-sm font-semibold text-ds-foreground">{item.name}</div>
                    {item.price && (
                      <div className="text-sm text-ds-muted-foreground mt-1">{item.price}</div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, idx) => (
                <tr key={feature} className={idx % 2 === 0 ? 'bg-ds-muted/30' : 'bg-ds-background'}>
                  <td className="sticky start-0 z-10 p-4 text-sm font-medium text-ds-foreground border-b border-ds-border bg-inherit">
                    {feature}
                  </td>
                  {items.map((item) => {
                    const value = item.values[feature]
                    return (
                      <td
                        key={item.id}
                        className={`p-4 text-center text-sm border-b border-ds-border ${
                          highlightedItem === item.id ? 'bg-ds-primary/10' : ''
                        }`}
                      >
                        {typeof value === 'boolean' ? (
                          value ? <CheckIcon /> : <XIcon />
                        ) : (
                          <span className="text-ds-foreground">{value || '-'}</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="sticky start-0 z-10 bg-ds-background p-4" />
                {items.map((item) => (
                  <td key={item.id} className="p-4 text-center">
                    {item.cta && (
                      <Link
                        to={item.cta.url}
                        className={`inline-block px-6 py-2 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90 ${
                          highlightedItem === item.id
                            ? 'bg-ds-primary text-ds-primary-foreground'
                            : 'bg-ds-muted text-ds-foreground'
                        }`}
                      >
                        {item.cta.text}
                      </Link>
                    )}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </section>
  )
}
