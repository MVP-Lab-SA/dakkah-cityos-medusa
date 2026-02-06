import { createFileRoute } from "@tanstack/react-router"
import { VendorDashboard } from "@/components/vendor/vendor-dashboard"

export const Route = createFileRoute("/$countryCode/vendor/")({
  component: VendorDashboardRoute,
})

function VendorDashboardRoute() {
  return (
    <div className="container mx-auto py-12">
      <VendorDashboard />
    </div>
  )
}
