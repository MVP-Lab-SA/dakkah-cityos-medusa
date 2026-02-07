import { createFileRoute, Link } from "@tanstack/react-router"
import { AccountLayout } from "@/components/account"
import { TrackingInfo } from "@/components/orders/tracking-info"
import { ArrowLeft } from "@medusajs/icons"

export const Route = createFileRoute("/$countryCode/account/orders/$id/track")({
  component: TrackOrderPage,
})

function TrackOrderPage() {
  const { countryCode, id } = Route.useParams()

  // Mock tracking data - would come from API
  const trackingData = {
    carrier: "FedEx",
    trackingNumber: "794644790159",
    trackingUrl: "https://www.fedex.com/fedextrack/?trknbr=794644790159",
    estimatedDelivery: "December 20, 2024",
    events: [
      {
        date: "2024-12-18T14:30:00Z",
        location: "Local Delivery Hub",
        status: "Out for Delivery",
        description: "Package is out for delivery",
      },
      {
        date: "2024-12-18T08:00:00Z",
        location: "Distribution Center, Los Angeles, CA",
        status: "In Transit",
        description: "Package arrived at local facility",
      },
      {
        date: "2024-12-17T15:45:00Z",
        location: "Memphis, TN",
        status: "In Transit",
        description: "Package departed FedEx hub",
      },
      {
        date: "2024-12-16T10:00:00Z",
        location: "Warehouse",
        status: "Shipped",
        description: "Shipment picked up",
      },
    ],
  }

  return (
    <AccountLayout>
      <div className="max-w-2xl">
        {/* Back Link */}
        <Link
          to={`/${countryCode}/account/orders/${id}`}
          className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Order Details
        </Link>

        <h1 className="text-2xl font-bold text-zinc-900 mb-6">Track Your Order</h1>

        <TrackingInfo {...trackingData} />
      </div>
    </AccountLayout>
  )
}
