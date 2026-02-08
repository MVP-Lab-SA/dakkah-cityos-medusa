import { useInvoice, useInvoiceDownload, useEarlyPaymentDiscount, useApplyEarlyPayment } from "@/lib/hooks/use-invoices"
import { Button } from "@/components/ui/button"
import type { InvoiceItem } from "@/lib/types/invoices"

interface InvoiceDetailProps {
  invoiceId: string
}

export function InvoiceDetail({ invoiceId }: InvoiceDetailProps) {
  const { data: invoice, isLoading } = useInvoice(invoiceId)
  const { data: earlyPayment } = useEarlyPaymentDiscount(invoiceId)
  const downloadMutation = useInvoiceDownload()
  const applyEarlyPaymentMutation = useApplyEarlyPayment()

  if (isLoading) {
    return <div className="animate-pulse space-y-4"><div className="h-8 bg-muted rounded w-1/3"></div><div className="h-64 bg-muted rounded"></div></div>
  }

  if (!invoice) {
    return <div className="text-center py-12 text-muted-foreground">Invoice not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invoice {invoice.invoice_number}</h1>
          <p className="text-muted-foreground">
            Issued: {new Date(invoice.issued_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <InvoiceStatusBadge status={invoice.status} />
          <Button
            variant="outline"
            onClick={() => downloadMutation.mutate(invoiceId)}
            disabled={downloadMutation.isPending}
          >
            {downloadMutation.isPending ? "Generating..." : "Download PDF"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Subtotal</p>
          <p className="text-xl font-bold">${Number(invoice.subtotal).toFixed(2)}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Tax</p>
          <p className="text-xl font-bold">${Number(invoice.tax_total).toFixed(2)}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Total</p>
          <p className="text-xl font-bold">${Number(invoice.total).toFixed(2)}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Amount Due</p>
          <p className="text-xl font-bold text-red-600">${Number(invoice.amount_due).toFixed(2)}</p>
        </div>
      </div>

      {earlyPayment && invoice.status !== "paid" && (
        <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-green-800">Early Payment Discount Available</p>
              <p className="text-sm text-green-700">
                Pay by {new Date(earlyPayment.deadline).toLocaleDateString()} and save ${earlyPayment.savings.toFixed(2)} ({earlyPayment.discount_percentage}% off)
              </p>
              <p className="text-sm font-medium text-green-800 mt-1">
                Discounted total: ${earlyPayment.discounted_total.toFixed(2)}
              </p>
            </div>
            <Button
              onClick={() => applyEarlyPaymentMutation.mutate(invoiceId)}
              disabled={applyEarlyPaymentMutation.isPending}
            >
              {applyEarlyPaymentMutation.isPending ? "Processing..." : "Pay Now"}
            </Button>
          </div>
        </div>
      )}

      <div className="border rounded-lg">
        <div className="p-4 border-b bg-muted/20">
          <h2 className="font-semibold">Line Items</h2>
        </div>
        <div className="divide-y">
          {invoice.items.map((item: InvoiceItem) => (
            <div key={item.id} className="p-4 flex items-center gap-4">
              {item.thumbnail && (
                <img src={item.thumbnail} alt={item.title} className="w-12 h-12 object-cover rounded" />
              )}
              <div className="flex-1">
                <p className="font-medium">{item.title}</p>
                {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                <p className="text-sm text-muted-foreground">
                  {item.quantity} x ${Number(item.unit_price).toFixed(2)}
                </p>
              </div>
              <p className="font-semibold">${Number(item.total).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {invoice.billing_address && (
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Billing Address</h3>
          <div className="text-sm text-muted-foreground">
            <p>{invoice.billing_address.first_name} {invoice.billing_address.last_name}</p>
            {invoice.billing_address.company && <p>{invoice.billing_address.company}</p>}
            <p>{invoice.billing_address.address_1}</p>
            {invoice.billing_address.address_2 && <p>{invoice.billing_address.address_2}</p>}
            <p>{invoice.billing_address.city}, {invoice.billing_address.province} {invoice.billing_address.postal_code}</p>
            <p>{invoice.billing_address.country_code?.toUpperCase()}</p>
          </div>
        </div>
      )}

      {invoice.notes && (
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Notes</h3>
          <p className="text-sm text-muted-foreground">{invoice.notes}</p>
        </div>
      )}
    </div>
  )
}

function InvoiceStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800",
    issued: "bg-blue-100 text-blue-800",
    sent: "bg-indigo-100 text-indigo-800",
    paid: "bg-green-100 text-green-800",
    partially_paid: "bg-yellow-100 text-yellow-800",
    overdue: "bg-red-100 text-red-800",
    void: "bg-gray-100 text-gray-600",
    cancelled: "bg-gray-100 text-gray-600",
  }
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status] || "bg-gray-100"}`}>
      {status.replace("_", " ")}
    </span>
  )
}
