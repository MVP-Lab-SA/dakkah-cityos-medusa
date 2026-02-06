import type { MedusaRequest as BaseMedusaRequest } from "@medusajs/framework/http"
import type { AuthContext } from "@medusajs/framework/types"

// Module Service Types
export interface QuoteModuleService {
  listQuotes(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<any[]>
  retrieveQuote(id: string, config?: Record<string, unknown>): Promise<any>
  createQuotes(data: any | any[]): Promise<any[]>
  updateQuotes(data: any | any[]): Promise<any[]>
  deleteQuotes(ids: string | string[]): Promise<void>
}

export interface CompanyModuleService {
  listCompanies(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<any[]>
  retrieveCompany(id: string, config?: Record<string, unknown>): Promise<any>
  createCompanies(data: any | any[]): Promise<any[]>
  updateCompanies(data: any | any[]): Promise<any[]>
  deleteCompanies(ids: string | string[]): Promise<void>
  listCompanyUsers(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<any[]>
  createCompanyUsers(data: any | any[]): Promise<any[]>
}

export interface VendorModuleService {
  listVendors(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<any[]>
  retrieveVendor(id: string, config?: Record<string, unknown>): Promise<any>
  createVendors(data: any | any[]): Promise<any[]>
  updateVendors(data: any | any[]): Promise<any[]>
  deleteVendors(ids: string | string[]): Promise<void>
  listVendorUsers(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<any[]>
  createVendorUsers(data: any | any[]): Promise<any[]>
}

export interface StoreModuleService {
  listStores(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<any[]>
  retrieveStore(id: string, config?: Record<string, unknown>): Promise<any>
  createStores(data: any | any[]): Promise<any[]>
  updateStores(data: any | any[]): Promise<any[]>
  deleteStores(ids: string | string[]): Promise<void>
}

export interface TenantModuleService {
  listTenants(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<any[]>
  retrieveTenant(id: string, config?: Record<string, unknown>): Promise<any>
  createTenants(data: any | any[]): Promise<any[]>
  updateTenants(data: any | any[]): Promise<any[]>
  deleteTenants(ids: string | string[]): Promise<void>
}

export interface SubscriptionModuleService {
  listSubscriptions(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<any[]>
  retrieveSubscription(id: string, config?: Record<string, unknown>): Promise<any>
  createSubscriptions(data: any | any[]): Promise<any[]>
  updateSubscriptions(idOrSelector: string | Record<string, unknown>, data: Record<string, unknown>): Promise<any[]>
  deleteSubscriptions(ids: string | string[]): Promise<void>
  listBillingCycles(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<any[]>
  createBillingCycles(data: any | any[]): Promise<any[]>
}

export interface CommissionModuleService {
  listCommissions(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<any[]>
  retrieveCommission(id: string, config?: Record<string, unknown>): Promise<any>
  createCommissions(data: any | any[]): Promise<any[]>
  updateCommissions(data: any | any[]): Promise<any[]>
  deleteCommissions(ids: string | string[]): Promise<void>
}

export interface PayoutModuleService {
  listPayouts(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<any[]>
  retrievePayout(id: string, config?: Record<string, unknown>): Promise<any>
  createPayouts(data: any | any[]): Promise<any[]>
  updatePayouts(data: any | any[]): Promise<any[]>
  deletePayouts(ids: string | string[]): Promise<void>
}

export interface VolumePricingModuleService {
  listVolumePricingRules(filters?: Record<string, unknown>, config?: Record<string, unknown>): Promise<any[]>
  retrieveVolumePricingRule(id: string, config?: Record<string, unknown>): Promise<any>
  createVolumePricingRules(data: any | any[]): Promise<any[]>
  updateVolumePricingRules(data: any | any[]): Promise<any[]>
  deleteVolumePricingRules(ids: string | string[]): Promise<void>
}

// Tenant and Store context types
export interface TenantContext {
  id: string
  name: string
  domain?: string
  settings?: Record<string, unknown>
}

export interface StoreContext {
  id: string
  name: string
  tenant_id: string
  settings?: Record<string, unknown>
}

// Extended Request Type
declare module "@medusajs/framework/http" {
  interface MedusaRequest {
    auth_context?: AuthContext
    tenant?: TenantContext
    store?: StoreContext
  }
}

// Container type augmentation
declare module "@medusajs/framework/types" {
  interface ModuleImplementations {
    quote: QuoteModuleService
    company: CompanyModuleService
    vendor: VendorModuleService
    cityosStore: StoreModuleService
    tenantModuleService: TenantModuleService
    subscription: SubscriptionModuleService
    commission: CommissionModuleService
    payout: PayoutModuleService
    volumePricing: VolumePricingModuleService
  }
}
