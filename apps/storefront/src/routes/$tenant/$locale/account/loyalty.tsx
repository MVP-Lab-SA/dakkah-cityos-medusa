import { createFileRoute } from "@tanstack/react-router"
import { AccountLayout } from "@/components/account"
import { LoyaltyDashboard } from "@/components/commerce/loyalty-dashboard"
import { useLoyaltyPoints } from "@/lib/hooks/use-commerce-extras"
import { t, formatNumber, formatDate, type SupportedLocale } from "@/lib/i18n"

export const Route = createFileRoute("/$tenant/$locale/account/loyalty")({
  component: LoyaltyPage,
})

function LoyaltyPage() {
  const { locale } = Route.useParams() as { tenant: string; locale: string }
  const { data: loyalty, isLoading } = useLoyaltyPoints()

  return (
    <AccountLayout
      title={t(locale, "loyalty.title")}
      description={t(locale, "loyalty.description")}
    >
      {isLoading ? (
        <div className="space-y-4">
          <div className="h-32 bg-ds-muted rounded-lg animate-pulse" />
          <div className="h-24 bg-ds-muted rounded-lg animate-pulse" />
          <div className="h-48 bg-ds-muted rounded-lg animate-pulse" />
        </div>
      ) : !loyalty ? (
        <div className="bg-ds-background rounded-lg border border-ds-border p-12 text-center">
          <p className="text-4xl mb-4">🎯</p>
          <h3 className="text-lg font-semibold text-ds-foreground mb-2">
            {t(locale, "loyalty.no_points_title")}
          </h3>
          <p className="text-sm text-ds-muted-foreground">
            {t(locale, "loyalty.no_points_description")}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <LoyaltyDashboard
            balance={loyalty.balance}
            currentTier={loyalty.currentTier}
            nextTier={loyalty.nextTier}
            tierProgress={loyalty.tierProgress}
            pointsToNextTier={loyalty.pointsToNextTier}
            expiringPoints={loyalty.expiringPoints}
            expiringDate={loyalty.expiringDate}
            recentActivity={loyalty.recentActivity}
            rewards={loyalty.rewards}
            locale={locale}
          />

          {loyalty.recentActivity.length > 0 && (
            <div className="bg-ds-background rounded-lg border border-ds-border overflow-hidden">
              <div className="px-6 py-4 border-b border-ds-border">
                <h3 className="font-semibold text-ds-foreground">
                  {t(locale, "loyalty.points_history")}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-ds-muted">
                      <th className="text-start px-6 py-3 font-medium text-ds-muted-foreground">
                        {t(locale, "loyalty.date")}
                      </th>
                      <th className="text-start px-6 py-3 font-medium text-ds-muted-foreground">
                        {t(locale, "loyalty.description")}
                      </th>
                      <th className="text-start px-6 py-3 font-medium text-ds-muted-foreground">
                        {t(locale, "loyalty.type")}
                      </th>
                      <th className="text-end px-6 py-3 font-medium text-ds-muted-foreground">
                        {t(locale, "loyalty.points")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loyalty.recentActivity.map((activity) => (
                      <tr key={activity.id} className="border-b border-ds-border last:border-b-0">
                        <td className="px-6 py-3 text-ds-muted-foreground">
                          {formatDate(activity.date, locale as SupportedLocale)}
                        </td>
                        <td className="px-6 py-3 text-ds-foreground">{activity.description}</td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                            activity.type === "earned"
                              ? "bg-ds-success/10 text-ds-success"
                              : activity.type === "redeemed"
                              ? "bg-ds-primary/10 text-ds-primary"
                              : "bg-ds-destructive/10 text-ds-destructive"
                          }`}>
                            {t(locale, `loyalty.type_${activity.type}`)}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-end font-medium">
                          <span className={
                            activity.type === "earned"
                              ? "text-ds-success"
                              : "text-ds-destructive"
                          }>
                            {activity.type === "earned" ? "+" : "-"}
                            {formatNumber(activity.points, locale as SupportedLocale)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </AccountLayout>
  )
}
