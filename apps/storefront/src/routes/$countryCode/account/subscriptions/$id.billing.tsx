import { createFileRoute, Link } from "@tanstack/react-router"
import { AccountLayout } from "@/components/account"
import { BillingHistory } from "@/components/subscriptions/billing-history"
import { PaymentMethodCard } from "@/components/subscriptions/payment-method-card"
import { ArrowLeft } from "@medusajs/icons"

export const Route = createFileRoute("/$countryCode/account/subscriptions/$id/billing")({
  component: BillingPage,
})

function BillingPage() {
  const { countryCode, id } = Route.useParams()

  // Mock data - would come from API
  const invoices = [
    { id: "inv_1", date: "2024-12-01", amount: 29, currency_code: "usd", status: "paid" as const },
    { id: "inv_2", date: "2024-11-01", amount: 29, currency_code: "usd", status: "paid" as const },
    { id: "inv_3", date: "2024-10-01", amount: 29, currency_code: "usd", status: "paid" as const },
    { id: "inv_4", date: "2024-09-01", amount: 29, currency_code: "usd", status: "paid" as const },
  ]

  const paymentMethod = {
    id: "pm_1",
    type: "card" as const,
    last4: "4242",
    brand: "Visa",
    expiryMonth: 12,
    expiryYear: 2025,
  }

  const handleDownloadInvoice = async (invoiceId: string) => {
    console.log("Downloading invoice:", invoiceId)
    // Would trigger PDF download
  }

  return (
    <AccountLayout>
      <div className="max-w-2xl">
        {/* Back Link */}
        <Link
          to={`/${countryCode}/account/subscriptions/${id}` as any}
          className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Subscription
        </Link>

        <h1 className="text-2xl font-bold text-zinc-900 mb-6">Billing & Payments</h1>

        <div className="space-y-6">
          <PaymentMethodCard 
            paymentMethod={paymentMethod} 
            onUpdate={() => console.log("Update payment method")}
          />
          
          <BillingHistory 
            invoices={invoices} 
            onDownload={handleDownloadInvoice}
          />
        </div>
      </div>
    </AccountLayout>
  )
}
