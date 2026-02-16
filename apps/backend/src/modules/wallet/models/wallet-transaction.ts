import { model } from "@medusajs/framework/utils"

const WalletTransaction = model.define("wallet_transaction", {
  id: model.id().primaryKey(),
  wallet_id: model.text(),
  type: model.enum(["credit", "debit"]),
  amount: model.bigNumber(),
  balance_after: model.bigNumber(),
  description: model.text().nullable(),
  reference_id: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default WalletTransaction
