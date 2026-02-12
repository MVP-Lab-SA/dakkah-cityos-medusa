// @ts-nocheck
import { useState } from "react";
import { t } from "../../lib/i18n";

interface VendorAnalyticsDashboardProps {
  vendorId: string;
  locale: string;
}

const TIME_PERIODS = [
  { key: "7d", label: "7 Days" },
  { key: "30d", label: "30 Days" },
  { key: "90d", label: "90 Days" },
  { key: "12m", label: "12 Months" },
];

const MOCK_TOP_PRODUCTS = [
  { id: "1", name: "Product A", orders: 142, revenue: 12840 },
  { id: "2", name: "Product B", orders: 98, revenue: 8720 },
  { id: "3", name: "Product C", orders: 76, revenue: 6540 },
  { id: "4", name: "Product D", orders: 54, revenue: 4320 },
  { id: "5", name: "Product E", orders: 31, revenue: 2480 },
];

function VendorAnalyticsDashboard({ vendorId, locale }: VendorAnalyticsDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  const metrics = {
    revenue: 45230.50,
    orders: 384,
    conversionRate: 3.2,
    averageOrderValue: 117.79,
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ds-foreground">
            {t(locale, "vendor.analytics.title") !== "vendor.analytics.title"
              ? t(locale, "vendor.analytics.title")
              : "Analytics Overview"}
          </h1>
          <p className="text-ds-muted-foreground">
            {t(locale, "vendor.analytics.subtitle") !== "vendor.analytics.subtitle"
              ? t(locale, "vendor.analytics.subtitle")
              : "Track your store performance and insights"}
          </p>
        </div>

        <div className="flex gap-1 bg-ds-surface rounded-lg p-1 border border-ds-border">
          {TIME_PERIODS.map((period) => (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                selectedPeriod === period.key
                  ? "bg-ds-card text-ds-primary font-medium shadow-sm"
                  : "text-ds-muted-foreground hover:text-ds-foreground"
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-ds-card border border-ds-border rounded-lg p-6">
          <p className="text-sm text-ds-muted-foreground mb-1">
            {t(locale, "vendor.analytics.revenue") !== "vendor.analytics.revenue"
              ? t(locale, "vendor.analytics.revenue")
              : "Revenue"}
          </p>
          <p className="text-2xl font-bold text-ds-foreground">
            ${metrics.revenue.toLocaleString()}
          </p>
          <p className="text-xs text-ds-muted-foreground mt-1">+12.5% from last period</p>
        </div>

        <div className="bg-ds-card border border-ds-border rounded-lg p-6">
          <p className="text-sm text-ds-muted-foreground mb-1">
            {t(locale, "vendor.analytics.orders") !== "vendor.analytics.orders"
              ? t(locale, "vendor.analytics.orders")
              : "Orders"}
          </p>
          <p className="text-2xl font-bold text-ds-foreground">{metrics.orders}</p>
          <p className="text-xs text-ds-muted-foreground mt-1">+8.3% from last period</p>
        </div>

        <div className="bg-ds-card border border-ds-border rounded-lg p-6">
          <p className="text-sm text-ds-muted-foreground mb-1">
            {t(locale, "vendor.analytics.conversionRate") !== "vendor.analytics.conversionRate"
              ? t(locale, "vendor.analytics.conversionRate")
              : "Conversion Rate"}
          </p>
          <p className="text-2xl font-bold text-ds-foreground">{metrics.conversionRate}%</p>
          <p className="text-xs text-ds-muted-foreground mt-1">+0.4% from last period</p>
        </div>

        <div className="bg-ds-card border border-ds-border rounded-lg p-6">
          <p className="text-sm text-ds-muted-foreground mb-1">
            {t(locale, "vendor.analytics.avgOrderValue") !== "vendor.analytics.avgOrderValue"
              ? t(locale, "vendor.analytics.avgOrderValue")
              : "Avg. Order Value"}
          </p>
          <p className="text-2xl font-bold text-ds-foreground">
            ${metrics.averageOrderValue.toFixed(2)}
          </p>
          <p className="text-xs text-ds-muted-foreground mt-1">+3.1% from last period</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-ds-card border border-ds-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-ds-foreground mb-4">
            {t(locale, "vendor.analytics.revenueChart") !== "vendor.analytics.revenueChart"
              ? t(locale, "vendor.analytics.revenueChart")
              : "Revenue Over Time"}
          </h2>
          <div className="h-64 bg-ds-surface rounded-lg flex items-center justify-center border border-ds-border">
            <div className="text-center">
              <div className="flex items-end justify-center gap-1 mb-3">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                  <div
                    key={i}
                    className="w-4 bg-ds-primary/30 rounded-t"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <p className="text-sm text-ds-muted-foreground">Revenue trend line chart</p>
            </div>
          </div>
        </div>

        <div className="bg-ds-card border border-ds-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-ds-foreground mb-4">
            {t(locale, "vendor.analytics.ordersChart") !== "vendor.analytics.ordersChart"
              ? t(locale, "vendor.analytics.ordersChart")
              : "Orders Over Time"}
          </h2>
          <div className="h-64 bg-ds-surface rounded-lg flex items-center justify-center border border-ds-border">
            <div className="text-center">
              <div className="flex items-end justify-center gap-2 mb-3">
                {[30, 50, 35, 70, 45, 80, 55, 65, 40, 75, 60, 72].map((h, i) => (
                  <div
                    key={i}
                    className="w-6 bg-ds-primary/50 rounded-t"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <p className="text-sm text-ds-muted-foreground">Orders bar chart</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-ds-card border border-ds-border rounded-lg">
        <div className="p-6 border-b border-ds-border">
          <h2 className="text-lg font-semibold text-ds-foreground">
            {t(locale, "vendor.analytics.topProducts") !== "vendor.analytics.topProducts"
              ? t(locale, "vendor.analytics.topProducts")
              : "Top Products"}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-ds-surface">
              <tr>
                <th className="text-start p-4 text-sm font-medium text-ds-muted-foreground">#</th>
                <th className="text-start p-4 text-sm font-medium text-ds-muted-foreground">
                  {t(locale, "vendor.analytics.productName") !== "vendor.analytics.productName"
                    ? t(locale, "vendor.analytics.productName")
                    : "Product"}
                </th>
                <th className="text-end p-4 text-sm font-medium text-ds-muted-foreground">
                  {t(locale, "vendor.analytics.orders") !== "vendor.analytics.orders"
                    ? t(locale, "vendor.analytics.orders")
                    : "Orders"}
                </th>
                <th className="text-end p-4 text-sm font-medium text-ds-muted-foreground">
                  {t(locale, "vendor.analytics.revenue") !== "vendor.analytics.revenue"
                    ? t(locale, "vendor.analytics.revenue")
                    : "Revenue"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ds-border">
              {MOCK_TOP_PRODUCTS.map((product, index) => (
                <tr key={product.id} className="hover:bg-ds-surface/50">
                  <td className="p-4 text-sm text-ds-muted-foreground">{index + 1}</td>
                  <td className="p-4 text-sm font-medium text-ds-foreground">{product.name}</td>
                  <td className="p-4 text-sm text-ds-foreground text-end">{product.orders}</td>
                  <td className="p-4 text-sm font-medium text-ds-foreground text-end">
                    ${product.revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default VendorAnalyticsDashboard;
