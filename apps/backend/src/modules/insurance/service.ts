// @ts-nocheck
import { MedusaService } from "@medusajs/framework/utils"
import InsurancePolicy from "./models/insurance-policy"
import InsuranceClaim from "./models/insurance-claim"

class InsuranceModuleService extends MedusaService({
  InsurancePolicy,
  InsuranceClaim,
}) {
  async createPolicy(data: {
    customerId: string
    productId: string
    planType: string
    coverageAmount: number
    premium: number
    startDate: Date
    metadata?: Record<string, unknown>
  }): Promise<any> {
    if (data.coverageAmount <= 0) {
      throw new Error("Coverage amount must be greater than zero")
    }
    if (data.premium <= 0) {
      throw new Error("Premium must be greater than zero")
    }

    const endDate = new Date(data.startDate)
    endDate.setFullYear(endDate.getFullYear() + 1)

    const policy = await (this as any).createInsPolicys({
      customer_id: data.customerId,
      product_id: data.productId,
      plan_type: data.planType,
      coverage_amount: data.coverageAmount,
      premium: data.premium,
      start_date: data.startDate,
      end_date: endDate,
      status: "active",
      policy_number: `POL-${Date.now().toString(36).toUpperCase()}`,
    })

    return policy
  }

  async fileInsuranceClaim(policyId: string, description: string, claimAmount: number): Promise<any> {
    if (!description || !description.trim()) {
      throw new Error("Claim description is required")
    }
    if (claimAmount <= 0) {
      throw new Error("Claim amount must be greater than zero")
    }

    const policy = await this.retrieveInsPolicy(policyId)

    if (policy.status !== "active") {
      throw new Error("Policy is not active")
    }

    if (claimAmount > Number(policy.coverage_amount)) {
      throw new Error("Claim amount exceeds coverage limit")
    }

    const claim = await (this as any).createInsClaims({
      policy_id: policyId,
      description: description.trim(),
      claim_amount: claimAmount,
      status: "pending",
      claim_number: `CLM-${Date.now().toString(36).toUpperCase()}`,
      filed_at: new Date(),
    })

    return claim
  }

  async processInsuranceClaim(claimId: string, decision: "approved" | "rejected", notes?: string): Promise<any> {
    const claim = await this.retrieveInsClaim(claimId)

    if (claim.status !== "pending" && claim.status !== "under_review") {
      throw new Error("Claim is not in a reviewable state")
    }

    const updated = await (this as any).updateInsClaims({
      id: claimId,
      status: decision,
      decision_notes: notes || null,
      decided_at: new Date(),
      payout_amount: decision === "approved" ? claim.claim_amount : 0,
    })

    return updated
  }

  async cancelPolicy(policyId: string, reason?: string): Promise<any> {
    const policy = await this.retrieveInsPolicy(policyId)

    if (policy.status === "cancelled") {
      throw new Error("Policy is already cancelled")
    }

    const updated = await (this as any).updateInsPolicys({
      id: policyId,
      status: "cancelled",
      cancellation_reason: reason || null,
      cancelled_at: new Date(),
    })

    return updated
  }

  async getPolicyDetails(policyId: string): Promise<any> {
    const policy = await this.retrieveInsPolicy(policyId)
    const claims = await this.listInsClaims({ policy_id: policyId })
    const claimList = Array.isArray(claims) ? claims : [claims].filter(Boolean)

    const now = new Date()
    const endDate = new Date(policy.end_date)
    const isExpired = endDate < now

    return {
      ...policy,
      claims: claimList,
      isExpired,
      totalClaimed: claimList.reduce((sum: number, c: any) => sum + Number(c.claim_amount || 0), 0),
      remainingCoverage: Number(policy.coverage_amount) - claimList.reduce((sum: number, c: any) => sum + Number(c.payout_amount || 0), 0),
    }
  }
}

export default InsuranceModuleService
