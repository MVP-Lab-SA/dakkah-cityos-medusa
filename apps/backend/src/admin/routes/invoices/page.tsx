import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button, Badge, Input, toast, Label, Textarea } from "@medusajs/ui"
import { DocumentText, Plus, CurrencyDollar, XMark, Eye, PaperPlane } from "@medusajs/icons"
import { useState } from "react"
import { 
  useInvoices, useSendInvoice, useRecordPayment, useVoidInvoice, useCreateInvoice, 
  Invoice 
} from "../../hooks/use-invoices"
import { useCompanies } from "../../hooks/use-companies"
import { DataTable } from "../../components/tables/data-table"
import { StatusBadge } from "../../components/common"
import { StatsGrid } from "../../components/charts/stats-grid"
import { ConfirmModal } from "../../components/modals/confirm-modal"
import { FormDrawer } from "../../components/forms/form-drawer"
import { MoneyDisplay } from "../../components/common/money-display"

const InvoicesPage = () => {
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [showCreateDrawer, setShowCreateDrawer] = useState(false)
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null)
  const [sendingInvoice, setSendingInvoice] = useState<Invoice | null>(null)
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null)
  const [voidingInvoice, setVoidingInvoice] = useState<Invoice | null>(null)
  const [paymentAmount, setPaymentAmount] = useState<string>("")
  const [voidReason, setVoidReason] = useState<string>("")

  const [createFormData, setCreateFormData] = useState({
    company_id: "",
    issue_date: new Date().toISOString().split("T")[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    payment_terms: "Net 30",
    payment_terms_days: 30,
    notes: "",
    items: [{ title: "", quantity: 1, unit_price: 0 }],
  })

  const { data: invoicesData, isLoading } = useInvoices(statusFilter ? { status: statusFilter } : undefined)
  const { data: companiesData } = useCompanies()
  
  const sendInvoice = useSendInvoice()
  const recordPayment = useRecordPayment()
  const voidInvoice = useVoidInvoice()
  const createInvoice = useCreateInvoice()

  const invoices = invoicesData?.invoices || []
  const companies = companiesData?.companies || []

  const stats = [
    { label: "Total Invoices", value: invoices.length, icon: <DocumentText className="w-5 h-5" /> },
    { label: "Draft", value: invoices.filter(i => i.status === "draft").length },
    { label: "Sent", value: invoices.filter(i => i.status === "sent").length, color: "blue" as const },
    { label: "Paid", value: invoices.filter(i => i.status === "paid").length, color: "green" as const },
    { label: "Overdue", value: invoices.filter(i => i.status === "overdue").length, color: "red" as const },
  ]

  const totalOutstanding = invoices
    .filter(i => ["sent", "overdue"].includes(i.status))
    .reduce((sum, i) => sum + Number(i.amount_due), 0)

  const handleSendInvoice = async () => {
    if (!sendingInvoice) return
    try {
      await sendInvoice.mutateAsync(sendingInvoice.id)
      toast.success("Invoice sent successfully")
      setSendingInvoice(null)
    } catch (error) {
      toast.error("Failed to send invoice")
    }
  }

  const handleRecordPayment = async () => {
    if (!payingInvoice) return
    try {
      const amount = paymentAmount ? parseFloat(paymentAmount) : undefined
      await recordPayment.mutateAsync({ id: payingInvoice.id, amount })
      toast.success("Payment recorded")
      setPayingInvoice(null)
      setPaymentAmount("")
    } catch (error) {
      toast.error("Failed to record payment")
    }
  }

  const handleVoidInvoice = async () => {
    if (!voidingInvoice) return
    try {
      await voidInvoice.mutateAsync({ id: voidingInvoice.id, reason: voidReason })
      toast.success("Invoice voided")
      setVoidingInvoice(null)
      setVoidReason("")
    } catch (error) {
      toast.error("Failed to void invoice")
    }
  }

  const handleCreateInvoice = async () => {
    try {
      const validItems = createFormData.items.filter(item => item.title && item.unit_price > 0)
      if (validItems.length === 0) {
        toast.error("Add at least one valid item")
        return
      }
      
      await createInvoice.mutateAsync({
        ...createFormData,
        items: validItems,
      })
      toast.success("Invoice created")
      setShowCreateDrawer(false)
      resetCreateForm()
    } catch (error) {
      toast.error("Failed to create invoice")
    }
  }

  const resetCreateForm = () => {
    setCreateFormData({
      company_id: "",
      issue_date: new Date().toISOString().split("T")[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      payment_terms: "Net 30",
      payment_terms_days: 30,
      notes: "",
      items: [{ title: "", quantity: 1, unit_price: 0 }],
    })
  }

  const addItem = () => {
    setCreateFormData({
      ...createFormData,
      items: [...createFormData.items, { title: "", quantity: 1, unit_price: 0 }],
    })
  }

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...createFormData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setCreateFormData({ ...createFormData, items: newItems })
  }

  const removeItem = (index: number) => {
    if (createFormData.items.length === 1) return
    const newItems = createFormData.items.filter((_, i) => i !== index)
    setCreateFormData({ ...createFormData, items: newItems })
  }

  const columns = [
    { key: "invoice_number", header: "Invoice #", sortable: true, cell: (inv: Invoice) => (
      <Text className="font-mono font-medium">{inv.invoice_number}</Text>
    )},
    { key: "company", header: "Company", cell: (inv: Invoice) => (
      <div>
        <Text className="font-medium">{inv.company?.name || "-"}</Text>
        {inv.customer && (
          <Text className="text-ui-fg-muted text-sm">{inv.customer.email}</Text>
        )}
      </div>
    )},
    { key: "issue_date", header: "Issue Date", sortable: true, cell: (inv: Invoice) => (
      new Date(inv.issue_date).toLocaleDateString()
    )},
    { key: "due_date", header: "Due Date", sortable: true, cell: (inv: Invoice) => (
      <div>
        <Text>{new Date(inv.due_date).toLocaleDateString()}</Text>
        {inv.status === "overdue" && (
          <Text className="text-ui-tag-red-text text-sm">
            {Math.floor((Date.now() - new Date(inv.due_date).getTime()) / (1000 * 60 * 60 * 24))} days overdue
          </Text>
        )}
      </div>
    )},
    { key: "total", header: "Amount", sortable: true, cell: (inv: Invoice) => (
      <MoneyDisplay amount={Number(inv.total)} currency={inv.currency_code} />
    )},
    { key: "amount_due", header: "Balance Due", sortable: true, cell: (inv: Invoice) => (
      <MoneyDisplay 
        amount={Number(inv.amount_due)} 
        currency={inv.currency_code}
        className={Number(inv.amount_due) > 0 ? "text-ui-tag-red-text font-medium" : "text-ui-tag-green-text"}
      />
    )},
    { key: "status", header: "Status", cell: (inv: Invoice) => <StatusBadge status={inv.status} /> },
    { key: "actions", header: "", width: "160px", cell: (inv: Invoice) => (
      <div className="flex gap-1">
        <Button variant="transparent" size="small" onClick={() => setViewingInvoice(inv)}>
          <Eye className="w-4 h-4" />
        </Button>
        {inv.status === "draft" && (
          <Button variant="secondary" size="small" onClick={() => setSendingInvoice(inv)}>
            <PaperAirplane className="w-4 h-4" />
          </Button>
        )}
        {["sent", "overdue"].includes(inv.status) && (
          <>
            <Button variant="secondary" size="small" onClick={() => setPayingInvoice(inv)}>
              <CurrencyDollar className="w-4 h-4" />
            </Button>
            <Button variant="secondary" size="small" onClick={() => setVoidingInvoice(inv)}>
              <XMark className="w-4 h-4" />
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
            <Heading level="h1">Invoices</Heading>
            <Text className="text-ui-fg-muted">Manage B2B invoices and payments</Text>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <Text className="text-ui-fg-muted text-sm">Outstanding</Text>
              <Text className="font-semibold text-lg">
                ${(totalOutstanding / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </Text>
            </div>
            <Button onClick={() => setShowCreateDrawer(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Invoice
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <StatsGrid stats={stats} columns={5} />
      </div>

      <div className="px-6 pb-6">
        <div className="flex gap-4 mb-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <Select.Trigger className="w-[180px]">
              <Select.Value placeholder="All Statuses" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="">All Statuses</Select.Item>
              <Select.Item value="draft">Draft</Select.Item>
              <Select.Item value="sent">Sent</Select.Item>
              <Select.Item value="paid">Paid</Select.Item>
              <Select.Item value="overdue">Overdue</Select.Item>
              <Select.Item value="void">Void</Select.Item>
            </Select.Content>
          </Select>
        </div>

        <DataTable 
          data={invoices} 
          columns={columns} 
          searchable 
          searchPlaceholder="Search invoices..." 
          searchKeys={["invoice_number"]}
          loading={isLoading}
          emptyMessage="No invoices found"
        />
      </div>

      {/* Create Invoice Drawer */}
      <FormDrawer
        open={showCreateDrawer}
        onOpenChange={(open) => { if (!open) { setShowCreateDrawer(false); resetCreateForm() } }}
        title="Create Invoice"
        onSubmit={handleCreateInvoice}
        submitLabel="Create"
        loading={createInvoice.isPending}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="company">Company *</Label>
            <Select value={createFormData.company_id} onValueChange={(v) => setCreateFormData({ ...createFormData, company_id: v })}>
              <Select.Trigger>
                <Select.Value placeholder="Select company" />
              </Select.Trigger>
              <Select.Content>
                {companies.map((c) => (
                  <Select.Item key={c.id} value={c.id}>{c.name}</Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="issue_date">Issue Date</Label>
              <Input 
                type="date" 
                value={createFormData.issue_date} 
                onChange={(e) => setCreateFormData({ ...createFormData, issue_date: e.target.value })} 
              />
            </div>
            <div>
              <Label htmlFor="due_date">Due Date</Label>
              <Input 
                type="date" 
                value={createFormData.due_date} 
                onChange={(e) => setCreateFormData({ ...createFormData, due_date: e.target.value })} 
              />
            </div>
          </div>

          <div>
            <Label htmlFor="payment_terms">Payment Terms</Label>
            <Select 
              value={createFormData.payment_terms} 
              onValueChange={(v) => {
                const days = v === "Due on Receipt" ? 0 : v === "Net 15" ? 15 : v === "Net 30" ? 30 : v === "Net 60" ? 60 : 30
                setCreateFormData({ ...createFormData, payment_terms: v, payment_terms_days: days })
              }}
            >
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="Due on Receipt">Due on Receipt</Select.Item>
                <Select.Item value="Net 15">Net 15</Select.Item>
                <Select.Item value="Net 30">Net 30</Select.Item>
                <Select.Item value="Net 60">Net 60</Select.Item>
              </Select.Content>
            </Select>
          </div>

          <div>
            <Label>Line Items</Label>
            <div className="space-y-2 mt-2">
              {createFormData.items.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <Input 
                    placeholder="Description" 
                    value={item.title} 
                    onChange={(e) => updateItem(idx, "title", e.target.value)} 
                    className="flex-1"
                  />
                  <Input 
                    type="number" 
                    placeholder="Qty" 
                    value={item.quantity} 
                    onChange={(e) => updateItem(idx, "quantity", parseInt(e.target.value) || 1)} 
                    className="w-20"
                  />
                  <Input 
                    type="number" 
                    placeholder="Price" 
                    value={item.unit_price} 
                    onChange={(e) => updateItem(idx, "unit_price", parseFloat(e.target.value) || 0)} 
                    className="w-28"
                  />
                  <Button 
                    variant="transparent" 
                    size="small" 
                    onClick={() => removeItem(idx)}
                    disabled={createFormData.items.length === 1}
                  >
                    <XMark className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button variant="secondary" size="small" onClick={addItem}>
                <Plus className="w-4 h-4 mr-1" /> Add Item
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
              value={createFormData.notes} 
              onChange={(e) => setCreateFormData({ ...createFormData, notes: e.target.value })} 
              placeholder="Notes visible to customer"
            />
          </div>
        </div>
      </FormDrawer>

      {/* View Invoice Drawer */}
      <FormDrawer
        open={!!viewingInvoice}
        onOpenChange={() => setViewingInvoice(null)}
        title={`Invoice ${viewingInvoice?.invoice_number}`}
        onSubmit={() => setViewingInvoice(null)}
        submitLabel="Close"
      >
        {viewingInvoice && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <Text className="text-ui-fg-muted text-sm">Company</Text>
                <Text className="font-medium">{viewingInvoice.company?.name}</Text>
                {viewingInvoice.company?.email && <Text className="text-sm">{viewingInvoice.company.email}</Text>}
              </div>
              <StatusBadge status={viewingInvoice.status} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Text className="text-ui-fg-muted">Issue Date</Text>
                <Text>{new Date(viewingInvoice.issue_date).toLocaleDateString()}</Text>
              </div>
              <div>
                <Text className="text-ui-fg-muted">Due Date</Text>
                <Text>{new Date(viewingInvoice.due_date).toLocaleDateString()}</Text>
              </div>
              <div>
                <Text className="text-ui-fg-muted">Payment Terms</Text>
                <Text>{viewingInvoice.payment_terms || `Net ${viewingInvoice.payment_terms_days}`}</Text>
              </div>
              {viewingInvoice.paid_at && (
                <div>
                  <Text className="text-ui-fg-muted">Paid At</Text>
                  <Text>{new Date(viewingInvoice.paid_at).toLocaleDateString()}</Text>
                </div>
              )}
            </div>

            <div>
              <Text className="text-ui-fg-muted text-sm mb-2">Line Items</Text>
              <div className="border border-ui-border-base rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-ui-bg-subtle">
                    <tr>
                      <th className="text-left p-2">Description</th>
                      <th className="text-right p-2">Qty</th>
                      <th className="text-right p-2">Price</th>
                      <th className="text-right p-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewingInvoice.items?.map((item, idx) => (
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

            <div className="border-t border-ui-border-base pt-4 space-y-2">
              <div className="flex justify-between">
                <Text className="text-ui-fg-muted">Subtotal</Text>
                <Text>${(Number(viewingInvoice.subtotal) / 100).toFixed(2)}</Text>
              </div>
              {Number(viewingInvoice.tax_total) > 0 && (
                <div className="flex justify-between">
                  <Text className="text-ui-fg-muted">Tax</Text>
                  <Text>${(Number(viewingInvoice.tax_total) / 100).toFixed(2)}</Text>
                </div>
              )}
              <div className="flex justify-between font-medium text-lg">
                <Text>Total</Text>
                <Text>${(Number(viewingInvoice.total) / 100).toFixed(2)}</Text>
              </div>
              {Number(viewingInvoice.amount_paid) > 0 && (
                <div className="flex justify-between text-ui-tag-green-text">
                  <Text>Paid</Text>
                  <Text>-${(Number(viewingInvoice.amount_paid) / 100).toFixed(2)}</Text>
                </div>
              )}
              <div className="flex justify-between font-semibold text-lg border-t border-ui-border-base pt-2">
                <Text>Balance Due</Text>
                <Text className={Number(viewingInvoice.amount_due) > 0 ? "text-ui-tag-red-text" : ""}>
                  ${(Number(viewingInvoice.amount_due) / 100).toFixed(2)}
                </Text>
              </div>
            </div>

            {viewingInvoice.notes && (
              <div>
                <Text className="text-ui-fg-muted text-sm">Notes</Text>
                <Text>{viewingInvoice.notes}</Text>
              </div>
            )}
          </div>
        )}
      </FormDrawer>

      {/* Send Invoice Modal */}
      <ConfirmModal 
        open={!!sendingInvoice} 
        onOpenChange={() => setSendingInvoice(null)} 
        title="Send Invoice"
        description={`Send invoice ${sendingInvoice?.invoice_number} to ${sendingInvoice?.company?.name}?`}
        onConfirm={handleSendInvoice}
        confirmLabel="Send"
        loading={sendInvoice.isPending}
      />

      {/* Record Payment Modal */}
      <ConfirmModal 
        open={!!payingInvoice} 
        onOpenChange={() => { setPayingInvoice(null); setPaymentAmount("") }} 
        title="Record Payment"
        description={
          <div className="space-y-4">
            <Text>Record payment for invoice {payingInvoice?.invoice_number}</Text>
            <div>
              <Label>Amount (leave empty for full payment)</Label>
              <Input 
                type="number" 
                placeholder={`Full: $${(Number(payingInvoice?.amount_due || 0) / 100).toFixed(2)}`}
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
            </div>
          </div>
        }
        onConfirm={handleRecordPayment}
        confirmLabel="Record Payment"
        loading={recordPayment.isPending}
      />

      {/* Void Invoice Modal */}
      <ConfirmModal 
        open={!!voidingInvoice} 
        onOpenChange={() => { setVoidingInvoice(null); setVoidReason("") }} 
        title="Void Invoice"
        description={
          <div className="space-y-4">
            <Text>Void invoice {voidingInvoice?.invoice_number}? This action cannot be undone.</Text>
            <div>
              <Label>Reason (optional)</Label>
              <Textarea 
                value={voidReason}
                onChange={(e) => setVoidReason(e.target.value)}
                placeholder="Reason for voiding"
              />
            </div>
          </div>
        }
        onConfirm={handleVoidInvoice}
        confirmLabel="Void Invoice"
        variant="danger"
        loading={voidInvoice.isPending}
      />
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Invoices",
  icon: DocumentText,
})

export default InvoicesPage
