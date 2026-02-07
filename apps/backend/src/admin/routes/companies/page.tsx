import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Table, Input } from "@medusajs/ui"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../../lib/client"
import { BuildingStorefront } from "@medusajs/icons"
import { useState } from "react"

interface Company {
  id: string
  name: string
  email: string
  phone?: string
  tax_id?: string
  status: string
  tier: string
  credit_limit: number
  credit_balance: number
  payment_terms_days: number
  created_at: string
  users?: { id: string; email: string; role: string }[]
}

const CompaniesPage = () => {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")

  const { data, isLoading } = useQuery({
    queryKey: ["admin-companies"],
    queryFn: async () => {
      const response = await sdk.client.fetch<{ companies: Company[]; count: number }>(
        "/admin/companies",
        { credentials: "include" }
      )
      return response
    },
  })

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return sdk.client.fetch(`/admin/companies/${id}`, {
        method: "PUT",
        credentials: "include",
        body: { status },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-companies"] })
    },
  })

  const companies = data?.companies || []
  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  )

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
      case "active":
        return "green"
      case "suspended":
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
          <Heading level="h1">B2B Companies</Heading>
        </div>
        <div className="px-6 py-4">
          <Text className="text-ui-fg-subtle">Loading companies...</Text>
        </div>
      </Container>
    )
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h1">B2B Companies</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            Manage your B2B customer accounts, credit limits, and payment terms
          </Text>
        </div>
        <div className="flex items-center gap-x-2">
          <Text size="small" className="text-ui-fg-subtle">
            {data?.count || 0} companies
          </Text>
        </div>
      </div>

      <div className="px-6 py-4">
        <Input
          size="small"
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <div className="px-6 py-4">
        {filteredCompanies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <BuildingStorefront className="text-ui-fg-muted mb-4" />
            <Text className="text-ui-fg-subtle">No companies found</Text>
          </div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Company</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Tier</Table.HeaderCell>
                <Table.HeaderCell>Credit Limit</Table.HeaderCell>
                <Table.HeaderCell>Balance</Table.HeaderCell>
                <Table.HeaderCell>Payment Terms</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredCompanies.map((company) => (
                <Table.Row key={company.id}>
                  <Table.Cell>
                    <div>
                      <Text size="small" weight="plus">
                        {company.name}
                      </Text>
                      <Text size="small" className="text-ui-fg-subtle">
                        {company.email}
                      </Text>
                      {company.tax_id && (
                        <Text size="xsmall" className="text-ui-fg-muted">
                          Tax ID: {company.tax_id}
                        </Text>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge size="2xsmall" color={getStatusColor(company.status)}>
                      {company.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge size="2xsmall" color={getTierColor(company.tier)}>
                      {company.tier}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="small">
                      ${company.credit_limit.toLocaleString()}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text
                      size="small"
                      className={
                        company.credit_balance > company.credit_limit * 0.8
                          ? "text-ui-fg-error"
                          : ""
                      }
                    >
                      ${company.credit_balance.toLocaleString()}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="small">Net {company.payment_terms_days}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-x-2">
                      {company.status === "pending" && (
                        <Button
                          size="small"
                          variant="secondary"
                          onClick={() =>
                            updateStatusMutation.mutate({
                              id: company.id,
                              status: "active",
                            })
                          }
                          disabled={updateStatusMutation.isPending}
                        >
                          Activate
                        </Button>
                      )}
                      {company.status === "active" && (
                        <Button
                          size="small"
                          variant="secondary"
                          onClick={() =>
                            updateStatusMutation.mutate({
                              id: company.id,
                              status: "suspended",
                            })
                          }
                          disabled={updateStatusMutation.isPending}
                        >
                          Suspend
                        </Button>
                      )}
                      {company.status === "suspended" && (
                        <Button
                          size="small"
                          variant="secondary"
                          onClick={() =>
                            updateStatusMutation.mutate({
                              id: company.id,
                              status: "active",
                            })
                          }
                          disabled={updateStatusMutation.isPending}
                        >
                          Reactivate
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
  label: "Companies",
  icon: BuildingStorefront,
})

export default CompaniesPage
