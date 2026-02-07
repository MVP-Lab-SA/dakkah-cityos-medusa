import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatPrice } from "@/lib/utils/price"
import { Plus, Trash } from "@medusajs/icons"

interface LineItem {
  id: string
  product_title: string
  variant_title?: string
  quantity: number
  unit_price: number
}

interface POFormProps {
  onSubmit?: (data: {
    items: LineItem[]
    notes?: string
  }) => Promise<void>
  onSaveDraft?: (data: {
    items: LineItem[]
    notes?: string
  }) => Promise<void>
  onCancel?: () => void
}

export function POForm({ onSubmit, onSaveDraft, onCancel }: POFormProps) {
  const [items, setItems] = useState<LineItem[]>([])
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addItem = () => {
    setItems([
      ...items,
      {
        id: `item_${Date.now()}`,
        product_title: "",
        quantity: 1,
        unit_price: 0,
      },
    ])
  }

  const updateItem = (id: string, updates: Partial<LineItem>) => {
    setItems(items.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    ))
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0
  )

  const handleSubmit = async () => {
    if (!onSubmit || items.length === 0) return
    setIsSubmitting(true)
    try {
      await onSubmit({ items, notes })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = async () => {
    if (!onSaveDraft) return
    setIsSubmitting(true)
    try {
      await onSaveDraft({ items, notes })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-zinc-200">
        <h3 className="text-lg font-semibold text-zinc-900">New Purchase Order</h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Line Items */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Label>Line Items</Label>
            <Button variant="outline" size="sm" onClick={addItem}>
              <Plus className="w-4 h-4 mr-1" />
              Add Item
            </Button>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-8 bg-zinc-50 rounded-lg">
              <p className="text-zinc-500">No items added yet</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={addItem}>
                Add First Item
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="flex gap-4 p-4 bg-zinc-50 rounded-lg">
                  <div className="flex-1">
                    <Input
                      placeholder="Product name"
                      value={item.product_title}
                      onChange={(e) =>
                        updateItem(item.id, { product_title: e.target.value })
                      }
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.id, { quantity: parseInt(e.target.value) || 1 })
                      }
                    />
                  </div>
                  <div className="w-32">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Price"
                      value={item.unit_price}
                      onChange={(e) =>
                        updateItem(item.id, { unit_price: parseFloat(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div className="w-24 text-right pt-2">
                    <p className="font-medium">
                      {formatPrice(item.quantity * item.unit_price, "usd")}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <Label htmlFor="notes">Notes (Optional)</Label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes or special instructions..."
            rows={3}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>

        {/* Summary */}
        {items.length > 0 && (
          <div className="bg-zinc-50 rounded-lg p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-zinc-600">Subtotal ({items.length} items)</span>
              <span className="font-medium text-zinc-900">
                {formatPrice(subtotal, "usd")}
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              Tax and shipping will be calculated upon approval
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-6 py-4 border-t border-zinc-200 flex justify-between">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <div className="flex gap-3">
          {onSaveDraft && (
            <Button variant="outline" onClick={handleSaveDraft} disabled={isSubmitting}>
              Save as Draft
            </Button>
          )}
          <Button 
            onClick={handleSubmit} 
            disabled={items.length === 0 || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit for Approval"}
          </Button>
        </div>
      </div>
    </div>
  )
}
