// @ts-nocheck
import { t } from "../../lib/i18n";

interface VendorPerformanceCardProps {
  vendorId: string;
  locale: string;
}

interface PerformanceMetrics {
  ratingScore: number;
  fulfillmentRate: number;
  responseTime: string;
  returnRate: number;
}

function getPerformanceBadge(metrics: PerformanceMetrics): {
  label: string;
  color: string;
} {
  const score =
    metrics.ratingScore * 20 +
    metrics.fulfillmentRate * 0.3 +
    (100 - metrics.returnRate) * 0.2;

  if (score >= 115) return { label: "Excellent", color: "bg-ds-success/15 text-ds-success" };
  if (score >= 100) return { label: "Good", color: "bg-ds-info/15 text-ds-info" };
  if (score >= 80) return { label: "Fair", color: "bg-ds-warning/15 text-ds-warning" };
  return { label: "Needs Improvement", color: "bg-ds-destructive/15 text-ds-destructive" };
}

function VendorPerformanceCard({ vendorId, locale }: VendorPerformanceCardProps) {
  const metrics: PerformanceMetrics = {
    ratingScore: 4.7,
    fulfillmentRate: 96.5,
    responseTime: "< 2 hours",
    returnRate: 2.1,
  };

  const badge = getPerformanceBadge(metrics);

  return (
    <div className="bg-ds-card border border-ds-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-ds-foreground">
          {t(locale, "vendor.performance.title") !== "vendor.performance.title"
            ? t(locale, "vendor.performance.title")
            : "Performance"}
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
          {badge.label}
        </span>
      </div>

      <div className="space-y-5">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm text-ds-muted-foreground">
              {t(locale, "vendor.performance.rating") !== "vendor.performance.rating"
                ? t(locale, "vendor.performance.rating")
                : "Rating Score"}
            </span>
            <span className="text-sm font-semibold text-ds-foreground">
              {metrics.ratingScore} / 5.0
            </span>
          </div>
          <div className="w-full h-2 bg-ds-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-ds-primary rounded-full transition-all"
              style={{ width: `${(metrics.ratingScore / 5) * 100}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm text-ds-muted-foreground">
              {t(locale, "vendor.performance.fulfillment") !== "vendor.performance.fulfillment"
                ? t(locale, "vendor.performance.fulfillment")
                : "Fulfillment Rate"}
            </span>
            <span className="text-sm font-semibold text-ds-foreground">
              {metrics.fulfillmentRate}%
            </span>
          </div>
          <div className="w-full h-2 bg-ds-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-ds-primary rounded-full transition-all"
              style={{ width: `${metrics.fulfillmentRate}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm text-ds-muted-foreground">
              {t(locale, "vendor.performance.responseTime") !== "vendor.performance.responseTime"
                ? t(locale, "vendor.performance.responseTime")
                : "Response Time"}
            </span>
            <span className="text-sm font-semibold text-ds-foreground">
              {metrics.responseTime}
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm text-ds-muted-foreground">
              {t(locale, "vendor.performance.returnRate") !== "vendor.performance.returnRate"
                ? t(locale, "vendor.performance.returnRate")
                : "Return Rate"}
            </span>
            <span className="text-sm font-semibold text-ds-foreground">
              {metrics.returnRate}%
            </span>
          </div>
          <div className="w-full h-2 bg-ds-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-ds-primary rounded-full transition-all"
              style={{ width: `${metrics.returnRate}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorPerformanceCard;
