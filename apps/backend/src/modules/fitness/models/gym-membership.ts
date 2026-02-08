import { model } from "@medusajs/framework/utils"

const GymMembership = model.define("gym_membership", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  customer_id: model.text(),
  facility_id: model.text().nullable(),
  membership_type: model.enum([
    "basic",
    "premium",
    "vip",
    "student",
    "corporate",
    "family",
  ]),
  status: model.enum([
    "active",
    "frozen",
    "expired",
    "cancelled",
  ]).default("active"),
  start_date: model.dateTime(),
  end_date: model.dateTime().nullable(),
  monthly_fee: model.bigNumber(),
  currency_code: model.text(),
  auto_renew: model.boolean().default(true),
  freeze_count: model.number().default(0),
  max_freezes: model.number().default(2),
  access_hours: model.json().nullable(),
  includes: model.json().nullable(),
  metadata: model.json().nullable(),
})

export default GymMembership
