import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button } from "@medusajs/ui"
import { DetailWidgetProps } from "@medusajs/framework/types"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../lib/client"

const VendorInfoWidget = ({ data }: DetailWidgetProps) => {
  const vendorId = data?.metadata?.vendor_id

  const { data: vendorData, isLoading } = useQuery({
    queryKey: ["vendor", vendorId],
    queryFn: async () => {
      if (!vendorId) return null
      const response = await sdk.admin.custom.get(`/vendors/${vendorId}`)
      return response.json()
    },
    enabled: !!vendorId,
  })

  if (!vendorId) {
    return null
  }

  if (isLoading) {
    return (
      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading level="h2">Vendor Information</Heading>
        </div>
        <div className="px-6 py-4">
          <Text size="small" className="text-ui-fg-subtle">
            Loading...
          </Text>
        </div>
      </Container>
    )
  }

  const vendor = vendorData?.vendor

  if (!vendor) {
    return null
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Vendor Information</Heading>
        <Button
          size="small"
          variant="secondary"
          onClick={() => window.open(`/admin/vendors/${vendor.id}`, "_blank")}
        >
          View Vendor
        </Button>
      </div>
      <div className="px-6 py-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <Text size="small" leading="compact" weight="plus">
            Business Name
          </Text>
          <Text size="small" leading="compact" className="text-ui-fg-subtle">
            {vendor.business_name}
          </Text>

          <Text size="small" leading="compact" weight="plus">
            Email
          </Text>
          <Text size="small" leading="compact" className="text-ui-fg-subtle">
            {vendor.email}
          </Text>

          <Text size="small" leading="compact" weight="plus">
            Status
          </Text>
          <div>
            <Badge
              size="2xsmall"
              color={
                vendor.status === "active"
                  ? "green"
                  : vendor.status === "onboarding"
                  ? "orange"
                  : "red"
              }
            >
              {vendor.status}
            </Badge>
          </div>

          <Text size="small" leading="compact" weight="plus">
            Verification
          </Text>
          <div>
            <Badge
              size="2xsmall"
              color={
                vendor.verification_status === "approved"
                  ? "green"
                  : vendor.verification_status === "pending"
                  ? "orange"
                  : "red"
              }
            >
              {vendor.verification_status}
            </Badge>
          </div>

          <Text size="small" leading="compact" weight="plus">
            Commission
          </Text>
          <Text size="small" leading="compact" className="text-ui-fg-subtle">
            {vendor.commission_type === "percentage"
              ? `${vendor.commission_rate}%`
              : `$${(vendor.commission_flat / 100).toFixed(2)}`}
          </Text>

          <Text size="small" leading="compact" weight="plus">
            Total Sales
          </Text>
          <Text size="small" leading="compact" className="text-ui-fg-subtle">
            ${(vendor.total_sales / 100).toFixed(2)}
          </Text>

          <Text size="small" leading="compact" weight="plus">
            Total Orders
          </Text>
          <Text size="small" leading="compact" className="text-ui-fg-subtle">
            {vendor.total_orders}
          </Text>
        </div>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default VendorInfoWidget
