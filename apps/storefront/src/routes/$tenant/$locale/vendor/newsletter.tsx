// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { useAuth } from "@/lib/context/auth-context"
import { useState, useMemo } from "react"

interface NewsletterCampaign {
  id: string
  subject: string
  preview_text?: string
  sent_date?: string
  recipients: number
  open_rate: number
  click_rate: number
  status: string
  created_at: string
}

export const Route = createFileRoute("/$tenant/$locale/vendor/newsletter")({
  component: VendorNewsletterRoute,
})

function VendorNewsletterRoute() {
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
    queryKey: ["vendor-newsletter", statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (statusFilter) params.set("status", statusFilter)
      const url = `/vendor/newsletter${params.toString() ? `?${params}` : ""}`
      return sdk.client.fetch<{ items: NewsletterCampaign[]; count: number }>(url, {
        credentials: "include",
      })
    },
  })

  const items = data?.items || []

  const statusColors: Record<string, string> = {
    sent: "bg-green-100 text-green-800",
    draft: "bg-gray-100 text-gray-800",
    scheduled: "bg-blue-100 text-blue-800",
    sending: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
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
        <h1 className="text-2xl font-bold">Newsletter Campaigns</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          + Create Campaign
        </button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["", "sent", "draft", "scheduled", "sending", "failed"].map((s) => (
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
          <p className="text-lg mb-2">No newsletter campaigns yet</p>
          <p className="text-sm">Create your first campaign to engage with your audience.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((campaign) => (
            <div key={campaign.id} className="border rounded-lg p-6 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{campaign.subject}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${statusColors[campaign.status] || "bg-gray-100 text-gray-800"}`}>
                      {campaign.status}
                    </span>
                  </div>
                  {campaign.preview_text && (
                    <p className="text-gray-600 text-sm mb-3">{campaign.preview_text}</p>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 mb-3">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold">{campaign.recipients.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Recipients</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold">{campaign.open_rate.toFixed(1)}%</p>
                      <p className="text-xs text-gray-500">Open Rate</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold">{campaign.click_rate.toFixed(1)}%</p>
                      <p className="text-xs text-gray-500">Click Rate</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-sm font-medium">{campaign.sent_date ? new Date(campaign.sent_date).toLocaleDateString() : "—"}</p>
                      <p className="text-xs text-gray-500">Sent Date</p>
                    </div>
                  </div>
                </div>
                <button className="text-sm text-blue-600 hover:underline ml-4">
                  View Stats
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
