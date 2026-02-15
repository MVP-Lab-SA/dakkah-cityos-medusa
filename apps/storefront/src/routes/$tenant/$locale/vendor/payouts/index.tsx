import { AuthGuard } from "@/components/auth/auth-guard"
import { createFileRoute } from "@tanstack/react-router"
import { VendorPayouts } from "@/components/vendor/vendor-payouts"

export const Route = createFileRoute("/$tenant/$locale/vendor/payouts/")({
  component: VendorPayoutsRoute,
})

function VendorPayoutsRoute() {
  return (<AuthGuard>
    <div className="container mx-auto py-12">
      <VendorPayouts />
    </div>
    </AuthGuard>
  )
}
