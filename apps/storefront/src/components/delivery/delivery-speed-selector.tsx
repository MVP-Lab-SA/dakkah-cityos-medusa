import { t, formatCurrency, type SupportedLocale } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { clsx } from "clsx"

interface DeliverySpeedOption {
  id: string
  type: "standard" | "express" | "same-day" | "next-day" | "scheduled"
  label: string
  estimatedTime: string
  price: { amount: number; currency: string }
  available: boolean
  cutoffTime?: string
}

interface DeliverySpeedSelectorProps {
  options: DeliverySpeedOption[]
  selectedId?: string
  onSelect: (optionId: string) => void
  locale?: string
  className?: string
}

const typeIcons: Record<string, string> = {
  standard: "📦",
  express: "🚀",
  "same-day": "⚡",
  "next-day": "🌅",
  scheduled: "📅",
}

export function DeliverySpeedSelector({
  options,
  selectedId,
  onSelect,
  locale: localeProp,
  className,
}: DeliverySpeedSelectorProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  if (!options.length) {
    return (
      <div className={clsx("bg-ds-muted rounded-lg p-6 text-center", className)}>
        <p className="text-ds-muted-foreground text-sm">{t(locale, "expressDelivery.no_options")}</p>
      </div>
    )
  }

  return (
    <div className={clsx("space-y-3", className)}>
      <h3 className="text-base font-semibold text-ds-foreground">
        {t(locale, "expressDelivery.select_speed")}
      </h3>
      <div className="space-y-2">
        {options.map((option) => {
          const isSelected = selectedId === option.id

          return (
            <button
              key={option.id}
              onClick={() => option.available && onSelect(option.id)}
              disabled={!option.available}
              className={clsx(
                "w-full text-start rounded-lg border p-4 transition-all",
                isSelected
                  ? "border-ds-primary bg-ds-primary/5 ring-2 ring-ds-primary"
                  : "border-ds-border bg-ds-background hover:border-ds-foreground",
                !option.available && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xl flex-shrink-0">{typeIcons[option.type] || "📦"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-ds-foreground text-sm">{option.label}</span>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-ds-primary flex items-center justify-center flex-shrink-0">
                          <svg className="w-2.5 h-2.5 text-ds-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-ds-muted-foreground mt-0.5">{option.estimatedTime}</p>
                    {option.cutoffTime && (
                      <p className="text-xs text-ds-warning mt-0.5">
                        {t(locale, "expressDelivery.order_before").replace("{time}", option.cutoffTime)}
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-sm font-semibold text-ds-foreground flex-shrink-0">
                  {option.price.amount === 0
                    ? t(locale, "delivery.free")
                    : formatCurrency(option.price.amount, option.price.currency, locale as SupportedLocale)}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
