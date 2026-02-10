import { createFileRoute } from "@tanstack/react-router"
import { t, formatCurrency, type SupportedLocale } from "@/lib/i18n"
import { useState } from "react"

export const Route = createFileRoute("/$tenant/$locale/trade-in")({
  component: TradeInPage,
})

const steps = [
  { icon: "1", key: "commerce.trade_in_step_1" },
  { icon: "2", key: "commerce.trade_in_step_2" },
  { icon: "3", key: "commerce.trade_in_step_3" },
  { icon: "4", key: "commerce.trade_in_step_4" },
]

const sampleCategories = [
  "electronics",
  "phones",
  "laptops",
  "tablets",
  "wearables",
]

function TradeInPage() {
  const { locale } = Route.useParams() as { tenant: string; locale: string }
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCondition, setSelectedCondition] = useState<"excellent" | "good" | "fair" | "poor">("good")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const conditionMultipliers: Record<string, number> = {
    excellent: 1.0,
    good: 0.75,
    fair: 0.5,
    poor: 0.25,
  }

  const estimatedBase = 150
  const estimatedValue = estimatedBase * conditionMultipliers[selectedCondition]

  return (
    <div className="min-h-screen bg-ds-muted">
      <div className="bg-ds-background border-b border-ds-border">
        <div className="content-container py-12 sm:py-16 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-ds-foreground">
            {t(locale, "commerce.trade_in_title")}
          </h1>
          <p className="mt-3 text-lg text-ds-muted-foreground max-w-2xl mx-auto">
            {t(locale, "commerce.trade_in_subtitle")}
          </p>
        </div>
      </div>

      <div className="content-container py-8 sm:py-12">
        <div className="mb-12">
          <h2 className="text-xl font-bold text-ds-foreground text-center mb-8">
            {t(locale, "commerce.how_it_works")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div
                key={step.key}
                className="bg-ds-background rounded-lg border border-ds-border p-6 text-center"
              >
                <div className="w-10 h-10 rounded-full bg-ds-primary text-ds-primary-foreground flex items-center justify-center mx-auto text-lg font-bold mb-4">
                  {step.icon}
                </div>
                <p className="text-sm text-ds-foreground font-medium">
                  {t(locale, step.key)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-ds-foreground mb-4">
            {t(locale, "commerce.find_product")}
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t(locale, "commerce.search_placeholder")}
              className="flex-1 px-4 py-3 bg-ds-background border border-ds-border rounded-lg text-sm text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"
            />
            <button
              type="button"
              className="px-6 py-3 bg-ds-primary text-ds-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              {t(locale, "common.search")}
            </button>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {sampleCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                  selectedCategory === cat
                    ? "border-ds-primary bg-ds-primary text-ds-primary-foreground"
                    : "border-ds-border bg-ds-background text-ds-muted-foreground hover:bg-ds-muted"
                }`}
              >
                {t(locale, `commerce.category_${cat}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-ds-background rounded-lg border border-ds-border p-6 sm:p-8">
          <h2 className="text-xl font-bold text-ds-foreground mb-6">
            {t(locale, "commerce.value_estimator")}
          </h2>

          <div className="mb-6">
            <p className="text-sm font-medium text-ds-foreground mb-3">
              {t(locale, "commerce.select_condition")}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(["excellent", "good", "fair", "poor"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedCondition(c)}
                  className={`px-4 py-3 text-sm rounded-lg border transition-colors ${
                    selectedCondition === c
                      ? "border-ds-primary bg-ds-primary text-ds-primary-foreground"
                      : "border-ds-border bg-ds-background text-ds-muted-foreground hover:bg-ds-muted"
                  }`}
                >
                  <span className="font-medium">{t(locale, `commerce.condition_${c}`)}</span>
                  <span className="block text-xs mt-0.5 opacity-75">
                    {Math.round(conditionMultipliers[c] * 100)}%
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-ds-muted rounded-lg p-6 text-center">
            <p className="text-sm text-ds-muted-foreground mb-1">
              {t(locale, "commerce.estimated_value")}
            </p>
            <p className="text-4xl font-bold text-ds-primary">
              {formatCurrency(estimatedValue, "USD", locale as SupportedLocale)}
            </p>
            <p className="text-xs text-ds-muted-foreground mt-2">
              {t(locale, "commerce.estimate_disclaimer")}
            </p>
          </div>

          <button
            type="button"
            className="mt-6 w-full px-4 py-3 bg-ds-primary text-ds-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            {t(locale, "commerce.submit_trade_in")}
          </button>
        </div>
      </div>
    </div>
  )
}
