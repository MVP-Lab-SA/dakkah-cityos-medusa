import { model } from "@medusajs/framework/utils";

const TaxRule = model.define("tax_rule", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  name: model.text(),
  description: model.text().nullable(),
  country_code: model.text(),
  region_code: model.text().nullable(),
  city: model.text().nullable(),
  postal_code_pattern: model.text().nullable(),
  tax_rate: model.number(),
  tax_type: model.text().default("vat"),
  applies_to: model.text().default("all"),
  category: model.text().nullable(),
  priority: model.number().default(0),
  status: model.text().default("active"),
  valid_from: model.dateTime().nullable(),
  valid_to: model.dateTime().nullable(),
  metadata: model.json().nullable(),
});

export default TaxRule;
