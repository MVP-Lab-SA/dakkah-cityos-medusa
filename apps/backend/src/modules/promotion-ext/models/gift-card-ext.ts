import { model } from "@medusajs/framework/utils"

const GiftCardExt = model.define("gift_card_ext", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  code: model.text().unique(),
  initial_value: model.bigNumber(),
  remaining_value: model.bigNumber(),
  currency_code: model.text(),
  sender_name: model.text().nullable(),
  sender_email: model.text().nullable(),
  recipient_name: model.text().nullable(),
  recipient_email: model.text().nullable(),
  message: model.text().nullable(),
  delivered_at: model.dateTime().nullable(),
  expires_at: model.dateTime().nullable(),
  is_active: model.boolean().default(true),
  metadata: model.json().nullable(),
})

export default GiftCardExt
