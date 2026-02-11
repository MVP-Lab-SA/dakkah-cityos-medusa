import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"

interface UpgradePromptProps {
  locale?: string
  featureName: string
  benefits?: string[]
  onUpgrade?: () => void
  onDismiss?: () => void
  variant?: "inline" | "banner" | "modal"
}

export function UpgradePrompt({
  locale: localeProp,
  featureName,
  benefits = [],
  onUpgrade,
  onDismiss,
  variant = "inline",
}: UpgradePromptProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  if (variant === "banner") {
    return (
      <div className="bg-gradient-to-r from-ds-primary/10 to-ds-accent/10 border border-ds-primary/20 rounded-lg px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-ds-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="h-4 w-4 text-ds-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-ds-foreground">
              {t(locale, "freemium.upgrade_to_unlock")}
            </p>
            <p className="text-xs text-ds-muted-foreground">{featureName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onDismiss && (
            <button onClick={onDismiss} className="text-sm text-ds-muted-foreground hover:text-ds-foreground">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {onUpgrade && (
            <button
              onClick={onUpgrade}
              className="px-4 py-1.5 bg-ds-primary text-ds-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              {t(locale, "freemium.upgrade")}
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-ds-card rounded-xl border border-ds-border p-6 text-center max-w-sm mx-auto">
      <div className="w-14 h-14 bg-ds-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="h-7 w-7 text-ds-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>

      <h3 className="text-lg font-semibold text-ds-foreground mb-1">
        {t(locale, "freemium.upgrade_to_unlock")}
      </h3>
      <p className="text-sm text-ds-muted-foreground mb-4">
        {t(locale, "freemium.feature_locked")}
      </p>

      {benefits.length > 0 && (
        <ul className="space-y-2 mb-6 text-start">
          {benefits.map((benefit, idx) => (
            <li key={idx} className="flex items-center gap-2 text-sm text-ds-foreground">
              <svg className="h-4 w-4 text-ds-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {benefit}
            </li>
          ))}
        </ul>
      )}

      <div className="space-y-2">
        {onUpgrade && (
          <button
            onClick={onUpgrade}
            className="w-full py-2.5 bg-ds-primary text-ds-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {t(locale, "freemium.upgrade_now")}
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="w-full py-2 text-sm text-ds-muted-foreground hover:text-ds-foreground transition-colors"
          >
            {t(locale, "freemium.get_started_free")}
          </button>
        )}
      </div>
    </div>
  )
}
