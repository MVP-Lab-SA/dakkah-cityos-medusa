import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Table, Input } from "@medusajs/ui"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../../lib/client"
import { ServerStack } from "@medusajs/icons"
import { useState } from "react"

interface Tenant {
  id: string
  name: string
  slug: string
  domain?: string
  email: string
  status: string
  plan: string
  monthly_revenue: number
  users_count: number
  storage_used_mb: number
  api_calls_count: number
  created_at: string
}

const TenantsPage = () => {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["admin-tenants"],
    queryFn: async () => {
      const response = await sdk.client.fetch<{
        tenants: Tenant[]
        count: number
      }>("/admin/tenants", { credentials: "include" })
      return response
    },
  })

  const suspendMutation = useMutation({
    mutationFn: async (tenantId: string) => {
      return sdk.client.fetch(`/admin/tenants/${tenantId}`, {
        method: "PUT",
        credentials: "include",
        body: { status: "suspended" },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tenants"] })
    },
  })

  const activateMutation = useMutation({
    mutationFn: async (tenantId: string) => {
      return sdk.client.fetch(`/admin/tenants/${tenantId}`, {
        method: "PUT",
        credentials: "include",
        body: { status: "active" },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tenants"] })
    },
  })

  const tenants = data?.tenants || []

  const filteredTenants = tenants.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      t.slug.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || t.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "green"
      case "suspended":
        return "red"
      case "trial":
        return "orange"
      case "pending":
        return "orange"
      default:
        return "grey"
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "enterprise":
        return "purple"
      case "professional":
        return "blue"
      case "starter":
        return "green"
      default:
        return "grey"
    }
  }

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatStorage = (mb: number) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)} GB`
    }
    return `${mb} MB`
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const activeCount = tenants.filter((t) => t.status === "active").length
  const totalMRR = tenants
    .filter((t) => t.status === "active")
    .reduce((sum, t) => sum + (t.monthly_revenue || 0), 0)

  if (isLoading) {
    return (
      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading level="h1">Tenants</Heading>
        </div>
        <div className="px-6 py-4">
          <Text className="text-ui-fg-subtle">Loading tenants...</Text>
        </div>
      </Container>
    )
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h1">Multi-Tenant Management</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            Manage tenant accounts, plans, and usage
          </Text>
        </div>
        <div className="flex items-center gap-x-6">
          <div className="text-right">
            <Text size="small" weight="plus">
              {activeCount} active tenants
            </Text>
            <Text size="xsmall" className="text-ui-fg-subtle">
              Platform MRR: {formatMoney(totalMRR)}
            </Text>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-x-4 px-6 py-4">
        <Input
          size="small"
          placeholder="Search tenants..."
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
            variant={statusFilter === "active" ? "primary" : "secondary"}
            onClick={() => setStatusFilter("active")}
          >
            Active
          </Button>
          <Button
            size="small"
            variant={statusFilter === "trial" ? "primary" : "secondary"}
            onClick={() => setStatusFilter("trial")}
          >
            Trial
          </Button>
          <Button
            size="small"
            variant={statusFilter === "suspended" ? "primary" : "secondary"}
            onClick={() => setStatusFilter("suspended")}
          >
            Suspended
          </Button>
        </div>
      </div>

      <div className="px-6 py-4">
        {filteredTenants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <ServerStack className="text-ui-fg-muted mb-4" />
            <Text className="text-ui-fg-subtle">No tenants found</Text>
          </div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Tenant</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Plan</Table.HeaderCell>
                <Table.HeaderCell>Users</Table.HeaderCell>
                <Table.HeaderCell>Storage</Table.HeaderCell>
                <Table.HeaderCell>API Calls</Table.HeaderCell>
                <Table.HeaderCell>MRR</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredTenants.map((tenant) => (
                <Table.Row key={tenant.id}>
                  <Table.Cell>
                    <div>
                      <Text size="small" weight="plus">
                        {tenant.name}
                      </Text>
                      <Text size="xsmall" className="text-ui-fg-subtle">
                        {tenant.slug}
                        {tenant.domain && ` / ${tenant.domain}`}
                      </Text>
                      <Text size="xsmall" className="text-ui-fg-muted">
                        {tenant.email}
                      </Text>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge size="2xsmall" color={getStatusColor(tenant.status)}>
                      {tenant.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge size="2xsmall" color={getPlanColor(tenant.plan)}>
                      {tenant.plan}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="small">{tenant.users_count}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="small">{formatStorage(tenant.storage_used_mb)}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="small">{formatNumber(tenant.api_calls_count)}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="small">{formatMoney(tenant.monthly_revenue)}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-x-2">
                      {tenant.status === "active" && (
                        <Button
                          size="small"
                          variant="secondary"
                          onClick={() => suspendMutation.mutate(tenant.id)}
                          disabled={suspendMutation.isPending}
                        >
                          Suspend
                        </Button>
                      )}
                      {(tenant.status === "suspended" || tenant.status === "pending") && (
                        <Button
                          size="small"
                          variant="secondary"
                          onClick={() => activateMutation.mutate(tenant.id)}
                          disabled={activateMutation.isPending}
                        >
                          Activate
                        </Button>
                      )}
                    </div>
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
  label: "Tenants",
  icon: ServerStack,
})

export default TenantsPage
