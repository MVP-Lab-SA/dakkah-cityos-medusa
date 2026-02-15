import { AuthGuard } from "@/components/auth/auth-guard"
import { createFileRoute } from "@tanstack/react-router"
import { VendorCommissions } from "@/components/vendor/vendor-commissions"

export const Route = createFileRoute("/$tenant/$locale/vendor/commissions")({
  component: VendorCommissionsRoute,
})

function VendorCommissionsRoute() {
  return (<AuthGuard>
    <div className="container mx-auto py-12">
      <VendorCommissions />
    </div>
    </AuthGuard>
  )
}
