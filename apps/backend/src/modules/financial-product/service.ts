import { MedusaService } from "@medusajs/framework/utils"
import LoanProduct from "./models/loan-product.js"
import LoanApplication from "./models/loan-application.js"
import InsuranceProduct from "./models/insurance-product.js"
import InsurancePolicy from "./models/insurance-policy.js"
import InvestmentPlan from "./models/investment-plan.js"

class FinancialProductModuleService extends MedusaService({
  LoanProduct,
  LoanApplication,
  InsuranceProduct,
  InsurancePolicy,
  InvestmentPlan,
}) {}

export default FinancialProductModuleService
