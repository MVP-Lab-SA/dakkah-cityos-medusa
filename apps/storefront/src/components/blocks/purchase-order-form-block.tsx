import React, { useState } from 'react'

interface LineItem {
  id: string
  product: string
  qty: number
  price: number
}

interface PurchaseOrderFormBlockProps {
  heading?: string
  requiresApproval?: boolean
  showBudget?: boolean
  defaultShipping?: string
}

const shippingAddresses = [
  { id: '1', label: 'HQ - 123 Business Ave, Suite 400, New York, NY 10001' },
  { id: '2', label: 'Warehouse - 456 Industrial Blvd, Newark, NJ 07102' },
  { id: '3', label: 'Branch Office - 789 Commerce St, Chicago, IL 60601' },
]

const approvalChain = [
  { name: 'Department Manager', status: 'pending' as const },
  { name: 'Finance Director', status: 'pending' as const },
  { name: 'VP of Operations', status: 'pending' as const },
]

export const PurchaseOrderFormBlock: React.FC<PurchaseOrderFormBlockProps> = (props) => {
  const { heading, description, ...rest } = props;
  const itemsKey = Object.keys(props).find(k => Array.isArray(props[k]));
  const items = itemsKey ? props[itemsKey] : [];
  if ((!items || !items.length) && !heading && !description) return null;
  heading = 'Create Purchase Order',
  requiresApproval = true,
  showBudget = true,
  defaultShipping = '1',
}) => {
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', product: 'Industrial Sensor Module', qty: 10, price: 149.99 },
    { id: '2', product: 'Mounting Bracket Kit', qty: 20, price: 24.50 },
  ])
  const [selectedShipping, setSelectedShipping] = useState(defaultShipping)
  const [notes, setNotes] = useState('')

  const poNumber = 'PO-2026-00847'
  const budgetTotal = 50000
  const budgetUsed = 32450
  const subtotal = lineItems.reduce((sum, item) => sum + item.qty * item.price, 0)
  const budgetRemaining = budgetTotal - budgetUsed - subtotal

  const addItem = () => {
    setLineItems([
      ...lineItems,
      { id: String(Date.now()), product: '', qty: 1, price: 0 },
    ])
  }

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(lineItems.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const removeItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((item) => item.id !== id))
    }
  }

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-ds-foreground">
              {heading}
            </h2>
            <p className="text-ds-muted-foreground mt-1">
              PO Number: <span className="font-mono font-semibold text-ds-foreground">{poNumber}</span>
            </p>
          </div>
          {requiresApproval && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-ds-warning/10 text-ds-warning border border-ds-warning/20">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Requires Approval
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="border border-ds-border rounded-lg overflow-hidden">
              <div className="bg-ds-muted px-4 py-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-ds-foreground">Line Items</h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-ds-primary text-ds-primary-foreground hover:opacity-90 transition-opacity"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Item
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="border-b border-ds-border bg-ds-background">
                      <th className="text-start text-xs font-medium text-ds-muted-foreground p-3">Product</th>
                      <th className="text-center text-xs font-medium text-ds-muted-foreground p-3 w-20">Qty</th>
                      <th className="text-end text-xs font-medium text-ds-muted-foreground p-3 w-28">Unit Price</th>
                      <th className="text-end text-xs font-medium text-ds-muted-foreground p-3 w-28">Total</th>
                      <th className="p-3 w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item) => (
                      <tr key={item.id} className="border-b border-ds-border last:border-b-0">
                        <td className="p-3">
                          <input
                            type="text"
                            value={item.product}
                            onChange={(e) => updateItem(item.id, 'product', e.target.value)}
                            placeholder="Enter product name"
                            className="w-full px-2 py-1.5 text-sm rounded border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-1 focus:ring-ds-primary"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            value={item.qty}
                            onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)}
                            min={1}
                            className="w-full px-2 py-1.5 text-sm text-center rounded border border-ds-border bg-ds-background text-ds-foreground focus:outline-none focus:ring-1 focus:ring-ds-primary"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                            min={0}
                            step={0.01}
                            className="w-full px-2 py-1.5 text-sm text-end rounded border border-ds-border bg-ds-background text-ds-foreground focus:outline-none focus:ring-1 focus:ring-ds-primary"
                          />
                        </td>
                        <td className="p-3 text-end text-sm font-medium text-ds-foreground">
                          ${(item.qty * item.price).toFixed(2)}
                        </td>
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-ds-muted-foreground hover:text-ds-destructive transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-ds-muted/50">
                      <td colSpan={3} className="p-3 text-end text-sm font-semibold text-ds-foreground">
                        Subtotal
                      </td>
                      <td className="p-3 text-end text-sm font-bold text-ds-foreground">
                        ${subtotal.toFixed(2)}
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="border border-ds-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-ds-foreground mb-3">Shipping Address</h3>
              <div className="space-y-2">
                {shippingAddresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                      selectedShipping === addr.id
                        ? 'border-ds-primary bg-ds-primary/5'
                        : 'border-ds-border hover:bg-ds-muted/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      value={addr.id}
                      checked={selectedShipping === addr.id}
                      onChange={(e) => setSelectedShipping(e.target.value)}
                      className="mt-0.5 accent-ds-primary"
                    />
                    <span className="text-sm text-ds-foreground">{addr.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border border-ds-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-ds-foreground mb-3">Notes</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any special instructions or notes for this purchase order..."
                rows={3}
                className="w-full px-3 py-2 text-sm rounded-md border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary resize-none"
              />
            </div>
          </div>

          <div className="space-y-6">
            {showBudget && (
              <div className="border border-ds-border rounded-lg p-4">
                <h3 className="text-sm font-semibold text-ds-foreground mb-3">Budget Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-ds-muted-foreground">
                    <span>Used: ${budgetUsed.toLocaleString()}</span>
                    <span>Total: ${budgetTotal.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-3 bg-ds-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        budgetRemaining < 0 ? 'bg-ds-destructive' : budgetRemaining < 5000 ? 'bg-ds-warning' : 'bg-ds-primary'
                      }`}
                      style={{ width: `${Math.min(((budgetUsed + subtotal) / budgetTotal) * 100, 100)}%` }}
                    />
                  </div>
                  <p className={`text-sm font-medium ${budgetRemaining < 0 ? 'text-ds-destructive' : 'text-ds-foreground'}`}>
                    {budgetRemaining < 0
                      ? `Over budget by $${Math.abs(budgetRemaining).toFixed(2)}`
                      : `$${budgetRemaining.toFixed(2)} remaining`}
                  </p>
                </div>
              </div>
            )}

            {requiresApproval && (
              <div className="border border-ds-border rounded-lg p-4">
                <h3 className="text-sm font-semibold text-ds-foreground mb-3">Approval Chain</h3>
                <div className="space-y-3">
                  {approvalChain.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-ds-muted border-2 border-ds-border flex items-center justify-center">
                          <span className="text-xs font-medium text-ds-muted-foreground">{idx + 1}</span>
                        </div>
                        {idx < approvalChain.length - 1 && (
                          <div className="w-0.5 h-4 bg-ds-border" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ds-foreground">{step.name}</p>
                        <p className="text-xs text-ds-muted-foreground capitalize">{step.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              className="w-full py-3 px-4 rounded-lg bg-ds-primary text-ds-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm"
            >
              Submit PO
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
