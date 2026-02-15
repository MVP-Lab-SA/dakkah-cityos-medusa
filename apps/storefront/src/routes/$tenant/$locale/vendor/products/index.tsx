import { AuthGuard } from "@/components/auth/auth-guard"
import { createFileRoute } from "@tanstack/react-router"
import { VendorProductList } from "@/components/vendor/vendor-product-list"

export const Route = createFileRoute("/$tenant/$locale/vendor/products/")({
  component: VendorProductsRoute,
})

function VendorProductsRoute() {
  return (<AuthGuard>
    <div className="container mx-auto py-12">
      <VendorProductList />
    </div>
    </AuthGuard>
  )
}
