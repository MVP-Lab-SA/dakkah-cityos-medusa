import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { limit = "20", offset = "0", tenant_id, code } = req.query as Record<string, string | undefined>

  try {
    const moduleService = req.scope.resolve("promotionExt") as any

    const filters: Record<string, any> = { is_active: true }
    if (tenant_id) filters.tenant_id = tenant_id
    if (code) filters.code = code

    const items = await moduleService.listGiftCardExts(filters, {
      skip: Number(offset),
      take: Number(limit),
      order: { created_at: "DESC" },
    })

    const giftCards = (Array.isArray(items) ? items : [items].filter(Boolean)).filter((gc: any) => {
      if (gc.expires_at && new Date(gc.expires_at) < new Date()) return false
      return Number(gc.remaining_value) > 0
    })

    res.json({
      gift_cards: giftCards,
      count: giftCards.length,
      limit: Number(limit),
      offset: Number(offset),
    })
  } catch (error: any) {
    handleApiError(res, error, "STORE-GIFT-CARDS")}
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { code, amount, cart_id, recipient_email, recipient_name, sender_name, sender_email, message, tenant_id } =
    req.body as {
      code?: string
      amount?: number
      cart_id?: string
      recipient_email?: string
      recipient_name?: string
      sender_name?: string
      sender_email?: string
      message?: string
      tenant_id?: string
    }

  try {
    const moduleService = req.scope.resolve("promotionExt") as any

    if (code) {
      const cards = await moduleService.listGiftCardExts({ code, is_active: true })
      const cardList = Array.isArray(cards) ? cards : [cards].filter(Boolean)

      if (cardList.length === 0) {
        return res.status(404).json({ message: "Gift card not found or inactive" })
      }

      const giftCard = cardList[0]

      if (giftCard.expires_at && new Date(giftCard.expires_at) < new Date()) {
        return res.status(400).json({ message: "Gift card has expired" })
      }

      if (Number(giftCard.remaining_value) <= 0) {
        return res.status(400).json({ message: "Gift card has no remaining balance" })
      }

      const redeemAmount = amount || Number(giftCard.remaining_value)
      if (redeemAmount > Number(giftCard.remaining_value)) {
        return res.status(400).json({ message: "Insufficient gift card balance" })
      }

      const newBalance = Number(giftCard.remaining_value) - redeemAmount
      await (moduleService as any).updateGiftCardExts({
        id: giftCard.id,
        remaining_value: newBalance,
        is_active: newBalance > 0,
      })

      return res.json({
        success: true,
        redeemed_amount: redeemAmount,
        remaining_value: newBalance,
        gift_card_id: giftCard.id,
      })
    }

    if (recipient_email && amount && tenant_id) {
      const generatedCode = `GC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

      const giftCard = await (moduleService as any).createGiftCardExts({
        tenant_id,
        code: generatedCode,
        initial_value: amount,
        remaining_value: amount,
        currency_code: "usd",
        sender_name: sender_name || null,
        sender_email: sender_email || null,
        recipient_name: recipient_name || null,
        recipient_email,
        message: message || null,
        is_active: true,
      })

      return res.status(201).json({ gift_card: giftCard })
    }

    return res.status(400).json({ message: "Provide a code to redeem, or recipient_email, amount, and tenant_id to purchase" })
  } catch (error: any) {
    handleApiError(res, error, "STORE-GIFT-CARDS")}
}

