import { Star } from "@medusajs/icons"
import type { ServiceProvider } from "../../lib/types/bookings"

interface ProviderSelectProps {
  providers: ServiceProvider[]
  selectedProvider: string | null
  onProviderSelect: (providerId: string) => void
}

export function ProviderSelect({
  providers,
  selectedProvider,
  onProviderSelect,
}: ProviderSelectProps) {
  if (providers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-ds-muted-foreground">No providers available for this service.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {providers.map((provider) => {
        const isSelected = selectedProvider === provider.id

        return (
          <button
            key={provider.id}
            onClick={() => onProviderSelect(provider.id)}
            className={`
              w-full flex items-center gap-4 p-4 rounded-xl text-start transition-all duration-200
              ${
                isSelected
                  ? "bg-ds-primary text-ds-primary-foreground"
                  : "bg-ds-background border border-ds-border hover:border-ds-border"
              }
            `}
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              {provider.avatar ? (
                <img
                  src={provider.avatar}
                  alt={provider.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium
                    ${isSelected ? "bg-ds-primary" : "bg-ds-muted text-ds-muted-foreground"}
                  `}
                >
                  {provider.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="font-medium">{provider.name}</div>
              {provider.bio && (
                <p
                  className={`text-sm truncate ${isSelected ? "text-ds-muted-foreground" : "text-ds-muted-foreground"}`}
                >
                  {provider.bio}
                </p>
              )}
            </div>

            {/* Rating */}
            {provider.rating && (
              <div
                className={`flex items-center gap-1 text-sm ${isSelected ? "text-ds-muted-foreground" : "text-ds-muted-foreground"}`}
              >
                <Star
                  className={`w-4 h-4 ${isSelected ? "text-ds-warning" : "text-ds-warning"}`}
                />
                <span className="font-medium">{provider.rating.toFixed(1)}</span>
                {provider.review_count && (
                  <span className={isSelected ? "text-ds-muted-foreground" : "text-ds-muted-foreground"}>
                    ({provider.review_count})
                  </span>
                )}
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}

interface ProviderCardProps {
  provider: ServiceProvider
  compact?: boolean
}

export function ProviderCard({ provider, compact }: ProviderCardProps) {
  return (
    <div className={`flex items-center gap-3 ${compact ? "" : "p-4 bg-ds-muted rounded-lg"}`}>
      {/* Avatar */}
      {provider.avatar ? (
        <img
          src={provider.avatar}
          alt={provider.name}
          className={`rounded-full object-cover ${compact ? "w-8 h-8" : "w-10 h-10"}`}
        />
      ) : (
        <div
          className={`rounded-full bg-ds-muted flex items-center justify-center text-ds-muted-foreground font-medium ${compact ? "w-8 h-8 text-sm" : "w-10 h-10"}`}
        >
          {provider.name.charAt(0)}
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className={`font-medium text-ds-foreground ${compact ? "text-sm" : ""}`}>
          {provider.name}
        </div>
        {!compact && provider.rating && (
          <div className="flex items-center gap-1 text-sm text-ds-muted-foreground">
            <Star className="w-3.5 h-3.5 text-ds-warning" />
            <span>{provider.rating.toFixed(1)}</span>
            {provider.review_count && (
              <span className="text-ds-muted-foreground">({provider.review_count} reviews)</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
