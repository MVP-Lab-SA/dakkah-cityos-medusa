// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import { VendorOrderList } from "@/components/vendor/vendor-order-list"
import { useState } from "react"
import { lazy, Suspense } from "react"

const VendorOrderDetail = lazy(() => import("@/components/vendor/vendor-order-detail"))

export const Route = createFileRoute("/$tenant/$locale/vendor/orders/")({
  component: VendorOrdersRoute,
})

function VendorOrdersRoute() {
  const { locale } = Route.useParams()
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  if (selectedOrderId) {
    return (
      <div className="container mx-auto py-12">
        <button
          onClick={() => setSelectedOrderId(null)}
          className="mb-4 text-ds-primary hover:underline flex items-center gap-1"
        >
          ← Back to Orders
        </button>
        <Suspense fallback={<div className="text-ds-muted-foreground">Loading...</div>}>
          <VendorOrderDetail orderId={selectedOrderId} locale={locale} />
        </Suspense>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12">
      <VendorOrderList onOrderClick={(id: string) => setSelectedOrderId(id)} />
    </div>
  )
}
