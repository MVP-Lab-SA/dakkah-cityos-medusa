import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Check } from "@medusajs/icons"

interface ReturnItem {
  id: string
  title: string
  thumbnail?: string
  quantity: number
  maxQuantity: number
}

interface ReturnFormProps {
  orderId: string
  items: ReturnItem[]
  onSubmit?: (data: { items: Array<{ id: string; quantity: number; reason: string }> }) => Promise<void>
  onCancel?: () => void
}

export function ReturnForm({ orderId, items, onSubmit, onCancel }: ReturnFormProps) {
  const [selectedItems, setSelectedItems] = useState<
    Record<string, { quantity: number; reason: string }>
  >({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const reasons = [
    "Defective or damaged",
    "Wrong item received",
    "Item not as described",
    "Changed my mind",
    "Better price found",
    "No longer needed",
    "Other",
  ]

  const toggleItem = (itemId: string, maxQuantity: number) => {
    setSelectedItems((prev) => {
      if (prev[itemId]) {
        const { [itemId]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [itemId]: { quantity: maxQuantity, reason: reasons[0] } }
    })
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], quantity },
    }))
  }

  const updateReason = (itemId: string, reason: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], reason },
    }))
  }

  const handleSubmit = async () => {
    if (Object.keys(selectedItems).length === 0) return

    setIsSubmitting(true)
    try {
      const returnData = {
        items: Object.entries(selectedItems).map(([id, data]) => ({
          id,
          quantity: data.quantity,
          reason: data.reason,
        })),
      }
      await onSubmit?.(returnData)
      setSubmitted(true)
    } catch (error) {
      console.error("Failed to submit return request:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-ds-background rounded-xl border border-ds-border p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-ds-success flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-ds-success" />
        </div>
        <h3 className="text-xl font-semibold text-ds-foreground mb-2">Return Request Submitted</h3>
        <p className="text-ds-muted-foreground mb-6">
          We have received your return request. You will receive an email with further instructions.
        </p>
        <Button onClick={onCancel}>Back to Order</Button>
      </div>
    )
  }

  return (
    <div className="bg-ds-background rounded-xl border border-ds-border overflow-hidden">
      <div className="px-6 py-4 border-b border-ds-border">
        <h3 className="text-lg font-semibold text-ds-foreground">Request Return</h3>
        <p className="text-sm text-ds-muted-foreground mt-1">Select items you want to return</p>
      </div>

      <div className="divide-y divide-ds-border">
        {items.map((item) => {
          const isSelected = !!selectedItems[item.id]
          const selectedData = selectedItems[item.id]

          return (
            <div key={item.id} className="p-6">
              <div className="flex gap-4">
                {/* Checkbox */}
                <button
                  onClick={() => toggleItem(item.id, item.maxQuantity)}
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                    isSelected
                      ? "bg-ds-primary border-ds-foreground"
                      : "border-ds-border hover:border-ds-border"
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4 text-ds-primary-foreground" />}
                </button>

                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-lg bg-ds-muted overflow-hidden flex-shrink-0">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-ds-muted-foreground text-xs">
                      No img
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1">
                  <h4 className="font-medium text-ds-foreground">{item.title}</h4>
                  <p className="text-sm text-ds-muted-foreground">Qty: {item.maxQuantity}</p>

                  {isSelected && (
                    <div className="mt-4 space-y-3">
                      <div>
                        <Label className="text-sm">Return Quantity</Label>
                        <select
                          value={selectedData.quantity}
                          onChange={(e) =>
                            updateQuantity(item.id, parseInt(e.target.value))
                          }
                          className="mt-1 block w-full max-w-[100px] rounded-lg border border-ds-border px-3 py-2 text-sm"
                        >
                          {Array.from({ length: item.maxQuantity }, (_, i) => i + 1).map(
                            (num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                      <div>
                        <Label className="text-sm">Reason for Return</Label>
                        <select
                          value={selectedData.reason}
                          onChange={(e) => updateReason(item.id, e.target.value)}
                          className="mt-1 block w-full rounded-lg border border-ds-border px-3 py-2 text-sm"
                        >
                          {reasons.map((reason) => (
                            <option key={reason} value={reason}>
                              {reason}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="px-6 py-4 border-t border-ds-border flex justify-between">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={Object.keys(selectedItems).length === 0 || isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Return Request"}
        </Button>
      </div>
    </div>
  )
}
