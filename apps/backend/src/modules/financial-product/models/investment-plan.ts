import { model } from "@medusajs/framework/utils"

const InvestmentPlan = model.define("investment_plan", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  name: model.text(),
  description: model.text().nullable(),
  plan_type: model.enum([
    "savings",
    "fixed_deposit",
    "mutual_fund",
    "gold",
    "crypto",
    "real_estate",
  ]),
  min_investment: model.bigNumber(),
  currency_code: model.text(),
  expected_return_pct: model.number().nullable(),
  risk_level: model.enum([
    "low",
    "moderate",
    "high",
    "very_high",
  ]),
  lock_in_months: model.number().nullable(),
  is_shariah_compliant: model.boolean().default(false),
  features: model.json().nullable(),
  terms: model.json().nullable(),
  is_active: model.boolean().default(true),
  metadata: model.json().nullable(),
})

export default InvestmentPlan
