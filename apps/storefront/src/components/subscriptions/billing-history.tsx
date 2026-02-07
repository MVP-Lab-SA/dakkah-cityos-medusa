import { formatPrice } from "@/lib/utils/price"
import { Button } from "@/components/ui/button"
import { ArrowDownTray, Check, XMark, Clock } from "@medusajs/icons"

interface Invoice {
  id: string
  date: string
  amount: number
  currency_code: string
  status: "paid" | "pending" | "failed"
  downloadUrl?: string
}

interface BillingHistoryProps {
  invoices: Invoice[]
  onDownload?: (invoiceId: string) => Promise<void>
}

export function BillingHistory({ invoices, onDownload }: BillingHistoryProps) {
  const getStatusIcon = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return <Check className="w-4 h-4 text-green-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "failed":
        return <XMark className="w-4 h-4 text-red-600" />
    }
  }

  const getStatusText = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return "Paid"
      case "pending":
        return "Pending"
      case "failed":
        return "Failed"
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (invoices.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-zinc-200 p-8 text-center">
        <p className="text-zinc-500">No billing history yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-zinc-200">
        <h3 className="text-lg font-semibold text-zinc-900">Billing History</h3>
      </div>
      
      <div className="divide-y divide-zinc-100">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                {getStatusIcon(invoice.status)}
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900">
                  {formatDate(invoice.date)}
                </p>
                <p className="text-xs text-zinc-500">{getStatusText(invoice.status)}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-medium text-zinc-900">
                {formatPrice(invoice.amount, invoice.currency_code)}
              </span>
              {invoice.status === "paid" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDownload?.(invoice.id)}
                >
                  <ArrowDownTray className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
