import { t } from "@/lib/i18n"

const conditionStyles: Record<string, string> = {
  excellent: "border-ds-success bg-ds-success/10 text-ds-success",
  good: "border-ds-primary bg-ds-primary/10 text-ds-primary",
  fair: "border-ds-warning bg-ds-warning/10 text-ds-warning",
  poor: "border-ds-destructive bg-ds-destructive/10 text-ds-destructive",
}

export function ConditionGrader({
  selectedCondition,
  locale,
  onSelect,
}: {
  selectedCondition?: string
  locale: string
  onSelect?: (condition: string) => void
}) {
  const conditions = [
    { value: "excellent", key: "recommerce.excellent", descKey: "recommerce.excellent_desc", multiplier: 1.0 },
    { value: "good", key: "recommerce.good", descKey: "recommerce.good_desc", multiplier: 0.75 },
    { value: "fair", key: "recommerce.fair", descKey: "recommerce.fair_desc", multiplier: 0.5 },
    { value: "poor", key: "recommerce.poor", descKey: "recommerce.poor_desc", multiplier: 0.25 },
  ]

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-ds-foreground">
        {t(locale, "recommerce.grade_condition")}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {conditions.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => onSelect?.(c.value)}
            className={`p-4 rounded-xl border-2 text-start transition-colors ${
              selectedCondition === c.value
                ? conditionStyles[c.value]
                : "border-ds-border hover:border-ds-ring"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-ds-foreground">{t(locale, c.key)}</span>
              <span className="text-xs font-semibold">
                {Math.round(c.multiplier * 100)}%
              </span>
            </div>
            <p className="text-xs text-ds-muted-foreground">{t(locale, c.descKey)}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
