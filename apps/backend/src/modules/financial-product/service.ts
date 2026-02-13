import { MedusaService } from "@medusajs/framework/utils"
import LoanProduct from "./models/loan-product"
import LoanApplication from "./models/loan-application"
import InsuranceProduct from "./models/insurance-product"
import InsurancePolicy from "./models/insurance-policy"
import InvestmentPlan from "./models/investment-plan"

class FinancialProductModuleService extends MedusaService({
  LoanProduct,
  LoanApplication,
  InsuranceProduct,
  InsurancePolicy,
  InvestmentPlan,
}) {}

export default FinancialProductModuleService
