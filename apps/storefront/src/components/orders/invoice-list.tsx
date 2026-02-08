import { useInvoices, useInvoiceDownload } from "@/lib/hooks/use-invoices"
import { Button } from "@/components/ui/button"
import type { Invoice, InvoiceStatus } from "@/lib/types/invoices"

interface InvoiceListProps {
  statusFilter?: InvoiceStatus[]
}

export function InvoiceList({ statusFilter }: InvoiceListProps) {
  const { data, isLoading } = useInvoices(statusFilter ? { status: statusFilter } : undefined)
  const downloadMutation = useInvoiceDownload()

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  const invoices = data?.invoices || []

  if (invoices.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">No invoices found</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg divide-y">
      {invoices.map((invoice: Invoice) => (
        <div key={invoice.id} className="p-4 flex items-center justify-between">
          <div>
            <p className="font-medium">{invoice.invoice_number}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(invoice.issued_at).toLocaleDateString()} - Due {new Date(invoice.due_date).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bold">${Number(invoice.total).toFixed(2)}</span>
            <StatusBadge status={invoice.status} />
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadMutation.mutate(invoice.id)}
              disabled={downloadMutation.isPending}
            >
              Download
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
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
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[status] || "bg-gray-100"}`}>{status.replace("_", " ")}</span>
}
