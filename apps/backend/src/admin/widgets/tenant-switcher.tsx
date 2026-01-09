import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Select, Text, Badge } from "@medusajs/ui"
import { useState, useEffect } from "react"

/**
 * Tenant Switcher Widget
 * Allows super admins to switch between tenants
 * Shows current tenant for tenant admins
 */
const TenantSwitcherWidget = () => {
  const [tenants, setTenants] = useState<any[]>([])
  const [currentTenant, setCurrentTenant] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<string>("tenant_admin")

  useEffect(() => {
    loadTenants()
  }, [])

  const loadTenants = async () => {
    try {
      // TODO: Replace with actual API call once admin routes are created
      // const response = await fetch("/admin/platform/tenants")
      // const { tenants } = await response.json()
      
      // Mock data for now
      const mockTenants = [
        {
          id: "tenant_001",
          handle: "riyadh-retail",
          name: "Riyadh Retail Hub",
          status: "active",
          country_id: "SA",
          scope_type: "city",
        },
        {
          id: "tenant_002",
          handle: "healthcare-ksa",
          name: "Healthcare KSA",
          status: "active",
          country_id: "SA",
          scope_type: "theme",
        },
      ]
      
      setTenants(mockTenants)
      setCurrentTenant(mockTenants[0])
      setUserRole("super_admin") // Mock role
    } catch (error) {
      console.error("Failed to load tenants:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTenantChange = (tenantId: string) => {
    const selected = tenants.find((t) => t.id === tenantId)
    setCurrentTenant(selected)
    
    // Store in localStorage for persistence
    if (selected) {
      localStorage.setItem("cityos_current_tenant", tenantId)
      
      // Reload to apply tenant context
      window.location.reload()
    }
  }

  if (loading) {
    return (
      <Container className="p-4">
        <Text size="small" className="text-ui-fg-muted">
          Loading tenant information...
        </Text>
      </Container>
    )
  }

  // Show read-only for tenant admins
  if (userRole !== "super_admin") {
    return (
      <Container className="p-4 bg-ui-bg-subtle border border-ui-border-base rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <Text size="small" weight="plus" className="mb-1">
              Current Tenant
            </Text>
            <Text size="large" weight="plus">
              {currentTenant?.name || "Unknown Tenant"}
            </Text>
            <Text size="small" className="text-ui-fg-muted mt-1">
              {currentTenant?.handle}
            </Text>
          </div>
          <Badge color="green" size="small">
            {currentTenant?.status || "unknown"}
          </Badge>
        </div>
      </Container>
    )
  }

  // Show switcher for super admins
  return (
    <Container className="p-4 bg-ui-bg-base border border-ui-border-strong rounded-lg">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Text size="small" weight="plus">
            Tenant Context
          </Text>
          <Badge color="purple" size="small">
            Super Admin
          </Badge>
        </div>
        
        <Select
          onValueChange={handleTenantChange}
          value={currentTenant?.id}
        >
          <Select.Trigger>
            <Select.Value placeholder="Select a tenant" />
          </Select.Trigger>
          <Select.Content>
            {tenants.map((tenant) => (
              <Select.Item key={tenant.id} value={tenant.id}>
                <div className="flex flex-col">
                  <Text size="small" weight="plus">
                    {tenant.name}
                  </Text>
                  <Text size="xsmall" className="text-ui-fg-muted">
                    {tenant.handle} • {tenant.scope_type} • {tenant.country_id}
                  </Text>
                </div>
              </Select.Item>
            ))}
          </Select.Content>
        </Select>

        {currentTenant && (
          <div className="pt-2 border-t border-ui-border-base">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <Text size="xsmall" className="text-ui-fg-muted">
                  Scope Type
                </Text>
                <Text size="small">{currentTenant.scope_type}</Text>
              </div>
              <div>
                <Text size="xsmall" className="text-ui-fg-muted">
                  Country
                </Text>
                <Text size="small">{currentTenant.country_id}</Text>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.before" as any,
})

export default TenantSwitcherWidget
