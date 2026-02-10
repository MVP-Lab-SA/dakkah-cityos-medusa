import { t, formatNumber, formatDate, type SupportedLocale } from "@/lib/i18n"

interface LoyaltyActivity {
  id: string
  type: "earned" | "redeemed" | "expired"
  points: number
  description: string
  date: string
}

interface LoyaltyReward {
  id: string
  title: string
  description: string
  pointsCost: number
  thumbnail?: string
  available: boolean
}

interface LoyaltyDashboardProps {
  balance: number
  currentTier: string
  nextTier?: string
  tierProgress: number
  pointsToNextTier: number
  expiringPoints: number
  expiringDate?: string
  recentActivity: LoyaltyActivity[]
  rewards: LoyaltyReward[]
  locale: string
  onRedeem?: (rewardId: string) => void
  isLoading?: boolean
}

const activityTypeColors: Record<string, string> = {
  earned: "text-ds-success",
  redeemed: "text-ds-primary",
  expired: "text-ds-destructive",
}

export function LoyaltyDashboard({
  balance,
  currentTier,
  nextTier,
  tierProgress,
  pointsToNextTier,
  expiringPoints,
  expiringDate,
  recentActivity,
  rewards,
  locale,
  onRedeem,
  isLoading,
}: LoyaltyDashboardProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-ds-muted rounded-lg animate-pulse" />
        <div className="h-24 bg-ds-muted rounded-lg animate-pulse" />
        <div className="h-48 bg-ds-muted rounded-lg animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-ds-background rounded-lg border border-ds-border p-6">
        <p className="text-sm text-ds-muted-foreground">
          {t(locale, "loyalty.points_balance")}
        </p>
        <p className="text-4xl font-bold text-ds-foreground mt-1">
          {formatNumber(balance, locale as SupportedLocale)}
        </p>
        <p className="text-sm text-ds-muted-foreground mt-1">
          {t(locale, "loyalty.points")}
        </p>
      </div>

      <div className="bg-ds-background rounded-lg border border-ds-border p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-ds-foreground">{currentTier}</span>
          {nextTier && (
            <span className="text-sm text-ds-muted-foreground">{nextTier}</span>
          )}
        </div>
        <div className="w-full bg-ds-muted rounded-full h-3">
          <div
            className="bg-ds-primary h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(tierProgress, 100)}%` }}
          />
        </div>
        {nextTier && (
          <p className="text-xs text-ds-muted-foreground mt-2">
            {formatNumber(pointsToNextTier, locale as SupportedLocale)} {t(locale, "loyalty.points_to_next_tier")}
          </p>
        )}
      </div>

      {expiringPoints > 0 && (
        <div className="bg-ds-destructive/10 rounded-lg border border-ds-destructive/20 p-4">
          <p className="text-sm font-medium text-ds-destructive">
            ⚠ {formatNumber(expiringPoints, locale as SupportedLocale)} {t(locale, "loyalty.points_expiring")}
            {expiringDate && (
              <span className="font-normal">
                {" "}{t(locale, "loyalty.by")} {formatDate(expiringDate, locale as SupportedLocale)}
              </span>
            )}
          </p>
        </div>
      )}

      {recentActivity.length > 0 && (
        <div className="bg-ds-background rounded-lg border border-ds-border p-6">
          <h3 className="font-semibold text-ds-foreground mb-4">
            {t(locale, "loyalty.recent_activity")}
          </h3>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between py-2 border-b border-ds-border last:border-b-0"
              >
                <div>
                  <p className="text-sm text-ds-foreground">{activity.description}</p>
                  <p className="text-xs text-ds-muted-foreground">
                    {formatDate(activity.date, locale as SupportedLocale)}
                  </p>
                </div>
                <span className={`text-sm font-semibold ${activityTypeColors[activity.type] || "text-ds-foreground"}`}>
                  {activity.type === "earned" ? "+" : activity.type === "redeemed" ? "-" : "-"}
                  {formatNumber(activity.points, locale as SupportedLocale)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {rewards.length > 0 && (
        <div>
          <h3 className="font-semibold text-ds-foreground mb-4">
            {t(locale, "loyalty.rewards")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className="bg-ds-background rounded-lg border border-ds-border overflow-hidden"
              >
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
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm font-semibold text-ds-foreground">
                      {formatNumber(reward.pointsCost, locale as SupportedLocale)} {t(locale, "loyalty.pts")}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRedeem?.(reward.id)}
                      disabled={!reward.available || balance < reward.pointsCost}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-ds-primary text-ds-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t(locale, "loyalty.redeem")}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
