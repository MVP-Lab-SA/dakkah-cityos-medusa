import { useEffect, useState } from "react"
import { t, formatNumber, type SupportedLocale } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"
import type { PointsBalanceProps } from "@cityos/design-system"

export function PointsBalance({
  balance,
  lifetimeEarned,
  lifetimeRedeemed,
  animated = false,
  locale: localeProp,
  className,
}: PointsBalanceProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [displayBalance, setDisplayBalance] = useState(animated ? 0 : balance)

  useEffect(() => {
    if (!animated) {
      setDisplayBalance(balance)
      return
    }
    const duration = 1000
    const steps = 30
    const increment = balance / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= balance) {
        setDisplayBalance(balance)
        clearInterval(timer)
      } else {
        setDisplayBalance(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [balance, animated])

  return (
    <div className={`bg-ds-background border border-ds-border rounded-lg p-4 md:p-6 ${className || ""}`}>
      <p className="text-sm text-ds-muted-foreground">
        {t(locale, "loyalty.points_balance")}
      </p>
      <p className="text-4xl font-bold text-ds-foreground mt-1">
        {formatNumber(displayBalance, locale as SupportedLocale)}
      </p>
      <p className="text-sm text-ds-muted-foreground mt-1">
        {t(locale, "loyalty.points")}
      </p>

      {(lifetimeEarned !== undefined || lifetimeRedeemed !== undefined) && (
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-ds-border">
          {lifetimeEarned !== undefined && (
            <div>
              <p className="text-xs text-ds-muted-foreground">
                {t(locale, "loyalty.lifetime_earned")}
              </p>
              <p className="text-lg font-semibold text-ds-success">
                {formatNumber(lifetimeEarned, locale as SupportedLocale)}
              </p>
            </div>
          )}
          {lifetimeRedeemed !== undefined && (
            <div>
              <p className="text-xs text-ds-muted-foreground">
                {t(locale, "loyalty.lifetime_redeemed")}
              </p>
              <p className="text-lg font-semibold text-ds-primary">
                {formatNumber(lifetimeRedeemed, locale as SupportedLocale)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
