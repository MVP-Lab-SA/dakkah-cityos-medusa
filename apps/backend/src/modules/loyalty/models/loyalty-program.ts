import { model } from "@medusajs/framework/utils";

const LoyaltyProgram = model.define("loyalty_program", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  name: model.text(),
  description: model.text().nullable(),
  points_per_currency: model.number().default(1),
  currency_code: model.text(),
  status: model.text().default("active"),
  tiers: model.json().nullable(),
  earn_rules: model.json().nullable(),
  metadata: model.json().nullable(),
});

export default LoyaltyProgram;
