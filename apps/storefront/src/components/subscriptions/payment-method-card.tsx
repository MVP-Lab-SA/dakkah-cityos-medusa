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
    return <CreditCard className="w-8 h-8 text-zinc-600" />
  }

  if (!paymentMethod) {
    return (
      <div className="bg-white rounded-xl border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Payment Method</h3>
        <div className="text-center py-6">
          <CreditCard className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
          <p className="text-zinc-500 mb-4">No payment method on file</p>
          <Button onClick={onUpdate}>Add Payment Method</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-zinc-900">Payment Method</h3>
        <Button variant="ghost" size="sm" onClick={onUpdate}>
          <PencilSquare className="w-4 h-4 mr-1" />
          Update
        </Button>
      </div>

      <div className="flex items-center gap-4 p-4 bg-zinc-50 rounded-lg">
        {paymentMethod.type === "card" && (
          <>
            {getCardIcon(paymentMethod.brand)}
            <div>
              <p className="font-medium text-zinc-900">
                {paymentMethod.brand || "Card"} ending in {paymentMethod.last4}
              </p>
              {paymentMethod.expiryMonth && paymentMethod.expiryYear && (
                <p className="text-sm text-zinc-500">
                  Expires {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}
                </p>
              )}
            </div>
          </>
        )}

        {paymentMethod.type === "paypal" && (
          <>
            <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
              PP
            </div>
            <div>
              <p className="font-medium text-zinc-900">PayPal</p>
              <p className="text-sm text-zinc-500">{paymentMethod.email}</p>
            </div>
          </>
        )}

        {paymentMethod.type === "bank" && (
          <>
            <div className="w-8 h-8 rounded bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs">
              BK
            </div>
            <div>
              <p className="font-medium text-zinc-900">Bank Account</p>
              <p className="text-sm text-zinc-500">Ending in {paymentMethod.last4}</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
