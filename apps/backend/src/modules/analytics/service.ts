// @ts-nocheck
import { MedusaService } from "@medusajs/framework/utils"
import AnalyticsEvent from "./models/analytics-event"
import Report from "./models/report"
import Dashboard from "./models/dashboard"

class AnalyticsModuleService extends MedusaService({
  AnalyticsEvent,
  Report,
  Dashboard,
}) {
  async trackEvent(data: {
    tenant_id: string
    event_type: string
    entity_type?: string
    entity_id?: string
    customer_id?: string
    session_id?: string
    properties?: Record<string, unknown>
    revenue?: number
    currency?: string
  }) {
    return await (this as any).createAnalyticsEvents({
      tenant_id: data.tenant_id,
      event_type: data.event_type,
      entity_type: data.entity_type || null,
      entity_id: data.entity_id || null,
      customer_id: data.customer_id || null,
      session_id: data.session_id || null,
      properties: data.properties || null,
      revenue: data.revenue || null,
      currency: data.currency || null,
      created_at: new Date(),
    })
  }

  async getEventCounts(
    tenantId: string,
    eventType: string,
    dateRange: { start: Date; end: Date }
  ) {
    const events = await this.listAnalyticsEvents({
      tenant_id: tenantId,
      event_type: eventType,
    })

    const eventList = Array.isArray(events) ? events : [events].filter(Boolean)

    const filtered = eventList.filter((e) => {
      const createdAt = new Date(e.created_at)
      return createdAt >= dateRange.start && createdAt <= dateRange.end
    })

    return {
      event_type: eventType,
      count: filtered.length,
      date_range: dateRange,
    }
  }

  async getSalesMetrics(
    tenantId: string,
    dateRange: { start: Date; end: Date }
  ) {
    const events = await this.listAnalyticsEvents({
      tenant_id: tenantId,
      event_type: "purchase",
    })

    const eventList = Array.isArray(events) ? events : [events].filter(Boolean)

    const filtered = eventList.filter((e) => {
      const createdAt = new Date(e.created_at)
      return createdAt >= dateRange.start && createdAt <= dateRange.end
    })

    const revenue = filtered.reduce((sum, e) => sum + (Number(e.revenue) || 0), 0)
    const orderCount = filtered.length
    const avgOrderValue = orderCount > 0 ? revenue / orderCount : 0

    return {
      revenue,
      orderCount,
      avgOrderValue,
      dateRange,
    }
  }

  async getTopProducts(
    tenantId: string,
    limit: number = 10,
    dateRange: { start: Date; end: Date }
  ) {
    const events = await this.listAnalyticsEvents({
      tenant_id: tenantId,
      event_type: "purchase",
    })

    const eventList = Array.isArray(events) ? events : [events].filter(Boolean)

    const filtered = eventList.filter((e) => {
      const createdAt = new Date(e.created_at)
      return createdAt >= dateRange.start && createdAt <= dateRange.end && e.entity_type === "product"
    })

    const productCounts: Record<string, { count: number; revenue: number }> = {}
    for (const event of filtered) {
      if (event.entity_id) {
        if (!productCounts[event.entity_id]) {
          productCounts[event.entity_id] = { count: 0, revenue: 0 }
        }
        productCounts[event.entity_id].count++
        productCounts[event.entity_id].revenue += Number(event.revenue) || 0
      }
    }

    const sorted = Object.entries(productCounts)
      .map(([product_id, data]) => ({ product_id, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit)

    return sorted
  }

  async generateReport(reportId: string) {
    const report = await this.retrieveReport(reportId)

    await (this as any).updateReports({
      id: reportId,
      last_generated: new Date(),
    })

    return await this.retrieveReport(reportId)
  }

  async getDashboard(tenantId: string, dashboardSlug: string) {
    const dashboards = await this.listDashboards({
      tenant_id: tenantId,
      slug: dashboardSlug,
    })

    const list = Array.isArray(dashboards) ? dashboards : [dashboards].filter(Boolean)
    if (list.length === 0) {
      throw new Error(`Dashboard "${dashboardSlug}" not found`)
    }

    return list[0]
  }
}

export default AnalyticsModuleService
