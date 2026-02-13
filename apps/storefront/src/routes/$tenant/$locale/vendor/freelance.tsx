// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { useAuth } from "@/lib/context/auth-context"
import { useState, useMemo } from "react"

interface GigListing {
  id: string
  title: string
  description: string
  category?: string
  subcategory?: string
  listing_type: string
  price?: number
  hourly_rate?: number
  currency_code: string
  delivery_time_days?: number
  revisions_included?: number
  status: string
  skill_tags?: string[]
  portfolio_urls?: string[]
  proposal_count?: number
  created_at: string
}

export const Route = createFileRoute("/$tenant/$locale/vendor/freelance")({
  component: VendorFreelanceRoute,
})

function VendorFreelanceRoute() {
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
    queryKey: ["vendor-freelance", statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (statusFilter) params.set("status", statusFilter)
      const url = `/vendor/freelance${params.toString() ? `?${params}` : ""}`
      return sdk.client.fetch<{ items: GigListing[]; count: number }>(url, {
        credentials: "include",
      })
    },
  })

  const items = data?.items || []

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    draft: "bg-gray-100 text-gray-800",
    paused: "bg-yellow-100 text-yellow-800",
    completed: "bg-blue-100 text-blue-800",
    suspended: "bg-red-100 text-red-800",
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
        <h1 className="text-2xl font-bold">Gig Listings</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          + Post Gig
        </button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["", "active", "draft", "paused", "completed", "suspended"].map((s) => (
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
          <p className="text-lg mb-2">No gig listings yet</p>
          <p className="text-sm">Post your first gig to start receiving proposals.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((gig) => (
            <div key={gig.id} className="border rounded-lg p-6 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{gig.title}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${statusColors[gig.status] || "bg-gray-100 text-gray-800"}`}>
                      {gig.status}
                    </span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                      {gig.listing_type.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{gig.description}</p>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    {gig.price != null && (
                      <span className="font-medium text-gray-900">
                        {gig.currency_code?.toUpperCase()} {(gig.price / 100).toFixed(2)}
                        {gig.listing_type === "fixed_price" ? " fixed" : ""}
                      </span>
                    )}
                    {gig.hourly_rate != null && (
                      <span className="font-medium text-gray-900">
                        {gig.currency_code?.toUpperCase()} {(gig.hourly_rate / 100).toFixed(2)}/hr
                      </span>
                    )}
                    {gig.delivery_time_days && (
                      <span>{gig.delivery_time_days}d delivery</span>
                    )}
                    {gig.proposal_count != null && (
                      <span>{gig.proposal_count} proposals</span>
                    )}
                    {gig.category && <span>{gig.category}</span>}
                  </div>
                  {gig.skill_tags && gig.skill_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {gig.skill_tags.slice(0, 5).map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">{tag}</span>
                      ))}
                      {gig.skill_tags.length > 5 && (
                        <span className="text-xs text-gray-400">+{gig.skill_tags.length - 5} more</span>
                      )}
                    </div>
                  )}
                </div>
                <button className="text-sm text-blue-600 hover:underline ml-4">
                  View Proposals
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
