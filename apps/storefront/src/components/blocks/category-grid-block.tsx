import React from 'react'
import { Link } from '@tanstack/react-router'
import { t } from '@/lib/i18n'
import { useTenant } from '@/lib/context/tenant-context'

interface Category {
  id: string
  title: string
  slug: string
  description?: string
  image?: string
  count?: number
  icon?: string
}

interface CategoryGridBlockProps {
  heading?: string
  description?: string
  categories: Category[]
  columns?: 2 | 3 | 4 | 6
  variant?: 'card' | 'icon' | 'image-overlay' | 'minimal'
  showCount?: boolean
  tenantPrefix?: string
}

const columnClasses: Record<number, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6',
}

export const CategoryGridBlock: React.FC<CategoryGridBlockProps> = ({
  heading,
  description,
  categories,
  columns = 4,
  variant = 'card',
  showCount = false,
  tenantPrefix = '',
}) => {
  const { locale } = useTenant()

  if (!categories || !categories.length) return null

  const buildLink = (slug: string) =>
    tenantPrefix ? `${tenantPrefix}/categories/${slug}` : `/categories/${slug}`

  const renderCard = (category: Category) => (
    <Link
      key={category.id}
      to={buildLink(category.slug)}
      className="group block rounded-lg border border-ds-border bg-ds-card overflow-hidden transition-shadow hover:shadow-md"
    >
      {category.image && (
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={category.image}
            alt={category.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-ds-foreground">{category.title}</h3>
        {category.description && (
          <p className="text-sm text-ds-muted-foreground mt-1 line-clamp-2">
            {category.description}
          </p>
        )}
        {showCount && category.count !== undefined && (
          <span className="text-xs text-ds-muted-foreground mt-2 block">
            {category.count} {t(locale, 'blocks.items')}
          </span>
        )}
      </div>
    </Link>
  )

  const renderImageOverlay = (category: Category) => (
    <Link
      key={category.id}
      to={buildLink(category.slug)}
      className="group relative block rounded-lg overflow-hidden aspect-square"
    >
      {category.image ? (
        <img
          src={category.image}
          alt={category.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-ds-muted" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ds-foreground/80 to-transparent flex items-end p-4">
        <div>
          <h3 className="font-semibold text-ds-background">{category.title}</h3>
          {showCount && category.count !== undefined && (
            <span className="text-sm text-ds-background/80">{category.count} {t(locale, 'blocks.items')}</span>
          )}
        </div>
      </div>
    </Link>
  )

  const renderIcon = (category: Category) => (
    <Link
      key={category.id}
      to={buildLink(category.slug)}
      className="group flex flex-col items-center text-center p-6 rounded-lg border border-ds-border bg-ds-card transition-shadow hover:shadow-md"
    >
      {category.icon && (
        <span className="text-3xl mb-3">{category.icon}</span>
      )}
      <h3 className="font-semibold text-ds-foreground">{category.title}</h3>
      {showCount && category.count !== undefined && (
        <span className="text-xs text-ds-muted-foreground mt-1">{category.count} {t(locale, 'blocks.items')}</span>
      )}
    </Link>
  )

  const renderMinimal = (category: Category) => (
    <Link
      key={category.id}
      to={buildLink(category.slug)}
      className="group flex items-center gap-3 p-3 rounded-md hover:bg-ds-muted transition-colors"
    >
      {category.icon && <span className="text-lg">{category.icon}</span>}
      <span className="text-sm font-medium text-ds-foreground group-hover:text-ds-primary">
        {category.title}
      </span>
      {showCount && category.count !== undefined && (
        <span className="text-xs text-ds-muted-foreground ms-auto">{category.count}</span>
      )}
    </Link>
  )

  const renderCategory = (category: Category) => {
    switch (variant) {
      case 'image-overlay':
        return renderImageOverlay(category)
      case 'icon':
        return renderIcon(category)
      case 'minimal':
        return renderMinimal(category)
      default:
        return renderCard(category)
    }
  }

  return (
    <section className="w-full py-12 px-4">
      <div className="container mx-auto">
        {heading && (
          <h2 className="text-3xl font-bold text-ds-foreground mb-2">{heading}</h2>
        )}
        {description && (
          <p className="text-ds-muted-foreground mb-8 max-w-2xl">{description}</p>
        )}

        <div className={`grid gap-4 ${columnClasses[columns]}`}>
          {categories.map(renderCategory)}
        </div>
      </div>
    </section>
  )
}
