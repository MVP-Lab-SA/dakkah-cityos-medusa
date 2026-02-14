// @ts-nocheck
import { MedusaService } from "@medusajs/framework/utils"

class WalletModuleService extends MedusaService({}) {
  async createWallet(customerId: string, currency: string = "usd"): Promise<any> {
    const existing = await this.listWallets({ customer_id: customerId, currency })
    const list = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (list.length > 0) {
      throw new Error("Wallet already exists for this customer and currency")
    }

    const wallet = await (this as any).createWallets({
      customer_id: customerId,
      currency,
      balance: 0,
      status: "active",
      created_at: new Date(),
    })

    return wallet
  }

  async creditWallet(walletId: string, amount: number, description?: string, referenceId?: string): Promise<any> {
    if (amount <= 0) {
      throw new Error("Credit amount must be greater than zero")
    }

    const wallet = await this.retrieveWallet(walletId)

    if (wallet.status !== "active") {
      throw new Error("Wallet is not active")
    }

    const newBalance = Number(wallet.balance) + amount

    await (this as any).updateWallets({
      id: walletId,
      balance: newBalance,
    })

    const transaction = await (this as any).createWalletTransactions({
      wallet_id: walletId,
      type: "credit",
      amount,
      balance_after: newBalance,
      description: description || null,
      reference_id: referenceId || null,
      created_at: new Date(),
    })

    return transaction
  }

  async debitWallet(walletId: string, amount: number, description?: string, referenceId?: string): Promise<any> {
    if (amount <= 0) {
      throw new Error("Debit amount must be greater than zero")
    }

    const wallet = await this.retrieveWallet(walletId)

    if (wallet.status !== "active") {
      throw new Error("Wallet is not active")
    }

    if (Number(wallet.balance) < amount) {
      throw new Error("Insufficient wallet balance")
    }

    const newBalance = Number(wallet.balance) - amount

    await (this as any).updateWallets({
      id: walletId,
      balance: newBalance,
    })

    const transaction = await (this as any).createWalletTransactions({
      wallet_id: walletId,
      type: "debit",
      amount: -amount,
      balance_after: newBalance,
      description: description || null,
      reference_id: referenceId || null,
      created_at: new Date(),
    })

    return transaction
  }

  async getBalance(walletId: string): Promise<{ balance: number; currency: string; status: string }> {
    const wallet = await this.retrieveWallet(walletId)
    return {
      balance: Number(wallet.balance),
      currency: wallet.currency,
      status: wallet.status,
    }
  }

  async freezeWallet(walletId: string, reason?: string): Promise<any> {
    const wallet = await this.retrieveWallet(walletId)

    if (wallet.status === "frozen") {
      throw new Error("Wallet is already frozen")
    }

    return await (this as any).updateWallets({
      id: walletId,
      status: "frozen",
      freeze_reason: reason || null,
      frozen_at: new Date(),
    })
  }

  async getTransactionHistory(walletId: string, options?: { limit?: number; offset?: number }): Promise<any[]> {
    const transactions = await this.listWalletTransactions(
      { wallet_id: walletId },
      {
        take: options?.limit || 20,
        skip: options?.offset || 0,
        order: { created_at: "DESC" },
      }
    )
    return Array.isArray(transactions) ? transactions : [transactions].filter(Boolean)
  }
}

export default WalletModuleService
