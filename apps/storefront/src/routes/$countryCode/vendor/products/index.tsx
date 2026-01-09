import { createFileRoute } from "@tanstack/react-router"
import { VendorProductList } from "~/components/vendor/vendor-product-list"

export const Route = createFileRoute("/$countryCode/vendor/products/")({
  component: VendorProductsRoute,
})

function VendorProductsRoute() {
  return (
    <div className="container mx-auto py-12">
      <VendorProductList />
    </div>
  )
}
