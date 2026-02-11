import { t, formatNumber, type SupportedLocale } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"
import type { RedeemRewardFormProps } from "@cityos/design-system"

export function RedeemRewardForm({
  reward,
  userBalance,
  onConfirm,
  onCancel,
  loading,
  locale: localeProp,
  className,
}: RedeemRewardFormProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const remainingBalance = userBalance - reward.pointsCost

  return (
    <div className={`bg-ds-background border border-ds-border rounded-lg p-4 md:p-6 ${className || ""}`}>
      <h3 className="text-lg font-semibold text-ds-foreground mb-4">
        {t(locale, "loyalty.confirm_redemption")}
      </h3>

      <div className="bg-ds-muted rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          {reward.thumbnail && (
            <img
              src={reward.thumbnail}
              alt={reward.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
          )}
          <div>
            <h4 className="font-medium text-ds-foreground">{reward.title}</h4>
            <p className="text-sm text-ds-muted-foreground mt-0.5">{reward.description}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-ds-muted-foreground">{t(locale, "loyalty.reward_cost")}</span>
          <span className="font-semibold text-ds-foreground">
            {formatNumber(reward.pointsCost, locale as SupportedLocale)} {t(locale, "loyalty.pts")}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-ds-muted-foreground">{t(locale, "loyalty.current_balance")}</span>
          <span className="text-ds-foreground">
            {formatNumber(userBalance, locale as SupportedLocale)} {t(locale, "loyalty.pts")}
          </span>
        </div>
        <div className="border-t border-ds-border pt-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ds-muted-foreground">{t(locale, "loyalty.remaining_balance")}</span>
            <span className={`font-semibold ${remainingBalance >= 0 ? "text-ds-success" : "text-ds-destructive"}`}>
              {formatNumber(remainingBalance, locale as SupportedLocale)} {t(locale, "loyalty.pts")}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 px-4 text-sm font-medium rounded-lg border border-ds-border text-ds-foreground hover:bg-ds-muted transition-colors"
        >
          {t(locale, "common.cancel")}
        </button>
        <button
          type="button"
          onClick={() => onConfirm(reward.id)}
          disabled={loading || remainingBalance < 0}
          className="flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg bg-ds-primary text-ds-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? t(locale, "common.loading") : t(locale, "loyalty.confirm_redeem")}
        </button>
      </div>
    </div>
  )
}
