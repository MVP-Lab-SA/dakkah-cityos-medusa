import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { formatPrice } from "@/lib/utils/price"

export const Route = createFileRoute("/vendor/payouts/")({
  component: VendorPayoutsPage,
})

function useVendorPayouts() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:9000"

  return useQuery({
    queryKey: ["vendor-payouts"],
    queryFn: async () => {
      const response = await fetch(`${backendUrl}/store/vendors/me/payouts`, {
        credentials: "include",
      })
      if (!response.ok) throw new Error("Failed to fetch payouts")
      const data = await response.json()
      return data
    },
  })
}

function VendorPayoutsPage() {
  const { data, isLoading, error } = useVendorPayouts()

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          Failed to load payouts. Please try again.
        </div>
      </div>
    )
  }

  const balance = data?.balance || {
    total_earnings: 0,
    total_paid_out: 0,
    available_balance: 0,
    pending_balance: 0,
  }
  const payouts = data?.payouts || []

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Payouts</h1>
        <p className="text-gray-600 mt-1">View your earnings and payout history</p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatPrice(balance.total_earnings, "usd")}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Available Balance</p>
          <p className="text-2xl font-bold text-green-600">
            {formatPrice(balance.available_balance, "usd")}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {formatPrice(balance.pending_balance, "usd")}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Total Paid Out</p>
          <p className="text-2xl font-bold text-gray-600">
            {formatPrice(balance.total_paid_out, "usd")}
          </p>
        </div>
      </div>

      {/* Payout History */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Payout History</h2>
        </div>

        {payouts.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            No payouts yet. Earnings will be paid out according to your payout schedule.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payouts.map((payout: any) => (
                <tr key={payout.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(payout.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {formatPrice(payout.amount, payout.currency || "usd")}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        payout.status
                      )}`}
                    >
                      {payout.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{payout.method || "Bank Transfer"}</td>
                  <td className="px-6 py-4 text-gray-600 font-mono text-sm">
                    {payout.reference || payout.id.slice(0, 8)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
