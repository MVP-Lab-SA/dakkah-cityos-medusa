import { Button } from "@/components/ui/button"
import { CreditCard, PencilSquare } from "@medusajs/icons"

interface PaymentMethod {
  id: string
  type: "card" | "paypal" | "bank"
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  email?: string
}

interface PaymentMethodCardProps {
  paymentMethod?: PaymentMethod
  onUpdate?: () => void
}

export function PaymentMethodCard({ paymentMethod, onUpdate }: PaymentMethodCardProps) {
  const getCardIcon = (brand?: string) => {
    // In a real app, you'd return different icons for Visa, Mastercard, etc.
    return <CreditCard className="w-8 h-8 text-ds-muted-foreground" />
  }

  if (!paymentMethod) {
    return (
      <div className="bg-ds-background rounded-xl border border-ds-border p-6">
        <h3 className="text-lg font-semibold text-ds-foreground mb-4">Payment Method</h3>
        <div className="text-center py-6">
          <CreditCard className="w-12 h-12 text-ds-muted-foreground mx-auto mb-3" />
          <p className="text-ds-muted-foreground mb-4">No payment method on file</p>
          <Button onClick={onUpdate}>Add Payment Method</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-ds-background rounded-xl border border-ds-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-ds-foreground">Payment Method</h3>
        <Button variant="ghost" size="sm" onClick={onUpdate}>
          <PencilSquare className="w-4 h-4 me-1" />
          Update
        </Button>
      </div>

      <div className="flex items-center gap-4 p-4 bg-ds-muted rounded-lg">
        {paymentMethod.type === "card" && (
          <>
            {getCardIcon(paymentMethod.brand)}
            <div>
              <p className="font-medium text-ds-foreground">
                {paymentMethod.brand || "Card"} ending in {paymentMethod.last4}
              </p>
              {paymentMethod.expiryMonth && paymentMethod.expiryYear && (
                <p className="text-sm text-ds-muted-foreground">
                  Expires {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}
                </p>
              )}
            </div>
          </>
        )}

        {paymentMethod.type === "paypal" && (
          <>
            <div className="w-8 h-8 rounded bg-ds-info flex items-center justify-center text-ds-info font-bold text-xs">
              PP
            </div>
            <div>
              <p className="font-medium text-ds-foreground">PayPal</p>
              <p className="text-sm text-ds-muted-foreground">{paymentMethod.email}</p>
            </div>
          </>
        )}

        {paymentMethod.type === "bank" && (
          <>
            <div className="w-8 h-8 rounded bg-ds-success flex items-center justify-center text-ds-success font-bold text-xs">
              BK
            </div>
            <div>
              <p className="font-medium text-ds-foreground">Bank Account</p>
              <p className="text-sm text-ds-muted-foreground">Ending in {paymentMethod.last4}</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
