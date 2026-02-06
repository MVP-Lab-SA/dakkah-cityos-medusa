import type { MedusaRequest } from "@medusajs/framework/http"
import type { AuthContext } from "@medusajs/framework/types"

/**
 * Extended request type with custom properties for multi-tenant support
 */
export interface ExtendedRequest extends MedusaRequest {
  auth_context?: AuthContext
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
 */
export interface QuoteModuleService {
  listQuotes(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<any[]>
  listAndCountQuotes(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<[any[], number]>
  retrieveQuote(id: string, config?: Record<string, unknown>): Promise<any>
  createQuotes(data: any): Promise<any>
  updateQuotes(idOrSelector: string | Record<string, unknown>, data: Record<string, unknown>): Promise<any[]>
  deleteQuotes(ids: string | string[]): Promise<void>
  createQuoteItems(data: any): Promise<any>
  generateQuoteNumber(): Promise<string>
  calculateQuoteTotals(quoteId: string): Promise<void>
}

export interface CompanyModuleService {
  listCompanies(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<any[]>
  listAndCountCompanies(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<[any[], number]>
  retrieveCompany(id: string, config?: Record<string, unknown>): Promise<any>
  createCompanies(data: any): Promise<any>
  updateCompanies(idOrSelector: string | Record<string, unknown>, data: Record<string, unknown>): Promise<any[]>
  deleteCompanies(ids: string | string[]): Promise<void>
  listCompanyUsers(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<any[]>
  createCompanyUsers(data: any): Promise<any>
}

export interface VendorModuleService {
  listVendors(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<any[]>
  listAndCountVendors(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<[any[], number]>
  retrieveVendor(id: string, config?: Record<string, unknown>): Promise<any>
  createVendors(data: any): Promise<any>
  updateVendors(idOrSelector: string | Record<string, unknown>, data: Record<string, unknown>): Promise<any[]>
  deleteVendors(ids: string | string[]): Promise<void>
  listVendorUsers(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<any[]>
  createVendorUsers(data: any): Promise<any>
}

export interface StoreModuleService {
  listStores(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<any[]>
  listAndCountStores(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<[any[], number]>
  retrieveStore(id: string, config?: Record<string, unknown>): Promise<any>
  createStores(data: any): Promise<any>
  updateStores(idOrSelector: string | Record<string, unknown>, data: Record<string, unknown>): Promise<any[]>
  deleteStores(ids: string | string[]): Promise<void>
}

export interface TenantModuleService {
  listTenants(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<any[]>
  listAndCountTenants(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<[any[], number]>
  retrieveTenant(id: string, config?: Record<string, unknown>): Promise<any>
  createTenants(data: any): Promise<any>
  updateTenants(idOrSelector: string | Record<string, unknown>, data: Record<string, unknown>): Promise<any[]>
  deleteTenants(ids: string | string[]): Promise<void>
}

export interface SubscriptionModuleService {
  listSubscriptions(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<any[]>
  listAndCountSubscriptions(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<[any[], number]>
  retrieveSubscription(id: string, config?: Record<string, unknown>): Promise<any>
  createSubscriptions(data: any): Promise<any>
  updateSubscriptions(idOrSelector: string | Record<string, unknown>, data: Record<string, unknown>): Promise<any[]>
  deleteSubscriptions(ids: string | string[]): Promise<void>
  listBillingCycles(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<any[]>
  createBillingCycles(data: any): Promise<any>
}

export interface CommissionModuleService {
  listCommissions(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<any[]>
  listAndCountCommissions(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<[any[], number]>
  retrieveCommission(id: string, config?: Record<string, unknown>): Promise<any>
  createCommissions(data: any): Promise<any>
  updateCommissions(idOrSelector: string | Record<string, unknown>, data: Record<string, unknown>): Promise<any[]>
  deleteCommissions(ids: string | string[]): Promise<void>
}

export interface PayoutModuleService {
  listPayouts(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<any[]>
  listAndCountPayouts(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<[any[], number]>
  retrievePayout(id: string, config?: Record<string, unknown>): Promise<any>
  createPayouts(data: any): Promise<any>
  updatePayouts(idOrSelector: string | Record<string, unknown>, data: Record<string, unknown>): Promise<any[]>
  deletePayouts(ids: string | string[]): Promise<void>
}

export interface VolumePricingModuleService {
  listVolumePricingRules(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<any[]>
  retrieveVolumePricingRule(id: string, config?: Record<string, unknown>): Promise<any>
  createVolumePricingRules(data: any): Promise<any>
  updateVolumePricingRules(idOrSelector: string | Record<string, unknown>, data: Record<string, unknown>): Promise<any[]>
  deleteVolumePricingRules(ids: string | string[]): Promise<void>
}
