// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const NotificationPreference = model.define("notification_preference", {
  id: model.id().primaryKey(),
  customer_id: model.text(),
  tenant_id: model.text(),
  channel: model.text(),
  event_type: model.text(),
  enabled: model.boolean().default(true),
  frequency: model.text().default("immediate"),
  metadata: model.json().nullable(),
})

export default NotificationPreference
