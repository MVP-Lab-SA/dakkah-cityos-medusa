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
        return <Check className="w-4 h-4 text-ds-success" />
      case "pending":
        return <Clock className="w-4 h-4 text-ds-warning" />
      case "failed":
        return <XMark className="w-4 h-4 text-ds-destructive" />
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
      <div className="bg-ds-background rounded-xl border border-ds-border p-8 text-center">
        <p className="text-ds-muted-foreground">No billing history yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-ds-background rounded-xl border border-ds-border overflow-hidden">
      <div className="px-6 py-4 border-b border-ds-border">
        <h3 className="text-lg font-semibold text-ds-foreground">Billing History</h3>
      </div>
      
      <div className="divide-y divide-ds-border">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-ds-muted flex items-center justify-center">
                {getStatusIcon(invoice.status)}
              </div>
              <div>
                <p className="text-sm font-medium text-ds-foreground">
                  {formatDate(invoice.date)}
                </p>
                <p className="text-xs text-ds-muted-foreground">{getStatusText(invoice.status)}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-medium text-ds-foreground">
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
