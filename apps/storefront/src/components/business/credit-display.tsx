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
      <div className="bg-white rounded-xl border border-zinc-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-900">Credit Account</h3>
            <p className="text-sm text-zinc-500">Net 30 Terms</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div>
            <p className="text-sm text-zinc-500 mb-1">Credit Limit</p>
            <p className="text-2xl font-bold text-zinc-900">
              {formatPrice(creditLimit, currencyCode)}
            </p>
          </div>
          <div>
            <p className="text-sm text-zinc-500 mb-1">Used</p>
            <p className="text-2xl font-bold text-zinc-900">
              {formatPrice(usedCredit, currencyCode)}
            </p>
          </div>
          <div>
            <p className="text-sm text-zinc-500 mb-1">Available</p>
            <p className="text-2xl font-bold text-green-600">
              {formatPrice(availableCredit, currencyCode)}
            </p>
          </div>
        </div>

        {/* Usage Bar */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-zinc-500">Credit Usage</span>
            <span className="font-medium">{usagePercentage.toFixed(0)}%</span>
          </div>
          <div className="h-3 bg-zinc-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                usagePercentage >= 90
                  ? "bg-red-500"
                  : usagePercentage >= 70
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Transaction History */}
      {transactions.length > 0 && (
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-200">
            <h4 className="font-semibold text-zinc-900">Recent Transactions</h4>
          </div>
          <div className="divide-y divide-zinc-100">
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    tx.type === "charge" ? "bg-red-100" : "bg-green-100"
                  }`}>
                    {tx.type === "charge" ? (
                      <ArrowUpMini className="w-4 h-4 text-red-600" />
                    ) : (
                      <ArrowDownMini className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900">{tx.description}</p>
                    <p className="text-xs text-zinc-500">{formatDate(tx.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${
                    tx.type === "charge" ? "text-red-600" : "text-green-600"
                  }`}>
                    {tx.type === "charge" ? "-" : "+"}{formatPrice(tx.amount, currencyCode)}
                  </p>
                  <p className="text-xs text-zinc-500">
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
