import { Container, Heading, Table, Badge, Button } from "@medusajs/ui";
import { defineRouteConfig } from "@medusajs/admin-sdk";
import { useQuery } from "@tanstack/react-query";
import { sdk } from "../../../lib/client";

export const SubscriptionsPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      const res = await sdk.client.fetch("/admin/subscriptions");
      return res.json();
    },
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, "green" | "blue" | "orange" | "red" | "grey"> = {
      active: "green",
      draft: "grey",
      paused: "orange",
      past_due: "red",
      canceled: "grey",
      expired: "grey",
    };
    return colors[status] || "grey";
  };

  const formatInterval = (interval: string, count: number) => {
    const label = count > 1 ? `${count} ${interval}s` : interval;
    return label.charAt(0).toUpperCase() + label.slice(1);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <div className="flex items-center justify-between mb-4">
        <Heading level="h1">Subscriptions</Heading>
        <Button variant="primary">Create Subscription</Button>
      </div>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Customer</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Interval</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
            <Table.HeaderCell>Current Period</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data?.subscriptions?.map((subscription: any) => (
            <Table.Row key={subscription.id}>
              <Table.Cell>{subscription.customer_id}</Table.Cell>
              <Table.Cell>
                <Badge color={getStatusColor(subscription.status)}>
                  {subscription.status}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                {formatInterval(
                  subscription.billing_interval,
                  subscription.billing_interval_count
                )}
              </Table.Cell>
              <Table.Cell>
                {formatCurrency(subscription.total, subscription.currency_code)}
              </Table.Cell>
              <Table.Cell>
                {subscription.current_period_end
                  ? new Date(subscription.current_period_end).toLocaleDateString()
                  : "-"}
              </Table.Cell>
              <Table.Cell>
                <Button variant="secondary" size="small">
                  View
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Subscriptions",
  icon: "calendar",
});

export default SubscriptionsPage;
