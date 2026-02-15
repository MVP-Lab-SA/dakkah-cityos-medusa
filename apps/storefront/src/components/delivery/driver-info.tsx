import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { clsx } from "clsx"

interface DriverInfoProps {
  name: string
  photo?: string
  phone?: string
  onContact?: () => void
  locale?: string
  className?: string
}

export function DriverInfo({
  name,
  photo,
  phone,
  onContact,
  locale: localeProp,
  className,
}: DriverInfoProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  return (
    <div className={clsx("bg-ds-card border border-ds-border rounded-xl p-4 flex items-center gap-4", className)}>
      <div className="w-12 h-12 rounded-full bg-ds-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
        {photo ? (
          <img loading="lazy" src={photo} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xl">🚗</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ds-foreground">{name}</p>
        <p className="text-xs text-ds-muted-foreground">{t(locale, "tracking.your_driver")}</p>
        {phone && (
          <p className="text-xs text-ds-muted-foreground mt-0.5">{phone}</p>
        )}
      </div>
      {onContact && (
        <button
          onClick={onContact}
          className="px-3 py-1.5 text-xs font-medium bg-ds-primary text-ds-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex-shrink-0"
        >
          {t(locale, "tracking.call_driver")}
        </button>
      )}
    </div>
  )
}
