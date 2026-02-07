import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Table, Input } from "@medusajs/ui"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../../lib/client"
import { ReceiptPercent } from "@medusajs/icons"
import { useState } from "react"

interface Subscription {
  id: string
  customer_id: string
  customer_email?: string
  plan_id?: string
  plan_name?: string
  status: string
  billing_interval: string
  current_period_start: string
  current_period_end: string
  next_billing_date: string
  amount: number
  currency_code: string
  cancel_at_period_end: boolean
  created_at: string
}

interface SubscriptionPlan {
  id: string
  name: string
  description?: string
  billing_interval: string
  billing_interval_count: number
  amount: number
  currency_code: string
  trial_days: number
  is_active: boolean
  created_at: string
}

const SubscriptionsPage = () => {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<"subscriptions" | "plans">("subscriptions")

  const { data: subscriptionsData, isLoading: subsLoading } = useQuery({
    queryKey: ["admin-subscriptions"],
    queryFn: async () => {
      const response = await sdk.client.fetch<{
        subscriptions: Subscription[]
        count: number
      }>("/admin/subscriptions", { credentials: "include" })
      return response
    },
  })

  const { data: plansData, isLoading: plansLoading } = useQuery({
    queryKey: ["admin-subscription-plans"],
    queryFn: async () => {
      const response = await sdk.client.fetch<{
        plans: SubscriptionPlan[]
        count: number
      }>("/admin/subscription-plans", { credentials: "include" })
      return response
    },
  })

  const cancelMutation = useMutation({
    mutationFn: async (subscriptionId: string) => {
      return sdk.client.fetch(`/admin/subscriptions/${subscriptionId}`, {
        method: "PUT",
        credentials: "include",
        body: { status: "cancelled" },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions"] })
    },
  })

  const pauseMutation = useMutation({
    mutationFn: async (subscriptionId: string) => {
      return sdk.client.fetch(`/admin/subscriptions/${subscriptionId}`, {
        method: "PUT",
        credentials: "include",
        body: { status: "paused" },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions"] })
    },
  })

  const resumeMutation = useMutation({
    mutationFn: async (subscriptionId: string) => {
      return sdk.client.fetch(`/admin/subscriptions/${subscriptionId}`, {
        method: "PUT",
        credentials: "include",
        body: { status: "active" },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions"] })
    },
  })

  const subscriptions = subscriptionsData?.subscriptions || []
  const plans = plansData?.plans || []

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "green"
      case "paused":
        return "orange"
      case "cancelled":
        return "red"
      case "past_due":
        return "red"
      case "trialing":
        return "blue"
      default:
        return "grey"
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString()
  }

  const formatMoney = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount)
  }

  const activeCount = subscriptions.filter((s) => s.status === "active").length
  const mrr = subscriptions
    .filter((s) => s.status === "active")
    .reduce((sum, s) => sum + (s.amount || 0), 0)

  const isLoading = subsLoading || plansLoading

  if (isLoading) {
    return (
      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading level="h1">Subscriptions</Heading>
        </div>
        <div className="px-6 py-4">
          <Text className="text-ui-fg-subtle">Loading subscriptions...</Text>
        </div>
      </Container>
    )
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h1">Subscriptions</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            Manage recurring subscriptions and plans
          </Text>
        </div>
        <div className="flex items-center gap-x-6">
          <div className="text-right">
            <Text size="small" weight="plus">
              {activeCount} active
            </Text>
            <Text size="xsmall" className="text-ui-fg-subtle">
              MRR: {formatMoney(mrr, "usd")}
            </Text>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-x-4 px-6 py-4">
        <Button
          size="small"
          variant={activeTab === "subscriptions" ? "primary" : "secondary"}
          onClick={() => setActiveTab("subscriptions")}
        >
          Subscriptions ({subscriptions.length})
        </Button>
        <Button
          size="small"
          variant={activeTab === "plans" ? "primary" : "secondary"}
          onClick={() => setActiveTab("plans")}
        >
          Plans ({plans.length})
        </Button>
      </div>

      {activeTab === "subscriptions" && (
        <>
          <div className="px-6 py-4">
            <Input
              size="small"
              placeholder="Search by customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
          </div>

          <div className="px-6 py-4">
            {subscriptions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <ReceiptPercent className="text-ui-fg-muted mb-4" />
                <Text className="text-ui-fg-subtle">No subscriptions yet</Text>
              </div>
            ) : (
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Customer</Table.HeaderCell>
                    <Table.HeaderCell>Plan</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.HeaderCell>Amount</Table.HeaderCell>
                    <Table.HeaderCell>Next Billing</Table.HeaderCell>
                    <Table.HeaderCell>Actions</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {subscriptions.map((sub) => (
                    <Table.Row key={sub.id}>
                      <Table.Cell>
                        <Text size="small">{sub.customer_email || sub.customer_id}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="small">{sub.plan_name || "-"}</Text>
                        <Text size="xsmall" className="text-ui-fg-subtle">
                          {sub.billing_interval}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge size="2xsmall" color={getStatusColor(sub.status)}>
                          {sub.status}
                        </Badge>
                        {sub.cancel_at_period_end && (
                          <Text size="xsmall" className="text-ui-fg-error">
                            Cancels at period end
                          </Text>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="small">
                          {formatMoney(sub.amount, sub.currency_code)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="small">{formatDate(sub.next_billing_date)}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-x-2">
                          {sub.status === "active" && (
                            <>
                              <Button
                                size="small"
                                variant="secondary"
                                onClick={() => pauseMutation.mutate(sub.id)}
                                disabled={pauseMutation.isPending}
                              >
                                Pause
                              </Button>
                              <Button
                                size="small"
                                variant="secondary"
                                onClick={() => cancelMutation.mutate(sub.id)}
                                disabled={cancelMutation.isPending}
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                          {sub.status === "paused" && (
                            <Button
                              size="small"
                              variant="secondary"
                              onClick={() => resumeMutation.mutate(sub.id)}
                              disabled={resumeMutation.isPending}
                            >
                              Resume
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
        </>
      )}

      {activeTab === "plans" && (
        <div className="px-6 py-4">
          {plans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <ReceiptPercent className="text-ui-fg-muted mb-4" />
              <Text className="text-ui-fg-subtle">No subscription plans configured</Text>
            </div>
          ) : (
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Plan Name</Table.HeaderCell>
                  <Table.HeaderCell>Billing</Table.HeaderCell>
                  <Table.HeaderCell>Price</Table.HeaderCell>
                  <Table.HeaderCell>Trial</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {plans.map((plan) => (
                  <Table.Row key={plan.id}>
                    <Table.Cell>
                      <div>
                        <Text size="small" weight="plus">
                          {plan.name}
                        </Text>
                        {plan.description && (
                          <Text size="xsmall" className="text-ui-fg-subtle">
                            {plan.description}
                          </Text>
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="small">
                        Every {plan.billing_interval_count} {plan.billing_interval}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="small">
                        {formatMoney(plan.amount, plan.currency_code)}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="small">
                        {plan.trial_days > 0 ? `${plan.trial_days} days` : "None"}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        size="2xsmall"
                        color={plan.is_active ? "green" : "grey"}
                      >
                        {plan.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </div>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Subscriptions",
  icon: ReceiptPercent,
})

export default SubscriptionsPage
