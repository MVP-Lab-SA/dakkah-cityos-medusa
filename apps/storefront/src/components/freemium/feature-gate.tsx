import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { UpgradePrompt } from "./upgrade-prompt"
import type { ReactNode } from "react"

interface FeatureGateProps {
  locale?: string
  children: ReactNode
  hasAccess: boolean
  featureName: string
  benefits?: string[]
  onUpgrade?: () => void
  fallback?: ReactNode
  blurred?: boolean
}

export function FeatureGate({
  locale: localeProp,
  children,
  hasAccess,
  featureName,
  benefits = [],
  onUpgrade,
  fallback,
  blurred = true,
}: FeatureGateProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  if (hasAccess) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  if (blurred) {
    return (
      <div className="relative">
        <div className="blur-sm pointer-events-none select-none" aria-hidden="true">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-ds-background/30 backdrop-blur-[2px] rounded-lg">
          <UpgradePrompt
            locale={locale}
            featureName={featureName}
            benefits={benefits}
            onUpgrade={onUpgrade}
          />
        </div>
      </div>
    )
  }

  return (
    <UpgradePrompt
      locale={locale}
      featureName={featureName}
      benefits={benefits}
      onUpgrade={onUpgrade}
    />
  )
}
