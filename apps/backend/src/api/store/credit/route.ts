import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const customerId = req.auth_context?.actor_id

  if (!customerId) {
    return res.status(401).json({ message: "Authentication required" })
  }

  const { tenant_id } = req.query as Record<string, string | undefined>

  try {
    const companyModule = req.scope.resolve("company") as any

    const employees = await companyModule.listCompanyEmployees({
      customer_id: customerId,
    })

    const employeeList = Array.isArray(employees) ? employees : [employees].filter(Boolean)

    if (employeeList.length === 0) {
      return res.json({
        credit: {
          limit: 0,
          used: 0,
          available: 0,
          currency: "USD",
        },
      })
    }

    const employee = employeeList[0]
    const company = await companyModule.retrieveCompany(employee.company_id)

    const creditLimit = Number(company.credit_limit || 0)
    const creditUsed = Number(company.credit_used || 0)
    const availableCredit = creditLimit - creditUsed

    res.json({
      credit: {
        limit: creditLimit,
        used: creditUsed,
        available: availableCredit,
        utilization_percent: creditLimit > 0 ? Math.round((creditUsed / creditLimit) * 10000) / 100 : 0,
        payment_terms: company.payment_terms,
        currency: "USD",
      },
      company: {
        id: company.id,
        name: company.name,
      },
    })
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch credit balance", error: error.message })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const customerId = req.auth_context?.actor_id

  if (!customerId) {
    return res.status(401).json({ message: "Authentication required" })
  }

  const { cart_id, amount } = req.body as { cart_id: string; amount: number }

  if (!cart_id || !amount) {
    return res.status(400).json({ message: "cart_id and amount are required" })
  }

  try {
    const companyModule = req.scope.resolve("company") as any

    const employees = await companyModule.listCompanyEmployees({
      customer_id: customerId,
    })

    const employeeList = Array.isArray(employees) ? employees : [employees].filter(Boolean)

    if (employeeList.length === 0) {
      return res.status(404).json({ message: "No company account found" })
    }

    const employee = employeeList[0]
    const company = await companyModule.retrieveCompany(employee.company_id)

    const creditLimit = Number(company.credit_limit || 0)
    const creditUsed = Number(company.credit_used || 0)
    const availableCredit = creditLimit - creditUsed

    if (amount > availableCredit) {
      return res.status(400).json({ message: "Insufficient credit balance" })
    }

    res.json({
      success: true,
      applied_amount: amount,
      remaining_credit: availableCredit - amount,
      cart_id,
    })
  } catch (error: any) {
    res.status(500).json({ message: "Failed to apply credit", error: error.message })
  }
}
