import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"

interface Feature {
  name: string
  free: boolean | string
  premium: boolean | string
}

interface FreeTierCardProps {
  locale?: string
  features: Feature[]
  freePlanName?: string
  premiumPlanName?: string
  premiumPrice?: string
  premiumPeriod?: "month" | "year"
  onUpgrade?: () => void
  onGetStartedFree?: () => void
  currentPlan?: "free" | "premium"
}

export function FreeTierCard({
  locale: localeProp,
  features,
  freePlanName,
  premiumPlanName,
  premiumPrice,
  premiumPeriod = "month",
  onUpgrade,
  onGetStartedFree,
  currentPlan,
}: FreeTierCardProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === "string") return <span className="text-sm text-ds-foreground">{value}</span>
    if (value) {
      return (
        <svg className="h-5 w-5 text-ds-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    }
    return (
      <svg className="h-5 w-5 text-ds-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className={`bg-ds-card rounded-xl border ${currentPlan === "free" ? "border-ds-primary" : "border-ds-border"} p-6`}>
        <div className="text-center mb-6">
          {currentPlan === "free" && (
            <span className="text-xs bg-ds-primary/10 text-ds-primary px-2.5 py-1 rounded-full font-medium mb-2 inline-block">
              {t(locale, "freemium.current_plan")}
            </span>
          )}
          <h3 className="text-lg font-bold text-ds-foreground">
            {freePlanName || t(locale, "freemium.free_plan")}
          </h3>
          <p className="text-3xl font-bold text-ds-foreground mt-2">$0</p>
          <p className="text-sm text-ds-muted-foreground">{t(locale, "freemium.no_credit_card")}</p>
        </div>

        <ul className="space-y-3 mb-6">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-3">
              {renderFeatureValue(feature.free)}
              <span className={`text-sm ${feature.free ? "text-ds-foreground" : "text-ds-muted-foreground"}`}>
                {feature.name}
              </span>
            </li>
          ))}
        </ul>

        {onGetStartedFree && currentPlan !== "free" && (
          <button
            onClick={onGetStartedFree}
            className="w-full py-2.5 border border-ds-border rounded-lg text-sm font-medium text-ds-foreground hover:bg-ds-muted transition-colors"
          >
            {t(locale, "freemium.get_started_free")}
          </button>
        )}
      </div>

      <div className={`bg-ds-card rounded-xl border-2 ${currentPlan === "premium" ? "border-ds-primary" : "border-ds-primary/50"} p-6 relative`}>
        <div className="absolute -top-3 start-1/2 -translate-x-1/2">
          <span className="bg-ds-primary text-ds-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
            {t(locale, "freemium.popular")}
          </span>
        </div>

        <div className="text-center mb-6">
          {currentPlan === "premium" && (
            <span className="text-xs bg-ds-primary/10 text-ds-primary px-2.5 py-1 rounded-full font-medium mb-2 inline-block">
              {t(locale, "freemium.current_plan")}
            </span>
          )}
          <h3 className="text-lg font-bold text-ds-foreground">
            {premiumPlanName || t(locale, "freemium.paid_plan")}
          </h3>
          <div className="mt-2">
            <span className="text-3xl font-bold text-ds-foreground">{premiumPrice || "$29"}</span>
            <span className="text-sm text-ds-muted-foreground">
              {premiumPeriod === "month" ? t(locale, "freemium.per_month") : t(locale, "freemium.per_year")}
            </span>
          </div>
          <p className="text-sm text-ds-muted-foreground">{t(locale, "freemium.cancel_anytime")}</p>
        </div>

        <ul className="space-y-3 mb-6">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-3">
              {renderFeatureValue(feature.premium)}
              <span className={`text-sm ${feature.premium ? "text-ds-foreground" : "text-ds-muted-foreground"}`}>
                {feature.name}
              </span>
            </li>
          ))}
        </ul>

        {onUpgrade && currentPlan !== "premium" && (
          <button
            onClick={onUpgrade}
            className="w-full py-2.5 bg-ds-primary text-ds-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {t(locale, "freemium.upgrade_now")}
          </button>
        )}
      </div>
    </div>
  )
}
