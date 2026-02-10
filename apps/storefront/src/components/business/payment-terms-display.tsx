import type { PaymentTerms } from "@/lib/types/approvals"

interface PaymentTermsDisplayProps {
  terms: PaymentTerms
}

export function PaymentTermsDisplay({ terms }: PaymentTermsDisplayProps) {
  const termsLabels: Record<string, string> = {
    net_15: "Net 15",
    net_30: "Net 30",
    net_45: "Net 45",
    net_60: "Net 60",
    prepaid: "Prepaid",
    cod: "Cash on Delivery",
    custom: "Custom Terms",
  }

  return (
    <div className="border rounded-lg p-6">
      <h3 className="font-semibold mb-4">Payment Terms</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Terms</span>
          <span className="font-medium">{termsLabels[terms.terms_type] || terms.terms_type}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Days Until Due</span>
          <span className="font-medium">{terms.days_until_due} days</span>
        </div>
        {terms.early_payment_discount_percentage && (
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Early Payment Discount</span>
            <span className="font-medium text-ds-success">
              {terms.early_payment_discount_percentage}% if paid within {terms.early_payment_discount_days} days
            </span>
          </div>
        )}
        {terms.late_fee_percentage && (
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Late Fee</span>
            <span className="font-medium text-ds-destructive">{terms.late_fee_percentage}%</span>
          </div>
        )}
        {terms.credit_limit && (
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Credit Limit</span>
            <span className="font-medium">${terms.credit_limit.toLocaleString()}</span>
          </div>
        )}
      </div>
    </div>
  )
}
