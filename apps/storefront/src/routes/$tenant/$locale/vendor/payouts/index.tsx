import { createFileRoute } from "@tanstack/react-router"
import { VendorPayouts } from "@/components/vendor/vendor-payouts"

export const Route = createFileRoute("/$tenant/$locale/vendor/payouts/")({
  component: VendorPayoutsRoute,
})

function VendorPayoutsRoute() {
  return (
    <div className="container mx-auto py-12">
      <VendorPayouts />
    </div>
  )
}
