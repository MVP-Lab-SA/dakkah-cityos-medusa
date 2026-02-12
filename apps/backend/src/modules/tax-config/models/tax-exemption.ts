// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const TaxExemption = model.define("tax_config_exemption", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  entity_type: model.text().default("customer"),
  entity_id: model.text(),
  tax_rule_id: model.text().nullable(),
  exemption_type: model.text().default("full"),
  exemption_rate: model.number().nullable(),
  certificate_number: model.text().nullable(),
  valid_from: model.dateTime(),
  valid_to: model.dateTime().nullable(),
  status: model.text().default("active"),
  metadata: model.json().nullable(),
})

export default TaxExemption
