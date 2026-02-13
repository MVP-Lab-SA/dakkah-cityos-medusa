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
}) {
  /**
   * Calculate projected returns for an investment product based on amount and term in months.
   */
  async calculateReturns(productId: string, amount: number, term: number): Promise<{ principal: number; projectedReturn: number; totalValue: number; annualRate: number }> {
    const plan = await this.retrieveInvestmentPlan(productId)
    // @ts-expect-error - InvestmentPlan doesn't have annual_return_rate property
    const annualRate = Number(plan.annual_return_rate || 0.08)
    const years = term / 12
    const projectedReturn = amount * Math.pow(1 + annualRate, years) - amount
    return {
      principal: amount,
      projectedReturn: Math.round(projectedReturn * 100) / 100,
      totalValue: Math.round((amount + projectedReturn) * 100) / 100,
      annualRate,
    }
  }

  /**
   * Create a new investment for a customer in a specific financial product.
   */
  async createInvestment(productId: string, customerId: string, amount: number): Promise<any> {
    const plan = await this.retrieveInvestmentPlan(productId)
    if (plan.min_investment && amount < Number(plan.min_investment)) {
      throw new Error(`Minimum investment amount is ${plan.min_investment}`)
    }
    const risk = await this.assessRisk(productId)
    const application = await (this as any).createLoanApplications({
      product_id: productId,
      customer_id: customerId,
      amount,
      status: "active",
      risk_level: risk.riskLevel,
      invested_at: new Date(),
    })
    return application
  }

  /**
   * Get the complete investment portfolio for a customer across all products.
   */
  async getPortfolio(customerId: string): Promise<any> {
    const investments = await this.listLoanApplications({ customer_id: customerId, status: "active" }) as any
    const list = Array.isArray(investments) ? investments : [investments].filter(Boolean)
    let totalInvested = 0
    const holdings = []
    for (const inv of list) {
      totalInvested += Number(inv.amount || 0)
      holdings.push({ id: inv.id, productId: inv.product_id, amount: Number(inv.amount || 0) })
    }
    return { customerId, totalInvested, holdings, holdingsCount: holdings.length }
  }

  /**
   * Assess the risk level of a financial product based on its configuration.
   */
  async assessRisk(productId: string): Promise<{ riskLevel: string; riskScore: number }> {
    const plan = await this.retrieveInvestmentPlan(productId)
    // @ts-expect-error - InvestmentPlan doesn't have annual_return_rate property
    const annualRate = Number(plan.annual_return_rate || 0.08)
    let riskScore = 0
    if (annualRate > 0.15) riskScore = 80
    else if (annualRate > 0.10) riskScore = 60
    else if (annualRate > 0.05) riskScore = 40
    else riskScore = 20
    const riskLevel = riskScore >= 60 ? "high" : riskScore >= 40 ? "medium" : "low"
    return { riskLevel, riskScore }
  }
}

export default FinancialProductModuleService
