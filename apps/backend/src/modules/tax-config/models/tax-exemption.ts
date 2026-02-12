// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const TaxExemption = model.define("tax_exemption", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  entity_type: model.enum(["customer", "company", "product"]),
  entity_id: model.text(),
  tax_rule_id: model.text().nullable(),
  exemption_type: model.enum(["full", "partial"]),
  exemption_rate: model.number().nullable(),
  certificate_number: model.text().nullable(),
  valid_from: model.dateTime(),
  valid_to: model.dateTime().nullable(),
  status: model.enum(["active", "expired", "revoked"]).default("active"),
  metadata: model.json().nullable(),
})

export default TaxExemption
