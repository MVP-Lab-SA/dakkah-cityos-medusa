import { model } from "@medusajs/framework/utils"

const Wallet = model.define("wallet", {
  id: model.id().primaryKey(),
  customer_id: model.text(),
  currency: model.text().default("usd"),
  balance: model.bigNumber().default(0),
  version: model.number().default(1),
  status: model.enum(["active", "frozen", "closed"]).default("active"),
  freeze_reason: model.text().nullable(),
  frozen_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default Wallet
