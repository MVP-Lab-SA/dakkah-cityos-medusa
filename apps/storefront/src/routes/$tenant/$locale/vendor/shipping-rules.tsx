// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { useAuth } from "@/lib/context/auth-context"
import { useState, useMemo } from "react"

interface ShippingRule {
  id: string
  name: string
  region: string
  method: string
  rate: number
  currency_code: string
  free_above_threshold?: number
  description?: string
  status: string
  created_at: string
}

export const Route = createFileRoute("/$tenant/$locale/vendor/shipping-rules")({
  component: VendorShippingRulesRoute,
})

function VendorShippingRulesRoute() {
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
    queryKey: ["vendor-shipping-rules", statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (statusFilter) params.set("status", statusFilter)
      const url = `/vendor/shipping-extension${params.toString() ? `?${params}` : ""}`
      return sdk.client.fetch<{ items: ShippingRule[]; count: number }>(url, {
        credentials: "include",
      })
    },
  })

  const items = data?.items || []

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    draft: "bg-yellow-100 text-yellow-800",
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
        <h1 className="text-2xl font-bold">Shipping Rules</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          + Add Rule
        </button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["", "active", "inactive", "draft"].map((s) => (
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
          <p className="text-lg mb-2">No shipping rules configured</p>
          <p className="text-sm">Add shipping rules to define rates and methods for your products.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left text-sm text-gray-500">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Region</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Rate</th>
                <th className="py-3 px-4">Free Above</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((rule) => (
                <tr key={rule.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-4 px-4 font-medium">{rule.name}</td>
                  <td className="py-4 px-4 text-gray-600">{rule.region}</td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                      {rule.method}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {rule.currency_code?.toUpperCase()} {(rule.rate / 100).toFixed(2)}
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    {rule.free_above_threshold
                      ? `${rule.currency_code?.toUpperCase()} ${(rule.free_above_threshold / 100).toFixed(2)}`
                      : "—"}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${statusColors[rule.status] || "bg-gray-100 text-gray-800"}`}>
                      {rule.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
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
