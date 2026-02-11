import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { clsx } from "clsx"

interface DriverInfoCardProps {
  name: string
  photo?: string
  phone?: string
  rating?: number
  vehicleType?: string
  vehiclePlate?: string
  onCall?: () => void
  onMessage?: () => void
  locale?: string
  className?: string
}

export function DriverInfoCard({
  name,
  photo,
  phone: _phone,
  rating,
  vehicleType,
  vehiclePlate,
  onCall,
  onMessage,
  locale: localeProp,
  className,
}: DriverInfoCardProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  return (
    <div className={clsx("bg-ds-card border border-ds-border rounded-lg p-4", className)}>
      <div className="flex items-center gap-3">
        {photo ? (
          <img
            src={photo}
            alt={name}
            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-ds-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-lg">🧑‍✈️</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-ds-foreground text-sm">{name}</h4>
          <p className="text-xs text-ds-muted-foreground">{t(locale, "tracking.your_driver")}</p>
          {rating !== undefined && (
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-xs text-ds-warning">★</span>
              <span className="text-xs font-medium text-ds-foreground">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {onCall && (
            <button
              onClick={onCall}
              className="w-9 h-9 rounded-full bg-ds-success/10 text-ds-success flex items-center justify-center hover:bg-ds-success/20 transition-colors"
              aria-label={t(locale, "tracking.call_driver")}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
            </button>
          )}
          {onMessage && (
            <button
              onClick={onMessage}
              className="w-9 h-9 rounded-full bg-ds-primary/10 text-ds-primary flex items-center justify-center hover:bg-ds-primary/20 transition-colors"
              aria-label={t(locale, "tracking.message_driver")}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {(vehicleType || vehiclePlate) && (
        <div className="mt-3 pt-3 border-t border-ds-border flex items-center gap-3">
          <span className="text-lg">🚗</span>
          <div className="flex-1">
            {vehicleType && (
              <p className="text-xs text-ds-foreground">{vehicleType}</p>
            )}
            {vehiclePlate && (
              <p className="text-xs text-ds-muted-foreground font-mono">{vehiclePlate}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
