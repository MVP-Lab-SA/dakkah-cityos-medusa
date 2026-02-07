import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps } from "@medusajs/framework/types"
import { Container, Heading, Text, Badge, Button, Input } from "@medusajs/ui"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client"
import { useState } from "react"

interface Vendor {
  id: string
  business_name: string
}

const ProductBusinessConfigWidget = ({ data }: DetailWidgetProps<{ id: string }>) => {
  const queryClient = useQueryClient()
  const [selectedVendorId, setSelectedVendorId] = useState<string>("")
  const [isSubscriptionProduct, setIsSubscriptionProduct] = useState(false)
  const [isServiceProduct, setIsServiceProduct] = useState(false)
  const [serviceDuration, setServiceDuration] = useState("60")

  const { data: vendorsData, isLoading: vendorsLoading } = useQuery({
    queryKey: ["product-vendors"],
    queryFn: async () => {
      const response = await sdk.client.fetch<{ vendors: Vendor[] }>(
        "/admin/vendors",
        { credentials: "include" }
      )
      return response
    },
  })

  const vendors = vendorsData?.vendors || []

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h2">Business Configuration</Heading>
        <Text size="small" className="text-ui-fg-subtle">
          Configure how this product works across business models
        </Text>
      </div>

      {/* Vendor Attribution */}
      <div className="px-6 py-4">
        <div className="mb-3 flex items-center gap-x-2">
          <Text size="small" weight="plus">Vendor Attribution</Text>
          <Badge size="2xsmall" color="blue">Marketplace</Badge>
        </div>
        <Text size="small" className="text-ui-fg-subtle mb-3">
          Assign this product to a vendor for marketplace orders
        </Text>
        {vendorsLoading ? (
          <Text size="small" className="text-ui-fg-muted">Loading vendors...</Text>
        ) : vendors.length === 0 ? (
          <Text size="small" className="text-ui-fg-muted">No vendors available</Text>
        ) : (
          <div className="flex items-center gap-x-2">
            <select
              className="rounded-md border border-ui-border-base bg-ui-bg-field px-3 py-2 text-sm"
              value={selectedVendorId}
              onChange={(e) => setSelectedVendorId(e.target.value)}
            >
              <option value="">No vendor (Platform product)</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.business_name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Subscription Configuration */}
      <div className="px-6 py-4">
        <div className="mb-3 flex items-center gap-x-2">
          <Text size="small" weight="plus">Subscription Product</Text>
          <Badge size="2xsmall" color="green">Recurring</Badge>
        </div>
        <Text size="small" className="text-ui-fg-subtle mb-3">
          Enable recurring billing for this product
        </Text>
        <label className="flex items-center gap-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isSubscriptionProduct}
            onChange={(e) => setIsSubscriptionProduct(e.target.checked)}
            className="rounded border-ui-border-base"
          />
          <Text size="small">This is a subscription product</Text>
        </label>
        {isSubscriptionProduct && (
          <div className="mt-3 pl-6">
            <Text size="xsmall" className="text-ui-fg-muted">
              Subscription billing is configured through the Subscriptions module
            </Text>
          </div>
        )}
      </div>

      {/* Service/Booking Configuration */}
      <div className="px-6 py-4">
        <div className="mb-3 flex items-center gap-x-2">
          <Text size="small" weight="plus">Service Product</Text>
          <Badge size="2xsmall" color="orange">Booking</Badge>
        </div>
        <Text size="small" className="text-ui-fg-subtle mb-3">
          Enable booking/scheduling for this product
        </Text>
        <label className="flex items-center gap-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isServiceProduct}
            onChange={(e) => setIsServiceProduct(e.target.checked)}
            className="rounded border-ui-border-base"
          />
          <Text size="small">This is a bookable service</Text>
        </label>
        {isServiceProduct && (
          <div className="mt-3 pl-6 space-y-2">
            <div className="flex items-center gap-x-2">
              <Text size="small">Duration:</Text>
              <Input
                size="small"
                type="number"
                value={serviceDuration}
                onChange={(e) => setServiceDuration(e.target.value)}
                className="w-20"
              />
              <Text size="small">minutes</Text>
            </div>
          </div>
        )}
      </div>

      {/* B2B Configuration */}
      <div className="px-6 py-4">
        <div className="mb-3 flex items-center gap-x-2">
          <Text size="small" weight="plus">B2B Settings</Text>
          <Badge size="2xsmall" color="purple">Enterprise</Badge>
        </div>
        <Text size="small" className="text-ui-fg-subtle mb-3">
          Configure B2B-specific pricing and availability
        </Text>
        <Text size="xsmall" className="text-ui-fg-muted">
          B2B pricing is managed through Company-specific price lists
        </Text>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductBusinessConfigWidget
