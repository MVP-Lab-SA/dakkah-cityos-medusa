import { model } from "@medusajs/framework/utils"

const RentalReturn = model.define("rental_return", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  agreement_id: model.text(),
  inspected_by: model.text().nullable(),
  condition_on_return: model.enum(["excellent", "good", "fair", "poor", "damaged"]),
  inspection_notes: model.text().nullable(),
  damage_description: model.text().nullable(),
  damage_fee: model.bigNumber().nullable(),
  deposit_deduction: model.bigNumber().nullable(),
  deposit_refund: model.bigNumber().nullable(),
  returned_at: model.dateTime(),
  metadata: model.json().nullable(),
})

export default RentalReturn
