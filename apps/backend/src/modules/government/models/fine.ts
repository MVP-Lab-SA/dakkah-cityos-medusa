import { model } from "@medusajs/framework/utils"

const Fine = model.define("fine", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  citizen_id: model.text().nullable(),
  fine_type: model.enum([
    "traffic",
    "parking",
    "building_code",
    "environmental",
    "noise",
    "other",
  ]),
  fine_number: model.text().unique(),
  description: model.text(),
  amount: model.bigNumber(),
  currency_code: model.text(),
  status: model.enum([
    "issued",
    "contested",
    "paid",
    "overdue",
    "waived",
  ]).default("issued"),
  issued_at: model.dateTime(),
  due_date: model.dateTime(),
  paid_at: model.dateTime().nullable(),
  payment_reference: model.text().nullable(),
  location: model.json().nullable(),
  evidence: model.json().nullable(),
  contested_reason: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default Fine
