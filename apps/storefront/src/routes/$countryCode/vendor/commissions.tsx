import { createFileRoute } from "@tanstack/react-router"
import { VendorCommissions } from "@/components/vendor/vendor-commissions"

export const Route = createFileRoute("/$countryCode/vendor/commissions")({
  component: VendorCommissionsRoute,
})

function VendorCommissionsRoute() {
  return (
    <div className="container mx-auto py-12">
      <VendorCommissions />
    </div>
  )
}
