import type { MedusaRequest } from "@medusajs/framework/http"

/**
 * Auth context type
 */
export interface AuthContext {
  actor_id: string
  auth_identity_id: string
  actor_type: string
  app_metadata?: Record<string, unknown>
}

/**
 * Extended request type with custom properties for multi-tenant support
 */
export interface ExtendedRequest extends MedusaRequest {
  auth_context?: AuthContext
  auth?: {
    actor_id: string
    auth_identity_id: string
    actor_type: string
    scope: string
  }
  tenant?: {
    id: string
    name: string
    domain?: string
    settings?: Record<string, unknown>
  }
  store?: {
    id: string
    name: string
    tenant_id: string
    settings?: Record<string, unknown>
  }
}

/**
 * Helper to get auth context from request
 */
export function getAuthContext(req: MedusaRequest): AuthContext | undefined {
  return (req as ExtendedRequest).auth_context
}

/**
 * Helper to get tenant from request
 */
export function getTenant(req: MedusaRequest) {
  return (req as ExtendedRequest).tenant
}

/**
 * Helper to get store from request
 */
export function getStore(req: MedusaRequest) {
  return (req as ExtendedRequest).store
}

/**
 * Module service types for container resolution
 * These use Record<string, unknown> for flexibility with MedusaService methods
 */
export interface QuoteModuleService {
  listQuotes(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<[unknown[], number]>
  retrieveQuote(id: string, config?: Record<string, unknown>): Promise<unknown>
  createQuotes(data: unknown): Promise<unknown>
  updateQuotes(data: unknown): Promise<unknown[]>
  deleteQuotes(ids: string | string[]): Promise<void>
  createQuoteItems(data: unknown): Promise<unknown>
  listQuoteItems(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<[unknown[], number]>
  updateQuoteItems(data: unknown): Promise<unknown[]>
  generateQuoteNumber(): Promise<string>
  calculateQuoteTotals(quoteId: string): Promise<void>
  applyCustomDiscount(quoteId: string, percentage?: number, amount?: bigint, reason?: string): Promise<void>
}

export interface CompanyModuleService {
  listCompanies(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<[unknown[], number]>
  retrieveCompany(id: string, config?: Record<string, unknown>): Promise<unknown>
  createCompanies(data: unknown): Promise<unknown>
  updateCompanies(data: unknown): Promise<unknown[]>
  deleteCompanies(ids: string | string[]): Promise<void>
  listCompanyUsers(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<[unknown[], number]>
  retrieveCompanyUser(id: string, config?: Record<string, unknown>): Promise<unknown>
  createCompanyUsers(data: unknown): Promise<unknown>
  updateCompanyUsers(data: unknown): Promise<unknown[]>
}

export interface VendorModuleService {
  listVendors(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<[unknown[], number]>
  retrieveVendor(id: string, config?: Record<string, unknown>): Promise<unknown>
  createVendors(data: unknown): Promise<unknown>
  updateVendors(data: unknown): Promise<unknown[]>
  deleteVendors(ids: string | string[]): Promise<void>
  listVendorUsers(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<[unknown[], number]>
  createVendorUsers(data: unknown): Promise<unknown>
}

export interface StoreModuleService {
  listStores(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<[unknown[], number]>
  retrieveStore(id: string, config?: Record<string, unknown>): Promise<unknown>
  createStores(data: unknown): Promise<unknown>
  updateStores(data: unknown): Promise<unknown[]>
  deleteStores(ids: string | string[]): Promise<void>
  retrieveStoreBySubdomain(subdomain: string): Promise<unknown>
  retrieveStoreByDomain(domain: string): Promise<unknown>
  listStoresByTenant(tenantId: string, filters?: Record<string, unknown>): Promise<[unknown[], number]>
}

export interface TenantModuleService {
  listTenants(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<[unknown[], number]>
  retrieveTenant(id: string, config?: Record<string, unknown>): Promise<unknown>
  createTenants(data: unknown): Promise<unknown>
  updateTenants(data: unknown): Promise<unknown[]>
  deleteTenants(ids: string | string[]): Promise<void>
}

export interface SubscriptionModuleService {
  listSubscriptions(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<[unknown[], number]>
  retrieveSubscription(id: string, config?: Record<string, unknown>): Promise<unknown>
  createSubscriptions(data: unknown): Promise<unknown>
  updateSubscriptions(data: unknown): Promise<unknown[]>
  deleteSubscriptions(ids: string | string[]): Promise<void>
  listBillingCycles(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<[unknown[], number]>
  createBillingCycles(data: unknown): Promise<unknown>
  updateBillingCycles(data: unknown): Promise<unknown[]>
  createSubscriptionItems(data: unknown): Promise<unknown>
}

export interface CommissionModuleService {
  listCommissionRules(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<[unknown[], number]>
  retrieveCommissionRule(id: string, config?: Record<string, unknown>): Promise<unknown>
  createCommissionRules(data: unknown): Promise<unknown>
  updateCommissionRules(data: unknown): Promise<unknown[]>
  deleteCommissionRules(ids: string | string[]): Promise<void>
  listCommissionTransactions(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<[unknown[], number]>
  createCommissionTransactions(data: unknown): Promise<unknown>
  calculateCommission(data: unknown): Promise<unknown>
  createCommissionTransaction(data: unknown): Promise<unknown>
}

export interface PayoutModuleService {
  listPayouts(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<[unknown[], number]>
  retrievePayout(id: string, config?: Record<string, unknown>): Promise<unknown>
  createPayouts(data: unknown): Promise<unknown>
  updatePayouts(data: unknown): Promise<unknown[]>
  deletePayouts(ids: string | string[]): Promise<void>
  createVendorPayout(data: unknown): Promise<unknown>
  processStripeConnectPayout(payoutId: string): Promise<unknown>
  listPayoutTransactionLinks(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<[unknown[], number]>
  createPayoutTransactionLinks(data: unknown): Promise<unknown>
}

export interface VolumePricingModuleService {
  listVolumePricings(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<[unknown[], number]>
  retrieveVolumePricing(id: string, config?: Record<string, unknown>): Promise<unknown>
  createVolumePricings(data: unknown): Promise<unknown>
  updateVolumePricings(data: unknown): Promise<unknown[]>
  deleteVolumePricings(ids: string | string[]): Promise<void>
  listVolumePricingTiers(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<[unknown[], number]>
  createVolumePricingTiers(data: unknown): Promise<unknown>
  getApplicableTier(data: unknown): Promise<unknown>
  calculatePrice(data: unknown): Promise<unknown>
}
