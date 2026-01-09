import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading } from "@medusajs/ui"

const VendorStatsWidget = () => {
  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Vendor Statistics</Heading>
      </div>
      <div className="grid grid-cols-3 gap-4 px-6 py-4">
        <div>
          <div className="text-ui-fg-subtle text-sm">Active Vendors</div>
          <div className="text-2xl font-semibold">--</div>
        </div>
        <div>
          <div className="text-ui-fg-subtle text-sm">Pending Approval</div>
          <div className="text-2xl font-semibold">--</div>
        </div>
        <div>
          <div className="text-ui-fg-subtle text-sm">Total Payouts</div>
          <div className="text-2xl font-semibold">$--</div>
        </div>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.list.before",
})

export default VendorStatsWidget
