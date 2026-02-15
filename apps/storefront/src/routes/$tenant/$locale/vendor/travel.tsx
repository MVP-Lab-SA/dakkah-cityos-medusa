// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { useAuth } from "@/lib/context/auth-context"
import { useState, useMemo } from "react"

interface TravelPackage {
  id: string
  title: string
  description?: string
  destination: string
  duration: string
  price: number
  currency_code: string
  bookings: number
  rating: number
  status: string
  includes?: string[]
  departure_dates?: string[]
  max_travelers?: number
  image_url?: string
  created_at: string
}

export const Route = createFileRoute("/$tenant/$locale/vendor/travel")({
  component: VendorTravelRoute,
})

function VendorTravelRoute() {
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
    queryKey: ["vendor-travel", statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (statusFilter) params.set("status", statusFilter)
      const url = `/vendor/travel${params.toString() ? `?${params}` : ""}`
      return sdk.client.fetch<{ items: TravelPackage[]; count: number }>(url, {
        credentials: "include",
      })
    },
  })

  const items = data?.items || []

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    draft: "bg-ds-muted text-ds-foreground",
    sold_out: "bg-purple-100 text-purple-800",
    archived: "bg-red-100 text-red-800",
    seasonal: "bg-blue-100 text-blue-800",
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
        <h1 className="text-2xl font-bold">Travel Packages</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          + Create Package
        </button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["", "active", "draft", "seasonal", "sold_out", "archived"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 text-sm rounded-full border transition ${
              statusFilter === s ? "bg-blue-600 text-white border-blue-600" : "bg-ds-card hover:bg-ds-muted/50"
            }`}
          >
            {(s || "All").replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 text-ds-muted-foreground">
          <p className="text-lg mb-2">No travel packages yet</p>
          <p className="text-sm">Create your first travel package to start accepting bookings.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((pkg) => (
            <div key={pkg.id} className="border rounded-lg p-6 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{pkg.title}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${statusColors[pkg.status] || "bg-ds-muted text-ds-foreground"}`}>
                      {pkg.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  {pkg.description && (
                    <p className="text-ds-muted-foreground text-sm mb-3">{pkg.description}</p>
                  )}
                  <div className="flex items-center gap-6 text-sm text-ds-muted-foreground">
                    <span className="font-medium text-ds-foreground">
                      {pkg.currency_code?.toUpperCase()} {(pkg.price / 100).toFixed(2)}
                    </span>
                    <span>{pkg.destination}</span>
                    <span>{pkg.duration}</span>
                    <span>{pkg.bookings} bookings</span>
                    <span className="text-yellow-600">★ {pkg.rating.toFixed(1)}</span>
                    {pkg.max_travelers && <span>Max {pkg.max_travelers} travelers</span>}
                  </div>
                  {pkg.includes && pkg.includes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {pkg.includes.slice(0, 4).map((item, i) => (
                        <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">{item}</span>
                      ))}
                      {pkg.includes.length > 4 && (
                        <span className="text-xs text-ds-muted-foreground/70">+{pkg.includes.length - 4} more</span>
                      )}
                    </div>
                  )}
                </div>
                <button className="text-sm text-blue-600 hover:underline ml-4">
                  View Bookings
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
