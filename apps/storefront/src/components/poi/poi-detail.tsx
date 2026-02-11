import { useTenant } from "@/lib/context/tenant-context"
import { t } from "@/lib/i18n"
import type { POI } from "@/lib/hooks/use-content"
import { POIGallery } from "./poi-gallery"
import { POIMapView } from "./poi-map-view"
import { POIReviews } from "./poi-reviews"

interface POIDetailData extends POI {
  fullDescription?: string
  photos?: string[]
  email?: string
  website?: string
  hoursDetail?: { day: string; open: string; close: string }[]
  amenities?: string[]
  reviews?: { id: string; author: string; avatar?: string; rating: number; content: string; createdAt: string; helpful?: number }[]
}

interface POIDetailProps {
  poi: POIDetailData
  locale?: string
}

function StarRating({ average, count }: { average: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-5 w-5 ${star <= Math.round(average) ? "text-ds-warning" : "text-ds-muted"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-sm font-medium text-ds-foreground ms-1">{average.toFixed(1)}</span>
      <span className="text-sm text-ds-muted-foreground">({count})</span>
    </div>
  )
}

export function POIDetail({ poi, locale: localeProp }: POIDetailProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  return (
    <div className="space-y-6">
      {poi.photos && poi.photos.length > 0 && (
        <POIGallery
          images={poi.photos.map((url) => ({ url, alt: poi.name }))}
          name={poi.name}
          locale={locale}
        />
      )}

      <div className="bg-ds-background rounded-lg border border-ds-border p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            {poi.category && (
              <span className="inline-block px-2.5 py-0.5 text-xs font-medium bg-ds-muted text-ds-muted-foreground rounded mb-2">
                {poi.category}
              </span>
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-ds-foreground">{poi.name}</h1>
          </div>
          {poi.rating && <StarRating average={poi.rating.average} count={poi.rating.count} />}
        </div>

        <p className="text-sm text-ds-muted-foreground flex items-start gap-1 mb-4">
          <svg className="h-4 w-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {poi.address}
        </p>

        {(poi.fullDescription || poi.description) && (
          <div className="prose prose-sm max-w-none text-ds-foreground mb-6">
            <p>{poi.fullDescription || poi.description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {poi.phone && (
            <div className="flex items-center gap-2 text-sm">
              <svg className="h-4 w-4 text-ds-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href={`tel:${poi.phone}`} className="text-ds-primary hover:underline">{poi.phone}</a>
            </div>
          )}
          {poi.email && (
            <div className="flex items-center gap-2 text-sm">
              <svg className="h-4 w-4 text-ds-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href={`mailto:${poi.email}`} className="text-ds-primary hover:underline">{poi.email}</a>
            </div>
          )}
          {poi.website && (
            <div className="flex items-center gap-2 text-sm">
              <svg className="h-4 w-4 text-ds-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <a href={poi.website} target="_blank" rel="noopener noreferrer" className="text-ds-primary hover:underline">
                {poi.website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
          {poi.distance && (
            <div className="flex items-center gap-2 text-sm text-ds-muted-foreground">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              {poi.distance}
            </div>
          )}
        </div>
      </div>

      {poi.hoursDetail && poi.hoursDetail.length > 0 && (
        <div className="bg-ds-background rounded-lg border border-ds-border p-6">
          <h2 className="text-lg font-semibold text-ds-foreground mb-4">{t(locale, "poi.hours")}</h2>
          <div className="space-y-2">
            {poi.hoursDetail.map((h, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-ds-foreground font-medium">{h.day}</span>
                <span className="text-ds-muted-foreground">{h.open} - {h.close}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {poi.amenities && poi.amenities.length > 0 && (
        <div className="bg-ds-background rounded-lg border border-ds-border p-6">
          <h2 className="text-lg font-semibold text-ds-foreground mb-4">{t(locale, "poi.amenities")}</h2>
          <div className="flex flex-wrap gap-2">
            {poi.amenities.map((amenity) => (
              <span
                key={amenity}
                className="px-3 py-1.5 text-sm bg-ds-muted text-ds-muted-foreground rounded-full"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-ds-background rounded-lg border border-ds-border p-6">
        <h2 className="text-lg font-semibold text-ds-foreground mb-4">{t(locale, "poi.location")}</h2>
        <POIMapView
          pois={[{
            id: poi.id,
            name: poi.name,
            address: poi.address,
            lat: poi.lat,
            lng: poi.lng,
            category: poi.category,
            rating: poi.rating,
          }]}
          center={{ lat: poi.lat, lng: poi.lng }}
          zoom={15}
          locale={locale}
        />
      </div>

      {poi.reviews && poi.reviews.length > 0 && (
        <POIReviews
          reviews={poi.reviews}
          averageRating={poi.rating?.average}
          totalCount={poi.rating?.count}
          locale={locale}
        />
      )}
    </div>
  )
}
