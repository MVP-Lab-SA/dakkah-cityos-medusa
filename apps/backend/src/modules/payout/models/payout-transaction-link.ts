import { model } from "@medusajs/framework/utils"

// Links payout to commission transactions
const PayoutTransactionLink = model.define("payout_transaction_link", {
  id: model.id().primaryKey(),
  
  payout_id: model.text(),
  commission_transaction_id: model.text(),
  
  // Amount included in payout (might differ from transaction if partial)
  amount: model.bigInt(),
})

export default PayoutTransactionLink
