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

    const promotionExt = req.scope.resolve("promotionExt") as any
    let giftCardBalance = 0

    try {
      const giftCards = await promotionExt.listGiftCardExts({
        recipient_email: customerId,
        is_active: true,
      })

      const gcList = Array.isArray(giftCards) ? giftCards : [giftCards].filter(Boolean)
      giftCardBalance = gcList.reduce((sum: number, gc: any) => {
        if (gc.expires_at && new Date(gc.expires_at) < new Date()) return sum
        return sum + Number(gc.remaining_value || 0)
      }, 0)
    } catch {
    }

    const loyaltyBalance = accountList.reduce(
      (sum: number, acc: any) => sum + Number(acc.points_balance || 0),
      0
    )

    res.json({
      wallet: {
        gift_card_balance: giftCardBalance,
        loyalty_points: loyaltyBalance,
        total_credits: giftCardBalance,
        currency: "USD",
      },
    })
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch wallet balance", error: error.message })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const customerId = req.auth_context?.actor_id

  if (!customerId) {
    return res.status(401).json({ message: "Authentication required" })
  }

  const { amount, currency_code = "usd", tenant_id, payment_method } = req.body as {
    amount: number
    currency_code?: string
    tenant_id: string
    payment_method?: string
  }

  if (!amount || !tenant_id) {
    return res.status(400).json({ message: "amount and tenant_id are required" })
  }

  if (amount <= 0) {
    return res.status(400).json({ message: "Amount must be greater than 0" })
  }

  try {
    const promotionExt = req.scope.resolve("promotionExt") as any

    const code = `WLT-${customerId.slice(-6)}-${Date.now().toString(36).toUpperCase()}`

    const giftCard = await (promotionExt as any).createGiftCardExts({
      tenant_id,
      code,
      initial_value: amount,
      remaining_value: amount,
      currency_code,
      recipient_email: customerId,
      sender_name: "Wallet Top-up",
      is_active: true,
      metadata: { type: "wallet_topup", payment_method: payment_method || "unknown" },
    })

    res.status(201).json({
      success: true,
      transaction: {
        id: giftCard.id,
        amount,
        currency_code,
        type: "top_up",
      },
    })
  } catch (error: any) {
    res.status(500).json({ message: "Failed to add funds to wallet", error: error.message })
  }
}
