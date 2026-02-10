import type { MembershipBenefit } from "@/lib/hooks/use-memberships"

interface BenefitsListProps {
  benefits: MembershipBenefit[]
  showAll?: boolean
  maxVisible?: number
  variant?: "list" | "grid" | "compact"
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-ds-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg className="w-5 h-5 text-ds-muted-foreground/40 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

export function BenefitsList({
  benefits,
  showAll = false,
  maxVisible = 5,
  variant = "list",
}: BenefitsListProps) {
  const visibleBenefits = showAll ? benefits : benefits.slice(0, maxVisible)
  const hiddenCount = benefits.length - visibleBenefits.length

  if (variant === "compact") {
    return (
      <ul className="space-y-1.5">
        {visibleBenefits.map((benefit) => (
          <li
            key={benefit.id}
            className={`flex items-center gap-2 text-sm ${
              benefit.included ? "text-ds-foreground" : "text-ds-muted-foreground line-through"
            }`}
          >
            {benefit.included ? <CheckIcon /> : <XIcon />}
            <span>{benefit.title}</span>
          </li>
        ))}
        {hiddenCount > 0 && (
          <li className="text-xs text-ds-muted-foreground ps-7">
            +{hiddenCount} more
          </li>
        )}
      </ul>
    )
  }

  if (variant === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {visibleBenefits.map((benefit) => (
          <div
            key={benefit.id}
            className={`flex items-start gap-3 p-3 rounded-lg border ${
              benefit.included
                ? "border-ds-success/20 bg-ds-success/5"
                : "border-ds-border bg-ds-muted/50"
            }`}
          >
            {benefit.included ? <CheckIcon /> : <XIcon />}
            <div className="min-w-0">
              <p
                className={`text-sm font-medium ${
                  benefit.included ? "text-ds-foreground" : "text-ds-muted-foreground"
                }`}
              >
                {benefit.title}
              </p>
              {benefit.description && (
                <p className="text-xs text-ds-muted-foreground mt-0.5">
                  {benefit.description}
                </p>
              )}
              {benefit.value && benefit.included && (
                <p className="text-xs font-medium text-ds-primary mt-0.5">
                  {benefit.value}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {visibleBenefits.map((benefit) => (
        <li key={benefit.id} className="flex items-start gap-3">
          {benefit.included ? <CheckIcon /> : <XIcon />}
          <div className="min-w-0">
            <p
              className={`text-sm font-medium ${
                benefit.included ? "text-ds-foreground" : "text-ds-muted-foreground line-through"
              }`}
            >
              {benefit.title}
            </p>
            {benefit.description && (
              <p className="text-xs text-ds-muted-foreground mt-0.5">
                {benefit.description}
              </p>
            )}
            {benefit.value && benefit.included && (
              <p className="text-xs font-medium text-ds-primary mt-0.5">
                {benefit.value}
              </p>
            )}
          </div>
        </li>
      ))}
      {hiddenCount > 0 && (
        <li className="text-xs text-ds-muted-foreground ps-8">
          +{hiddenCount} more benefits
        </li>
      )}
    </ul>
  )
}
