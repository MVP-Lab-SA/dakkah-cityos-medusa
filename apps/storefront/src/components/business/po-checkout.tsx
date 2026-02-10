import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check } from "@medusajs/icons"

interface POCheckoutProps {
  onSubmit?: (poNumber: string, notes?: string) => Promise<void>
  isSubmitting?: boolean
}

export function POCheckout({ onSubmit, isSubmitting = false }: POCheckoutProps) {
  const [poNumber, setPONumber] = useState("")
  const [notes, setNotes] = useState("")
  const [usePO, setUsePO] = useState(false)

  const handleSubmit = async () => {
    if (!usePO || !poNumber || !onSubmit) return
    await onSubmit(poNumber, notes)
  }

  return (
    <div className="bg-ds-background rounded-xl border border-ds-border overflow-hidden">
      <div className="px-6 py-4 border-b border-ds-border">
        <h3 className="text-lg font-semibold text-ds-foreground">Purchase Order</h3>
      </div>

      <div className="p-6">
        {/* Toggle */}
        <label className="flex items-center gap-3 cursor-pointer mb-6">
          <button
            type="button"
            onClick={() => setUsePO(!usePO)}
            className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
              usePO
                ? "bg-ds-primary border-ds-foreground"
                : "border-ds-border hover:border-ds-border"
            }`}
          >
            {usePO && <Check className="w-4 h-4 text-ds-primary-foreground" />}
          </button>
          <span className="text-sm font-medium text-ds-foreground">
            Use a Purchase Order Number for this order
          </span>
        </label>

        {usePO && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="po-number">PO Number *</Label>
              <Input
                id="po-number"
                value={poNumber}
                onChange={(e) => setPONumber(e.target.value)}
                placeholder="Enter your purchase order number"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="po-notes">Notes (Optional)</Label>
              <textarea
                id="po-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any special instructions..."
                rows={3}
                className="mt-1 w-full rounded-lg border border-ds-border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ds-ring"
              />
            </div>

            <div className="bg-ds-muted rounded-lg p-4">
              <p className="text-sm text-ds-muted-foreground">
                By submitting a purchase order, you agree to our Net 30 payment terms. 
                An invoice will be sent to your company's billing contact.
              </p>
            </div>
          </div>
        )}
      </div>

      {usePO && (
        <div className="px-6 py-4 border-t border-ds-border">
          <Button
            onClick={handleSubmit}
            disabled={!poNumber || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Processing..." : "Submit Order with PO"}
          </Button>
        </div>
      )}
    </div>
  )
}
