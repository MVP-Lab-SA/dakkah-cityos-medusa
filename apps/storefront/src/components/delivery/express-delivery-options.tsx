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

interface ExpressDeliveryOptionsProps {
  options: DeliverySpeedOption[]
  selectedId?: string
  onSelect: (optionId: string) => void
  showPrices?: boolean
  locale?: string
  className?: string
}

const typeIcons: Record<string, string> = {
  "same-day": "⚡",
  express: "🚀",
  "next-day": "📦",
  standard: "🚚",
  scheduled: "📅",
}

export function ExpressDeliveryOptions({
  options,
  selectedId,
  onSelect,
  showPrices = true,
  locale: localeProp,
  className,
}: ExpressDeliveryOptionsProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  if (options.length === 0) {
    return (
      <div className={clsx("bg-ds-card border border-ds-border rounded-xl p-6 text-center", className)}>
        <p className="text-ds-muted-foreground text-sm">{t(locale, "expressDelivery.no_options")}</p>
      </div>
    )
  }

  return (
    <div className={clsx("space-y-3", className)}>
      <h3 className="text-base font-semibold text-ds-foreground">
        {t(locale, "expressDelivery.select_speed")}
      </h3>
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => option.available && onSelect(option.id)}
          disabled={!option.available}
          className={clsx(
            "w-full flex items-center gap-4 p-4 rounded-xl border text-start transition-all",
            selectedId === option.id
              ? "border-ds-primary bg-ds-primary/5 ring-2 ring-ds-primary/20"
              : option.available
                ? "border-ds-border bg-ds-card hover:border-ds-primary/50"
                : "border-ds-border bg-ds-muted opacity-50 cursor-not-allowed"
          )}
        >
          <span className="text-2xl">{typeIcons[option.type] || "📦"}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-ds-foreground">{option.label}</p>
            <p className="text-xs text-ds-muted-foreground">{option.estimatedTime}</p>
            {option.cutoffTime && (
              <p className="text-xs text-ds-warning mt-0.5">
                {t(locale, "expressDelivery.order_before").replace("{time}", option.cutoffTime)}
              </p>
            )}
          </div>
          {showPrices && (
            <div className="text-end">
              <p className="text-sm font-semibold text-ds-foreground">
                {option.price.amount === 0
                  ? t(locale, "commerce.free")
                  : formatCurrency(option.price.amount, option.price.currency, locale as SupportedLocale)}
              </p>
            </div>
          )}
          {selectedId === option.id && (
            <div className="w-5 h-5 rounded-full bg-ds-primary flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-ds-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </button>
      ))}
    </div>
  )
}
