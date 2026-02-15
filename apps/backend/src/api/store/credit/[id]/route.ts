import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const companyModule = req.scope.resolve("company") as any
    const { id } = req.params
    const company = await companyModule.retrieveCompany(id)
    if (!company) return res.status(404).json({ message: "Not found" })

    const creditLimit = Number(company.credit_limit || 0)
    const creditUsed = Number(company.credit_used || 0)
    const availableCredit = creditLimit - creditUsed

    return res.json({
      item: {
        id: company.id,
        name: company.name,
        credit: {
          limit: creditLimit,
          used: creditUsed,
          available: availableCredit,
          utilization_percent: creditLimit > 0 ? Math.round((creditUsed / creditLimit) * 10000) / 100 : 0,
          payment_terms: company.payment_terms,
          currency: "USD",
        },
      },
    })
  } catch (error: any) {
    if (error.type === "not_found" || error.message?.includes("not found")) {
      return res.status(404).json({ message: "Credit account not found" })
    }
    res.status(500).json({ message: "Failed to fetch credit details", error: error.message })
  }
}
