import { createFileRoute } from "@tanstack/react-router"
import { AccountLayout } from "@/components/account"
import { ReferralPanel } from "@/components/commerce/referral-panel"
import { useReferralInfo } from "@/lib/hooks/use-commerce-extras"
import { t, formatDate, formatCurrency, type SupportedLocale } from "@/lib/i18n"

export const Route = createFileRoute("/$tenant/$locale/account/referrals")({
  component: ReferralsPage,
})

const referralStatusColors: Record<string, string> = {
  pending: "bg-ds-muted text-ds-muted-foreground",
  completed: "bg-ds-success/10 text-ds-success",
  expired: "bg-ds-destructive/10 text-ds-destructive",
}

function ReferralsPage() {
  const { locale } = Route.useParams() as { tenant: string; locale: string }
  const { data: referral, isLoading } = useReferralInfo()

  return (
    <AccountLayout
      title={t(locale, "referral.title")}
      description={t(locale, "referral.description")}
    >
      {isLoading ? (
        <div className="space-y-4">
          <div className="h-64 bg-ds-muted rounded-lg animate-pulse" />
          <div className="h-48 bg-ds-muted rounded-lg animate-pulse" />
        </div>
      ) : !referral ? (
        <div className="bg-ds-background rounded-lg border border-ds-border p-12 text-center">
          <p className="text-4xl mb-4">🎁</p>
          <h3 className="text-lg font-semibold text-ds-foreground mb-2">
            {t(locale, "referral.no_referrals_title")}
          </h3>
          <p className="text-sm text-ds-muted-foreground">
            {t(locale, "referral.no_referrals_description")}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <ReferralPanel
            code={referral.code}
            link={referral.link}
            totalReferred={referral.totalReferred}
            totalEarned={referral.totalEarned}
            currencyCode={referral.currencyCode}
            rewardDescription={referral.rewardDescription}
            locale={locale}
          />

          {referral.history.length > 0 && (
            <div className="bg-ds-background rounded-lg border border-ds-border overflow-hidden">
              <div className="px-6 py-4 border-b border-ds-border">
                <h3 className="font-semibold text-ds-foreground">
                  {t(locale, "referral.history")}
                </h3>
              </div>
              <div className="divide-y divide-ds-border">
                {referral.history.map((item) => (
                  <div key={item.id} className="flex items-center justify-between px-6 py-4">
                    <div>
                      <p className="text-sm text-ds-foreground">{item.referredEmail}</p>
                      <p className="text-xs text-ds-muted-foreground mt-0.5">
                        {formatDate(item.date, locale as SupportedLocale)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                        referralStatusColors[item.status] || referralStatusColors.pending
                      }`}>
                        {t(locale, `referral.status_${item.status}`)}
                      </span>
                      {item.reward > 0 && (
                        <span className="text-sm font-medium text-ds-success">
                          +{formatCurrency(item.reward, referral.currencyCode, locale as SupportedLocale)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </AccountLayout>
  )
}
