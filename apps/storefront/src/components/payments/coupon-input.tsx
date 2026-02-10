import { useState } from "react"
import { t, formatCurrency, type SupportedLocale } from "@/lib/i18n"
import { clsx } from "clsx"

interface CouponInputProps {
  locale: string
  currency?: string
  appliedCoupon?: {
    code: string
    discount: number
    type: "percentage" | "fixed"
  }
  onApply: (code: string) => void | Promise<void>
  onRemove: () => void | Promise<void>
  error?: string
}

export function CouponInput({
  locale,
  currency = "USD",
  appliedCoupon,
  onApply,
  onRemove,
  error,
}: CouponInputProps) {
  const loc = locale as SupportedLocale
  const [code, setCode] = useState("")
  const [isApplying, setIsApplying] = useState(false)

  const handleApply = async () => {
    if (!code.trim()) return
    setIsApplying(true)
    try {
      await onApply(code.trim())
      setCode("")
    } finally {
      setIsApplying(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleApply()
    }
  }

  if (appliedCoupon) {
    return (
      <div className="bg-ds-success/10 rounded-lg px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-ds-success">{t(locale, "payment.coupon_applied")}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-mono bg-ds-background text-ds-foreground px-2 py-0.5 rounded border border-ds-border">
                {appliedCoupon.code}
              </span>
              <span className="text-sm font-semibold text-ds-success">
                -{appliedCoupon.type === "percentage"
                  ? `${appliedCoupon.discount}%`
                  : formatCurrency(appliedCoupon.discount, currency, loc)}
              </span>
            </div>
          </div>
          <button
            onClick={onRemove}
            className="text-sm font-medium text-ds-destructive hover:underline"
          >
            {t(locale, "payment.remove")}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={handleKeyDown}
          placeholder={t(locale, "payment.enter_coupon")}
          className="flex-1 px-3 py-2 text-sm font-mono rounded-lg border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"
        />
        <button
          onClick={handleApply}
          disabled={!code.trim() || isApplying}
          className="px-4 py-2 text-sm font-medium bg-ds-primary text-ds-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {isApplying ? t(locale, "payment.applying") : t(locale, "payment.apply")}
        </button>
      </div>
      {error && (
        <p className="text-sm text-ds-destructive">{error}</p>
      )}
    </div>
  )
}
