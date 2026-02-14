// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { useAuth } from "@/lib/context/auth-context"
import { useState, useMemo } from "react"

interface InventoryExtensionItem {
  id: string
  product_name: string
  sku: string
  quantity: number
  reserved: number
  available: number
  reorder_point: number
  warehouse: string
  low_stock_alert: boolean
  status: string
  updated_at: string
}

export const Route = createFileRoute("/$tenant/$locale/vendor/inventory-extension")({
  component: VendorInventoryExtensionRoute,
})

function VendorInventoryExtensionRoute() {
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
    queryKey: ["vendor-inventory-extension", statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (statusFilter) params.set("status", statusFilter)
      const url = `/vendor/inventory-extension${params.toString() ? `?${params}` : ""}`
      return sdk.client.fetch<{ items: InventoryExtensionItem[]; count: number }>(url, {
        credentials: "include",
      })
    },
  })

  const items = data?.items || []

  const statusColors: Record<string, string> = {
    in_stock: "bg-green-100 text-green-800",
    low_stock: "bg-yellow-100 text-yellow-800",
    out_of_stock: "bg-red-100 text-red-800",
    discontinued: "bg-gray-100 text-gray-800",
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
        <h1 className="text-2xl font-bold">Inventory Extension</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          + Add Stock Alert
        </button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["", "in_stock", "low_stock", "out_of_stock", "discontinued"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 text-sm rounded-full border transition ${
              statusFilter === s ? "bg-blue-600 text-white border-blue-600" : "bg-white hover:bg-gray-50"
            }`}
          >
            {s ? s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "All"}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-2">No inventory extension items yet</p>
          <p className="text-sm">Configure stock alerts, reorder points, and warehouse assignments.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left text-sm text-gray-500">
                <th className="pb-3 pr-4">Product</th>
                <th className="pb-3 pr-4">SKU</th>
                <th className="pb-3 pr-4">Warehouse</th>
                <th className="pb-3 pr-4 text-right">Quantity</th>
                <th className="pb-3 pr-4 text-right">Reserved</th>
                <th className="pb-3 pr-4 text-right">Available</th>
                <th className="pb-3 pr-4 text-right">Reorder Point</th>
                <th className="pb-3 pr-4">Alert</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-4 pr-4 font-medium">{item.product_name}</td>
                  <td className="py-4 pr-4 text-sm text-gray-500 font-mono">{item.sku}</td>
                  <td className="py-4 pr-4 text-sm text-gray-600">{item.warehouse || "—"}</td>
                  <td className="py-4 pr-4 text-right">{item.quantity}</td>
                  <td className="py-4 pr-4 text-right">{item.reserved}</td>
                  <td className="py-4 pr-4 text-right font-medium">{item.available}</td>
                  <td className="py-4 pr-4 text-right">{item.reorder_point}</td>
                  <td className="py-4 pr-4">
                    {item.low_stock_alert ? (
                      <span className="px-2 py-0.5 text-xs rounded-full font-medium bg-red-100 text-red-800">Low Stock</span>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                  <td className="py-4 pr-4">
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${statusColors[item.status] || "bg-gray-100 text-gray-800"}`}>
                      {item.status?.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button className="text-sm text-blue-600 hover:underline">Update</button>
                      <button className="text-sm text-gray-500 hover:underline">History</button>
                    </div>
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