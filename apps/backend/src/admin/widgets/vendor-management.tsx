import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Table } from "@medusajs/ui"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client"

interface Vendor {
  id: string
  business_name: string
  email: string
  status: string
  verification_status: string
  total_products: number
  total_sales: number
  commission_rate: number
  created_at: string
}

const VendorManagementWidget = () => {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["admin-vendors"],
    queryFn: async () => {
      const response = await sdk.client.fetch<{ vendors: Vendor[]; count: number }>(
        "/admin/vendors",
        { credentials: "include" }
      )
      return response
    },
  })

  const approveMutation = useMutation({
    mutationFn: async (vendorId: string) => {
      return sdk.client.fetch(`/admin/vendors/${vendorId}/approve`, {
        method: "POST",
        credentials: "include",
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vendors"] })
    },
  })

  const vendors = data?.vendors || []

  if (isLoading) {
    return (
      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading level="h2">Vendor Management</Heading>
        </div>
        <div className="px-6 py-4">
          <Text className="text-ui-fg-subtle">Loading vendors...</Text>
        </div>
      </Container>
    )
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h2">Vendor Management</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            {data?.count || 0} vendors registered
          </Text>
        </div>
      </div>

      <div className="px-6 py-4">
        {vendors.length === 0 ? (
          <Text className="text-ui-fg-subtle">No vendors registered yet</Text>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Business</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Products</Table.HeaderCell>
                <Table.HeaderCell>Sales</Table.HeaderCell>
                <Table.HeaderCell>Commission</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {vendors.map((vendor) => (
                <Table.Row key={vendor.id}>
                  <Table.Cell>
                    <div>
                      <Text size="small" weight="plus">{vendor.business_name}</Text>
                      <Text size="small" className="text-ui-fg-subtle">{vendor.email}</Text>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      size="2xsmall"
                      color={
                        vendor.verification_status === "approved"
                          ? "green"
                          : vendor.verification_status === "pending"
                          ? "orange"
                          : "grey"
                      }
                    >
                      {vendor.verification_status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="small">{vendor.total_products}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="small">${(vendor.total_sales || 0).toLocaleString()}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="small">{vendor.commission_rate}%</Text>
                  </Table.Cell>
                  <Table.Cell>
                    {vendor.verification_status === "pending" && (
                      <Button
                        size="small"
                        variant="secondary"
                        onClick={() => approveMutation.mutate(vendor.id)}
                        disabled={approveMutation.isPending}
                      >
                        Approve
                      </Button>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.list.before",
})

export default VendorManagementWidget
