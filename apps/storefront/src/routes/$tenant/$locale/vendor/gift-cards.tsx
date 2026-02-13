// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { useAuth } from "@/lib/context/auth-context"
import { useState, useMemo } from "react"

interface GiftCardTemplate {
  id: string
  design_name: string
  description?: string
  denomination: number
  currency_code: string
  sold_count: number
  redeemed_count: number
  status: string
  created_at: string
}

export const Route = createFileRoute("/$tenant/$locale/vendor/gift-cards")({
  component: VendorGiftCardsRoute,
})

function VendorGiftCardsRoute() {
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
    queryKey: ["vendor-gift-cards", statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (statusFilter) params.set("status", statusFilter)
      const url = `/vendor/gift-cards${params.toString() ? `?${params}` : ""}`
      return sdk.client.fetch<{ items: GiftCardTemplate[]; count: number }>(url, {
        credentials: "include",
      })
    },
  })

  const items = data?.items || []

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    draft: "bg-gray-100 text-gray-800",
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
        <h1 className="text-2xl font-bold">Gift Card Templates</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          + Create Template
        </button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["", "active", "draft", "archived"].map((s) => (
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
          <p className="text-lg mb-2">No gift card templates yet</p>
          <p className="text-sm">Create gift card templates for customers to purchase.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((card) => (
            <div key={card.id} className="border rounded-lg p-6 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{card.design_name}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${statusColors[card.status] || "bg-gray-100 text-gray-800"}`}>
                      {card.status}
                    </span>
                  </div>
                  {card.description && (
                    <p className="text-gray-600 text-sm mb-3">{card.description}</p>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold">{card.currency_code?.toUpperCase()} {(card.denomination / 100).toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Denomination</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold">{card.sold_count.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Sold</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold">{card.redeemed_count.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Redeemed</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold">{card.sold_count > 0 ? ((card.redeemed_count / card.sold_count) * 100).toFixed(1) : 0}%</p>
                      <p className="text-xs text-gray-500">Redemption Rate</p>
                    </div>
                  </div>
                </div>
                <button className="text-sm text-blue-600 hover:underline ml-4">
                  View Analytics
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
