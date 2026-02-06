import Stripe from "stripe";
import { MedusaError } from "@medusajs/framework/utils";

export interface StripeConnectConfig {
  secretKey: string;
  clientId: string;
  webhookSecret: string;
}

export interface ConnectAccountData {
  vendor_id: string;
  email: string;
  country: string;
  business_type: "individual" | "company";
  business_name?: string;
}

export interface TransferData {
  amount: number;
  currency: string;
  destination_account: string;
  metadata?: Record<string, string>;
  description?: string;
}

export class StripeConnectService {
  private stripe: Stripe;
  private config: StripeConnectConfig;

  constructor(config: StripeConnectConfig) {
    this.config = config;
    this.stripe = new Stripe(config.secretKey, {
      apiVersion: "2023-10-16",
      typescript: true,
    });
  }

  /**
   * Generate OAuth link for vendor onboarding
   */
  async generateOAuthLink(data: {
    vendor_id: string;
    email: string;
    redirect_uri: string;
  }): Promise<string> {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      state: data.vendor_id, // Use vendor_id as state for verification
      "stripe_user[email]": data.email,
      redirect_uri: data.redirect_uri,
      response_type: "code",
      scope: "read_write",
    });

    return `https://connect.stripe.com/oauth/authorize?${params.toString()}`;
  }

  /**
   * Complete OAuth flow and create connected account
   */
  async completeOAuth(code: string): Promise<{
    stripe_user_id: string;
    access_token: string;
    refresh_token?: string;
  }> {
    try {
      const response = await this.stripe.oauth.token({
        grant_type: "authorization_code",
        code,
      });

      return {
        stripe_user_id: response.stripe_user_id,
        access_token: response.access_token,
        refresh_token: response.refresh_token,
      };
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Stripe OAuth failed: ${error.message}`
      );
    }
  }

  /**
   * Create a connected account (Express account)
   */
  async createConnectedAccount(
    data: ConnectAccountData
  ): Promise<Stripe.Account> {
    try {
      const account = await this.stripe.accounts.create({
        type: "express",
        country: data.country,
        email: data.email,
        business_type: data.business_type,
        metadata: {
          vendor_id: data.vendor_id,
        },
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_profile: data.business_name
          ? { name: data.business_name }
          : undefined,
      });

      return account;
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Failed to create Stripe account: ${error.message}`
      );
    }
  }

  /**
   * Generate account link for onboarding
   */
  async generateAccountLink(
    account_id: string,
    refresh_url: string,
    return_url: string
  ): Promise<Stripe.AccountLink> {
    try {
      return await this.stripe.accountLinks.create({
        account: account_id,
        refresh_url,
        return_url,
        type: "account_onboarding",
      });
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Failed to generate account link: ${error.message}`
      );
    }
  }

  /**
   * Get account details
   */
  async getAccount(account_id: string): Promise<Stripe.Account> {
    try {
      return await this.stripe.accounts.retrieve(account_id);
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Account not found: ${error.message}`
      );
    }
  }

  /**
   * Check if account is fully onboarded
   */
  async isAccountOnboarded(account_id: string): Promise<boolean> {
    const account = await this.getAccount(account_id);
    return (
      account.charges_enabled === true &&
      account.payouts_enabled === true &&
      account.details_submitted === true
    );
  }

  /**
   * Create a transfer to connected account
   */
  async createTransfer(data: TransferData): Promise<Stripe.Transfer> {
    try {
      return await this.stripe.transfers.create({
        amount: Math.round(data.amount), // Stripe expects integer cents
        currency: data.currency,
        destination: data.destination_account,
        description: data.description,
        metadata: data.metadata || {},
      });
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Transfer failed: ${error.message}`
      );
    }
  }

  /**
   * Create a transfer with application fee (platform takes fee from customer)
   */
  async createTransferWithFee(data: {
    amount: number;
    currency: string;
    destination_account: string;
    platform_fee: number;
    payment_intent_id: string;
    metadata?: Record<string, string>;
  }): Promise<Stripe.Transfer> {
    try {
      // Transfer full amount minus platform fee
      const transfer_amount = data.amount - data.platform_fee;

      return await this.stripe.transfers.create({
        amount: Math.round(transfer_amount),
        currency: data.currency,
        destination: data.destination_account,
        source_transaction: data.payment_intent_id,
        metadata: {
          ...data.metadata,
          platform_fee: data.platform_fee.toString(),
        },
      });
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Transfer with fee failed: ${error.message}`
      );
    }
  }

  /**
   * Create a payout to connected account bank
   */
  async createPayout(
    account_id: string,
    amount: number,
    currency: string
  ): Promise<Stripe.Payout> {
    try {
      return await this.stripe.payouts.create(
        {
          amount: Math.round(amount),
          currency,
        },
        {
          stripeAccount: account_id,
        }
      );
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Payout failed: ${error.message}`
      );
    }
  }

  /**
   * Get balance for connected account
   */
  async getBalance(account_id: string): Promise<Stripe.Balance> {
    try {
      return await this.stripe.balance.retrieve({
        stripeAccount: account_id,
      });
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Failed to get balance: ${error.message}`
      );
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(
    payload: string | Buffer,
    signature: string
  ): Stripe.Event {
    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.config.webhookSecret
      );
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Webhook verification failed: ${error.message}`
      );
    }
  }

  /**
   * Deauthorize a connected account
   */
  async deauthorizeAccount(account_id: string): Promise<void> {
    try {
      await this.stripe.oauth.deauthorize({
        client_id: this.config.clientId,
        stripe_user_id: account_id,
      });
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Failed to deauthorize account: ${error.message}`
      );
    }
  }
}
