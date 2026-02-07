import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Table, Input } from "@medusajs/ui"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../../lib/client"
import { Buildings } from "@medusajs/icons"
import { useState } from "react"

interface Vendor {
  id: string
  business_name: string
  email: string
  phone?: string
  status: string
  verification_status: string
  tier: string
  total_products: number
  total_sales: number
  commission_rate: number
  bank_account_holder?: string
  bank_account_number?: string
  created_at: string
}

const VendorsPage = () => {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["admin-vendors-list"],
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
      queryClient.invalidateQueries({ queryKey: ["admin-vendors-list"] })
    },
  })

  const rejectMutation = useMutation({
    mutationFn: async (vendorId: string) => {
      return sdk.client.fetch(`/admin/vendors/${vendorId}/reject`, {
        method: "POST",
        credentials: "include",
        body: { reason: "Does not meet requirements" },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vendors-list"] })
    },
  })

  const vendors = data?.vendors || []
  const filteredVendors = vendors.filter((v) => {
    const matchesSearch =
      v.business_name.toLowerCase().includes(search.toLowerCase()) ||
      v.email.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || v.verification_status === statusFilter
    return matchesSearch && matchesStatus
  })

  const pendingCount = vendors.filter((v) => v.verification_status === "pending").length
  const approvedCount = vendors.filter((v) => v.verification_status === "approved").length

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "platinum":
        return "purple"
      case "gold":
        return "orange"
      case "silver":
        return "grey"
      default:
        return "blue"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "green"
      case "rejected":
        return "red"
      case "pending":
        return "orange"
      default:
        return "grey"
    }
  }

  if (isLoading) {
    return (
      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading level="h1">Marketplace Vendors</Heading>
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
          <Heading level="h1">Marketplace Vendors</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            Manage vendor applications, approvals, and performance
          </Text>
        </div>
        <div className="flex items-center gap-x-4">
          <div className="text-right">
            <Text size="small" weight="plus">
              {pendingCount} pending
            </Text>
            <Text size="xsmall" className="text-ui-fg-subtle">
              {approvedCount} approved
            </Text>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-x-4 px-6 py-4">
        <Input
          size="small"
          placeholder="Search vendors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex items-center gap-x-2">
          <Button
            size="small"
            variant={statusFilter === "all" ? "primary" : "secondary"}
            onClick={() => setStatusFilter("all")}
          >
            All
          </Button>
          <Button
            size="small"
            variant={statusFilter === "pending" ? "primary" : "secondary"}
            onClick={() => setStatusFilter("pending")}
          >
            Pending
          </Button>
          <Button
            size="small"
            variant={statusFilter === "approved" ? "primary" : "secondary"}
            onClick={() => setStatusFilter("approved")}
          >
            Approved
          </Button>
        </div>
      </div>

      <div className="px-6 py-4">
        {filteredVendors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Buildings className="text-ui-fg-muted mb-4" />
            <Text className="text-ui-fg-subtle">No vendors found</Text>
          </div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Vendor</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Tier</Table.HeaderCell>
                <Table.HeaderCell>Products</Table.HeaderCell>
                <Table.HeaderCell>Total Sales</Table.HeaderCell>
                <Table.HeaderCell>Commission</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredVendors.map((vendor) => (
                <Table.Row key={vendor.id}>
                  <Table.Cell>
                    <div>
                      <Text size="small" weight="plus">
                        {vendor.business_name}
                      </Text>
                      <Text size="small" className="text-ui-fg-subtle">
                        {vendor.email}
                      </Text>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      size="2xsmall"
                      color={getStatusColor(vendor.verification_status)}
                    >
                      {vendor.verification_status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge size="2xsmall" color={getTierColor(vendor.tier)}>
                      {vendor.tier}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="small">{vendor.total_products}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="small">
                      ${(vendor.total_sales || 0).toLocaleString()}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="small">{vendor.commission_rate}%</Text>
                  </Table.Cell>
                  <Table.Cell>
                    {vendor.verification_status === "pending" && (
                      <div className="flex items-center gap-x-2">
                        <Button
                          size="small"
                          variant="secondary"
                          onClick={() => approveMutation.mutate(vendor.id)}
                          disabled={approveMutation.isPending}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          variant="secondary"
                          onClick={() => rejectMutation.mutate(vendor.id)}
                          disabled={rejectMutation.isPending}
                        >
                          Reject
                        </Button>
                      </div>
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

export const config = defineRouteConfig({
  label: "Vendors",
  icon: Buildings,
})

export default VendorsPage
