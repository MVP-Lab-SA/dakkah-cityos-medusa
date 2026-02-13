// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { useAuth } from "@/lib/context/auth-context"
import { useState, useMemo } from "react"

interface CharityCampaign {
  id: string
  name: string
  description?: string
  goal: number
  raised: number
  currency_code: string
  donors_count: number
  status: string
  end_date: string
  category?: string
  image_url?: string
  created_at: string
}

export const Route = createFileRoute("/$tenant/$locale/vendor/charity")({
  component: VendorCharityRoute,
})

function VendorCharityRoute() {
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
    queryKey: ["vendor-charity", statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (statusFilter) params.set("status", statusFilter)
      const url = `/vendor/charity${params.toString() ? `?${params}` : ""}`
      return sdk.client.fetch<{ items: CharityCampaign[]; count: number }>(url, {
        credentials: "include",
      })
    },
  })

  const items = data?.items || []

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    draft: "bg-gray-100 text-gray-800",
    completed: "bg-purple-100 text-purple-800",
    ended: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
  }

  function getProgress(raised: number, goal: number) {
    if (goal <= 0) return 0
    return Math.min(Math.round((raised / goal) * 100), 100)
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
        <h1 className="text-2xl font-bold">Charity Campaigns</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          + Start Campaign
        </button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["", "active", "draft", "pending", "completed", "ended"].map((s) => (
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
          <p className="text-lg mb-2">No charity campaigns yet</p>
          <p className="text-sm">Start your first campaign to begin raising donations.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((campaign) => {
            const progress = getProgress(campaign.raised, campaign.goal)
            return (
              <div key={campaign.id} className="border rounded-lg p-6 hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{campaign.name}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${statusColors[campaign.status] || "bg-gray-100 text-gray-800"}`}>
                        {campaign.status}
                      </span>
                      {campaign.category && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                          {campaign.category}
                        </span>
                      )}
                    </div>
                    {campaign.description && (
                      <p className="text-gray-600 text-sm mb-3">{campaign.description}</p>
                    )}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span className="font-medium text-gray-900">
                        {campaign.currency_code?.toUpperCase()} {(campaign.raised / 100).toFixed(2)}
                        <span className="text-gray-500 font-normal"> / {(campaign.goal / 100).toFixed(2)}</span>
                      </span>
                      <span className="font-medium text-green-600">{progress}%</span>
                      <span>{campaign.donors_count} donors</span>
                      <span>Ends {new Date(campaign.end_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button className="text-sm text-blue-600 hover:underline ml-4">
                    View Donations
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
