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

  async getEffectivePreferences(customerId: string, tenantId: string) {
    const defaults = [
      { channel: "email", category: "transactional", enabled: true },
      { channel: "email", category: "marketing", enabled: true },
      { channel: "email", category: "security", enabled: true },
      { channel: "sms", category: "transactional", enabled: false },
      { channel: "sms", category: "marketing", enabled: false },
      { channel: "sms", category: "security", enabled: true },
      { channel: "push", category: "transactional", enabled: true },
      { channel: "push", category: "marketing", enabled: false },
      { channel: "push", category: "security", enabled: true },
      { channel: "in_app", category: "transactional", enabled: true },
      { channel: "in_app", category: "marketing", enabled: true },
      { channel: "in_app", category: "security", enabled: true },
    ]

    const userPrefs = await this.listNotificationPreferences({
      customer_id: customerId,
      tenant_id: tenantId,
    })
    const prefList = Array.isArray(userPrefs) ? userPrefs : [userPrefs].filter(Boolean)

    const effective = defaults.map((def) => {
      const override = prefList.find(
        (p: any) => p.channel === def.channel && (p.event_type === def.category || p.category === def.category)
      )
      return {
        channel: def.channel,
        category: def.category,
        enabled: override ? override.enabled : def.enabled,
        source: override ? "user" : "default",
      }
    })

    return effective
  }

  async updateChannelPreference(customerId: string, channel: string, enabled: boolean) {
    const validChannels = ["email", "sms", "push", "in_app"]
    if (!validChannels.includes(channel)) {
      throw new Error(`Invalid channel. Must be one of: ${validChannels.join(", ")}`)
    }

    const existing = await this.listNotificationPreferences({
      customer_id: customerId,
      channel,
    })
    const list = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    const results = []
    for (const pref of list) {
      const updated = await (this as any).updateNotificationPreferences({
        id: pref.id,
        enabled,
      })
      results.push(updated)
    }

    return { channel, enabled, updated: results.length }
  }

  async updateCategoryPreference(customerId: string, category: string, enabled: boolean) {
    const validCategories = ["marketing", "transactional", "security"]
    if (!validCategories.includes(category)) {
      throw new Error(`Invalid category. Must be one of: ${validCategories.join(", ")}`)
    }

    const existing = await this.listNotificationPreferences({
      customer_id: customerId,
      event_type: category,
    })
    const list = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    const results = []
    for (const pref of list) {
      const updated = await (this as any).updateNotificationPreferences({
        id: pref.id,
        enabled,
      })
      results.push(updated)
    }

    return { category, enabled, updated: results.length }
  }

  async shouldNotify(customerId: string, tenantId: string, channel: string, category: string): Promise<boolean> {
    const effective = await this.getEffectivePreferences(customerId, tenantId)
    const match = effective.find(
      (p) => p.channel === channel && p.category === category
    )
    return match ? match.enabled : false
  }

  async bulkOptOut(customerId: string, channels?: string[]) {
    const targetChannels = channels || ["email", "sms", "push", "in_app"]

    const existing = await this.listNotificationPreferences({
      customer_id: customerId,
    })
    const list = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    const results = []
    for (const pref of list) {
      if (targetChannels.includes(pref.channel)) {
        const updated = await (this as any).updateNotificationPreferences({
          id: pref.id,
          enabled: false,
        })
        results.push(updated)
      }
    }

    return { optedOut: results.length, channels: targetChannels }
  }
}

export default NotificationPreferencesModuleService
