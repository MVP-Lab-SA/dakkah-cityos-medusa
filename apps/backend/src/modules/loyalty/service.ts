// @ts-nocheck
import { MedusaService } from "@medusajs/framework/utils"
import LoyaltyProgram from "./models/loyalty-program"
import LoyaltyAccount from "./models/loyalty-account"
import PointTransaction from "./models/point-transaction"

class LoyaltyModuleService extends MedusaService({
  LoyaltyProgram,
  LoyaltyAccount,
  PointTransaction,
}) {
  async earnPoints(data: {
    accountId: string
    points: number
    referenceType?: string
    referenceId?: string
    description?: string
    expiresAt?: Date
    metadata?: Record<string, unknown>
  }) {
    const account = await this.retrieveLoyaltyAccount(data.accountId)

    if (account.status !== "active") {
      throw new Error("Loyalty account is not active")
    }

    const newBalance = Number(account.points_balance) + data.points
    const newLifetime = Number(account.lifetime_points) + data.points

    await (this as any).updateLoyaltyAccounts({
      id: data.accountId,
      points_balance: newBalance,
      lifetime_points: newLifetime,
    })

    const transaction = await (this as any).createPointTransactions({
      account_id: data.accountId,
      tenant_id: account.tenant_id,
      type: "earn",
      points: data.points,
      balance_after: newBalance,
      reference_type: data.referenceType || null,
      reference_id: data.referenceId || null,
      description: data.description || null,
      expires_at: data.expiresAt || null,
      metadata: data.metadata || null,
    })

    await this.calculateTier(data.accountId)

    return transaction
  }

  async redeemPoints(data: {
    accountId: string
    points: number
    referenceType?: string
    referenceId?: string
    description?: string
    metadata?: Record<string, unknown>
  }) {
    const account = await this.retrieveLoyaltyAccount(data.accountId)

    if (account.status !== "active") {
      throw new Error("Loyalty account is not active")
    }

    if (Number(account.points_balance) < data.points) {
      throw new Error("Insufficient points balance")
    }

    const newBalance = Number(account.points_balance) - data.points

    await (this as any).updateLoyaltyAccounts({
      id: data.accountId,
      points_balance: newBalance,
    })

    const transaction = await (this as any).createPointTransactions({
      account_id: data.accountId,
      tenant_id: account.tenant_id,
      type: "redeem",
      points: -data.points,
      balance_after: newBalance,
      reference_type: data.referenceType || null,
      reference_id: data.referenceId || null,
      description: data.description || null,
      metadata: data.metadata || null,
    })

    return transaction
  }

  async getBalance(accountId: string) {
    const account = await this.retrieveLoyaltyAccount(accountId)
    return {
      points_balance: Number(account.points_balance),
      lifetime_points: Number(account.lifetime_points),
      tier: account.tier,
      tier_expires_at: account.tier_expires_at,
      status: account.status,
    }
  }

  async getTransactionHistory(
    accountId: string,
    options?: { limit?: number; offset?: number; type?: string }
  ) {
    const filters: Record<string, any> = { account_id: accountId }
    if (options?.type) {
      filters.type = options.type
    }

    const transactions = await this.listPointTransactions(filters, {
      take: options?.limit || 20,
      skip: options?.offset || 0,
      order: { created_at: "DESC" },
    })

    return transactions
  }

  async calculateTier(accountId: string) {
    const account = await this.retrieveLoyaltyAccount(accountId)
    const program = await this.retrieveLoyaltyProgram(account.program_id)

    if (!program.tiers || !Array.isArray(program.tiers)) {
      return account.tier
    }

    const tiers = program.tiers as Array<{
      name: string
      min_points: number
      duration_days?: number
    }>

    const sortedTiers = [...tiers].sort((a, b) => b.min_points - a.min_points)
    const lifetimePoints = Number(account.lifetime_points)

    let newTier: string | null = null
    let tierExpiry: Date | null = null

    for (const tier of sortedTiers) {
      if (lifetimePoints >= tier.min_points) {
        newTier = tier.name
        if (tier.duration_days) {
          tierExpiry = new Date()
          tierExpiry.setDate(tierExpiry.getDate() + tier.duration_days)
        }
        break
      }
    }

    if (newTier !== account.tier) {
      await (this as any).updateLoyaltyAccounts({
        id: accountId,
        tier: newTier,
        tier_expires_at: tierExpiry,
      })
    }

    return newTier
  }

  async expirePoints(beforeDate: Date) {
    const transactions = await this.listPointTransactions({
      type: "earn",
    })

    const txList = Array.isArray(transactions) ? transactions : [transactions].filter(Boolean)
    const expired = []

    for (const tx of txList) {
      if (tx.expires_at && new Date(tx.expires_at) <= beforeDate) {
        const account = await this.retrieveLoyaltyAccount(tx.account_id)
        const pointsToExpire = Math.min(Number(tx.points), Number(account.points_balance))

        if (pointsToExpire > 0) {
          const newBalance = Number(account.points_balance) - pointsToExpire

          await (this as any).updateLoyaltyAccounts({
            id: tx.account_id,
            points_balance: newBalance,
          })

          const expireTx = await (this as any).createPointTransactions({
            account_id: tx.account_id,
            tenant_id: account.tenant_id,
            type: "expire",
            points: -pointsToExpire,
            balance_after: newBalance,
            reference_type: null,
            reference_id: tx.id,
            description: `Points expired from transaction ${tx.id}`,
          })

          expired.push(expireTx)
        }
      }
    }

    return expired
  }

  /** Calculate points earned for an order based on amount and program rules */
  async calculatePoints(programId: string, amount: number): Promise<number> {
    if (amount <= 0) {
      throw new Error("Amount must be greater than zero")
    }

    const program = await this.retrieveLoyaltyProgram(programId)
    const pointsPerUnit = Number((program as any).points_per_currency_unit || 1)
    const multiplier = Number((program as any).multiplier || 1)

    return Math.floor(amount * pointsPerUnit * multiplier)
  }

  async getOrCreateAccount(programId: string, customerId: string, tenantId: string) {
    const existing = await this.listLoyaltyAccounts({
      program_id: programId,
      customer_id: customerId,
    })

    const list = Array.isArray(existing) ? existing : [existing].filter(Boolean)
    if (list.length > 0) {
      return list[0]
    }

    return await (this as any).createLoyaltyAccounts({
      program_id: programId,
      customer_id: customerId,
      tenant_id: tenantId,
      points_balance: 0,
      lifetime_points: 0,
      status: "active",
    })
  }
}

export default LoyaltyModuleService
