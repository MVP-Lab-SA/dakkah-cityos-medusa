import { Container, Heading, Table, Badge, Button, Text } from "@medusajs/ui"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Buildings } from "@medusajs/icons"
import { useState, useEffect } from "react"

/**
 * Tenant Management Page
 * Platform admins can view and manage all tenants
 */
const TenantManagementPage = () => {
  const [tenants, setTenants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTenants()
  }, [])

  const loadTenants = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch("/admin/platform/tenants")
      // const { tenants } = await response.json()
      
      // Mock data
      const mockTenants = [
        {
          id: "tenant_001",
          handle: "riyadh-retail",
          name: "Riyadh Retail Hub",
          status: "active",
          country_id: "SA",
          scope_type: "city",
          scope_id: "riyadh",
          category_id: "retail",
          subscription_tier: "enterprise",
          created_at: new Date("2024-01-15"),
        },
        {
          id: "tenant_002",
          handle: "healthcare-ksa",
          name: "Healthcare KSA",
          status: "active",
          country_id: "SA",
          scope_type: "theme",
          scope_id: "healthcare",
          category_id: "healthcare",
          subscription_tier: "pro",
          created_at: new Date("2024-02-20"),
        },
        {
          id: "tenant_003",
          handle: "jeddah-marketplace",
          name: "Jeddah Marketplace",
          status: "trial",
          country_id: "SA",
          scope_type: "city",
          scope_id: "jeddah",
          category_id: "marketplace",
          subscription_tier: "basic",
          created_at: new Date("2024-03-10"),
        },
      ]
      
      setTenants(mockTenants)
    } catch (error) {
      console.error("Failed to load tenants:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const colorMap: Record<string, string> = {
      active: "green",
      trial: "orange",
      suspended: "red",
      inactive: "grey",
    }
    const color = colorMap[status] || "grey"
    return <Badge color={color as any}>{status}</Badge>
  }

  const getTierBadge = (tier: string) => {
    const colorMap: Record<string, string> = {
      enterprise: "purple",
      pro: "blue",
      basic: "grey",
    }
    const color = colorMap[tier] || "grey"
    return <Badge color={color as any}>{tier}</Badge>
  }

  if (loading) {
    return (
      <Container className="p-8">
        <Text>Loading tenants...</Text>
      </Container>
    )
  }

  return (
    <Container className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Heading level="h1">Tenant Management</Heading>
          <Text size="small" className="text-ui-fg-muted mt-1">
            Manage all CityOS tenants across the platform
          </Text>
        </div>
        <Button variant="primary">Create Tenant</Button>
      </div>

      <div className="rounded-lg border border-ui-border-base overflow-hidden">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Tenant</Table.HeaderCell>
              <Table.HeaderCell>Hierarchy</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Tier</Table.HeaderCell>
              <Table.HeaderCell>Created</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {tenants.map((tenant) => (
              <Table.Row key={tenant.id}>
                <Table.Cell>
                  <div>
                    <Text weight="plus">{tenant.name}</Text>
                    <Text size="small" className="text-ui-fg-muted">
                      {tenant.handle}
                    </Text>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="space-y-1">
                    <Text size="small">
                      {tenant.country_id} / {tenant.scope_type} / {tenant.category_id}
                    </Text>
                    <Text size="xsmall" className="text-ui-fg-muted">
                      {tenant.scope_id}
                    </Text>
                  </div>
                </Table.Cell>
                <Table.Cell>{getStatusBadge(tenant.status)}</Table.Cell>
                <Table.Cell>{getTierBadge(tenant.subscription_tier)}</Table.Cell>
                <Table.Cell>
                  <Text size="small">
                    {tenant.created_at.toLocaleDateString()}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Button variant="secondary" size="small">
                    Manage
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      <div className="mt-4">
        <Text size="small" className="text-ui-fg-muted">
          Showing {tenants.length} tenants
        </Text>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Tenants",
  icon: Buildings,
})

export default TenantManagementPage
