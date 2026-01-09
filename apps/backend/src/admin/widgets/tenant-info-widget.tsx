import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge } from "@medusajs/ui"
import { DetailWidgetProps } from "@medusajs/framework/types"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../lib/client"

const TenantInfoWidget = ({ data }: DetailWidgetProps) => {
  const tenantId = data?.metadata?.tenant_id

  const { data: tenantData, isLoading } = useQuery({
    queryKey: ["tenant", tenantId],
    queryFn: async () => {
      if (!tenantId) return null
      const tenantModule = await sdk.admin.custom.get(`/tenants/${tenantId}`)
      return tenantModule.json()
    },
    enabled: !!tenantId,
  })

  if (!tenantId) {
    return null
  }

  if (isLoading) {
    return (
      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading level="h2">Tenant Information</Heading>
        </div>
        <div className="px-6 py-4">
          <Text size="small" className="text-ui-fg-subtle">
            Loading...
          </Text>
        </div>
      </Container>
    )
  }

  const tenant = tenantData?.tenant

  if (!tenant) {
    return null
  }

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h2">Tenant Information</Heading>
      </div>
      <div className="px-6 py-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <Text size="small" leading="compact" weight="plus">
            Tenant
          </Text>
          <Text size="small" leading="compact" className="text-ui-fg-subtle">
            {tenant.name}
          </Text>

          <Text size="small" leading="compact" weight="plus">
            Handle
          </Text>
          <Text size="small" leading="compact" className="text-ui-fg-subtle">
            {tenant.handle}
          </Text>

          <Text size="small" leading="compact" weight="plus">
            Status
          </Text>
          <div>
            <Badge
              size="2xsmall"
              color={tenant.is_active ? "green" : "grey"}
            >
              {tenant.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>

          {tenant.description && (
            <>
              <Text size="small" leading="compact" weight="plus">
                Description
              </Text>
              <Text size="small" leading="compact" className="text-ui-fg-subtle">
                {tenant.description}
              </Text>
            </>
          )}
        </div>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default TenantInfoWidget
