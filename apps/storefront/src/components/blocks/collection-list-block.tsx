import React from 'react'

interface CollectionItem {
  id: string
  title: string
  handle: string
  image?: {
    url: string
    alt?: string
  }
}

interface CollectionListBlockProps {
  heading?: string
  description?: string
  collections: CollectionItem[]
  layout?: 'grid' | 'carousel' | 'list'
  columns?: 2 | 3 | 4 | 6
}

const columnClasses: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
}

export const CollectionListBlock: React.FC<CollectionListBlockProps> = ({
  heading,
  description,
  collections,
  layout = 'grid',
  columns = 3,
}) => {
  if (!collections || collections.length === 0) return null

  const renderGridItem = (collection: CollectionItem) => (
    <a
      key={collection.id}
      href={`/collections/${collection.handle}`}
      className="group relative block overflow-hidden rounded-xl bg-ds-card border border-ds-border"
    >
      <div className="aspect-square overflow-hidden">
        {collection.image?.url ? (
          <img
            src={collection.image.url}
            alt={collection.image.alt || collection.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-ds-muted flex items-center justify-center">
            <span className="text-ds-muted-foreground text-lg font-medium">
              {collection.title}
            </span>
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-ds-foreground/20 group-hover:bg-ds-foreground/30 transition-colors" />
      <div className="absolute bottom-0 start-0 end-0 p-4">
        <h3 className="text-lg font-semibold text-ds-primary-foreground drop-shadow-md">
          {collection.title}
        </h3>
      </div>
    </a>
  )

  const renderListItem = (collection: CollectionItem) => (
    <a
      key={collection.id}
      href={`/collections/${collection.handle}`}
      className="flex items-center gap-4 p-4 bg-ds-card border border-ds-border rounded-xl hover:bg-ds-muted transition-colors"
    >
      {collection.image?.url && (
        <img
          src={collection.image.url}
          alt={collection.image.alt || collection.title}
          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
        />
      )}
      <h3 className="text-lg font-semibold text-ds-foreground">
        {collection.title}
      </h3>
    </a>
  )

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        {heading && (
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-ds-foreground mb-4">
            {heading}
          </h2>
        )}
        {description && (
          <p className="text-ds-muted-foreground mb-8 max-w-2xl">
            {description}
          </p>
        )}

        {layout === 'list' ? (
          <div className="flex flex-col gap-3">
            {collections.map(renderListItem)}
          </div>
        ) : layout === 'carousel' ? (
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="flex-shrink-0 w-64 md:w-72 snap-start"
              >
                {renderGridItem(collection)}
              </div>
            ))}
          </div>
        ) : (
          <div className={`grid gap-4 md:gap-6 ${columnClasses[columns] || columnClasses[3]}`}>
            {collections.map(renderGridItem)}
          </div>
        )}
      </div>
    </section>
  )
}
