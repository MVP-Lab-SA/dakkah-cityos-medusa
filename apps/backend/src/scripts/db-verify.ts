// @ts-nocheck
import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import { createLogger } from "../lib/logger"
const logger = createLogger("scripts:db-verify")

interface VerificationResult {
  name: string
  count: number
  status: "OK" | "WARN" | "ERROR"
  message: string
  details?: string[]
}

interface DuplicateInfo {
  type: string
  items: any[]
  recommendation: string
}

export default async function verifyDatabase({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const results: VerificationResult[] = []
  const duplicates: DuplicateInfo[] = []

  logger.info(`\n${String("=".repeat(60)}`))
  logger.info("DATABASE VERIFICATION SCRIPT")
  logger.info(String("=".repeat(60)) + "\n")

  // ============================================================
  // 1. ADMIN USER
  // ============================================================
  logger.info("[1/13] Checking Admin User...")
  try {
    const { data: adminUsers } = await query.graph({
      entity: "user",
      fields: ["id", "email", "first_name", "last_name"],
      filters: { email: "admin@dakkah.com" },
    })

    if (adminUsers && adminUsers.length > 0) {
      results.push({
        name: "Admin User (admin@dakkah.com)",
        count: 1,
        status: "OK",
        message: "Admin user exists",
        details: [`ID: ${adminUsers[0].id}`, `Name: ${adminUsers[0].first_name} ${adminUsers[0].last_name}`],
      })
    } else {
      results.push({
        name: "Admin User (admin@dakkah.com)",
        count: 0,
        status: "ERROR",
        message: "Admin user not found",
      })
    }
  } catch (error: any) {
    results.push({
      name: "Admin User",
      count: 0,
      status: "ERROR",
      message: `Error checking admin user: ${error.message}`,
    })
  }

  // ============================================================
  // 2. STORE
  // ============================================================
  logger.info("[2/13] Checking Store...")
  try {
    const storeModule = container.resolve(Modules.STORE)
    const stores = await storeModule.listStores()

    if (stores && stores.length > 0) {
      const store = stores[0]
      const sarSupported = store.supported_currencies?.some(
        (c: any) => c.currency_code === "sar" && c.is_default
      )

      results.push({
        name: "Store",
        count: 1,
        status: sarSupported ? "OK" : "WARN",
        message: sarSupported ? "Store configured with SAR as default" : "Store exists but SAR may not be default",
        details: [
          `Store ID: ${store.id}`,
          `Default Currency: ${store.default_currency_code}`,
          `Supported Currencies: ${store.supported_currencies?.map((c: any) => c.currency_code).join(", ")}`,
        ],
      })
    } else {
      results.push({
        name: "Store",
        count: 0,
        status: "ERROR",
        message: "No store found",
      })
    }
  } catch (error: any) {
    results.push({
      name: "Store",
      count: 0,
      status: "ERROR",
      message: `Error checking store: ${error.message}`,
    })
  }

  // ============================================================
  // 3. SALES CHANNELS
  // ============================================================
  logger.info("[3/13] Checking Sales Channels...")
  try {
    const salesChannelModule = container.resolve(Modules.SALES_CHANNEL)
    const allChannels = await salesChannelModule.listSalesChannels()
    const expectedChannels = ["Default Sales Channel", "Web Store", "Mobile App"]
    const foundChannels = (allChannels || []).map((c: any) => c.name)
    const missingChannels = expectedChannels.filter((e) => !foundChannels.includes(e))

    const status = missingChannels.length === 0 ? "OK" : "WARN"
    const message =
      missingChannels.length === 0
        ? `All ${allChannels.length} expected sales channels found`
        : `Missing channels: ${missingChannels.join(", ")}`

    results.push({
      name: "Sales Channels",
      count: allChannels.length || 0,
      status,
      message,
      details: foundChannels.map((name, idx) => `${idx + 1}. ${name}`),
    })
  } catch (error: any) {
    results.push({
      name: "Sales Channels",
      count: 0,
      status: "ERROR",
      message: `Error checking sales channels: ${error.message}`,
    })
  }

  // ============================================================
  // 4. REGIONS
  // ============================================================
  logger.info("[4/13] Checking Regions...")
  try {
    const { data: regions } = await query.graph({
      entity: "region",
      fields: ["id", "name", "currency_code", "countries"],
    })

    const regionList = regions || []
    const expectedRegions = ["MENA", "International"]
    const foundRegionNames = regionList.map((r: any) => r.name)
    const missingRegions = expectedRegions.filter((e) => !foundRegionNames.includes(e))

    const status = regionList.length > 0 ? "OK" : "ERROR"
    const message =
      regionList.length > 0 ? `Found ${regionList.length} region(s)` : "No regions found"

    results.push({
      name: "Regions",
      count: regionList.length,
      status,
      message,
      details: regionList.map((r: any) => `${r.name} (${r.currency_code})`),
    })
  } catch (error: any) {
    results.push({
      name: "Regions",
      count: 0,
      status: "ERROR",
      message: `Error checking regions: ${error.message}`,
    })
  }

  // ============================================================
  // 5. STOCK LOCATIONS
  // ============================================================
  logger.info("[5/13] Checking Stock Locations...")
  try {
    const stockLocationModule = container.resolve(Modules.STOCK_LOCATION)
    const stockLocations = await stockLocationModule.listStockLocations()

    const riyadhWarehouses = (stockLocations || []).filter((sl: any) => sl.name === "Riyadh Warehouse")
    const hasDuplicates = riyadhWarehouses.length > 1

    if (hasDuplicates) {
      duplicates.push({
        type: "Stock Locations (Riyadh Warehouse)",
        items: riyadhWarehouses,
        recommendation: "Keep the first 'Riyadh Warehouse', remove extras",
      })
    }

    results.push({
      name: "Stock Locations",
      count: stockLocations?.length || 0,
      status: hasDuplicates ? "WARN" : "OK",
      message: hasDuplicates ? `Found ${riyadhWarehouses.length} duplicate Riyadh Warehouses` : "Stock locations verified",
      details: (stockLocations || []).map((sl: any) => `${sl.name} (${sl.id})`),
    })
  } catch (error: any) {
    results.push({
      name: "Stock Locations",
      count: 0,
      status: "ERROR",
      message: `Error checking stock locations: ${error.message}`,
    })
  }

  // ============================================================
  // 6. FULFILLMENT SETS & SHIPPING OPTIONS
  // ============================================================
  logger.info("[6/13] Checking Fulfillment & Shipping...")
  try {
    const fulfillmentModule = container.resolve(Modules.FULFILLMENT)
    const fulfillmentSets = await fulfillmentModule.listFulfillmentSets()
    const shippingProfiles = await fulfillmentModule.listShippingProfiles()
    const shippingOptions = await fulfillmentModule.listShippingOptions()

    results.push({
      name: "Fulfillment Sets",
      count: fulfillmentSets?.length || 0,
      status: (fulfillmentSets?.length || 0) > 0 ? "OK" : "WARN",
      message: `${fulfillmentSets?.length || 0} fulfillment set(s) configured`,
    })

    results.push({
      name: "Shipping Profiles",
      count: shippingProfiles?.length || 0,
      status: (shippingProfiles?.length || 0) > 0 ? "OK" : "WARN",
      message: `${shippingProfiles?.length || 0} shipping profile(s) configured`,
    })

    results.push({
      name: "Shipping Options",
      count: shippingOptions?.length || 0,
      status: (shippingOptions?.length || 0) > 0 ? "OK" : "WARN",
      message: `${shippingOptions?.length || 0} shipping option(s) configured`,
      details: (shippingOptions || []).map((so: any) => so.name),
    })
  } catch (error: any) {
    results.push({
      name: "Fulfillment & Shipping",
      count: 0,
      status: "ERROR",
      message: `Error checking fulfillment: ${error.message}`,
    })
  }

  // ============================================================
  // 7. API KEYS
  // ============================================================
  logger.info("[7/13] Checking API Keys...")
  try {
    const { data: apiKeys } = await query.graph({
      entity: "api_key",
      fields: ["id", "token", "title", "type", "created_at"],
      filters: { type: "publishable" },
    })

    const apiKeyList = apiKeys || []
    const storefrontKeys = apiKeyList.filter((k: any) => k.title === "Storefront API Key")
    const hasDuplicateApiKeys = storefrontKeys.length > 1

    if (hasDuplicateApiKeys) {
      duplicates.push({
        type: "API Keys (Storefront API Key)",
        items: storefrontKeys,
        recommendation: "Keep the oldest 'Storefront API Key', remove extras",
      })
    }

    results.push({
      name: "API Keys (Publishable)",
      count: apiKeyList.length,
      status: hasDuplicateApiKeys ? "WARN" : "OK",
      message: hasDuplicateApiKeys ? `Found ${storefrontKeys.length} duplicate Storefront API keys` : "API keys verified",
      details: apiKeyList.slice(0, 5).map((k: any) => `${k.title} (${k.type})`),
    })
  } catch (error: any) {
    results.push({
      name: "API Keys",
      count: 0,
      status: "ERROR",
      message: `Error checking API keys: ${error.message}`,
    })
  }

  // ============================================================
  // 8. PRODUCT CATEGORIES
  // ============================================================
  logger.info("[8/13] Checking Product Categories...")
  try {
    const { data: categories } = await query.graph({
      entity: "product_category",
      fields: ["id", "name", "handle"],
    })

    const categoryList = categories || []

    results.push({
      name: "Product Categories",
      count: categoryList.length,
      status: categoryList.length > 0 ? "OK" : "WARN",
      message: `Found ${categoryList.length} product categories`,
      details: categoryList.slice(0, 5).map((c: any) => `${c.name} (${c.handle})`),
    })
  } catch (error: any) {
    results.push({
      name: "Product Categories",
      count: 0,
      status: "ERROR",
      message: `Error checking categories: ${error.message}`,
    })
  }

  // ============================================================
  // 9. PRODUCTS, VARIANTS & PRICES
  // ============================================================
  logger.info("[9/13] Checking Products...")
  try {
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id", "title", "handle", "variants"],
    })

    const productList = products || []
    let totalVariants = 0
    let totalPrices = 0

    if (productList.length > 0) {
      totalVariants = productList.reduce((sum, p: any) => sum + (p.variants?.length || 0), 0)
    }

    results.push({
      name: "Products",
      count: productList.length,
      status: productList.length > 0 ? "OK" : "WARN",
      message: `Found ${productList.length} product(s) with ${totalVariants} variant(s)`,
      details: productList.slice(0, 3).map((p: any) => `${p.title} (${p.variants?.length || 0} variants)`),
    })
  } catch (error: any) {
    results.push({
      name: "Products",
      count: 0,
      status: "ERROR",
      message: `Error checking products: ${error.message}`,
    })
  }

  // ============================================================
  // 10. TENANT (DAKKAH)
  // ============================================================
  logger.info("[10/13] Checking Tenant...")
  try {
    const tenantService = container.resolve("tenant") as any

    let tenants: any[] = []
    try {
      const result = await tenantService.listTenants({ handle: "dakkah" })
      tenants = Array.isArray(result) ? result : [result].filter(Boolean)
    } catch {
      tenants = []
    }

    results.push({
      name: "Tenant (dakkah)",
      count: tenants.length,
      status: tenants.length > 0 ? "OK" : "WARN",
      message: tenants.length > 0 ? "Dakkah tenant exists" : "Dakkah tenant not found",
      details: tenants.map((t: any) => `${t.name} (${t.handle}) - Status: ${t.status}`),
    })
  } catch (error: any) {
    results.push({
      name: "Tenant (dakkah)",
      count: 0,
      status: "WARN",
      message: `Tenant service may not be available: ${error.message}`,
    })
  }

  // ============================================================
  // 11. NODE HIERARCHY
  // ============================================================
  logger.info("[11/13] Checking Node Hierarchy...")
  try {
    const nodeService = container.resolve("node") as any

    let nodeCount = 0
    let nodes: any[] = []

    try {
      const result = await nodeService.listNodes()
      nodes = Array.isArray(result) ? result : [result].filter(Boolean)
      nodeCount = nodes.length
    } catch {
      nodes = []
      nodeCount = 0
    }

    const nodeTypes = new Set(nodes.map((n: any) => n.type))
    const expectedLevels = 5
    const foundLevels = nodeTypes.size

    results.push({
      name: "Node Hierarchy",
      count: nodeCount,
      status: nodeCount >= expectedLevels ? "OK" : foundLevels > 0 ? "WARN" : "ERROR",
      message: `Found ${nodeCount} node(s) across ${foundLevels} type(s)`,
      details: nodes
        .slice(0, 5)
        .map((n: any) => `${n.type}: ${n.name || n.slug}`),
    })
  } catch (error: any) {
    results.push({
      name: "Node Hierarchy",
      count: 0,
      status: "WARN",
      message: `Node service error: ${error.message}`,
    })
  }

  // ============================================================
  // 12. GOVERNANCE AUTHORITY
  // ============================================================
  logger.info("[12/13] Checking Governance Authority...")
  try {
    const governanceService = container.resolve("governance") as any

    let authorities: any[] = []
    try {
      const result = await governanceService.listGovernanceAuthorities?.({ slug: "sa-mena" })
      authorities = Array.isArray(result) ? result : [result].filter(Boolean)
    } catch {
      try {
        const result = await governanceService.listGovernanceAuthorities?.({ slug: "sa-mena" })
        authorities = Array.isArray(result) ? result : [result].filter(Boolean)
      } catch {
        authorities = []
      }
    }

    results.push({
      name: "Governance Authority",
      count: authorities.length,
      status: authorities.length > 0 ? "OK" : "WARN",
      message: authorities.length > 0 ? "Governance authority exists" : "No governance authority found",
      details: authorities.map((a: any) => `${a.name} (${a.slug})`),
    })
  } catch (error: any) {
    results.push({
      name: "Governance Authority",
      count: 0,
      status: "WARN",
      message: `Governance service may not be available: ${error.message}`,
    })
  }

  // ============================================================
  // 13. CUSTOMERS & VENDORS
  // ============================================================
  logger.info("[13/13] Checking Customers & Vendors...")
  try {
    const { data: customers } = await query.graph({
      entity: "customer",
      fields: ["id", "email", "first_name"],
    })

    const customerList = customers || []

    results.push({
      name: "Customers",
      count: customerList.length,
      status: customerList.length > 0 ? "OK" : "WARN",
      message: `Found ${customerList.length} customer(s)`,
      details: customerList.slice(0, 3).map((c: any) => `${c.first_name || "N/A"} (${c.email})`),
    })
  } catch (error: any) {
    results.push({
      name: "Customers",
      count: 0,
      status: "WARN",
      message: `Error checking customers: ${error.message}`,
    })
  }

  try {
    const vendorService = container.resolve("vendor") as any
    let vendors: any[] = []

    try {
      vendors = await vendorService.listVendors()
    } catch {
      vendors = []
    }

    results.push({
      name: "Vendors",
      count: Array.isArray(vendors) ? vendors.length : 0,
      status: (Array.isArray(vendors) && vendors.length > 0) ? "OK" : "WARN",
      message: Array.isArray(vendors) && vendors.length > 0 ? `Found ${vendors.length} vendor(s)` : "No vendors found",
      details: (Array.isArray(vendors) ? vendors : [])
        .slice(0, 3)
        .map((v: any) => v.name || v.handle || v.id),
    })
  } catch (error: any) {
    results.push({
      name: "Vendors",
      count: 0,
      status: "WARN",
      message: `Vendor service may not be available: ${error.message}`,
    })
  }

  // ============================================================
  // PRINT SUMMARY REPORT
  // ============================================================
  logger.info(`\n${String("=".repeat(60)}`))
  logger.info("VERIFICATION SUMMARY REPORT")
  logger.info(String("=".repeat(60)) + "\n")

  const statusCounts = {
    OK: results.filter((r) => r.status === "OK").length,
    WARN: results.filter((r) => r.status === "WARN").length,
    ERROR: results.filter((r) => r.status === "ERROR").length,
  }

  // Print results table
  results.forEach((result) => {
    const statusSymbol = {
      OK: "✓",
      WARN: "⚠",
      ERROR: "✗",
    }[result.status]

    logger.info(`${statusSymbol} ${result.name.padEnd(30)} | Count: ${String(result.count).padEnd(3)} | ${result.status}`)
    if (result.details && result.details.length > 0) {
      result.details.slice(0, 3).forEach((detail) => {
        logger.info(`  └─ ${detail}`)
      })
      if (result.details.length > 3) {
        logger.info(`  └─ ... and ${result.details.length - 3} more`)
      }
    }
    logger.info("")
  })

  // Print status summary
  logger.info(String("-".repeat(60)))
  logger.error(`Status Summary: ${statusCounts.OK} OK | ${statusCounts.WARN} WARNING(S) | ${statusCounts.ERROR} ERROR(S)`)
  logger.info(String("-".repeat(60)) + "\n")

  // ============================================================
  // DUPLICATES REPORT
  // ============================================================
  if (duplicates.length > 0) {
    logger.info(String("=".repeat(60)))
    logger.info("DUPLICATES FOUND")
    logger.info(String("=".repeat(60)) + "\n")

    duplicates.forEach((dup, idx) => {
      logger.info(`${idx + 1}. ${dup.type}`)
      logger.info(`   Found: ${dup.items.length} duplicate(s)`)
      logger.info(`   Recommendation: ${dup.recommendation}`)
      logger.info("")

      dup.items.forEach((item, itemIdx) => {
        const label = itemIdx === 0 ? "KEEP" : "REMOVE"
        const id = item.id || item.stock_location_id || "unknown"
        const title = item.title || item.name || id
        const createdAt = item.created_at ? new Date(item.created_at).toLocaleString() : "N/A"

        logger.info(`   [${label}] ${title} (ID: ${id})`)
        if (createdAt !== "N/A") {
          logger.info(`         Created: ${createdAt}`)
        }
      })
      logger.info("")
    })

    logger.info(String("=".repeat(60)))
    logger.info("CLEANUP OPERATIONS (Simulation Mode)")
    logger.info(String("=".repeat(60)) + "\n")

    // Simulate cleanup for API Keys
    const apiKeyDups = duplicates.find((d) => d.type.includes("API Keys"))
    if (apiKeyDups) {
      logger.info("API Key Cleanup (Simulation):")
      const sorted = [...apiKeyDups.items].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
      const toKeep = sorted[0]
      const toRemove = sorted.slice(1)

      logger.info(`  Keeping: ${toKeep.title} (ID: ${toKeep.id}, Created: ${new Date(toKeep.created_at).toLocaleString()})`)
      logger.info(`  Removing: ${toRemove.length} duplicate(s)`)

      toRemove.forEach((item) => {
        logger.info(`    // TODO: uncomment to enable cleanup`)
        logger.info(`    // await container.resolve(Modules.API_KEY).deleteApiKeys([${JSON.stringify(item.id)}])`)
      })
      logger.info("")
    }

    // Simulate cleanup for Stock Locations
    const stockLocDups = duplicates.find((d) => d.type.includes("Stock Locations"))
    if (stockLocDups) {
      logger.info("Stock Location Cleanup (Simulation):")
      const toKeep = stockLocDups.items[0]
      const toRemove = stockLocDups.items.slice(1)

      logger.info(`  Keeping: ${toKeep.name} (ID: ${toKeep.id})`)
      logger.info(`  Removing: ${toRemove.length} duplicate(s)`)

      toRemove.forEach((item) => {
        logger.info(`    // TODO: uncomment to enable cleanup`)
        logger.info(`    // const stockLocModule = container.resolve(Modules.STOCK_LOCATION)`)
        logger.info(`    // await stockLocModule.deleteStockLocations([${JSON.stringify(item.id)}])`)
      })
      logger.info("")
    }

    logger.info("To enable cleanup, uncomment the TODO lines above and run this script again.\n")
  } else {
    logger.info(String("=".repeat(60)))
    logger.info("✓ No duplicates found")
    logger.info(String("=".repeat(60)) + "\n")
  }

  // ============================================================
  // FINAL SUMMARY
  // ============================================================
  const hasErrors = statusCounts.ERROR > 0
  const hasWarnings = statusCounts.WARN > 0

  logger.info(String("=".repeat(60)))
  if (hasErrors) {
    logger.error("STATUS: ✗ VERIFICATION FAILED - Errors detected")
  } else if (hasWarnings) {
    logger.info("STATUS: ⚠ VERIFICATION PASSED WITH WARNINGS")
  } else {
    logger.info("STATUS: ✓ VERIFICATION SUCCESSFUL - All checks passed")
  }
  logger.info(String("=".repeat(60)) + "\n")

  logger.info("Database verification complete")
}
