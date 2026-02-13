// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { useAuth } from "@/lib/context/auth-context"
import { useState, useMemo } from "react"

interface AffiliateProgram {
  id: string
  name: string
  description?: string
  commission_rate: number
  commission_type?: string
  affiliates_count: number
  revenue: number
  conversions: number
  clicks?: number
  currency_code: string
  cookie_duration?: number
  status: string
  created_at: string
}

export const Route = createFileRoute("/$tenant/$locale/vendor/affiliate")({
  component: VendorAffiliateRoute,
})

function VendorAffiliateRoute() {
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
    queryKey: ["vendor-affiliate", statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (statusFilter) params.set("status", statusFilter)
      const url = `/vendor/affiliate${params.toString() ? `?${params}` : ""}`
      return sdk.client.fetch<{ items: AffiliateProgram[]; count: number }>(url, {
        credentials: "include",
      })
    },
  })

  const items = data?.items || []

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    paused: "bg-yellow-100 text-yellow-800",
    draft: "bg-gray-100 text-gray-800",
    ended: "bg-red-100 text-red-800",
  }

  function getConversionRate(conversions: number, clicks: number) {
    if (!clicks || clicks <= 0) return "0.00"
    return ((conversions / clicks) * 100).toFixed(2)
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
        <h1 className="text-2xl font-bold">Affiliate Programs</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          + Create Program
        </button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["", "active", "paused", "draft", "ended"].map((s) => (
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
          <p className="text-lg mb-2">No affiliate programs yet</p>
          <p className="text-sm">Create your first program to start growing through affiliates.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((program) => (
            <div key={program.id} className="border rounded-lg p-6 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{program.name}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${statusColors[program.status] || "bg-gray-100 text-gray-800"}`}>
                      {program.status}
                    </span>
                    {program.commission_type && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                        {program.commission_type}
                      </span>
                    )}
                  </div>
                  {program.description && (
                    <p className="text-gray-600 text-sm mb-3">{program.description}</p>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-3 mb-3">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold">{program.commission_rate}%</p>
                      <p className="text-xs text-gray-500">Commission</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold">{program.affiliates_count}</p>
                      <p className="text-xs text-gray-500">Affiliates</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold">{program.currency_code?.toUpperCase()} {(program.revenue / 100).toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Revenue</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold">{program.conversions.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Conversions</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold">{getConversionRate(program.conversions, program.clicks || 0)}%</p>
                      <p className="text-xs text-gray-500">Conv. Rate</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {program.cookie_duration && <span>Cookie: {program.cookie_duration} days</span>}
                    {program.clicks !== undefined && <span>{program.clicks.toLocaleString()} clicks</span>}
                  </div>
                </div>
                <button className="text-sm text-blue-600 hover:underline ml-4">
                  View Affiliates
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
