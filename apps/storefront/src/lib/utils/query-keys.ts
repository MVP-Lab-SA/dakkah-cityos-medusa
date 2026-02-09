import { Query } from "@tanstack/react-query"

const createDomainKeys = (domain: string) => ({
  all: [domain] as const,
  list: (...params: any[]) => [domain, "list", ...params] as const,
  detail: (id: string, ...params: any[]) => [domain, "detail", id, ...params] as const,
  predicate: <TData = unknown, TError = Error>(
    query: Query<TData, TError, TData, readonly unknown[]>,
    excludeKeys?: string[],
  ): boolean => {
    let hasExcludedKeys = false
    if (excludeKeys) {
      hasExcludedKeys = excludeKeys.some(key => query.queryKey?.includes(key))
    }
    return !hasExcludedKeys && query.queryKey?.includes(domain)
  },
})

const createDynamicKey = (domain: string, key: string, ...params: any[]) =>
  [domain, key, ...params] as const

export const queryKeys = {
  cart: {
    ...createDomainKeys("cart"),
    current: (fields?: string) => [...queryKeys.cart.all, fields] as const,
  },

  customer: {
    ...createDomainKeys("customer"),
    current: () => [...queryKeys.customer.all] as const,
    orders: () => createDynamicKey("customer", "orders"),
  },

  products: {
    ...createDomainKeys("products"),
    related: (productId: string, regionId?: string) =>
      createDynamicKey("products", "related", productId, regionId),
    latest: (limit?: number, regionId?: string) =>
      createDynamicKey("products", "latest", limit, regionId),
  },

  orders: {
    ...createDomainKeys("orders"),
  },

  regions: {
    ...createDomainKeys("regions"),
  },

  categories: {
    ...createDomainKeys("categories"),
  },

  payments: {
    ...createDomainKeys("payments"),
    forCart: (cartId: string) => createDynamicKey("payments", "forCart", cartId),
    sessions: (regionId?: string) => createDynamicKey("payments", "sessions", regionId),
    session: (sessionId: string) =>
      createDynamicKey("payments", "session", sessionId),
  },

  shipping: {
    ...createDomainKeys("shipping"),
    forCart: (cartId: string) => createDynamicKey("shipping", "forCart", cartId),
    options: (cartId: string, regionId?: string) =>
      createDynamicKey("shipping", "options", cartId, regionId),
  },

  pages: {
    ...createDomainKeys("pages"),
    bySlug: (slug: string) => createDynamicKey("pages", "bySlug", slug),
  },

  tenants: {
    ...createDomainKeys("tenants"),
    byHandle: (handle: string) => createDynamicKey("tenants", "byHandle", handle),
  },

  vendors: {
    ...createDomainKeys("vendors"),
    byHandle: (handle: string) => createDynamicKey("vendors", "byHandle", handle),
  },

  vendorOrders: {
    ...createDomainKeys("vendor-orders"),
  },

  purchaseOrders: {
    ...createDomainKeys("purchase-orders"),
  },

  commissions: {
    ...createDomainKeys("commissions"),
    summary: () => createDynamicKey("commissions", "summary"),
    transactions: (...params: any[]) => createDynamicKey("commissions", "transactions", ...params),
  },

  payouts: {
    ...createDomainKeys("payouts"),
    summary: () => createDynamicKey("payouts", "summary"),
  },

  invoices: {
    ...createDomainKeys("invoices"),
  },

  volumePricing: {
    ...createDomainKeys("volume-pricing"),
    forProduct: (productId: string) => createDynamicKey("volume-pricing", "product", productId),
  },

  translations: {
    ...createDomainKeys("translations"),
    byLocale: (locale: string) => createDynamicKey("translations", "locale", locale),
    byKey: (locale: string, namespace: string) => createDynamicKey("translations", "key", locale, namespace),
  },

  subscriptions: {
    ...createDomainKeys("subscriptions"),
    plans: () => createDynamicKey("subscriptions", "plans"),
    billingHistory: (id: string) => createDynamicKey("subscriptions", "billing", id),
    events: (id: string) => createDynamicKey("subscriptions", "events", id),
  },

  bookings: {
    ...createDomainKeys("bookings"),
    services: () => createDynamicKey("bookings", "services"),
    availability: (serviceId: string, date: string) => createDynamicKey("bookings", "availability", serviceId, date),
    reminders: (bookingId: string) => createDynamicKey("bookings", "reminders", bookingId),
  },

  approvals: {
    ...createDomainKeys("approvals"),
    workflows: () => createDynamicKey("approvals", "workflows"),
    requests: (...params: any[]) => createDynamicKey("approvals", "requests", ...params),
  },

  taxExemptions: {
    ...createDomainKeys("tax-exemptions"),
  },

  nodes: {
    ...createDomainKeys("nodes"),
    tree: (tenantId: string) => createDynamicKey("nodes", "tree", tenantId),
    children: (tenantId: string, parentId: string) => createDynamicKey("nodes", "children", tenantId, parentId),
    root: (tenantId: string) => createDynamicKey("nodes", "root", tenantId),
  },

  governance: {
    ...createDomainKeys("governance"),
    policies: (tenantId: string) => createDynamicKey("governance", "policies", tenantId),
  },

  personas: {
    ...createDomainKeys("personas"),
  },

  tenantAdmin: {
    ...createDomainKeys("tenant-admin"),
    users: () => createDynamicKey("tenant-admin", "users"),
    settings: () => createDynamicKey("tenant-admin", "settings"),
    billing: () => createDynamicKey("tenant-admin", "billing"),
    usage: (...params: any[]) => createDynamicKey("tenant-admin", "usage", ...params),
    invoices: () => createDynamicKey("tenant-admin", "invoices"),
  },

  auditLogs: {
    ...createDomainKeys("audit-logs"),
  },

  eventOutbox: {
    ...createDomainKeys("event-outbox"),
  },

  channelMappings: {
    ...createDomainKeys("channel-mappings"),
  },

  regionZones: {
    ...createDomainKeys("region-zones"),
  },

  vendorTeam: {
    ...createDomainKeys("vendor-team"),
  },

  vendorAnalytics: {
    ...createDomainKeys("vendor-analytics"),
    snapshots: (...params: any[]) => createDynamicKey("vendor-analytics", "snapshots", ...params),
    performance: () => createDynamicKey("vendor-analytics", "performance"),
  },

  platform: {
    ...createDomainKeys("platform"),
    context: (tenantSlug: string) => createDynamicKey("platform", "context", tenantSlug),
    defaultTenant: () => createDynamicKey("platform", "defaultTenant"),
    capabilities: () => createDynamicKey("platform", "capabilities"),
  },

  cms: {
    ...createDomainKeys("cms"),
    pageByPath: (tenantId: string, path: string, locale?: string) =>
      createDynamicKey("cms", "pageByPath", tenantId, path, locale),
    pageChildren: (tenantId: string, parentId: string) =>
      createDynamicKey("cms", "pageChildren", tenantId, parentId),
    navigation: (tenantId: string, location: string, locale?: string) =>
      createDynamicKey("cms", "navigation", tenantId, location, locale),
    verticals: (tenantId: string) =>
      createDynamicKey("cms", "verticals", tenantId),
    breadcrumbs: (tenantId: string, path: string) =>
      createDynamicKey("cms", "breadcrumbs", tenantId, path),
  },
} as const

export type QueryKeys = typeof queryKeys
