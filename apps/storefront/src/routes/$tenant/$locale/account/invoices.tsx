// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import { AccountLayout } from "@/components/account"
import { t } from "@/lib/i18n"
import { useState, useEffect } from "react"
import { ReceiptPercent } from "@medusajs/icons"

export const Route = createFileRoute("/$tenant/$locale/account/invoices")({
  component: InvoicesPage,
  head: () => ({
    meta: [
      { title: "Invoices" },
      { name: "description", content: "View and download your invoices" },
    ],
  }),
})

function InvoicesPage() {
  const { tenant, locale } = Route.useParams() as { tenant: string; locale: string }
  const [mounted, setMounted] = useState(false)

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

  return (
    <AccountLayout title="Invoices" description="View and download your invoices">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-ds-foreground">Invoices</h1>
          <p className="text-sm text-ds-muted-foreground mt-1">View and download your invoices</p>
        </div>

        <div className="bg-ds-background rounded-lg border border-ds-border p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-ds-muted flex items-center justify-center mx-auto mb-4">
            <ReceiptPercent className="h-6 w-6 text-ds-muted-foreground" />
          </div>
          <p className="text-ds-muted-foreground">No invoices yet</p>
          <p className="text-xs text-ds-muted-foreground mt-2">Your invoices will appear here once orders are processed.</p>
        </div>
      </div>
    </AccountLayout>
  )
}
