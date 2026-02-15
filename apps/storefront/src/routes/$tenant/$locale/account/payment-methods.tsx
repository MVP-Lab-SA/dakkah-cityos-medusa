// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import { AccountLayout } from "@/components/account"
import { t } from "@/lib/i18n"
import { useState, useEffect } from "react"
import { CreditCard, Plus } from "@medusajs/icons"

export const Route = createFileRoute("/$tenant/$locale/account/payment-methods")({
  component: PaymentMethodsPage,
  head: () => ({
    meta: [
      { title: "Payment Methods" },
      { name: "description", content: "Manage your saved payment methods" },
    ],
  }),
})

function PaymentMethodsPage() {
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
    <AccountLayout title="Payment Methods" description="Manage your saved payment methods">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ds-foreground">Payment Methods</h1>
            <p className="text-sm text-ds-muted-foreground mt-1">Manage your saved payment methods</p>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-ds-primary rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            Add Payment Method
          </button>
        </div>

        <div className="bg-ds-background rounded-lg border border-ds-border p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-ds-muted flex items-center justify-center mx-auto mb-4">
            <CreditCard className="h-6 w-6 text-ds-muted-foreground" />
          </div>
          <p className="text-ds-muted-foreground">No payment methods saved yet</p>
          <p className="text-xs text-ds-muted-foreground mt-2">Add a payment method to make checkout faster and easier.</p>
        </div>
      </div>
    </AccountLayout>
  )
}
