import { useState } from "react"
import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"
import type { GiftCardRedeemProps } from "@cityos/design-system"

export function GiftCardRedeem({
  onRedeem,
  loading,
  error,
  success,
  locale: localeProp,
  className,
}: GiftCardRedeemProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [code, setCode] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.trim()) {
      onRedeem(code.trim())
    }
  }

  return (
    <div className={`bg-ds-background border border-ds-border rounded-lg p-4 md:p-6 ${className || ""}`}>
      <h3 className="text-lg font-semibold text-ds-foreground mb-2">
        {t(locale, "giftCards.redeem_title")}
      </h3>
      <p className="text-sm text-ds-muted-foreground mb-4">
        {t(locale, "giftCards.redeem_description")}
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder={t(locale, "giftCards.enter_code")}
            className="w-full px-3 py-2 border border-ds-border rounded-lg text-sm text-ds-foreground bg-ds-background font-mono tracking-wider uppercase"
            maxLength={20}
          />
        </div>

        {error && (
          <div className="px-3 py-2 bg-ds-destructive/10 rounded-lg">
            <p className="text-sm text-ds-destructive">{error}</p>
          </div>
        )}

        {success && (
          <div className="px-3 py-2 bg-ds-success/10 rounded-lg">
            <p className="text-sm text-ds-success">{t(locale, "giftCards.redeem_success")}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="w-full py-2.5 px-4 bg-ds-primary text-ds-primary-foreground text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? t(locale, "common.loading") : t(locale, "giftCards.redeem_button")}
        </button>
      </form>
    </div>
  )
}
