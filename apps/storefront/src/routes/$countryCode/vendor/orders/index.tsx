import { createFileRoute } from "@tanstack/react-router"
import { VendorOrderList } from "@/components/vendor/vendor-order-list"

export const Route = createFileRoute("/$countryCode/vendor/orders/")({
  component: VendorOrdersRoute,
})

function VendorOrdersRoute() {
  return (
    <div className="container mx-auto py-12">
      <VendorOrderList />
    </div>
  )
}
