import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const customerId = req.auth_context?.actor_id

  if (!customerId) {
    return res.status(401).json({ message: "Authentication required" })
  }

  const { tenant_id } = req.query as Record<string, string | undefined>

  try {
    const loyaltyService = req.scope.resolve("loyalty") as any

    const accounts = await loyaltyService.listLoyaltyAccounts({
      customer_id: customerId,
      ...(tenant_id ? { tenant_id } : {}),
    })

    const accountList = Array.isArray(accounts) ? accounts : [accounts].filter(Boolean)

    if (accountList.length === 0) {
      return res.json({
        enrolled: false,
        account: null,
      })
    }

    const account = accountList[0]
    const balance = await loyaltyService.getBalance(account.id)

    let program = null
    try {
      program = await loyaltyService.retrieveLoyaltyProgram(account.program_id)
    } catch {
    }

    const transactions = await loyaltyService.getTransactionHistory(account.id, {
      limit: 10,
      offset: 0,
    })

    res.json({
      enrolled: true,
      account: {
        id: account.id,
        ...balance,
      },
      program: program
        ? {
            id: program.id,
            name: program.name,
            description: program.description,
            tiers: program.tiers,
          }
        : null,
      recent_transactions: Array.isArray(transactions) ? transactions : [],
    })
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch loyalty account", error: error.message })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const customerId = req.auth_context?.actor_id

  if (!customerId) {
    return res.status(401).json({ message: "Authentication required" })
  }

  const { program_id, tenant_id } = req.body as { program_id: string; tenant_id: string }

  if (!program_id || !tenant_id) {
    return res.status(400).json({ message: "program_id and tenant_id are required" })
  }

  try {
    const loyaltyService = req.scope.resolve("loyalty") as any

    const account = await loyaltyService.getOrCreateAccount(program_id, customerId, tenant_id)

    res.status(201).json({
      success: true,
      account: {
        id: account.id,
        points_balance: Number(account.points_balance),
        lifetime_points: Number(account.lifetime_points),
        tier: account.tier,
        status: account.status,
      },
    })
  } catch (error: any) {
    res.status(500).json({ message: "Failed to enroll in loyalty program", error: error.message })
  }
}
