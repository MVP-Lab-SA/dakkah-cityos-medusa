import { model } from "@medusajs/framework/utils"

const Backer = model.define("backer", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  campaign_id: model.text(),
  customer_id: model.text(),
  total_pledged: model.bigNumber().default(0),
  currency_code: model.text(),
  pledge_count: model.number().default(1),
  is_repeat_backer: model.boolean().default(false),
  first_backed_at: model.dateTime(),
  metadata: model.json().nullable(),
})

export default Backer
