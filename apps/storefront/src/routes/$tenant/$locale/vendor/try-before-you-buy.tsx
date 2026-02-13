// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { useAuth } from "@/lib/context/auth-context"
import { useState, useMemo } from "react"

interface TBYBItem {
  id: string
  product_name: string
  trial_period: number
  conversion_rate: number
  active_trials: number
  returns: number
  status: string
  created_at: string
}

export const Route = createFileRoute("/$tenant/$locale/vendor/try-before-you-buy")({
  component: VendorTryBeforeYouBuyRoute,
})

function VendorTryBeforeYouBuyRoute() {
  const auth = useAuth()
  const [statusFilter, setStatusFilter] = useState<string>("")

  const vendorId = useMemo(() => {
    const user = (auth as any)?.user || (auth as any)?.customer
    if (user?.vendor_id) return user.vendor_id
    if (user?.metadata?.vendor_id) return user.metadata.vendor_id
    if (user?.id) return user.id
    return "current-vendor"
  }, [auth])

  const { data, isLoading } = useQuery({
    queryKey: ["vendor-try-before-you-buy", statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (statusFilter) params.set("status", statusFilter)
      const url = `/vendor/try-before-you-buy${params.toString() ? `?${params}` : ""}`
      return sdk.client.fetch<{ items: TBYBItem[]; count: number }>(url, {
        credentials: "include",
      })
    },
  })

  const items = data?.items || []

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    draft: "bg-gray-100 text-gray-800",
    paused: "bg-yellow-100 text-yellow-800",
    archived: "bg-red-100 text-red-800",
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

  return (
    <div className="container mx-auto py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Try Before You Buy</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          + Add Item
        </button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["", "active", "draft", "paused", "archived"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 text-sm rounded-full border transition ${
              statusFilter === s ? "bg-blue-600 text-white border-blue-600" : "bg-white hover:bg-gray-50"
            }`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-2">No try-before-you-buy items yet</p>
          <p className="text-sm">Add items to let customers try products before purchasing.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left text-sm text-gray-500">
                <th className="pb-3 pr-4">Product</th>
                <th className="pb-3 pr-4 text-right">Trial Period</th>
                <th className="pb-3 pr-4 text-right">Conversion Rate</th>
                <th className="pb-3 pr-4 text-right">Active Trials</th>
                <th className="pb-3 pr-4 text-right">Returns</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-4 pr-4 font-medium">{item.product_name}</td>
                  <td className="py-4 pr-4 text-right">{item.trial_period} days</td>
                  <td className="py-4 pr-4 text-right font-medium text-green-600">{item.conversion_rate}%</td>
                  <td className="py-4 pr-4 text-right">{item.active_trials}</td>
                  <td className="py-4 pr-4 text-right">{item.returns}</td>
                  <td className="py-4 pr-4">
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${statusColors[item.status] || "bg-gray-100 text-gray-800"}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <button className="text-sm text-blue-600 hover:underline">View Trials</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
