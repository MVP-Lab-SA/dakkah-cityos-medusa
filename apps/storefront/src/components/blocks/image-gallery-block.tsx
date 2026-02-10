import React from 'react'

interface GalleryImage {
  image: {
    url: string
    alt?: string
  }
  caption?: string
}

interface ImageGalleryBlockProps {
  heading?: string
  images: GalleryImage[]
  layout?: 'grid' | 'masonry' | 'carousel'
  columns?: 2 | 3 | 4
  aspectRatio?: 'square' | 'video' | 'auto'
}

export const ImageGalleryBlock: React.FC<ImageGalleryBlockProps> = ({
  heading,
  images,
  layout = 'grid',
  columns = 3,
  aspectRatio = 'auto',
}) => {
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null)

  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }

  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    auto: '',
  }

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const prevImage = () => setLightboxIndex((prev) => prev !== null ? (prev - 1 + images.length) % images.length : null)
  const nextImage = () => setLightboxIndex((prev) => prev !== null ? (prev + 1) % images.length : null)

  React.useEffect(() => {
    if (lightboxIndex === null) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'ArrowRight') nextImage()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightboxIndex])

  const renderImage = (item: GalleryImage, index: number) => (
    <button
      key={index}
      type="button"
      onClick={() => openLightbox(index)}
      className="group relative overflow-hidden rounded-lg cursor-pointer"
    >
      <img
        src={item.image.url}
        alt={item.image.alt || ''}
        className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${aspectClasses[aspectRatio]}`}
      />
      {item.caption && (
        <div className="absolute inset-x-0 bottom-0 bg-ds-background/80 px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-xs text-ds-foreground truncate">{item.caption}</p>
        </div>
      )}
    </button>
  )

  const [carouselIndex, setCarouselIndex] = React.useState(0)

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        {heading && (
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-ds-foreground text-center mb-8 md:mb-12">
            {heading}
          </h2>
        )}

        {layout === 'grid' && (
          <div className={`grid gap-4 ${gridCols[columns]}`}>
            {images.map((img, i) => renderImage(img, i))}
          </div>
        )}

        {layout === 'masonry' && (
          <div className={`columns-1 sm:columns-2 lg:columns-${columns} gap-4 space-y-4`}>
            {images.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => openLightbox(index)}
                className="group relative overflow-hidden rounded-lg cursor-pointer break-inside-avoid w-full"
              >
                <img
                  src={item.image.url}
                  alt={item.image.alt || ''}
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {item.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-ds-background/80 px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs text-ds-foreground truncate">{item.caption}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {layout === 'carousel' && images.length > 0 && (
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-lg">
              <img
                src={images[carouselIndex].image.url}
                alt={images[carouselIndex].image.alt || ''}
                className="w-full object-cover aspect-video cursor-pointer"
                onClick={() => openLightbox(carouselIndex)}
              />
            </div>
            {images[carouselIndex].caption && (
              <p className="text-sm text-ds-muted-foreground text-center mt-3">
                {images[carouselIndex].caption}
              </p>
            )}
            {images.length > 1 && (
              <div className="flex items-center justify-center gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setCarouselIndex((prev) => (prev - 1 + images.length) % images.length)}
                  className="p-2 rounded-full border border-ds-border text-ds-muted-foreground hover:text-ds-foreground hover:bg-ds-muted transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-sm text-ds-muted-foreground">
                  {carouselIndex + 1} / {images.length}
                </span>
                <button
                  type="button"
                  onClick={() => setCarouselIndex((prev) => (prev + 1) % images.length)}
                  className="p-2 rounded-full border border-ds-border text-ds-muted-foreground hover:text-ds-foreground hover:bg-ds-muted transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}

        {lightboxIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-ds-background/90">
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute top-4 end-4 p-2 rounded-full text-ds-foreground hover:bg-ds-muted transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <button
              type="button"
              onClick={prevImage}
              className="absolute start-4 p-2 rounded-full text-ds-foreground hover:bg-ds-muted transition-colors"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="max-w-5xl max-h-[85vh] px-16">
              <img
                src={images[lightboxIndex].image.url}
                alt={images[lightboxIndex].image.alt || ''}
                className="max-w-full max-h-[80vh] object-contain mx-auto"
              />
              {images[lightboxIndex].caption && (
                <p className="text-sm text-ds-muted-foreground text-center mt-4">
                  {images[lightboxIndex].caption}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={nextImage}
              className="absolute end-4 p-2 rounded-full text-ds-foreground hover:bg-ds-muted transition-colors"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
