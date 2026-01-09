import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Container, Heading } from "@medusajs/ui";
import { useQuery } from "@tanstack/react-query";
import { sdk } from "../../lib/client";

export const SubscriptionStatsWidget = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["subscription-stats"],
    queryFn: async () => {
      const res = await sdk.client.fetch("/admin/subscriptions?limit=1000");
      const json = await res.json();
      
      const subscriptions = json.subscriptions || [];
      
      const stats = {
        total: subscriptions.length,
        active: subscriptions.filter((s: any) => s.status === "active").length,
        past_due: subscriptions.filter((s: any) => s.status === "past_due").length,
        mrr: subscriptions
          .filter((s: any) => s.status === "active")
          .reduce((sum: number, s: any) => {
            // Normalize to monthly
            let monthlyAmount = s.total;
            switch (s.billing_interval) {
              case "daily":
                monthlyAmount = s.total * 30;
                break;
              case "weekly":
                monthlyAmount = s.total * 4.33;
                break;
              case "quarterly":
                monthlyAmount = s.total / 3;
                break;
              case "yearly":
                monthlyAmount = s.total / 12;
                break;
            }
            return sum + monthlyAmount;
          }, 0),
      };
      
      return stats;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

  return (
    <Container>
      <Heading level="h3" className="mb-4">
        Subscription Overview
      </Heading>
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 rounded">
          <div className="text-sm text-gray-600">Total Subscriptions</div>
          <div className="text-2xl font-bold">{data?.total || 0}</div>
        </div>
        <div className="p-4 bg-green-50 rounded">
          <div className="text-sm text-gray-600">Active</div>
          <div className="text-2xl font-bold text-green-600">{data?.active || 0}</div>
        </div>
        <div className="p-4 bg-red-50 rounded">
          <div className="text-sm text-gray-600">Past Due</div>
          <div className="text-2xl font-bold text-red-600">{data?.past_due || 0}</div>
        </div>
        <div className="p-4 bg-blue-50 rounded">
          <div className="text-sm text-gray-600">MRR</div>
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(data?.mrr || 0)}
          </div>
        </div>
      </div>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "product.details.before",
});

export default SubscriptionStatsWidget;
