// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const AnalyticsEvent = model.define("analytics_event", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  event_type: model.text(),
  entity_type: model.text().nullable(),
  entity_id: model.text().nullable(),
  customer_id: model.text().nullable(),
  session_id: model.text().nullable(),
  properties: model.json().nullable(),
  revenue: model.bigNumber().nullable(),
  currency: model.text().nullable(),
})

export default AnalyticsEvent
