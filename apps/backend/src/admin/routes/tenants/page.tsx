import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button, Badge, Text } from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { Buildings2 } from "@medusajs/icons"
import { sdk } from "../../lib/client"
import { DataTable, useDataTable } from "@medusajs/ui"

const TenantsPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      const response = await sdk.admin.custom.get("/tenants")
      return response.json()
    },
  })

  const columns = [
    {
      header: "Name",
      cell: ({ row }: any) => (
        <div>
          <Text size="small" weight="plus">{row.original.name}</Text>
          <Text size="small" className="text-ui-fg-subtle">
            {row.original.handle}
          </Text>
        </div>
      ),
    },
    {
      header: "Type",
      cell: ({ row }: any) => (
        <Badge size="2xsmall" color="grey">
          {row.original.type}
        </Badge>
      ),
    },
    {
      header: "Status",
      cell: ({ row }: any) => (
        <Badge
          size="2xsmall"
          color={row.original.is_active ? "green" : "red"}
        >
          {row.original.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      header: "Products",
      cell: ({ row }: any) => (
        <Text size="small">{row.original.total_products || 0}</Text>
      ),
    },
    {
      header: "Orders",
      cell: ({ row }: any) => (
        <Text size="small">{row.original.total_orders || 0}</Text>
      ),
    },
    {
      header: "Revenue",
      cell: ({ row }: any) => (
        <Text size="small">
          ${((row.original.total_revenue || 0) / 100).toFixed(2)}
        </Text>
      ),
    },
  ]

  const table = useDataTable({
    data: data?.tenants || [],
    columns,
    enablePagination: true,
    enableRowSelection: false,
    pageSize: 10,
  })

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h1">Tenants</Heading>
        <Text size="small" className="text-ui-fg-subtle">
          Manage marketplace tenants
        </Text>
      </div>
      <div className="px-6 py-4">
        <DataTable table={table} />
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Tenants",
  icon: Buildings2,
})

export default TenantsPage
