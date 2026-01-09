import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button, Badge, Text } from "@medusajs/ui"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { BuildingStorefront, CheckCircle, XCircle } from "@medusajs/icons"
import { sdk } from "../../lib/client"
import { toast } from "@medusajs/ui"
import { DataTable, useDataTable } from "@medusajs/ui"

const VendorsPage = () => {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["vendors"],
    queryFn: async () => {
      const response = await sdk.admin.custom.get("/vendors")
      return response.json()
    },
  })

  const approveMutation = useMutation({
    mutationFn: async (vendorId: string) => {
      await sdk.admin.custom.post(`/vendors/${vendorId}/approve`, {})
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] })
      toast.success("Vendor approved successfully")
    },
  })

  const rejectMutation = useMutation({
    mutationFn: async ({ vendorId, notes }: { vendorId: string; notes?: string }) => {
      await sdk.admin.custom.post(`/vendors/${vendorId}/reject`, { notes })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] })
      toast.success("Vendor rejected")
    },
  })

  const columns = [
    {
      header: "Business Name",
      cell: ({ row }: any) => (
        <div>
          <Text size="small" weight="plus">{row.original.business_name}</Text>
          <Text size="small" className="text-ui-fg-subtle">{row.original.email}</Text>
        </div>
      ),
    },
    {
      header: "Status",
      cell: ({ row }: any) => (
        <Badge
          size="2xsmall"
          color={
            row.original.status === "active"
              ? "green"
              : row.original.status === "onboarding"
              ? "orange"
              : "red"
          }
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      header: "Verification",
      cell: ({ row }: any) => (
        <Badge
          size="2xsmall"
          color={
            row.original.verification_status === "approved"
              ? "green"
              : row.original.verification_status === "pending"
              ? "orange"
              : "red"
          }
        >
          {row.original.verification_status}
        </Badge>
      ),
    },
    {
      header: "Commission",
      cell: ({ row }: any) => (
        <Text size="small">
          {row.original.commission_type === "percentage"
            ? `${row.original.commission_rate}%`
            : `$${(row.original.commission_flat / 100).toFixed(2)}`}
        </Text>
      ),
    },
    {
      header: "Sales",
      cell: ({ row }: any) => (
        <div>
          <Text size="small" weight="plus">
            ${(row.original.total_sales / 100).toFixed(2)}
          </Text>
          <Text size="small" className="text-ui-fg-subtle">
            {row.original.total_orders} orders
          </Text>
        </div>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }: any) => {
        if (row.original.verification_status === "pending") {
          return (
            <div className="flex gap-2">
              <Button
                size="small"
                variant="secondary"
                onClick={() => approveMutation.mutate(row.original.id)}
                disabled={approveMutation.isPending}
              >
                <CheckCircle className="mr-1" />
                Approve
              </Button>
              <Button
                size="small"
                variant="secondary"
                onClick={() =>
                  rejectMutation.mutate({
                    vendorId: row.original.id,
                    notes: "Rejected by admin",
                  })
                }
                disabled={rejectMutation.isPending}
              >
                <XCircle className="mr-1" />
                Reject
              </Button>
            </div>
          )
        }
        return null
      },
    },
  ]

  const table = useDataTable({
    data: data?.vendors || [],
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
        <Heading level="h1">Vendors</Heading>
        <Text size="small" className="text-ui-fg-subtle">
          Manage vendor applications and approvals
        </Text>
      </div>
      <div className="px-6 py-4">
        <DataTable table={table} />
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Vendors",
  icon: BuildingStorefront,
})

export default VendorsPage
