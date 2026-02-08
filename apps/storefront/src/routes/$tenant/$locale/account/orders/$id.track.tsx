import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { AccountLayout } from "@/components/account"
import { TrackingInfo } from "@/components/orders/tracking-info"
import { ArrowLeft, Spinner } from "@medusajs/icons"
import { getBackendUrl } from "@/lib/utils/env"

export const Route = createFileRoute("/$tenant/$locale/account/orders/$id/track")({
  component: TrackOrderPage,
})

function TrackOrderPage() {
  const { tenant, locale, id } = Route.useParams()
  const backendUrl = getBackendUrl()

  // Fetch order with fulfillment data
  const { data: order, isLoading, error } = useQuery({
    queryKey: ["order-tracking", id],
    queryFn: async () => {
      const response = await fetch(
        `${backendUrl}/store/orders/${id}?fields=*fulfillments,*fulfillments.labels,*fulfillments.items`,
        { credentials: "include" }
      )
      if (!response.ok) throw new Error("Failed to fetch order")
      const data = await response.json()
      return data.order
    },
  })

  // Extract tracking info from fulfillments
  const getTrackingData = () => {
    if (!order?.fulfillments?.length) {
      return null
    }

    const fulfillment = order.fulfillments[0]
    const label = fulfillment.labels?.[0]

    if (!label?.tracking_number) {
      return null
    }

    // Build tracking URL based on common carriers
    const getTrackingUrl = (carrier: string, trackingNumber: string) => {
      const carrierUrls: Record<string, string> = {
        fedex: `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
        ups: `https://www.ups.com/track?tracknum=${trackingNumber}`,
        usps: `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
        dhl: `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`,
      }
      const normalizedCarrier = carrier?.toLowerCase() || ""
      return carrierUrls[normalizedCarrier] || `https://www.google.com/search?q=${trackingNumber}+tracking`
    }

    // Build tracking events from fulfillment data
    const events = []
    
    if (fulfillment.shipped_at) {
      events.push({
        date: fulfillment.shipped_at,
        location: "Warehouse",
        status: "Shipped",
        description: "Shipment picked up by carrier",
      })
    }
    
    if (fulfillment.created_at && fulfillment.created_at !== fulfillment.shipped_at) {
      events.unshift({
        date: fulfillment.created_at,
        location: "Warehouse",
        status: "Processing",
        description: "Fulfillment created",
      })
    }

    // If delivered
    if (fulfillment.delivered_at) {
      events.push({
        date: fulfillment.delivered_at,
        location: "Delivery Address",
        status: "Delivered",
        description: "Package delivered",
      })
    }

    return {
      carrier: label.tracking_carrier || "Carrier",
      trackingNumber: label.tracking_number,
      trackingUrl: getTrackingUrl(label.tracking_carrier, label.tracking_number),
      estimatedDelivery: fulfillment.metadata?.estimated_delivery || null,
      events: events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    }
  }

  const trackingData = getTrackingData()

  return (
    <AccountLayout>
      <div className="max-w-2xl">
        {/* Back Link */}
        <Link
          to={`/${tenant}/${locale}/account/orders/${id}` as any}
          className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Order Details
        </Link>

        <h1 className="text-2xl font-bold text-zinc-900 mb-6">Track Your Order</h1>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Spinner className="w-6 h-6 animate-spin text-zinc-400" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
            Failed to load tracking information. Please try again later.
          </div>
        )}

        {!isLoading && !error && !trackingData && (
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-8 text-center">
            <p className="text-zinc-600 mb-2">No tracking information available yet.</p>
            <p className="text-sm text-zinc-500">
              Tracking details will appear here once your order has been shipped.
            </p>
          </div>
        )}

        {trackingData && <TrackingInfo {...trackingData} />}
      </div>
    </AccountLayout>
  )
}
