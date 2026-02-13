// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { useAuth } from "@/lib/context/auth-context"
import { useState, useMemo } from "react"

interface VolumePricingTier {
  id: string
  product_name: string
  min_quantity: number
  max_quantity: number | null
  unit_price: number
  discount_percentage: number
  currency_code: string
  status: string
  created_at: string
}

export const Route = createFileRoute("/$tenant/$locale/vendor/volume-pricing")({
  component: VendorVolumePricingRoute,
})

function VendorVolumePricingRoute() {
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
    queryKey: ["vendor-volume-pricing", statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (statusFilter) params.set("status", statusFilter)
      const url = `/vendor/volume-pricing${params.toString() ? `?${params}` : ""}`
      return sdk.client.fetch<{ items: VolumePricingTier[]; count: number }>(url, {
        credentials: "include",
      })
    },
  })

  const items = data?.items || []

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    draft: "bg-gray-100 text-gray-800",
    expired: "bg-red-100 text-red-800",
    scheduled: "bg-blue-100 text-blue-800",
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
        <h1 className="text-2xl font-bold">Volume Pricing</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          + Add Tier
        </button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["", "active", "draft", "expired", "scheduled"].map((s) => (
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
          <p className="text-lg mb-2">No volume pricing tiers yet</p>
          <p className="text-sm">Create pricing tiers to offer bulk discounts.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left text-sm text-gray-500">
                <th className="pb-3 pr-4">Product</th>
                <th className="pb-3 pr-4 text-right">Min Qty</th>
                <th className="pb-3 pr-4 text-right">Max Qty</th>
                <th className="pb-3 pr-4 text-right">Unit Price</th>
                <th className="pb-3 pr-4 text-right">Discount %</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((tier) => (
                <tr key={tier.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-4 pr-4 font-medium">{tier.product_name}</td>
                  <td className="py-4 pr-4 text-right">{tier.min_quantity}</td>
                  <td className="py-4 pr-4 text-right">{tier.max_quantity ?? "∞"}</td>
                  <td className="py-4 pr-4 text-right">
                    {tier.currency_code?.toUpperCase()} {(tier.unit_price / 100).toFixed(2)}
                  </td>
                  <td className="py-4 pr-4 text-right font-medium text-green-600">
                    {tier.discount_percentage}%
                  </td>
                  <td className="py-4 pr-4">
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${statusColors[tier.status] || "bg-gray-100 text-gray-800"}`}>
                      {tier.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <button className="text-sm text-blue-600 hover:underline">Edit</button>
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
