import { model } from "@medusajs/framework/utils"

const ClickTracking = model.define("click_tracking", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  link_id: model.text(),
  affiliate_id: model.text(),
  ip_address: model.text().nullable(),
  user_agent: model.text().nullable(),
  referrer: model.text().nullable(),
  landed_at: model.dateTime(),
  converted: model.boolean().default(false),
  conversion_order_id: model.text().nullable(),
  conversion_amount: model.bigNumber().nullable(),
  metadata: model.json().nullable(),
})

export default ClickTracking
