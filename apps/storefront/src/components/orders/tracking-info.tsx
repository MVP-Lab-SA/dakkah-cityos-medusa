import { ArrowUpRightOnBox, TruckFast } from "@medusajs/icons"

interface TrackingEvent {
  date: string
  location: string
  status: string
  description: string
}

interface TrackingInfoProps {
  carrier?: string
  trackingNumber?: string
  trackingUrl?: string
  estimatedDelivery?: string
  events?: TrackingEvent[]
}

export function TrackingInfo({
  carrier,
  trackingNumber,
  trackingUrl,
  estimatedDelivery,
  events = [],
}: TrackingInfoProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!trackingNumber) {
    return (
      <div className="bg-ds-background rounded-xl border border-ds-border p-6">
        <h3 className="text-lg font-semibold text-ds-foreground mb-4">Tracking Information</h3>
        <div className="text-center py-8">
          <TruckFast className="w-12 h-12 text-ds-muted-foreground mx-auto mb-3" />
          <p className="text-ds-muted-foreground">Tracking information will be available once your order ships.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-ds-background rounded-xl border border-ds-border p-6">
      <h3 className="text-lg font-semibold text-ds-foreground mb-4">Tracking Information</h3>
      
      {/* Carrier & Tracking Number */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {carrier && (
          <div>
            <p className="text-xs text-ds-muted-foreground uppercase tracking-wider">Carrier</p>
            <p className="text-sm font-medium text-ds-foreground mt-1">{carrier}</p>
          </div>
        )}
        <div>
          <p className="text-xs text-ds-muted-foreground uppercase tracking-wider">Tracking Number</p>
          <p className="text-sm font-medium text-ds-foreground mt-1 font-mono">{trackingNumber}</p>
        </div>
      </div>

      {/* Estimated Delivery */}
      {estimatedDelivery && (
        <div className="bg-ds-info rounded-lg p-4 mb-6">
          <p className="text-sm text-ds-info">
            <span className="font-medium">Estimated Delivery:</span> {estimatedDelivery}
          </p>
        </div>
      )}

      {/* External Link */}
      {trackingUrl && (
        <a
          href={trackingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-ds-info hover:text-ds-info mb-6"
        >
          Track on {carrier || "carrier"} website
          <ArrowUpRightOnBox className="w-4 h-4" />
        </a>
      )}

      {/* Events Timeline */}
      {events.length > 0 && (
        <div className="border-t border-ds-border pt-4">
          <h4 className="text-sm font-semibold text-ds-foreground mb-4">Shipping Updates</h4>
          <div className="space-y-4">
            {events.map((event, index) => (
              <div key={index} className="flex gap-3">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-ds-muted mt-1.5" />
                  {index < events.length - 1 && (
                    <div className="absolute left-1/2 top-4 w-0.5 h-full -translate-x-1/2 bg-ds-muted" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-sm font-medium text-ds-foreground">{event.status}</p>
                  <p className="text-sm text-ds-muted-foreground">{event.description}</p>
                  <p className="text-xs text-ds-muted-foreground mt-1">
                    {formatDate(event.date)} - {event.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
