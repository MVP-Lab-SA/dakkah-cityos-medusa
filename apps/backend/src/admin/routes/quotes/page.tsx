import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button, Badge, Select, Input, Label, Textarea, toast } from "@medusajs/ui"
import { DocumentText, CheckCircle, XCircle, Eye, CurrencyDollar } from "@medusajs/icons"
import { useState } from "react"
import { 
  useQuotes, useQuote, useApproveQuote, useRejectQuote, useUpdateQuote,
  Quote 
} from "../../hooks/use-quotes"
import { DataTable } from "../../components/tables/data-table"
import { StatusBadge } from "../../components/common"
import { StatsGrid } from "../../components/charts/stats-grid"
import { ConfirmModal } from "../../components/modals/confirm-modal"
import { FormDrawer } from "../../components/forms/form-drawer"
import { MoneyDisplay } from "../../components/common/money-display"

const QuotesPage = () => {
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [viewingQuote, setViewingQuote] = useState<Quote | null>(null)
  const [approvingQuote, setApprovingQuote] = useState<Quote | null>(null)
  const [rejectingQuote, setRejectingQuote] = useState<Quote | null>(null)
  
  const [approvalForm, setApprovalForm] = useState({
    custom_discount_percentage: 0,
    discount_reason: "",
    valid_until: "",
    internal_notes: "",
  })
  
  const [rejectionReason, setRejectionReason] = useState("")

  const { data: quotesData, isLoading } = useQuotes(
    statusFilter ? { status: statusFilter } : undefined
  )
  const { data: quoteDetailData } = useQuote(viewingQuote?.id || "")
  
  const approveQuote = useApproveQuote()
  const rejectQuote = useRejectQuote()

  const quotes = quotesData?.quotes || []
  const quoteDetail = quoteDetailData?.quote

  const stats = [
    { label: "Total Quotes", value: quotes.length, icon: <DocumentText className="w-5 h-5" /> },
    { label: "Pending Review", value: quotes.filter(q => ["submitted", "under_review"].includes(q.status)).length, color: "orange" as const },
    { label: "Approved", value: quotes.filter(q => q.status === "approved").length, color: "green" as const },
    { label: "Accepted", value: quotes.filter(q => q.status === "accepted").length, color: "blue" as const },
  ]

  const totalValue = quotes
    .filter(q => ["approved", "accepted"].includes(q.status))
    .reduce((sum, q) => sum + Number(q.total || 0), 0)

  const handleApprove = async () => {
    if (!approvingQuote) return
    try {
      const validUntil = approvalForm.valid_until || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
      await approveQuote.mutateAsync({
        id: approvingQuote.id,
        custom_discount_percentage: approvalForm.custom_discount_percentage || undefined,
        discount_reason: approvalForm.discount_reason || undefined,
        valid_until: validUntil,
        internal_notes: approvalForm.internal_notes || undefined,
      })
      toast.success("Quote approved")
      setApprovingQuote(null)
      resetApprovalForm()
    } catch (error) {
      toast.error("Failed to approve quote")
    }
  }

  const handleReject = async () => {
    if (!rejectingQuote) return
    try {
      await rejectQuote.mutateAsync({
        id: rejectingQuote.id,
        rejection_reason: rejectionReason,
      })
      toast.success("Quote rejected")
      setRejectingQuote(null)
      setRejectionReason("")
    } catch (error) {
      toast.error("Failed to reject quote")
    }
  }

  const resetApprovalForm = () => {
    setApprovalForm({
      custom_discount_percentage: 0,
      discount_reason: "",
      valid_until: "",
      internal_notes: "",
    })
  }

  const openApproveDrawer = (quote: Quote) => {
    setApprovalForm({
      custom_discount_percentage: quote.custom_discount_percentage || 0,
      discount_reason: quote.discount_reason || "",
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      internal_notes: quote.internal_notes || "",
    })
    setApprovingQuote(quote)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "grey"
      case "submitted":
      case "under_review": return "orange"
      case "approved": return "green"
      case "rejected": return "red"
      case "accepted": return "blue"
      case "declined": return "red"
      case "expired": return "grey"
      default: return "grey"
    }
  }

  const isQuoteExpired = (quote: Quote) => {
    if (!quote.valid_until) return false
    return new Date(quote.valid_until) < new Date()
  }

  const columns = [
    { key: "quote_number", header: "Quote #", sortable: true, cell: (q: Quote) => (
      <Text className="font-mono font-medium">{q.quote_number || q.id.slice(0, 8)}</Text>
    )},
    { key: "company", header: "Company / Customer", cell: (q: Quote) => (
      <div>
        <Text className="font-medium">{q.company?.name || "Individual"}</Text>
        <Text className="text-ui-fg-muted text-sm">
          {q.customer ? `${q.customer.first_name || ""} ${q.customer.last_name || ""}`.trim() || q.customer.email : q.customer_email}
        </Text>
      </div>
    )},
    { key: "items", header: "Items", cell: (q: Quote) => `${q.items_count || 0} items` },
    { key: "total", header: "Total", sortable: true, cell: (q: Quote) => (
      <MoneyDisplay amount={Number(q.total || q.total_amount || 0)} currency={q.currency_code} />
    )},
    { key: "discount", header: "Discount", cell: (q: Quote) => (
      q.custom_discount_percentage ? (
        <Badge color="purple">{q.custom_discount_percentage}% off</Badge>
      ) : "-"
    )},
    { key: "valid_until", header: "Valid Until", cell: (q: Quote) => (
      q.valid_until ? (
        <div>
          <Text className={isQuoteExpired(q) ? "text-ui-tag-red-text" : ""}>
            {new Date(q.valid_until).toLocaleDateString()}
          </Text>
          {isQuoteExpired(q) && <Badge color="red" className="text-xs">Expired</Badge>}
        </div>
      ) : "-"
    )},
    { key: "status", header: "Status", cell: (q: Quote) => (
      <Badge color={getStatusColor(q.status) as any}>{q.status.replace("_", " ")}</Badge>
    )},
    { key: "created_at", header: "Created", sortable: true, cell: (q: Quote) => (
      new Date(q.created_at).toLocaleDateString()
    )},
    { key: "actions", header: "", width: "140px", cell: (q: Quote) => (
      <div className="flex gap-1">
        <Button variant="transparent" size="small" onClick={() => setViewingQuote(q)}>
          <Eye className="w-4 h-4" />
        </Button>
        {["submitted", "under_review"].includes(q.status) && (
          <>
            <Button variant="secondary" size="small" onClick={() => openApproveDrawer(q)}>
              <CheckCircle className="w-4 h-4 text-ui-tag-green-icon" />
            </Button>
            <Button variant="secondary" size="small" onClick={() => setRejectingQuote(q)}>
              <XCircle className="w-4 h-4 text-ui-tag-red-icon" />
            </Button>
          </>
        )}
      </div>
    )},
  ]

  return (
    <Container className="p-0">
      <div className="p-6 border-b border-ui-border-base">
        <div className="flex items-center justify-between">
          <div>
            <Heading level="h1">Quotes</Heading>
            <Text className="text-ui-fg-muted">Manage B2B quote requests</Text>
          </div>
          <div className="text-right">
            <Text className="text-ui-fg-muted text-sm">Approved Value</Text>
            <Text className="font-semibold text-lg">
              ${(totalValue / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </Text>
          </div>
        </div>
      </div>

      <div className="p-6">
        <StatsGrid stats={stats} columns={4} />
      </div>

      <div className="px-6 pb-6">
        <div className="flex gap-4 mb-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <Select.Trigger className="w-[180px]">
              <Select.Value placeholder="All Statuses" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="">All Statuses</Select.Item>
              <Select.Item value="submitted">Submitted</Select.Item>
              <Select.Item value="under_review">Under Review</Select.Item>
              <Select.Item value="approved">Approved</Select.Item>
              <Select.Item value="rejected">Rejected</Select.Item>
              <Select.Item value="accepted">Accepted</Select.Item>
              <Select.Item value="declined">Declined</Select.Item>
              <Select.Item value="expired">Expired</Select.Item>
            </Select.Content>
          </Select>
        </div>

        <DataTable 
          data={quotes} 
          columns={columns} 
          searchable 
          searchPlaceholder="Search quotes..." 
          searchKeys={["quote_number", "customer_email"]}
          loading={isLoading}
          emptyMessage="No quotes found"
        />
      </div>

      {/* View Quote Drawer */}
      <FormDrawer
        open={!!viewingQuote}
        onOpenChange={() => setViewingQuote(null)}
        title={`Quote ${viewingQuote?.quote_number || viewingQuote?.id.slice(0, 8)}`}
        onSubmit={() => setViewingQuote(null)}
        submitLabel="Close"
      >
        {(viewingQuote || quoteDetail) && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <Text className="text-ui-fg-muted text-sm">Company</Text>
                <Text className="font-medium">{quoteDetail?.company?.name || viewingQuote?.company?.name || "Individual"}</Text>
              </div>
              <Badge color={getStatusColor(viewingQuote?.status || "") as any}>
                {viewingQuote?.status?.replace("_", " ")}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Text className="text-ui-fg-muted">Customer</Text>
                <Text>{quoteDetail?.customer?.email || viewingQuote?.customer_email}</Text>
              </div>
              <div>
                <Text className="text-ui-fg-muted">Created</Text>
                <Text>{new Date(viewingQuote?.created_at || "").toLocaleDateString()}</Text>
              </div>
              {viewingQuote?.valid_until && (
                <div>
                  <Text className="text-ui-fg-muted">Valid Until</Text>
                  <Text className={isQuoteExpired(viewingQuote) ? "text-ui-tag-red-text" : ""}>
                    {new Date(viewingQuote.valid_until).toLocaleDateString()}
                  </Text>
                </div>
              )}
              {viewingQuote?.reviewed_at && (
                <div>
                  <Text className="text-ui-fg-muted">Reviewed At</Text>
                  <Text>{new Date(viewingQuote.reviewed_at).toLocaleDateString()}</Text>
                </div>
              )}
            </div>

            {quoteDetail?.items && quoteDetail.items.length > 0 && (
              <div>
                <Text className="text-ui-fg-muted text-sm mb-2">Line Items</Text>
                <div className="border border-ui-border-base rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-ui-bg-subtle">
                      <tr>
                        <th className="text-left p-2">Item</th>
                        <th className="text-right p-2">Qty</th>
                        <th className="text-right p-2">Price</th>
                        <th className="text-right p-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quoteDetail.items.map((item, idx) => (
                        <tr key={idx} className="border-t border-ui-border-base">
                          <td className="p-2">{item.title}</td>
                          <td className="text-right p-2">{item.quantity}</td>
                          <td className="text-right p-2">${(item.unit_price / 100).toFixed(2)}</td>
                          <td className="text-right p-2">${(item.total / 100).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="border-t border-ui-border-base pt-4 space-y-2">
              <div className="flex justify-between">
                <Text className="text-ui-fg-muted">Subtotal</Text>
                <Text>${(Number(viewingQuote?.subtotal || 0) / 100).toFixed(2)}</Text>
              </div>
              {viewingQuote?.custom_discount_percentage && (
                <div className="flex justify-between text-ui-tag-green-text">
                  <Text>Discount ({viewingQuote.custom_discount_percentage}%)</Text>
                  <Text>-${(Number(viewingQuote.discount_total || 0) / 100).toFixed(2)}</Text>
                </div>
              )}
              <div className="flex justify-between font-semibold text-lg border-t border-ui-border-base pt-2">
                <Text>Total</Text>
                <Text>${(Number(viewingQuote?.total || 0) / 100).toFixed(2)}</Text>
              </div>
            </div>

            {viewingQuote?.customer_notes && (
              <div>
                <Text className="text-ui-fg-muted text-sm">Customer Notes</Text>
                <Text className="bg-ui-bg-subtle p-2 rounded mt-1">{viewingQuote.customer_notes}</Text>
              </div>
            )}

            {viewingQuote?.rejection_reason && (
              <div>
                <Text className="text-ui-fg-muted text-sm">Rejection Reason</Text>
                <Text className="text-ui-tag-red-text">{viewingQuote.rejection_reason}</Text>
              </div>
            )}

            {viewingQuote?.internal_notes && (
              <div>
                <Text className="text-ui-fg-muted text-sm">Internal Notes</Text>
                <Text>{viewingQuote.internal_notes}</Text>
              </div>
            )}
          </div>
        )}
      </FormDrawer>

      {/* Approve Quote Drawer */}
      <FormDrawer
        open={!!approvingQuote}
        onOpenChange={(open) => { if (!open) { setApprovingQuote(null); resetApprovalForm() } }}
        title="Approve Quote"
        onSubmit={handleApprove}
        submitLabel="Approve"
        loading={approveQuote.isPending}
      >
        {approvingQuote && (
          <div className="space-y-4">
            <div className="bg-ui-bg-subtle p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <Text className="font-medium">{approvingQuote.company?.name || "Individual"}</Text>
                <Text className="font-medium">${(Number(approvingQuote.total || 0) / 100).toFixed(2)}</Text>
              </div>
              <Text className="text-ui-fg-muted text-sm">{approvingQuote.items_count || 0} items</Text>
            </div>

            <div>
              <Label>Discount Percentage</Label>
              <Input 
                type="number" 
                value={approvalForm.custom_discount_percentage} 
                onChange={(e) => setApprovalForm({ ...approvalForm, custom_discount_percentage: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                max={100}
              />
              <Text className="text-ui-fg-muted text-xs mt-1">Optional discount to apply</Text>
            </div>

            <div>
              <Label>Discount Reason</Label>
              <Input 
                value={approvalForm.discount_reason} 
                onChange={(e) => setApprovalForm({ ...approvalForm, discount_reason: e.target.value })}
                placeholder="Bulk order, loyal customer, etc."
              />
            </div>

            <div>
              <Label>Valid Until</Label>
              <Input 
                type="date" 
                value={approvalForm.valid_until} 
                onChange={(e) => setApprovalForm({ ...approvalForm, valid_until: e.target.value })}
              />
            </div>

            <div>
              <Label>Internal Notes</Label>
              <Textarea 
                value={approvalForm.internal_notes} 
                onChange={(e) => setApprovalForm({ ...approvalForm, internal_notes: e.target.value })}
                placeholder="Notes for internal use only"
              />
            </div>
          </div>
        )}
      </FormDrawer>

      {/* Reject Quote Modal */}
      <ConfirmModal 
        open={!!rejectingQuote} 
        onOpenChange={() => { setRejectingQuote(null); setRejectionReason("") }}
        title="Reject Quote"
        description={
          <div className="space-y-4">
            <Text>Reject this quote request?</Text>
            <div>
              <Label>Reason for Rejection</Label>
              <Textarea 
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Provide a reason (visible to customer)"
              />
            </div>
          </div>
        }
        onConfirm={handleReject}
        confirmLabel="Reject Quote"
        variant="danger"
        loading={rejectQuote.isPending}
      />
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Quotes",
  icon: DocumentText,
})

export default QuotesPage
