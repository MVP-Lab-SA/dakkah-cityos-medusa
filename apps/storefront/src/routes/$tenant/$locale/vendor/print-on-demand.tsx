// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { useAuth } from "@/lib/context/auth-context"
import { useState, useMemo } from "react"

interface PODDesign {
  id: string
  design_name: string
  product_type: string
  base_cost: number
  retail_price: number
  sales: number
  currency_code: string
  status: string
  thumbnail_url?: string
  created_at: string
}

export const Route = createFileRoute("/$tenant/$locale/vendor/print-on-demand")({
  component: VendorPrintOnDemandRoute,
})

function VendorPrintOnDemandRoute() {
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
    queryKey: ["vendor-print-on-demand", statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (statusFilter) params.set("status", statusFilter)
      const url = `/vendor/print-on-demand${params.toString() ? `?${params}` : ""}`
      return sdk.client.fetch<{ items: PODDesign[]; count: number }>(url, {
        credentials: "include",
      })
    },
  })

  const items = data?.items || []

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    draft: "bg-gray-100 text-gray-800",
    archived: "bg-red-100 text-red-800",
    pending_review: "bg-yellow-100 text-yellow-800",
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
        <h1 className="text-2xl font-bold">Print-on-Demand Designs</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          + Upload Design
        </button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["", "active", "draft", "pending_review", "archived"].map((s) => (
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
          <p className="text-lg mb-2">No designs yet</p>
          <p className="text-sm">Upload your first design to start selling print-on-demand products.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((design) => (
            <div key={design.id} className="border rounded-lg p-6 hover:shadow-md transition">
              {design.thumbnail_url && (
                <div className="w-full h-40 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                  <img src={design.thumbnail_url} alt={design.design_name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold">{design.design_name}</h3>
                <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${statusColors[design.status] || "bg-gray-100 text-gray-800"}`}>
                  {design.status?.replace(/_/g, " ")}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-3">{design.product_type}</p>
              <div className="grid grid-cols-3 gap-2 text-center mb-4">
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-sm font-bold">{design.currency_code?.toUpperCase()} {(design.base_cost / 100).toFixed(2)}</p>
                  <p className="text-xs text-gray-500">Base Cost</p>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-sm font-bold">{design.currency_code?.toUpperCase()} {(design.retail_price / 100).toFixed(2)}</p>
                  <p className="text-xs text-gray-500">Retail</p>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-sm font-bold">{design.sales}</p>
                  <p className="text-xs text-gray-500">Sales</p>
                </div>
              </div>
              <button className="text-sm text-blue-600 hover:underline">View Sales</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
