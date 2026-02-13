// @ts-nocheck
import { MedusaService } from "@medusajs/framework/utils"
import NotificationPreference from "./models/notification-preference"

class NotificationPreferencesModuleService extends MedusaService({
  NotificationPreference,
}) {
  async getByCustomer(customerId: string, tenantId: string) {
    const prefs = await this.listNotificationPreferences({
      customer_id: customerId,
      tenant_id: tenantId,
    })

    return Array.isArray(prefs) ? prefs : [prefs].filter(Boolean)
  }

  async updatePreference(data: {
    customerId: string
    tenantId: string
    channel: string
    eventType: string
    enabled: boolean
    frequency?: string
  }) {
    const existing = await this.listNotificationPreferences({
      customer_id: data.customerId,
      tenant_id: data.tenantId,
      channel: data.channel,
      event_type: data.eventType,
    })

    const list = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (list.length > 0) {
      return await (this as any).updateNotificationPreferences({
        id: list[0].id,
        enabled: data.enabled,
        frequency: data.frequency || list[0].frequency,
      })
    }

    return await (this as any).createNotificationPreferences({
      customer_id: data.customerId,
      tenant_id: data.tenantId,
      channel: data.channel,
      event_type: data.eventType,
      enabled: data.enabled,
      frequency: data.frequency || "immediate",
    })
  }

  async getEnabledChannelsForEvent(
    customerId: string,
    tenantId: string,
    eventType: string
  ): Promise<string[]> {
    const prefs = await this.listNotificationPreferences({
      customer_id: customerId,
      tenant_id: tenantId,
      event_type: eventType,
      enabled: true,
    })

    const list = Array.isArray(prefs) ? prefs : [prefs].filter(Boolean)
    return list.map((p: any) => p.channel)
  }

  async initializeDefaults(customerId: string, tenantId: string) {
    const defaults = [
      { channel: "email", event_type: "order_update", enabled: true, frequency: "immediate" },
      { channel: "email", event_type: "shipping", enabled: true, frequency: "immediate" },
      { channel: "email", event_type: "promotion", enabled: true, frequency: "weekly_digest" },
      { channel: "email", event_type: "review_request", enabled: true, frequency: "immediate" },
      { channel: "email", event_type: "price_drop", enabled: true, frequency: "daily_digest" },
      { channel: "email", event_type: "back_in_stock", enabled: true, frequency: "immediate" },
      { channel: "email", event_type: "newsletter", enabled: true, frequency: "weekly_digest" },
      { channel: "in_app", event_type: "order_update", enabled: true, frequency: "immediate" },
      { channel: "in_app", event_type: "shipping", enabled: true, frequency: "immediate" },
    ]

    const created = []
    for (const def of defaults) {
      const pref = await (this as any).createNotificationPreferences({
        customer_id: customerId,
        tenant_id: tenantId,
        ...def,
      })
      created.push(pref)
    }

    return created
  }

  async bulkUpdate(
    customerId: string,
    tenantId: string,
    updates: Array<{ channel: string; eventType: string; enabled: boolean; frequency?: string }>
  ) {
    const results = []
    for (const update of updates) {
      const result = await this.updatePreference({
        customerId,
        tenantId,
        channel: update.channel,
        eventType: update.eventType,
        enabled: update.enabled,
        frequency: update.frequency,
      })
      results.push(result)
    }
    return results
  }
}

export default NotificationPreferencesModuleService
