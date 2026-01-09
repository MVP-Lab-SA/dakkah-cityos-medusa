import { createFileRoute, redirect } from "@tanstack/react-router"
import { VendorDashboard } from "~/components/vendor/vendor-dashboard"

export const Route = createFileRoute("/$countryCode/vendor/")({
  beforeLoad: ({ context }) => {
    // Check if user is authenticated and has vendor role
    if (!context.customer) {
      throw redirect({
        to: "/$countryCode/account/login",
        search: { redirect: `/${context.countryCode}/vendor` },
      })
    }
    
    // TODO: Check if customer has vendor role/permissions
    // This would typically check customer metadata or a vendor association
  },
  component: VendorDashboardRoute,
})

function VendorDashboardRoute() {
  return (
    <div className="container mx-auto py-12">
      <VendorDashboard />
    </div>
  )
}
