/**
 * Metrics Collection for CityOS Commerce
 * 
 * Collects and exposes metrics for:
 * - API response times
 * - Order processing
 * - Vendor performance
 * - Commission calculations
 * - System health
 */

export interface MetricLabels {
  [key: string]: string
}

export interface CounterMetric {
  name: string
  help: string
  labels: MetricLabels
  value: number
}

export interface HistogramMetric {
  name: string
  help: string
  labels: MetricLabels
  values: number[]
  buckets: number[]
}

export interface GaugeMetric {
  name: string
  help: string
  labels: MetricLabels
  value: number
}

class MetricsCollector {
  private counters: Map<string, CounterMetric> = new Map()
  private histograms: Map<string, HistogramMetric> = new Map()
  private gauges: Map<string, GaugeMetric> = new Map()

  private getKey(name: string, labels: MetricLabels): string {
    const labelStr = Object.entries(labels)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}="${v}"`)
      .join(",")
    return `${name}{${labelStr}}`
  }

  /**
   * Increment a counter metric
   */
  incCounter(name: string, help: string, labels: MetricLabels = {}, value: number = 1) {
    const key = this.getKey(name, labels)
    const existing = this.counters.get(key)
    if (existing) {
      existing.value += value
    } else {
      this.counters.set(key, { name, help, labels, value })
    }
  }

  /**
   * Record a histogram observation
   */
  observeHistogram(
    name: string,
    help: string,
    labels: MetricLabels,
    value: number,
    buckets: number[] = [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]
  ) {
    const key = this.getKey(name, labels)
    const existing = this.histograms.get(key)
    if (existing) {
      existing.values.push(value)
    } else {
      this.histograms.set(key, { name, help, labels, values: [value], buckets })
    }
  }

  /**
   * Set a gauge metric
   */
  setGauge(name: string, help: string, labels: MetricLabels, value: number) {
    const key = this.getKey(name, labels)
    this.gauges.set(key, { name, help, labels, value })
  }

  /**
   * Track API request metrics
   */
  trackRequest(method: string, path: string, statusCode: number, durationMs: number) {
    // Request count
    this.incCounter(
      "cityos_http_requests_total",
      "Total HTTP requests",
      { method, path, status: String(statusCode) }
    )

    // Request duration
    this.observeHistogram(
      "cityos_http_request_duration_seconds",
      "HTTP request duration in seconds",
      { method, path },
      durationMs / 1000
    )

    // Track errors separately
    if (statusCode >= 500) {
      this.incCounter(
        "cityos_http_errors_total",
        "Total HTTP errors (5xx)",
        { method, path }
      )
    }
  }

  /**
   * Track order metrics
   */
  trackOrder(status: string, vendorId?: string, amount?: number) {
    this.incCounter(
      "cityos_orders_total",
      "Total orders",
      { status, vendor_id: vendorId || "unknown" }
    )

    if (amount !== undefined) {
      this.observeHistogram(
        "cityos_order_amount",
        "Order amount distribution",
        { status },
        amount,
        [10, 50, 100, 250, 500, 1000, 2500, 5000, 10000]
      )
    }
  }

  /**
   * Track vendor metrics
   */
  trackVendor(action: string, vendorId: string) {
    this.incCounter(
      "cityos_vendor_actions_total",
      "Total vendor actions",
      { action, vendor_id: vendorId }
    )
  }

  /**
   * Track commission metrics
   */
  trackCommission(vendorId: string, amount: number, type: string) {
    this.incCounter(
      "cityos_commissions_total",
      "Total commissions calculated",
      { vendor_id: vendorId, type }
    )

    this.observeHistogram(
      "cityos_commission_amount",
      "Commission amount distribution",
      { type },
      amount,
      [1, 5, 10, 25, 50, 100, 250, 500, 1000]
    )
  }

  /**
   * Track payout metrics
   */
  trackPayout(vendorId: string, amount: number, status: string) {
    this.incCounter(
      "cityos_payouts_total",
      "Total payouts",
      { vendor_id: vendorId, status }
    )

    if (status === "completed") {
      this.observeHistogram(
        "cityos_payout_amount",
        "Payout amount distribution",
        {},
        amount,
        [50, 100, 250, 500, 1000, 2500, 5000, 10000]
      )
    }
  }

  /**
   * Track cache metrics
   */
  trackCache(operation: "hit" | "miss" | "set" | "delete", key: string) {
    const keyType = key.split(":")[1] || "unknown"
    this.incCounter(
      "cityos_cache_operations_total",
      "Total cache operations",
      { operation, key_type: keyType }
    )
  }

  /**
   * Track active entities
   */
  setActiveEntities(type: string, count: number) {
    this.setGauge(
      "cityos_active_entities",
      "Number of active entities",
      { type },
      count
    )
  }

  /**
   * Export metrics in Prometheus format
   */
  exportPrometheus(): string {
    const lines: string[] = []

    // Export counters
    for (const [key, metric] of this.counters) {
      lines.push(`# HELP ${metric.name} ${metric.help}`)
      lines.push(`# TYPE ${metric.name} counter`)
      lines.push(`${key} ${metric.value}`)
    }

    // Export gauges
    for (const [key, metric] of this.gauges) {
      lines.push(`# HELP ${metric.name} ${metric.help}`)
      lines.push(`# TYPE ${metric.name} gauge`)
      lines.push(`${key} ${metric.value}`)
    }

    // Export histograms (simplified)
    for (const [key, metric] of this.histograms) {
      lines.push(`# HELP ${metric.name} ${metric.help}`)
      lines.push(`# TYPE ${metric.name} histogram`)

      const sum = metric.values.reduce((a, b) => a + b, 0)
      const count = metric.values.length

      // Bucket counts
      for (const bucket of metric.buckets) {
        const bucketCount = metric.values.filter((v) => v <= bucket).length
        lines.push(`${key.replace("}", `,le="${bucket}"}`)} ${bucketCount}`)
      }
      lines.push(`${key.replace("}", `,le="+Inf"}`)} ${count}`)
      lines.push(`${key.replace("{", "_sum{")}} ${sum}`)
      lines.push(`${key.replace("{", "_count{")}} ${count}`)
    }

    return lines.join("\n")
  }

  /**
   * Get metrics summary
   */
  getSummary(): Record<string, unknown> {
    return {
      counters: Object.fromEntries(
        Array.from(this.counters.entries()).map(([k, v]) => [k, v.value])
      ),
      gauges: Object.fromEntries(
        Array.from(this.gauges.entries()).map(([k, v]) => [k, v.value])
      ),
      histograms: Object.fromEntries(
        Array.from(this.histograms.entries()).map(([k, v]) => [
          k,
          {
            count: v.values.length,
            sum: v.values.reduce((a, b) => a + b, 0),
            avg: v.values.length > 0
              ? v.values.reduce((a, b) => a + b, 0) / v.values.length
              : 0,
          },
        ])
      ),
    }
  }

  /**
   * Reset all metrics (for testing)
   */
  reset() {
    this.counters.clear()
    this.histograms.clear()
    this.gauges.clear()
  }
}

// Singleton instance
export const metrics = new MetricsCollector()
