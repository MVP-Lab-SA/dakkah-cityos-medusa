// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { useAuth } from "@/lib/context/auth-context"
import { useMemo } from "react"

interface WalletData {
  balance: number
  pending: number
  total_earned: number
  currency_code: string
  transactions: WalletTransaction[]
}

interface WalletTransaction {
  id: string
  date: string
  type: string
  amount: number
  reference: string
  currency_code: string
}

export const Route = createFileRoute("/$tenant/$locale/vendor/wallet")({
  component: VendorWalletRoute,
})

function VendorWalletRoute() {
  const auth = useAuth()

  const vendorId = useMemo(() => {
    const user = (auth as any)?.user || (auth as any)?.customer
    if (user?.vendor_id) return user.vendor_id
    if (user?.metadata?.vendor_id) return user.metadata.vendor_id
    if (user?.id) return user.id
    return "current-vendor"
  }, [auth])

  const { data, isLoading } = useQuery({
    queryKey: ["vendor-wallet"],
    queryFn: async () => {
      const url = `/vendor/wallet`
      return sdk.client.fetch<WalletData>(url, {
        credentials: "include",
      })
    },
  })

  const typeColors: Record<string, string> = {
    payout: "text-green-600",
    sale: "text-green-600",
    refund: "text-red-600",
    fee: "text-red-600",
    adjustment: "text-yellow-600",
    withdrawal: "text-blue-600",
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-muted rounded w-1/3 mb-2" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const currency = data?.currency_code?.toUpperCase() || "USD"
  const transactions = data?.transactions || []

  return (
    <div className="container mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Wallet</h1>
        <p className="text-gray-500 text-sm mt-1">Financial overview and transaction history</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="border rounded-lg p-6 bg-green-50">
          <p className="text-sm text-gray-600 mb-1">Available Balance</p>
          <p className="text-3xl font-bold text-green-700">
            {currency} {((data?.balance || 0) / 100).toFixed(2)}
          </p>
        </div>
        <div className="border rounded-lg p-6 bg-yellow-50">
          <p className="text-sm text-gray-600 mb-1">Pending</p>
          <p className="text-3xl font-bold text-yellow-700">
            {currency} {((data?.pending || 0) / 100).toFixed(2)}
          </p>
        </div>
        <div className="border rounded-lg p-6 bg-blue-50">
          <p className="text-sm text-gray-600 mb-1">Total Earned</p>
          <p className="text-3xl font-bold text-blue-700">
            {currency} {((data?.total_earned || 0) / 100).toFixed(2)}
          </p>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-4">Transaction History</h2>

      {transactions.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-2">No transactions yet</p>
          <p className="text-sm">Transactions will appear here once you start earning.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left text-sm text-gray-500">
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Type</th>
                <th className="pb-3 pr-4 text-right">Amount</th>
                <th className="pb-3">Reference</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-4 pr-4 text-sm text-gray-500">
                    {new Date(tx.date).toLocaleDateString()}
                  </td>
                  <td className="py-4 pr-4">
                    <span className="px-2 py-0.5 text-xs rounded-full font-medium bg-gray-100 text-gray-800 capitalize">
                      {tx.type}
                    </span>
                  </td>
                  <td className={`py-4 pr-4 text-right font-medium ${typeColors[tx.type] || "text-gray-900"}`}>
                    {tx.amount >= 0 ? "+" : ""}{currency} {(Math.abs(tx.amount) / 100).toFixed(2)}
                  </td>
                  <td className="py-4 text-sm text-gray-500 font-mono">{tx.reference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
