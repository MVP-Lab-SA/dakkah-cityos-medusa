import { formatPrice } from "@/lib/utils/price"
import { CreditCard, ArrowUpMini, ArrowDownMini } from "@medusajs/icons"

interface CreditTransaction {
  id: string
  type: "charge" | "payment" | "refund" | "adjustment"
  amount: number
  description: string
  date: string
  balance_after: number
}

interface CreditDisplayProps {
  creditLimit: number
  availableCredit: number
  currencyCode: string
  transactions?: CreditTransaction[]
}

export function CreditDisplay({
  creditLimit,
  availableCredit,
  currencyCode,
  transactions = [],
}: CreditDisplayProps) {
  const usedCredit = creditLimit - availableCredit
  const usagePercentage = (usedCredit / creditLimit) * 100

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Credit Overview */}
      <div className="bg-ds-background rounded-xl border border-ds-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-ds-primary flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-ds-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-ds-foreground">Credit Account</h3>
            <p className="text-sm text-ds-muted-foreground">Net 30 Terms</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div>
            <p className="text-sm text-ds-muted-foreground mb-1">Credit Limit</p>
            <p className="text-2xl font-bold text-ds-foreground">
              {formatPrice(creditLimit, currencyCode)}
            </p>
          </div>
          <div>
            <p className="text-sm text-ds-muted-foreground mb-1">Used</p>
            <p className="text-2xl font-bold text-ds-foreground">
              {formatPrice(usedCredit, currencyCode)}
            </p>
          </div>
          <div>
            <p className="text-sm text-ds-muted-foreground mb-1">Available</p>
            <p className="text-2xl font-bold text-ds-success">
              {formatPrice(availableCredit, currencyCode)}
            </p>
          </div>
        </div>

        {/* Usage Bar */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-ds-muted-foreground">Credit Usage</span>
            <span className="font-medium">{usagePercentage.toFixed(0)}%</span>
          </div>
          <div className="h-3 bg-ds-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                usagePercentage >= 90
                  ? "bg-ds-destructive"
                  : usagePercentage >= 70
                  ? "bg-ds-warning"
                  : "bg-ds-success"
              }`}
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Transaction History */}
      {transactions.length > 0 && (
        <div className="bg-ds-background rounded-xl border border-ds-border overflow-hidden">
          <div className="px-6 py-4 border-b border-ds-border">
            <h4 className="font-semibold text-ds-foreground">Recent Transactions</h4>
          </div>
          <div className="divide-y divide-ds-border">
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    tx.type === "charge" ? "bg-ds-destructive" : "bg-ds-success"
                  }`}>
                    {tx.type === "charge" ? (
                      <ArrowUpMini className="w-4 h-4 text-ds-destructive" />
                    ) : (
                      <ArrowDownMini className="w-4 h-4 text-ds-success" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ds-foreground">{tx.description}</p>
                    <p className="text-xs text-ds-muted-foreground">{formatDate(tx.date)}</p>
                  </div>
                </div>
                <div className="text-end">
                  <p className={`font-medium ${
                    tx.type === "charge" ? "text-ds-destructive" : "text-ds-success"
                  }`}>
                    {tx.type === "charge" ? "-" : "+"}{formatPrice(tx.amount, currencyCode)}
                  </p>
                  <p className="text-xs text-ds-muted-foreground">
                    Balance: {formatPrice(tx.balance_after, currencyCode)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
