import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// Get credit details and history
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")
  const { id } = req.params
  
  const { data: [company] } = await query.graph({
    entity: "company",
    fields: [
      "id",
      "name",
      "credit_limit",
      "credit_used",
      "payment_terms_days",
      "tier",
    ],
    filters: { id },
  })
  
  if (!company) {
    return res.status(404).json({ message: "Company not found" })
  }
  
  // Calculate available credit
  const creditLimit = parseFloat(company.credit_limit || "0")
  const creditUsed = parseFloat(company.credit_used || "0")
  const availableCredit = creditLimit - creditUsed
  
  res.json({
    company_id: id,
    credit_limit: creditLimit,
    credit_used: creditUsed,
    available_credit: availableCredit,
    payment_terms_days: company.payment_terms_days,
    tier: company.tier,
  })
}

// Adjust credit limit
export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const companyModuleService = req.scope.resolve("companyModuleService") as any
  const { id } = req.params
  const { credit_limit, payment_terms_days, reason } = req.body as {
    credit_limit?: number
    payment_terms_days?: number
    reason?: string
  }
  
  const updateData: Record<string, any> = {}
  if (credit_limit !== undefined) updateData.credit_limit = credit_limit.toString()
  if (payment_terms_days !== undefined) updateData.payment_terms_days = payment_terms_days
  
  const company = await companyModuleService.updateCompanies({ id, ...updateData })
  
  // Log the credit adjustment (could store in metadata or separate audit table)
  console.log(`Credit adjusted for company ${id}: ${JSON.stringify({ credit_limit, payment_terms_days, reason })}`)
  
  res.json({ company })
}

// Manual credit adjustment (add/subtract from credit_used)
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")
  const companyModuleService = req.scope.resolve("companyModuleService") as any
  const { id } = req.params
  const { amount, type, reason } = req.body as {
    amount: number
    type: "add" | "subtract" | "reset"
    reason: string
  }
  
  const { data: [company] } = await query.graph({
    entity: "company",
    fields: ["id", "credit_used"],
    filters: { id },
  })
  
  if (!company) {
    return res.status(404).json({ message: "Company not found" })
  }
  
  let newCreditUsed: number
  const currentUsed = parseFloat(company.credit_used || "0")
  
  switch (type) {
    case "add":
      newCreditUsed = currentUsed + amount
      break
    case "subtract":
      newCreditUsed = Math.max(0, currentUsed - amount)
      break
    case "reset":
      newCreditUsed = 0
      break
    default:
      return res.status(400).json({ message: "Invalid adjustment type" })
  }
  
  const updated = await companyModuleService.updateCompanies({
    id,
    credit_used: newCreditUsed.toString(),
  })
  
  console.log(`Credit usage adjusted for company ${id}: ${type} ${amount}, reason: ${reason}`)
  
  res.json({
    company_id: id,
    previous_credit_used: currentUsed,
    new_credit_used: newCreditUsed,
    adjustment_type: type,
    adjustment_amount: amount,
    reason,
  })
}
