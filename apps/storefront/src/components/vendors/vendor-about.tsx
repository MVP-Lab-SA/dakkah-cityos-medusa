import { MapPin, Clock, ArrowUpRightOnBox } from "@medusajs/icons"

interface VendorAboutProps {
  description?: string
  location?: string
  joinedDate?: string
  website?: string
  policies?: {
    shipping?: string
    returns?: string
  }
}

export function VendorAbout({ 
  description, 
  location, 
  joinedDate, 
  website,
  policies 
}: VendorAboutProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    })
  }

  return (
    <div className="bg-ds-background rounded-xl border border-ds-border overflow-hidden">
      <div className="px-6 py-4 border-b border-ds-border">
        <h3 className="text-lg font-semibold text-ds-foreground">About</h3>
      </div>
      
      <div className="p-6 space-y-6">
        {description && (
          <p className="text-ds-muted-foreground">{description}</p>
        )}

        <div className="flex flex-wrap gap-6">
          {location && (
            <div className="flex items-center gap-2 text-sm text-ds-muted-foreground">
              <MapPin className="w-4 h-4" />
              {location}
            </div>
          )}
          {joinedDate && (
            <div className="flex items-center gap-2 text-sm text-ds-muted-foreground">
              <Clock className="w-4 h-4" />
              Selling since {formatDate(joinedDate)}
            </div>
          )}
          {website && (
            <a 
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-ds-info hover:text-ds-info"
            >
              <ArrowUpRightOnBox className="w-4 h-4" />
              Visit Website
            </a>
          )}
        </div>

        {policies && (
          <div className="pt-4 border-t border-ds-border space-y-4">
            {policies.shipping && (
              <div>
                <h4 className="text-sm font-medium text-ds-foreground mb-1">Shipping Policy</h4>
                <p className="text-sm text-ds-muted-foreground">{policies.shipping}</p>
              </div>
            )}
            {policies.returns && (
              <div>
                <h4 className="text-sm font-medium text-ds-foreground mb-1">Return Policy</h4>
                <p className="text-sm text-ds-muted-foreground">{policies.returns}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
