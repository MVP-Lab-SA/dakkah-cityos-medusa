import { t, formatNumber, type SupportedLocale } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"
import type { RewardCardProps } from "@cityos/design-system"

export function RewardCard({
  reward,
  userBalance,
  onRedeem,
  locale: localeProp,
  className,
}: RewardCardProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const canRedeem = reward.available && userBalance >= reward.pointsCost

  return (
    <div className={`bg-ds-background border border-ds-border rounded-lg overflow-hidden ${className || ""}`}>
      {reward.thumbnail && (
        <div className="aspect-video bg-ds-muted">
          <img
            src={reward.thumbnail}
            alt={reward.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <h4 className="font-medium text-ds-foreground text-sm">{reward.title}</h4>
        <p className="text-xs text-ds-muted-foreground mt-1">{reward.description}</p>

        {reward.category && (
          <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-medium bg-ds-accent text-ds-foreground rounded-full">
            {reward.category}
          </span>
        )}

        <div className="flex items-center justify-between mt-3">
          <span className="text-sm font-semibold text-ds-foreground">
            {formatNumber(reward.pointsCost, locale as SupportedLocale)} {t(locale, "loyalty.pts")}
          </span>
          <button
            type="button"
            onClick={() => onRedeem?.(reward.id)}
            disabled={!canRedeem}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-ds-primary text-ds-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t(locale, "loyalty.redeem")}
          </button>
        </div>

        {!reward.available && (
          <p className="text-xs text-ds-destructive mt-2">
            {t(locale, "loyalty.reward_unavailable")}
          </p>
        )}
        {reward.available && userBalance < reward.pointsCost && (
          <p className="text-xs text-ds-warning mt-2">
            {t(locale, "loyalty.need_more_points").replace(
              "{points}",
              formatNumber(reward.pointsCost - userBalance, locale as SupportedLocale)
            )}
          </p>
        )}
      </div>
    </div>
  )
}
