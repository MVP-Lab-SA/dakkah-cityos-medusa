import { model } from "@medusajs/framework/utils"

const PropertyValuation = model.define("property_valuation", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  listing_id: model.text(),
  valuator_id: model.text().nullable(),
  valuation_type: model.enum(["market", "assessed", "insurance", "investment"]),
  estimated_value: model.bigNumber(),
  currency_code: model.text(),
  valuation_date: model.dateTime(),
  methodology: model.text().nullable(),
  comparables: model.json().nullable(),
  notes: model.text().nullable(),
  valid_until: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default PropertyValuation
