import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Table } from "@medusajs/ui"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client"

interface Quote {
  id: string
  customer_email: string
  status: string
  total_amount: number
  currency_code: string
  items_count: number
  created_at: string
  notes?: string
}

const QuoteManagementWidget = () => {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["admin-quotes"],
    queryFn: async () => {
      const response = await sdk.client.fetch<{ quotes: Quote[]; count: number }>(
        "/admin/quotes",
        { credentials: "include" }
      )
      return response
    },
  })

  const approveMutation = useMutation({
    mutationFn: async ({ quoteId, quotedPrice }: { quoteId: string; quotedPrice: number }) => {
      return sdk.client.fetch(`/admin/quotes/${quoteId}/approve`, {
        method: "POST",
        body: { quoted_price: quotedPrice },
        credentials: "include",
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-quotes"] })
    },
  })

  const quotes = data?.quotes || []
  const pendingQuotes = quotes.filter((q) => q.status === "pending")

  if (isLoading) {
    return (
      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading level="h2">Quote Requests</Heading>
        </div>
        <div className="px-6 py-4">
          <Text className="text-ui-fg-subtle">Loading quotes...</Text>
        </div>
      </Container>
    )
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h2">Quote Requests</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            {pendingQuotes.length} pending quotes
          </Text>
        </div>
      </div>

      <div className="px-6 py-4">
        {quotes.length === 0 ? (
          <Text className="text-ui-fg-subtle">No quote requests</Text>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Customer</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Items</Table.HeaderCell>
                <Table.HeaderCell>Total</Table.HeaderCell>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {quotes.slice(0, 10).map((quote) => (
                <Table.Row key={quote.id}>
                  <Table.Cell>
                    <Text size="small">{quote.customer_email}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      size="2xsmall"
                      color={
                        quote.status === "approved"
                          ? "green"
                          : quote.status === "pending"
                          ? "orange"
                          : quote.status === "rejected"
                          ? "red"
                          : "grey"
                      }
                    >
                      {quote.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="small">{quote.items_count} items</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="small">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: quote.currency_code || "USD",
                      }).format(quote.total_amount || 0)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="small">
                      {new Date(quote.created_at).toLocaleDateString()}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    {quote.status === "pending" && (
                      <div className="flex gap-x-2">
                        <Button
                          size="small"
                          variant="secondary"
                          onClick={() =>
                            approveMutation.mutate({
                              quoteId: quote.id,
                              quotedPrice: quote.total_amount,
                            })
                          }
                          disabled={approveMutation.isPending}
                        >
                          Approve
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

export const config = defineWidgetConfig({
  zone: "order.details.side.before",
})

export default QuoteManagementWidget
