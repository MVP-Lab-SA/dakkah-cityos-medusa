import { Container, Heading, Table, Badge, Button, Text } from "@medusajs/ui"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { BuildingStorefront } from "@medusajs/icons"
import { useState, useEffect } from "react"

/**
 * Store Management Page
 * Manage stores within tenants (multi-brand storefronts)
 */
const StoreManagementPage = () => {
  const [stores, setStores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStores()
  }, [])

  const loadStores = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch("/admin/tenant/stores")
      // const { stores } = await response.json()
      
      // Mock data
      const mockStores = [
        {
          id: "store_001",
          handle: "riyadh-main",
          name: "Riyadh Main Store",
          tenant_id: "tenant_001",
          tenant_name: "Riyadh Retail Hub",
          status: "active",
          store_type: "retail",
          storefront_url: "https://riyadh.example.com",
          created_at: new Date("2024-01-20"),
        },
        {
          id: "store_002",
          handle: "riyadh-premium",
          name: "Riyadh Premium",
          tenant_id: "tenant_001",
          tenant_name: "Riyadh Retail Hub",
          status: "active",
          store_type: "retail",
          storefront_url: "https://premium.riyadh.example.com",
          created_at: new Date("2024-02-15"),
        },
        {
          id: "store_003",
          handle: "healthcare-portal",
          name: "Healthcare Portal",
          tenant_id: "tenant_002",
          tenant_name: "Healthcare KSA",
          status: "active",
          store_type: "b2b",
          storefront_url: "https://healthcare.example.com",
          created_at: new Date("2024-02-25"),
        },
      ]
      
      setStores(mockStores)
    } catch (error) {
      console.error("Failed to load stores:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const colorMap: Record<string, string> = {
      active: "green",
      inactive: "grey",
      maintenance: "orange",
      coming_soon: "blue",
    }
    const color = colorMap[status] || "grey"
    return <Badge color={color as any}>{status}</Badge>
  }

  const getTypeBadge = (type: string) => {
    const colorMap: Record<string, string> = {
      retail: "blue",
      marketplace: "purple",
      b2b: "orange",
      hybrid: "grey",
    }
    const color = colorMap[type] || "grey"
    return <Badge color={color as any}>{type}</Badge>
  }

  if (loading) {
    return (
      <Container className="p-8">
        <Text>Loading stores...</Text>
      </Container>
    )
  }

  return (
    <Container className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Heading level="h1">Store Management</Heading>
          <Text size="small" className="text-ui-fg-muted mt-1">
            Manage storefronts and brands across your tenant
          </Text>
        </div>
        <Button variant="primary">Create Store</Button>
      </div>

      <div className="rounded-lg border border-ui-border-base overflow-hidden">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Store</Table.HeaderCell>
              <Table.HeaderCell>Tenant</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Storefront URL</Table.HeaderCell>
              <Table.HeaderCell>Created</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {stores.map((store) => (
              <Table.Row key={store.id}>
                <Table.Cell>
                  <div>
                    <Text weight="plus">{store.name}</Text>
                    <Text size="small" className="text-ui-fg-muted">
                      {store.handle}
                    </Text>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Text size="small">{store.tenant_name}</Text>
                </Table.Cell>
                <Table.Cell>{getTypeBadge(store.store_type)}</Table.Cell>
                <Table.Cell>{getStatusBadge(store.status)}</Table.Cell>
                <Table.Cell>
                  <Text size="small" className="text-ui-fg-interactive">
                    {store.storefront_url || "Not configured"}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text size="small">
                    {store.created_at.toLocaleDateString()}
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
          Showing {stores.length} stores
        </Text>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Stores",
  icon: BuildingStorefront,
})

export default StoreManagementPage
