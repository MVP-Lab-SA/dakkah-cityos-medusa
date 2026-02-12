// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const NotificationPreference = model.define("notification_preference", {
  id: model.id().primaryKey(),
  customer_id: model.text(),
  tenant_id: model.text(),
  channel: model.enum(["email", "sms", "push", "in_app"]),
  event_type: model.enum([
    "order_update",
    "shipping",
    "promotion",
    "review_request",
    "price_drop",
    "back_in_stock",
    "newsletter",
  ]),
  enabled: model.boolean().default(true),
  frequency: model.enum(["immediate", "daily_digest", "weekly_digest"]).default("immediate"),
  metadata: model.json().nullable(),
})

export default NotificationPreference
