import { useState } from "react"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"

type CouponStatus = "idle" | "loading" | "success" | "error"

interface CouponInputProps {
  locale?: string
  onApply?: (code: string) => Promise<{ success: boolean; message?: string }>
  onRemove?: () => void
  appliedCode?: string
  discountText?: string
}

export function CouponInput({ locale: localeProp, onApply, onRemove, appliedCode, discountText }: CouponInputProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [code, setCode] = useState("")
  const [status, setStatus] = useState<CouponStatus>(appliedCode ? "success" : "idle")
  const [message, setMessage] = useState("")

  const handleApply = async () => {
    if (!code.trim()) return
    setStatus("loading")
    setMessage("")

    if (onApply) {
      try {
        const result = await onApply(code.trim().toUpperCase())
        if (result.success) {
          setStatus("success")
          setMessage(result.message || t(locale, "flashSale.coupon_applied"))
        } else {
          setStatus("error")
          setMessage(result.message || t(locale, "flashSale.coupon_invalid"))
        }
      } catch {
        setStatus("error")
        setMessage(t(locale, "flashSale.coupon_invalid"))
      }
    } else {
      setStatus("success")
      setMessage(t(locale, "flashSale.coupon_applied"))
    }
  }

  const handleRemove = () => {
    setCode("")
    setStatus("idle")
    setMessage("")
    onRemove?.()
  }

  if (status === "success" && (appliedCode || code)) {
    return (
      <div className="flex items-center justify-between bg-ds-success/10 border border-ds-success/20 rounded-lg px-4 py-3">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-ds-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-ds-success">
              {t(locale, "flashSale.discount_applied")}
            </p>
            <p className="text-xs text-ds-success/80">
              {appliedCode || code} {discountText && `· ${discountText}`}
            </p>
          </div>
        </div>
        <button
          onClick={handleRemove}
          className="text-sm text-ds-destructive hover:underline"
        >
          {t(locale, "flashSale.remove_coupon")}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <svg
            className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ds-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase())
              if (status === "error") {
                setStatus("idle")
                setMessage("")
              }
            }}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            placeholder={t(locale, "flashSale.enter_coupon")}
            className={`w-full ps-10 pe-4 py-2.5 rounded-lg border text-sm text-ds-foreground placeholder:text-ds-muted-foreground bg-ds-card focus:outline-none focus:ring-2 focus:ring-ds-primary/50 ${
              status === "error" ? "border-ds-destructive" : "border-ds-border"
            }`}
          />
        </div>
        <button
          onClick={handleApply}
          disabled={!code.trim() || status === "loading"}
          className="px-5 py-2.5 bg-ds-primary text-ds-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {status === "loading" ? (
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            t(locale, "flashSale.apply_coupon")
          )}
        </button>
      </div>
      {message && status === "error" && (
        <p className="text-sm text-ds-destructive flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {message}
        </p>
      )}
    </div>
  )
}
