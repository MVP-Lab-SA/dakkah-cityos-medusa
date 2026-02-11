import { createFileRoute } from "@tanstack/react-router"
import { AccountLayout } from "@/components/account"
import { DisputeCard } from "@/components/payments/disputes/dispute-card"
import { t } from "@/lib/i18n"
import { useState, useEffect } from "react"
import { clsx } from "clsx"

export const Route = createFileRoute("/$tenant/$locale/account/disputes")({
  component: DisputesPage,
})

type DisputeFilter = "all" | "open" | "resolved"

function DisputesPage() {
  const { tenant, locale } = Route.useParams() as { tenant: string; locale: string }
  const [mounted, setMounted] = useState(false)
  const [filter, setFilter] = useState<DisputeFilter>("all")

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-ds-muted flex items-center justify-center">
        <p className="text-sm text-ds-muted-foreground">{t(locale, "common.loading")}</p>
      </div>
    )
  }

  const filters: { key: DisputeFilter; label: string }[] = [
    { key: "all", label: t(locale, "disputes.filter_all") },
    { key: "open", label: t(locale, "disputes.filter_open") },
    { key: "resolved", label: t(locale, "disputes.filter_resolved") },
  ]

  return (
    <AccountLayout locale={locale} tenant={tenant}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-ds-foreground">{t(locale, "disputes.title")}</h1>
          <p className="text-sm text-ds-muted-foreground mt-1">{t(locale, "disputes.subtitle")}</p>
        </div>

        <div className="flex gap-2 border-b border-ds-border">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={clsx(
                "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px",
                filter === f.key
                  ? "border-ds-primary text-ds-primary"
                  : "border-transparent text-ds-muted-foreground hover:text-ds-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="bg-ds-background rounded-lg border border-ds-border p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-ds-muted flex items-center justify-center mx-auto mb-4">
            <span className="text-xl text-ds-muted-foreground">⚖</span>
          </div>
          <p className="text-ds-muted-foreground">{t(locale, "disputes.no_disputes")}</p>
          <p className="text-xs text-ds-muted-foreground mt-2">{t(locale, "disputes.no_disputes_description")}</p>
        </div>
      </div>
    </AccountLayout>
  )
}
