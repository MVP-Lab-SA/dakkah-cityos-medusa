// @ts-nocheck
import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function seedAllServices({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const TENANT_ID = "dakkah"

  const log = (msg: string) => {
    console.log(msg)
    logger.info(msg)
  }

  const logError = (section: string, err: any) => {
    const msg = `  ❌ ${section} failed: ${err.message}`
    console.log(msg)
    logger.warn(msg)
  }

  const resolveService = (key: string) => {
    try {
      return container.resolve(key) as any
    } catch {
      return null
    }
  }

  log("╔══════════════════════════════════════════════════════════════╗")
  log("║     DAKKAH CITYOS — SEED ALL SERVICES (48+ MODULES)       ║")
  log("╚══════════════════════════════════════════════════════════════╝")
  log("")

  let seededCount = 0
  let skippedCount = 0
  let failedCount = 0

  // ════════════════════════════════════════════════════════════════
  // 1. TENANT MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [1/48] TENANT ━━━")
  try {
    const svc = resolveService("tenant")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listTenants({ slug: "dakkah" })
    const list = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (list.length > 0 && list[0]?.id) {
      log("  ✓ Tenant already exists, skipping")
      skippedCount++
    } else {
      await svc.createTenants({
        name: "Dakkah CityOS",
        slug: "dakkah",
        handle: "dakkah",
        domain: "dakkah.sa",
        residency_zone: "MENA",
        country_id: "sa",
        default_locale: "en",
        supported_locales: ["ar", "en"],
        timezone: "Asia/Riyadh",
        default_currency: "sar",
        date_format: "dd/MM/yyyy",
        status: "active",
        subscription_tier: "enterprise",
        billing_email: "billing@dakkah.sa",
        primary_color: "#1a5f2a",
        accent_color: "#d4af37",
        settings: {
          features: { multi_vendor: true, bookings: true, subscriptions: true, b2b: true },
        },
        metadata: { seeded: true, seeded_at: new Date().toISOString() },
      })

      await svc.createTenants({
        name: "Jeddah Mall Hub",
        slug: "jeddah-hub",
        handle: "jeddah-hub",
        domain: "jeddah-hub.sa",
        residency_zone: "MENA",
        country_id: "sa",
        default_locale: "ar",
        supported_locales: ["ar", "en"],
        timezone: "Asia/Riyadh",
        default_currency: "sar",
        date_format: "dd/MM/yyyy",
        status: "active",
        subscription_tier: "professional",
        billing_email: "admin@jeddah-hub.sa",
        primary_color: "#0066cc",
        accent_color: "#ff9900",
        metadata: { seeded: true },
      })

      await svc.createTenants({
        name: "Dubai Commerce",
        slug: "dubai-commerce",
        handle: "dubai-commerce",
        domain: "dubai-commerce.ae",
        residency_zone: "MENA",
        country_id: "ae",
        default_locale: "en",
        supported_locales: ["ar", "en"],
        timezone: "Asia/Dubai",
        default_currency: "usd",
        date_format: "dd/MM/yyyy",
        status: "active",
        subscription_tier: "basic",
        billing_email: "admin@dubai-commerce.ae",
        primary_color: "#8b0000",
        accent_color: "#ffd700",
        metadata: { seeded: true },
      })
      log("  ✓ Created 3 tenants")
      seededCount++
    }
  } catch (err: any) {
    logError("Tenant", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 2. NODE MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [2/48] NODE ━━━")
  try {
    const svc = resolveService("node")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listNodes({ tenant_id: TENANT_ID })
    const nodeList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (nodeList.length > 0 && nodeList[0]?.id) {
      log("  ✓ Nodes already exist, skipping")
      skippedCount++
    } else {
      const createNode = svc.createNodeWithValidation?.bind(svc) || svc.createNodes?.bind(svc)

      const city = await createNode({
        tenant_id: TENANT_ID,
        name: "Riyadh",
        slug: "riyadh",
        code: "RUH",
        type: "CITY",
        location: { lat: 24.7136, lng: 46.6753 },
        status: "active",
      })

      const district = await createNode({
        tenant_id: TENANT_ID,
        name: "Al Olaya",
        slug: "al-olaya",
        code: "OLY",
        type: "DISTRICT",
        parent_id: city.id,
        location: { lat: 24.6911, lng: 46.6853 },
        status: "active",
      })

      await createNode({
        tenant_id: TENANT_ID,
        name: "King Fahad Business Zone",
        slug: "king-fahad-zone",
        code: "KFZ",
        type: "ZONE",
        parent_id: district.id,
        location: { lat: 24.6900, lng: 46.6850 },
        status: "active",
      })

      const jeddahCity = await createNode({
        tenant_id: TENANT_ID,
        name: "Jeddah",
        slug: "jeddah",
        code: "JED",
        type: "CITY",
        location: { lat: 21.4858, lng: 39.1925 },
        status: "active",
      })

      await createNode({
        tenant_id: TENANT_ID,
        name: "Al Balad",
        slug: "al-balad",
        code: "BLD",
        type: "DISTRICT",
        parent_id: jeddahCity.id,
        location: { lat: 21.4850, lng: 39.1860 },
        status: "active",
      })

      log("  ✓ Created 5 nodes (2 cities, 2 districts, 1 zone)")
      seededCount++
    }
  } catch (err: any) {
    logError("Node", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 3. GOVERNANCE MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [3/48] GOVERNANCE ━━━")
  try {
    const svc = resolveService("governance")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listGovernanceAuthoritys?.() || await svc.listGovernanceAuthorities?.() || []
    const govList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (govList.length > 0 && govList[0]?.id) {
      log("  ✓ Governance authorities already exist, skipping")
      skippedCount++
    } else {
      const create = svc.createGovernanceAuthoritys?.bind(svc) || svc.createGovernanceAuthorities?.bind(svc)

      await create({
        tenant_id: TENANT_ID,
        name: "Saudi Arabia National Authority",
        slug: "sa-national",
        code: "SA-NAT",
        type: "national",
        jurisdiction_level: 1,
        residency_zone: "MENA",
        country_id: "sa",
        policies: {
          commerce: { allow_cross_border: true, require_vat: true, vat_rate: 15, allowed_currencies: ["sar", "usd"] },
          data: { residency_required: true, classification: "confidential" },
        },
        status: "active",
      })

      await create({
        tenant_id: TENANT_ID,
        name: "UAE Federal Authority",
        slug: "ae-federal",
        code: "AE-FED",
        type: "national",
        jurisdiction_level: 1,
        residency_zone: "MENA",
        country_id: "ae",
        policies: {
          commerce: { allow_cross_border: true, require_vat: true, vat_rate: 5, allowed_currencies: ["usd", "aed"] },
        },
        status: "active",
      })

      await create({
        tenant_id: TENANT_ID,
        name: "Riyadh Municipal Authority",
        slug: "riyadh-muni",
        code: "RUH-MUN",
        type: "municipal",
        jurisdiction_level: 3,
        residency_zone: "MENA",
        country_id: "sa",
        policies: {
          licensing: { food_license_required: true, health_inspection_frequency: "quarterly" },
        },
        status: "active",
      })

      log("  ✓ Created 3 governance authorities")
      seededCount++
    }
  } catch (err: any) {
    logError("Governance", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 4. PERSONA MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [4/48] PERSONA ━━━")
  try {
    const svc = resolveService("persona")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listPersonas({ tenant_id: TENANT_ID })
    const pList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (pList.length > 0 && pList[0]?.id) {
      log("  ✓ Personas already exist, skipping")
      skippedCount++
    } else {
      await svc.createPersonas([
        {
          tenant_id: TENANT_ID,
          name: "City Resident",
          slug: "city-resident",
          category: "consumer",
          axes: { lifestyle: "urban", tech_savvy: true, age_range: "25-40" },
          priority: 1,
          status: "active",
        },
        {
          tenant_id: TENANT_ID,
          name: "Business Owner",
          slug: "business-owner",
          category: "business",
          axes: { segment: "sme", focus: "b2b", purchasing_power: "high" },
          priority: 2,
          status: "active",
        },
        {
          tenant_id: TENANT_ID,
          name: "Tourist Visitor",
          slug: "tourist",
          category: "consumer",
          axes: { origin: "international", stay_duration: "short", interests: ["culture", "shopping"] },
          priority: 3,
          status: "active",
        },
        {
          tenant_id: TENANT_ID,
          name: "Government Employee",
          slug: "gov-employee",
          category: "government",
          axes: { sector: "public", clearance: "standard" },
          priority: 4,
          status: "active",
        },
      ])
      log("  ✓ Created 4 personas")
      seededCount++
    }
  } catch (err: any) {
    logError("Persona", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 5. CITYOS STORE MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [5/48] CITYOS STORE ━━━")
  try {
    const svc = resolveService("cityosStore")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listStores({ tenant_id: TENANT_ID })
    const sList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (sList.length > 0 && sList[0]?.id) {
      log("  ✓ CityOS Stores already exist, skipping")
      skippedCount++
    } else {
      await svc.createStores([
        {
          tenant_id: TENANT_ID,
          handle: "dakkah-main",
          name: "Dakkah Main Store",
          store_type: "marketplace",
          status: "active",
          logo_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop",
          theme_config: { primaryColor: "#1a5f2a", accentColor: "#d4af37" },
          seo_title: "Dakkah CityOS — Saudi Arabia's Super App",
          seo_description: "Shop, book, dine, and more on Dakkah CityOS.",
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          handle: "dakkah-food",
          name: "Dakkah Food Hub",
          store_type: "vertical",
          status: "active",
          logo_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=200&fit=crop",
          theme_config: { primaryColor: "#c0392b", accentColor: "#e67e22" },
          metadata: { vertical: "food" },
        },
        {
          tenant_id: TENANT_ID,
          handle: "dakkah-b2b",
          name: "Dakkah Business",
          store_type: "b2b",
          status: "active",
          logo_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop",
          theme_config: { primaryColor: "#2c3e50", accentColor: "#3498db" },
          metadata: { vertical: "b2b" },
        },
      ])
      log("  ✓ Created 3 CityOS stores")
      seededCount++
    }
  } catch (err: any) {
    logError("CityOS Store", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 6. VENDOR MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [6/48] VENDOR ━━━")
  try {
    const svc = resolveService("vendor")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listVendors({ tenant_id: TENANT_ID })
    const vList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (vList.length > 0 && vList[0]?.id) {
      log("  ✓ Vendors already exist, skipping")
      skippedCount++
    } else {
      await svc.createVendors([
        {
          tenant_id: TENANT_ID,
          handle: "al-baik",
          business_name: "Al Baik",
          legal_name: "Al Baik Food Systems Company",
          business_type: "restaurant",
          email: "info@albaik.com",
          phone: "+966112345678",
          address_line1: "King Fahad Road",
          city: "Riyadh",
          postal_code: "11564",
          country_code: "sa",
          status: "active",
          verification_status: "approved",
          commission_type: "percentage",
          commission_rate: 12,
          logo_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop",
          banner_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=300&fit=crop",
          description: "Saudi Arabia's most beloved fast-food chain. Famous for broasted chicken and seafood.",
          total_sales: 2500000,
          total_orders: 15000,
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          handle: "jarir-bookstore",
          business_name: "Jarir Bookstore",
          legal_name: "Jarir Marketing Company",
          business_type: "retailer",
          email: "info@jarir.com",
          phone: "+966114611111",
          address_line1: "Olaya Street",
          city: "Riyadh",
          postal_code: "11321",
          country_code: "sa",
          status: "active",
          verification_status: "approved",
          commission_type: "percentage",
          commission_rate: 8,
          logo_url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop",
          banner_url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=300&fit=crop",
          description: "Leading retailer for electronics, books, and office supplies in Saudi Arabia.",
          total_sales: 5000000,
          total_orders: 25000,
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          handle: "saudi-oud",
          business_name: "Arabian Oud",
          legal_name: "Arabian Oud Company",
          business_type: "brand",
          email: "info@arabianoud.com",
          phone: "+966114780000",
          address_line1: "Tahlia Street",
          city: "Riyadh",
          postal_code: "11452",
          country_code: "sa",
          status: "active",
          verification_status: "approved",
          commission_type: "percentage",
          commission_rate: 10,
          logo_url: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=200&h=200&fit=crop",
          banner_url: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=300&fit=crop",
          description: "World's largest retailer of Arabian oud and perfumes with 900+ stores worldwide.",
          total_sales: 8000000,
          total_orders: 40000,
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          handle: "tamimi-markets",
          business_name: "Tamimi Markets",
          legal_name: "Abdullah Al Othaim Markets Company",
          business_type: "retailer",
          email: "info@tamimimarkets.com",
          phone: "+966112345000",
          address_line1: "Al Malaz District",
          city: "Riyadh",
          postal_code: "11441",
          country_code: "sa",
          status: "active",
          verification_status: "approved",
          commission_type: "percentage",
          commission_rate: 6,
          logo_url: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop",
          banner_url: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=300&fit=crop",
          description: "Premium supermarket chain offering fresh groceries and international products.",
          total_sales: 12000000,
          total_orders: 80000,
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          handle: "camel-fashion",
          business_name: "Camel Fashion House",
          legal_name: "Camel Fashion Trading LLC",
          business_type: "brand",
          email: "info@camelfashion.sa",
          phone: "+966112340000",
          address_line1: "Kingdom Tower",
          city: "Riyadh",
          postal_code: "11564",
          country_code: "sa",
          status: "active",
          verification_status: "approved",
          commission_type: "percentage",
          commission_rate: 15,
          logo_url: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop",
          banner_url: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=300&fit=crop",
          description: "Premium Saudi fashion brand blending traditional thobes with contemporary design.",
          total_sales: 3500000,
          total_orders: 20000,
          metadata: { seeded: true },
        },
      ])
      log("  ✓ Created 5 vendors")
      seededCount++
    }
  } catch (err: any) {
    logError("Vendor", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 7. COMMISSION MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [7/48] COMMISSION ━━━")
  try {
    const svc = resolveService("commission")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listCommissionRules({ tenant_id: TENANT_ID })
    const cList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (cList.length > 0 && cList[0]?.id) {
      log("  ✓ Commission rules already exist, skipping")
      skippedCount++
    } else {
      await svc.createCommissionRules([
        {
          tenant_id: TENANT_ID,
          name: "Standard Marketplace Commission",
          description: "Default commission for all marketplace vendors",
          commission_type: "percentage",
          commission_percentage: 15,
          priority: 1,
          status: "active",
          applies_to: "all_products",
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          name: "Food & Beverage Commission",
          description: "Reduced commission for food vendors",
          commission_type: "percentage",
          commission_percentage: 10,
          priority: 2,
          status: "active",
          applies_to: "category",
          conditions: { category: "food-beverages" },
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          name: "Premium Vendor Rate",
          description: "Discounted rate for high-volume vendors",
          commission_type: "percentage",
          commission_percentage: 8,
          priority: 3,
          status: "active",
          applies_to: "vendor",
          conditions: { min_monthly_sales: 500000 },
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          name: "Electronics Flat Fee",
          description: "Flat fee commission on electronics",
          commission_type: "flat",
          commission_flat_amount: 25,
          priority: 4,
          status: "active",
          applies_to: "category",
          conditions: { category: "electronics" },
          metadata: { seeded: true },
        },
      ])
      log("  ✓ Created 4 commission rules")
      seededCount++
    }
  } catch (err: any) {
    logError("Commission", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 8. PAYOUT MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [8/48] PAYOUT ━━━")
  try {
    const svc = resolveService("payout")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listPayouts({ tenant_id: TENANT_ID })
    const pList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (pList.length > 0 && pList[0]?.id) {
      log("  ✓ Payouts already exist, skipping")
      skippedCount++
    } else {
      await svc.createPayouts([
        {
          tenant_id: TENANT_ID,
          vendor_id: "vendor-albaik",
          payout_number: "PAY-2025-001",
          gross_amount: 125000,
          commission_amount: 15000,
          platform_fee_amount: 500,
          net_amount: 109500,
          period_start: new Date("2025-01-01"),
          period_end: new Date("2025-01-31"),
          transaction_count: 1500,
          status: "completed",
          payment_method: "bank_transfer",
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          vendor_id: "vendor-jarir",
          payout_number: "PAY-2025-002",
          gross_amount: 250000,
          commission_amount: 20000,
          platform_fee_amount: 1000,
          net_amount: 229000,
          period_start: new Date("2025-01-01"),
          period_end: new Date("2025-01-31"),
          transaction_count: 3200,
          status: "pending",
          payment_method: "bank_transfer",
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          vendor_id: "vendor-oud",
          payout_number: "PAY-2025-003",
          gross_amount: 400000,
          commission_amount: 40000,
          platform_fee_amount: 2000,
          net_amount: 358000,
          period_start: new Date("2025-02-01"),
          period_end: new Date("2025-02-28"),
          transaction_count: 5000,
          status: "processing",
          payment_method: "stripe",
          metadata: { seeded: true },
        },
      ])
      log("  ✓ Created 3 payouts")
      seededCount++
    }
  } catch (err: any) {
    logError("Payout", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 9. COMPANY MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [9/48] COMPANY ━━━")
  try {
    const svc = resolveService("company")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listCompanys?.() || await svc.listCompanies?.() || []
    const compList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (compList.length > 0 && compList[0]?.id) {
      log("  ✓ Companies already exist, skipping")
      skippedCount++
    } else {
      const create = svc.createCompanys?.bind(svc) || svc.createCompanies?.bind(svc)
      await create([
        {
          tenant_id: TENANT_ID,
          handle: "aramco-procurement",
          name: "Saudi Aramco Procurement",
          legal_name: "Saudi Arabian Oil Company",
          tax_id: "SA300000001",
          email: "procurement@aramco.com",
          phone: "+966138801111",
          industry: "energy",
          employee_count: 70000,
          annual_revenue: 1000000000,
          credit_limit: 5000000,
          credit_used: 250000,
          payment_terms_days: 60,
          status: "active",
          tier: "enterprise",
          requires_approval: true,
          auto_approve_limit: 50000,
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          handle: "sabic-supplies",
          name: "SABIC Supplies Division",
          legal_name: "Saudi Basic Industries Corporation",
          tax_id: "SA300000002",
          email: "supplies@sabic.com",
          phone: "+966114980000",
          industry: "chemicals",
          employee_count: 33000,
          annual_revenue: 500000000,
          credit_limit: 2000000,
          credit_used: 100000,
          payment_terms_days: 45,
          status: "active",
          tier: "enterprise",
          requires_approval: true,
          auto_approve_limit: 25000,
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          handle: "neom-tech",
          name: "NEOM Technology Division",
          legal_name: "NEOM Company",
          tax_id: "SA300000003",
          email: "tech@neom.com",
          phone: "+966175441234",
          industry: "technology",
          employee_count: 5000,
          annual_revenue: 200000000,
          credit_limit: 3000000,
          credit_used: 50000,
          payment_terms_days: 30,
          status: "active",
          tier: "premium",
          requires_approval: true,
          auto_approve_limit: 10000,
          metadata: { seeded: true },
        },
      ])
      log("  ✓ Created 3 companies")
      seededCount++
    }
  } catch (err: any) {
    logError("Company", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 10. QUOTE MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [10/48] QUOTE ━━━")
  try {
    const svc = resolveService("quote")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listQuotes({ tenant_id: TENANT_ID })
    const qList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (qList.length > 0 && qList[0]?.id) {
      log("  ✓ Quotes already exist, skipping")
      skippedCount++
    } else {
      await svc.createQuotes([
        {
          tenant_id: TENANT_ID,
          quote_number: "QT-2025-0001",
          company_id: "comp-aramco",
          customer_id: "cust-001",
          status: "draft",
          subtotal: 750000,
          total: 862500,
          tax_total: 112500,
          currency_code: "sar",
          valid_from: new Date("2025-03-01"),
          valid_until: new Date("2025-04-01"),
          customer_notes: "Bulk order for office supplies across 15 branches",
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          quote_number: "QT-2025-0002",
          company_id: "comp-sabic",
          customer_id: "cust-002",
          status: "sent",
          subtotal: 1200000,
          total: 1380000,
          tax_total: 180000,
          currency_code: "sar",
          valid_from: new Date("2025-02-15"),
          valid_until: new Date("2025-03-15"),
          customer_notes: "Lab equipment for new R&D facility",
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          quote_number: "QT-2025-0003",
          company_id: "comp-neom",
          customer_id: "cust-003",
          status: "accepted",
          subtotal: 500000,
          total: 575000,
          tax_total: 75000,
          currency_code: "sar",
          valid_from: new Date("2025-01-10"),
          valid_until: new Date("2025-02-10"),
          accepted_at: new Date("2025-01-20"),
          metadata: { seeded: true },
        },
      ])
      log("  ✓ Created 3 quotes")
      seededCount++
    }
  } catch (err: any) {
    logError("Quote", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 11. SUBSCRIPTION MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [11/48] SUBSCRIPTION ━━━")
  try {
    const svc = resolveService("subscription")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listSubscriptionPlans({ tenant_id: TENANT_ID })
    const sList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (sList.length > 0 && sList[0]?.id) {
      log("  ✓ Subscription plans already exist, skipping")
      skippedCount++
    } else {
      await svc.createSubscriptionPlans([
        {
          tenant_id: TENANT_ID,
          name: "Dakkah Basic",
          handle: "dakkah-basic",
          description: "Essential access to Dakkah CityOS services",
          status: "active",
          billing_interval: "monthly",
          billing_interval_count: 1,
          currency_code: "sar",
          price: 4900,
          features: { max_orders: 100, support: "email", analytics: "basic" },
          sort_order: 1,
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          name: "Dakkah Pro",
          handle: "dakkah-pro",
          description: "Professional plan with advanced features and priority support",
          status: "active",
          billing_interval: "monthly",
          billing_interval_count: 1,
          currency_code: "sar",
          price: 14900,
          compare_at_price: 19900,
          features: { max_orders: 1000, support: "priority", analytics: "advanced", api_access: true },
          sort_order: 2,
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          name: "Dakkah Enterprise",
          handle: "dakkah-enterprise",
          description: "Full platform access with white-label capabilities",
          status: "active",
          billing_interval: "yearly",
          billing_interval_count: 1,
          currency_code: "sar",
          price: 149900,
          features: { max_orders: -1, support: "dedicated", analytics: "enterprise", api_access: true, white_label: true },
          sort_order: 3,
          metadata: { seeded: true },
        },
      ])
      log("  ✓ Created 3 subscription plans")
      seededCount++
    }
  } catch (err: any) {
    logError("Subscription", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 12. BOOKING MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [12/48] BOOKING ━━━")
  try {
    const svc = resolveService("booking")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listServiceProducts({ tenant_id: TENANT_ID })
    const bList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (bList.length > 0 && bList[0]?.id) {
      log("  ✓ Service products already exist, skipping")
      skippedCount++
    } else {
      await svc.createServiceProducts([
        {
          tenant_id: TENANT_ID,
          product_id: "prod-spa-001",
          service_type: "appointment",
          duration_minutes: 60,
          buffer_before_minutes: 10,
          buffer_after_minutes: 10,
          max_capacity: 1,
          min_advance_booking_hours: 24,
          max_advance_booking_days: 30,
          cancellation_policy_hours: 12,
          location_type: "on_site",
          pricing_type: "fixed",
          is_active: true,
          metadata: { name: "Premium Hammam Spa Experience", price: 45000 },
        },
        {
          tenant_id: TENANT_ID,
          product_id: "prod-consult-001",
          service_type: "consultation",
          duration_minutes: 30,
          buffer_before_minutes: 5,
          buffer_after_minutes: 5,
          max_capacity: 1,
          min_advance_booking_hours: 2,
          max_advance_booking_days: 14,
          cancellation_policy_hours: 4,
          location_type: "virtual",
          virtual_meeting_provider: "zoom",
          pricing_type: "fixed",
          is_active: true,
          metadata: { name: "Business Strategy Consultation", price: 75000 },
        },
        {
          tenant_id: TENANT_ID,
          product_id: "prod-class-001",
          service_type: "class",
          duration_minutes: 90,
          max_capacity: 20,
          min_capacity: 5,
          min_advance_booking_hours: 48,
          max_advance_booking_days: 60,
          cancellation_policy_hours: 24,
          location_type: "on_site",
          pricing_type: "fixed",
          is_active: true,
          metadata: { name: "Arabic Calligraphy Workshop", price: 15000 },
        },
        {
          tenant_id: TENANT_ID,
          product_id: "prod-photo-001",
          service_type: "appointment",
          duration_minutes: 120,
          buffer_before_minutes: 15,
          buffer_after_minutes: 15,
          max_capacity: 1,
          min_advance_booking_hours: 48,
          max_advance_booking_days: 90,
          cancellation_policy_hours: 48,
          location_type: "on_site",
          pricing_type: "fixed",
          is_active: true,
          metadata: { name: "Desert Safari Photography Session", price: 85000 },
        },
      ])
      log("  ✓ Created 4 service products")
      seededCount++
    }
  } catch (err: any) {
    logError("Booking", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 13. REVIEW MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [13/48] REVIEW ━━━")
  try {
    const svc = resolveService("review")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listReviews()
    const rList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (rList.length > 0 && rList[0]?.id) {
      log("  ✓ Reviews already exist, skipping")
      skippedCount++
    } else {
      await svc.createReviews([
        {
          rating: 5,
          title: "Best broasted chicken in Saudi!",
          content: "Al Baik never disappoints. The chicken is always crispy, juicy, and perfectly seasoned. Been a loyal customer for years.",
          customer_id: "cust-review-001",
          customer_name: "Mohammed Al-Rashid",
          customer_email: "m.rashid@email.com",
          product_id: "prod-001",
          vendor_id: "vendor-albaik",
          is_verified_purchase: true,
          is_approved: true,
          helpful_count: 42,
          images: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop"],
        },
        {
          rating: 4,
          title: "Great electronics selection",
          content: "Jarir has the best selection of laptops and tablets. Prices are competitive and staff is knowledgeable.",
          customer_id: "cust-review-002",
          customer_name: "Fatima Al-Saud",
          customer_email: "f.saud@email.com",
          product_id: "prod-002",
          vendor_id: "vendor-jarir",
          is_verified_purchase: true,
          is_approved: true,
          helpful_count: 28,
        },
        {
          rating: 5,
          title: "Authentic Arabian Oud – Exquisite!",
          content: "The Oud collection is magnificent. The Khamria blend is heavenly – lasts all day and gets compliments everywhere.",
          customer_id: "cust-review-003",
          customer_name: "Sara Al-Otaibi",
          customer_email: "s.otaibi@email.com",
          product_id: "prod-003",
          vendor_id: "vendor-oud",
          is_verified_purchase: true,
          is_approved: true,
          helpful_count: 56,
          images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop"],
        },
        {
          rating: 3,
          title: "Good quality but delivery was slow",
          content: "The thobe quality is excellent and the fit is perfect. However, delivery took 5 days instead of the promised 2.",
          customer_id: "cust-review-004",
          customer_name: "Ahmed Al-Harbi",
          customer_email: "a.harbi@email.com",
          product_id: "prod-004",
          vendor_id: "vendor-camel",
          is_verified_purchase: true,
          is_approved: true,
          helpful_count: 15,
        },
        {
          rating: 5,
          title: "Fresh organic produce, amazing quality",
          content: "Tamimi Markets has the freshest organic fruits and vegetables. Their Saudi dates during Ramadan are the best.",
          customer_id: "cust-review-005",
          customer_name: "Nora Al-Qahtani",
          customer_email: "n.qahtani@email.com",
          product_id: "prod-005",
          vendor_id: "vendor-tamimi",
          is_verified_purchase: true,
          is_approved: true,
          helpful_count: 34,
          images: ["https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop"],
        },
      ])
      log("  ✓ Created 5 reviews")
      seededCount++
    }
  } catch (err: any) {
    logError("Review", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 14. INVOICE MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [14/48] INVOICE ━━━")
  try {
    const svc = resolveService("invoice")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listInvoices({ tenant_id: TENANT_ID })
    const iList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (iList.length > 0 && iList[0]?.id) {
      log("  ✓ Invoices already exist, skipping")
      skippedCount++
    } else {
      await svc.createInvoices([
        {
          invoice_number: "INV-2025-00001",
          company_id: "comp-aramco",
          customer_id: "cust-b2b-001",
          status: "paid",
          issue_date: new Date("2025-01-15"),
          due_date: new Date("2025-03-15"),
          paid_at: new Date("2025-02-10"),
          subtotal: 750000,
          tax_total: 112500,
          total: 862500,
          amount_paid: 862500,
          amount_due: 0,
          currency_code: "sar",
          payment_terms: "Net 60",
          payment_terms_days: 60,
          metadata: { seeded: true },
        },
        {
          invoice_number: "INV-2025-00002",
          company_id: "comp-sabic",
          customer_id: "cust-b2b-002",
          status: "sent",
          issue_date: new Date("2025-02-01"),
          due_date: new Date("2025-03-15"),
          subtotal: 1200000,
          tax_total: 180000,
          total: 1380000,
          amount_paid: 0,
          amount_due: 1380000,
          currency_code: "sar",
          payment_terms: "Net 45",
          payment_terms_days: 45,
          metadata: { seeded: true },
        },
        {
          invoice_number: "INV-2025-00003",
          company_id: "comp-neom",
          customer_id: "cust-b2b-003",
          status: "draft",
          issue_date: new Date("2025-03-01"),
          due_date: new Date("2025-03-31"),
          subtotal: 500000,
          tax_total: 75000,
          total: 575000,
          amount_paid: 0,
          amount_due: 575000,
          currency_code: "sar",
          payment_terms: "Net 30",
          payment_terms_days: 30,
          metadata: { seeded: true },
        },
      ])
      log("  ✓ Created 3 invoices")
      seededCount++
    }
  } catch (err: any) {
    logError("Invoice", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 15. VOLUME PRICING MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [15/48] VOLUME PRICING ━━━")
  try {
    const svc = resolveService("volumePricing")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listVolumePricings({ tenant_id: TENANT_ID })
    const vpList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (vpList.length > 0 && vpList[0]?.id) {
      log("  ✓ Volume pricing already exists, skipping")
      skippedCount++
    } else {
      await svc.createVolumePricings([
        {
          tenant_id: TENANT_ID,
          name: "Bulk Electronics Discount",
          description: "Tiered pricing for bulk electronics purchases",
          applies_to: "category",
          target_id: "cat-electronics",
          pricing_type: "tiered",
          priority: 1,
          status: "active",
          starts_at: new Date("2025-01-01"),
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          name: "Enterprise Office Supplies",
          description: "Volume discount for enterprise office supply orders",
          applies_to: "category",
          target_id: "cat-office",
          pricing_type: "volume",
          priority: 2,
          status: "active",
          starts_at: new Date("2025-01-01"),
          metadata: { seeded: true },
        },
      ])
      log("  ✓ Created 2 volume pricing rules")
      seededCount++
    }
  } catch (err: any) {
    logError("Volume Pricing", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 16. RESTAURANT MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [16/48] RESTAURANT ━━━")
  try {
    const svc = resolveService("restaurant")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listRestaurants({ tenant_id: TENANT_ID })
    const rList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (rList.length > 0 && rList[0]?.id) {
      log("  ✓ Restaurants already exist, skipping")
      skippedCount++
    } else {
      const restaurants = await svc.createRestaurants([
        {
          tenant_id: TENANT_ID,
          name: "Al Najdiyah Village",
          handle: "al-najdiyah",
          description: "Traditional Najdi cuisine in a beautifully restored heritage building in the heart of Riyadh.",
          cuisine_types: ["traditional_saudi", "najdi", "arabic"],
          address_line1: "Al Imam Turki Ibn Abdullah St",
          city: "Riyadh",
          postal_code: "12634",
          country_code: "sa",
          latitude: 24.6313,
          longitude: 46.7133,
          phone: "+966112345601",
          email: "info@alnajdiyah.sa",
          operating_hours: { mon: "12:00-23:00", tue: "12:00-23:00", wed: "12:00-23:00", thu: "12:00-00:00", fri: "13:00-00:00", sat: "12:00-00:00", sun: "12:00-23:00" },
          is_active: true,
          is_accepting_orders: true,
          avg_prep_time_minutes: 25,
          delivery_radius_km: 15,
          min_order_amount: 5000,
          delivery_fee: 1500,
          rating: 4.7,
          total_reviews: 2340,
          logo_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop",
          banner_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop",
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          name: "Mama Noura",
          handle: "mama-noura",
          description: "Famous Saudi shawarma and grills restaurant chain, beloved across the Kingdom for decades.",
          cuisine_types: ["shawarma", "grills", "arabic"],
          address_line1: "Olaya Street",
          city: "Riyadh",
          postal_code: "11564",
          country_code: "sa",
          latitude: 24.6911,
          longitude: 46.6853,
          phone: "+966112345602",
          email: "info@mamanoura.sa",
          operating_hours: { mon: "10:00-02:00", tue: "10:00-02:00", wed: "10:00-02:00", thu: "10:00-03:00", fri: "13:00-03:00", sat: "10:00-03:00", sun: "10:00-02:00" },
          is_active: true,
          is_accepting_orders: true,
          avg_prep_time_minutes: 15,
          delivery_radius_km: 20,
          min_order_amount: 3000,
          delivery_fee: 1000,
          rating: 4.5,
          total_reviews: 8900,
          logo_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=200&fit=crop",
          banner_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=400&fit=crop",
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          name: "The Globe",
          handle: "the-globe",
          description: "Fine dining at the iconic Al Faisaliah Tower with panoramic views of Riyadh skyline.",
          cuisine_types: ["international", "fine_dining", "fusion"],
          address_line1: "Al Faisaliah Tower, King Fahad Road",
          city: "Riyadh",
          postal_code: "11564",
          country_code: "sa",
          latitude: 24.6903,
          longitude: 46.6855,
          phone: "+966112345603",
          email: "reservations@theglobe.sa",
          operating_hours: { mon: "18:00-00:00", tue: "18:00-00:00", wed: "18:00-00:00", thu: "18:00-01:00", fri: "19:00-01:00", sat: "18:00-01:00", sun: "18:00-00:00" },
          is_active: true,
          is_accepting_orders: false,
          avg_prep_time_minutes: 45,
          rating: 4.9,
          total_reviews: 1200,
          logo_url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=200&fit=crop",
          banner_url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=400&fit=crop",
          metadata: { seeded: true },
        },
      ])

      const restArr = Array.isArray(restaurants) ? restaurants : [restaurants]
      if (restArr[0]?.id) {
        await svc.createMenus([
          { tenant_id: TENANT_ID, restaurant_id: restArr[0].id, name: "Main Menu", menu_type: "regular", is_active: true, display_order: 1 },
          { tenant_id: TENANT_ID, restaurant_id: restArr[0].id, name: "Breakfast Menu", menu_type: "breakfast", is_active: true, display_order: 2 },
        ])

        await svc.createMenuItems([
          { tenant_id: TENANT_ID, menu_id: "menu-001", name: "Kabsa", description: "Traditional Saudi rice dish with tender lamb, aromatic spices, and saffron", price: 6500, currency_code: "sar", category: "mains", is_available: true, is_featured: true, calories: 850, dietary_tags: ["halal"], prep_time_minutes: 20, image_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop" },
          { tenant_id: TENANT_ID, menu_id: "menu-001", name: "Jareesh", description: "Crushed wheat cooked slowly with lamb and traditional spices", price: 5500, currency_code: "sar", category: "mains", is_available: true, calories: 650, dietary_tags: ["halal"], prep_time_minutes: 15, image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop" },
          { tenant_id: TENANT_ID, menu_id: "menu-001", name: "Saudi Coffee (Qahwa)", description: "Traditional Saudi coffee with cardamom, served with dates", price: 1500, currency_code: "sar", category: "beverages", is_available: true, is_featured: true, calories: 10, dietary_tags: ["halal", "vegan"], prep_time_minutes: 5, image_url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop" },
          { tenant_id: TENANT_ID, menu_id: "menu-001", name: "Luqaimat", description: "Sweet dumpling balls drizzled with date syrup and sesame seeds", price: 2500, currency_code: "sar", category: "desserts", is_available: true, calories: 350, dietary_tags: ["halal", "vegetarian"], prep_time_minutes: 10 },
        ])
      }

      log("  ✓ Created 3 restaurants with menus and items")
      seededCount++
    }
  } catch (err: any) {
    logError("Restaurant", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 17. HEALTHCARE MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [17/48] HEALTHCARE ━━━")
  try {
    const svc = resolveService("healthcare")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listPractitioners({ tenant_id: TENANT_ID })
    const hList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (hList.length > 0 && hList[0]?.id) {
      log("  ✓ Practitioners already exist, skipping")
      skippedCount++
    } else {
      await svc.createPractitioners([
        {
          tenant_id: TENANT_ID,
          name: "Dr. Khalid Al-Farsi",
          title: "Consultant Cardiologist",
          specialization: "Cardiology",
          license_number: "SA-MED-2015-4521",
          license_verified: true,
          bio: "Board-certified cardiologist with 15 years experience. Fellowship from King Faisal Specialist Hospital.",
          experience_years: 15,
          languages: ["ar", "en"],
          consultation_fee: 50000,
          currency_code: "sar",
          consultation_duration_minutes: 30,
          is_accepting_patients: true,
          rating: 4.8,
          total_reviews: 320,
          photo_url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop",
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          name: "Dr. Layla Al-Ghamdi",
          title: "Dermatologist",
          specialization: "Dermatology",
          license_number: "SA-MED-2018-7832",
          license_verified: true,
          bio: "Specialist in cosmetic dermatology and skin care. Published researcher in desert-climate skin conditions.",
          experience_years: 8,
          languages: ["ar", "en", "fr"],
          consultation_fee: 35000,
          currency_code: "sar",
          consultation_duration_minutes: 20,
          is_accepting_patients: true,
          rating: 4.9,
          total_reviews: 450,
          photo_url: "https://images.unsplash.com/photo-1594824476967-48c8b964d31e?w=200&h=200&fit=crop",
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          name: "Dr. Omar Al-Zahrani",
          title: "Pediatrician",
          specialization: "Pediatrics",
          license_number: "SA-MED-2012-3210",
          license_verified: true,
          bio: "Children's health specialist with focus on newborn care and childhood development. Trained at Johns Hopkins.",
          experience_years: 12,
          languages: ["ar", "en"],
          consultation_fee: 30000,
          currency_code: "sar",
          consultation_duration_minutes: 30,
          is_accepting_patients: true,
          rating: 4.7,
          total_reviews: 580,
          photo_url: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop",
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          name: "Dr. Rania Al-Masri",
          title: "Psychiatrist",
          specialization: "Psychiatry",
          license_number: "SA-MED-2016-5543",
          license_verified: true,
          bio: "Mental health specialist focused on anxiety, depression, and stress management. Available for virtual consultations.",
          experience_years: 10,
          languages: ["ar", "en"],
          consultation_fee: 40000,
          currency_code: "sar",
          consultation_duration_minutes: 45,
          is_accepting_patients: true,
          rating: 4.6,
          total_reviews: 210,
          photo_url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop",
          metadata: { seeded: true },
        },
      ])
      log("  ✓ Created 4 practitioners")
      seededCount++
    }
  } catch (err: any) {
    logError("Healthcare", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 18. EDUCATION MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [18/48] EDUCATION ━━━")
  try {
    const svc = resolveService("education")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listCourses({ tenant_id: TENANT_ID })
    const eList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (eList.length > 0 && eList[0]?.id) {
      log("  ✓ Courses already exist, skipping")
      skippedCount++
    } else {
      await svc.createCourses([
        {
          tenant_id: TENANT_ID,
          title: "Arabic Calligraphy Masterclass",
          description: "Learn the art of Arabic calligraphy from Naskh to Thuluth scripts. Perfect for beginners and intermediate learners.",
          short_description: "Master the beautiful art of Arabic calligraphy",
          category: "arts",
          level: "beginner",
          format: "hybrid",
          language: "ar",
          price: 49900,
          currency_code: "sar",
          duration_hours: 24,
          total_lessons: 12,
          total_enrollments: 340,
          avg_rating: 4.8,
          total_reviews: 120,
          thumbnail_url: "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=400&h=300&fit=crop",
          status: "published",
          certificate_offered: true,
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          title: "Vision 2030 Business Strategy",
          description: "Comprehensive course on aligning business strategy with Saudi Vision 2030 objectives. Covers key sectors and opportunities.",
          short_description: "Strategic business alignment with Saudi Vision 2030",
          category: "business",
          level: "advanced",
          format: "live",
          language: "en",
          price: 149900,
          currency_code: "sar",
          duration_hours: 40,
          total_lessons: 20,
          total_enrollments: 890,
          avg_rating: 4.9,
          total_reviews: 280,
          thumbnail_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
          status: "published",
          certificate_offered: true,
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          title: "Full-Stack Development in Arabic",
          description: "Complete web development course taught in Arabic. From HTML/CSS to React and Node.js. Build real-world projects.",
          short_description: "Learn full-stack development, entirely in Arabic",
          category: "technology",
          level: "beginner",
          format: "self_paced",
          language: "ar",
          price: 79900,
          currency_code: "sar",
          duration_hours: 120,
          total_lessons: 60,
          total_enrollments: 2100,
          avg_rating: 4.7,
          total_reviews: 650,
          thumbnail_url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop",
          status: "published",
          certificate_offered: true,
          is_free: false,
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          title: "Traditional Saudi Cuisine Cooking",
          description: "Master the art of Saudi cooking. Learn to prepare Kabsa, Mandi, Jareesh, and other traditional dishes.",
          short_description: "Cook authentic Saudi dishes like a pro",
          category: "lifestyle",
          level: "all_levels",
          format: "hybrid",
          language: "ar",
          price: 29900,
          currency_code: "sar",
          duration_hours: 16,
          total_lessons: 8,
          total_enrollments: 560,
          avg_rating: 4.6,
          total_reviews: 190,
          thumbnail_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
          status: "published",
          certificate_offered: false,
          metadata: { seeded: true },
        },
      ])
      log("  ✓ Created 4 courses")
      seededCount++
    }
  } catch (err: any) {
    logError("Education", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 19. FITNESS MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [19/48] FITNESS ━━━")
  try {
    const svc = resolveService("fitness")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listTrainerProfiles({ tenant_id: TENANT_ID })
    const fList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (fList.length > 0 && fList[0]?.id) {
      log("  ✓ Trainer profiles already exist, skipping")
      skippedCount++
    } else {
      await svc.createTrainerProfiles([
        {
          tenant_id: TENANT_ID,
          name: "Fahad Al-Mutairi",
          specializations: ["strength_training", "crossfit", "olympic_lifting"],
          certifications: ["NSCA-CPT", "CrossFit Level 2"],
          bio: "Former Saudi national powerlifting champion. Specializes in strength and conditioning programs.",
          experience_years: 10,
          hourly_rate: 30000,
          currency_code: "sar",
          is_accepting_clients: true,
          rating: 4.9,
          total_sessions: 2500,
          photo_url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop",
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          name: "Hessa Al-Dosari",
          specializations: ["yoga", "pilates", "meditation"],
          certifications: ["RYT-500", "Pilates Certification"],
          bio: "Certified yoga instructor specializing in mindfulness and flexibility. Conducts classes in both Arabic and English.",
          experience_years: 7,
          hourly_rate: 25000,
          currency_code: "sar",
          is_accepting_clients: true,
          rating: 4.8,
          total_sessions: 1800,
          photo_url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=200&fit=crop",
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          name: "Turki Al-Shehri",
          specializations: ["boxing", "mma", "kickboxing"],
          certifications: ["ISSA-CPT", "Boxing Coach Level 3"],
          bio: "Professional boxing coach and former competitive fighter. Trains athletes and fitness enthusiasts.",
          experience_years: 12,
          hourly_rate: 35000,
          currency_code: "sar",
          is_accepting_clients: true,
          rating: 4.7,
          total_sessions: 3200,
          photo_url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop",
          metadata: { seeded: true },
        },
      ])
      log("  ✓ Created 3 trainer profiles")
      seededCount++
    }
  } catch (err: any) {
    logError("Fitness", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 20. GROCERY MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [20/48] GROCERY ━━━")
  try {
    const svc = resolveService("grocery")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listFreshProducts({ tenant_id: TENANT_ID })
    const gList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (gList.length > 0 && gList[0]?.id) {
      log("  ✓ Fresh products already exist, skipping")
      skippedCount++
    } else {
      await svc.createFreshProducts([
        { tenant_id: TENANT_ID, product_id: "prod-dates-001", storage_type: "ambient", shelf_life_days: 180, origin_country: "sa", organic: true, unit_type: "kg", min_order_quantity: 1, is_seasonal: true, season_start: "August", season_end: "October", metadata: { name: "Ajwa Dates – Madinah Premium", seeded: true } },
        { tenant_id: TENANT_ID, product_id: "prod-lamb-001", storage_type: "chilled", shelf_life_days: 5, optimal_temp_min: 0, optimal_temp_max: 4, origin_country: "sa", organic: false, unit_type: "kg", min_order_quantity: 1, metadata: { name: "Saudi Lamb – Fresh Cut", seeded: true } },
        { tenant_id: TENANT_ID, product_id: "prod-camel-milk", storage_type: "chilled", shelf_life_days: 7, optimal_temp_min: 2, optimal_temp_max: 6, origin_country: "sa", organic: true, unit_type: "liter", min_order_quantity: 1, metadata: { name: "Camel Milk – Farm Fresh", seeded: true } },
        { tenant_id: TENANT_ID, product_id: "prod-saffron-001", storage_type: "ambient", shelf_life_days: 365, origin_country: "ir", organic: true, unit_type: "gram", min_order_quantity: 1, metadata: { name: "Iranian Saffron – Grade 1", seeded: true } },
        { tenant_id: TENANT_ID, product_id: "prod-arabic-bread", storage_type: "ambient", shelf_life_days: 3, origin_country: "sa", organic: false, unit_type: "pack", min_order_quantity: 1, metadata: { name: "Khubz – Arabic Flatbread", seeded: true } },
      ])
      log("  ✓ Created 5 fresh products")
      seededCount++
    }
  } catch (err: any) {
    logError("Grocery", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 21. AUCTION MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [21/48] AUCTION ━━━")
  try {
    const svc = resolveService("auction")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listAuctionListings({ tenant_id: TENANT_ID })
    const aList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (aList.length > 0 && aList[0]?.id) {
      log("  ✓ Auction listings already exist, skipping")
      skippedCount++
    } else {
      await svc.createAuctionListings([
        {
          tenant_id: TENANT_ID, product_id: "prod-auction-001", title: "Antique Saudi Dagger (Janbiya) – 18th Century",
          description: "Rare antique Janbiya with silver handle and ornate sheath. Authenticated by the Saudi Heritage Authority.",
          auction_type: "english", status: "active", starting_price: 50000, reserve_price: 200000,
          current_price: 125000, currency_code: "sar", bid_increment: 5000,
          starts_at: new Date("2025-03-01T10:00:00Z"), ends_at: new Date("2025-03-15T22:00:00Z"),
          auto_extend: true, extend_minutes: 5, total_bids: 24,
          metadata: { seeded: true, image_url: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop" },
        },
        {
          tenant_id: TENANT_ID, product_id: "prod-auction-002", title: "Vintage Land Cruiser FJ40 – 1978 Restored",
          description: "Fully restored 1978 Toyota Land Cruiser FJ40. Desert tan with original interior. Only 45,000 km.",
          auction_type: "english", status: "active", starting_price: 150000, reserve_price: 350000,
          buy_now_price: 500000, current_price: 280000, currency_code: "sar", bid_increment: 10000,
          starts_at: new Date("2025-03-05T10:00:00Z"), ends_at: new Date("2025-03-20T22:00:00Z"),
          auto_extend: true, extend_minutes: 10, total_bids: 15,
          metadata: { seeded: true, image_url: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=300&fit=crop" },
        },
        {
          tenant_id: TENANT_ID, product_id: "prod-auction-003", title: "Rare Arabian Horse – Purebred Stallion",
          description: "Championship bloodline Arabian stallion. 5 years old, trained and competition-ready.",
          auction_type: "sealed", status: "scheduled", starting_price: 500000,
          reserve_price: 1500000, currency_code: "sar", bid_increment: 50000,
          starts_at: new Date("2025-04-01T10:00:00Z"), ends_at: new Date("2025-04-07T22:00:00Z"),
          auto_extend: false, total_bids: 0,
          metadata: { seeded: true },
        },
      ])
      log("  ✓ Created 3 auction listings")
      seededCount++
    }
  } catch (err: any) {
    logError("Auction", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 22. RENTAL MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [22/48] RENTAL ━━━")
  try {
    const svc = resolveService("rental")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listRentalProducts({ tenant_id: TENANT_ID })
    const rnList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (rnList.length > 0 && rnList[0]?.id) {
      log("  ✓ Rental products already exist, skipping")
      skippedCount++
    } else {
      await svc.createRentalProducts([
        { tenant_id: TENANT_ID, product_id: "prod-rental-001", rental_type: "daily", base_price: 75000, currency_code: "sar", deposit_amount: 200000, late_fee_per_day: 15000, min_duration: 1, max_duration: 30, is_available: true, condition_on_listing: "new", metadata: { name: "Toyota Land Cruiser 2024", seeded: true } },
        { tenant_id: TENANT_ID, product_id: "prod-rental-002", rental_type: "daily", base_price: 120000, currency_code: "sar", deposit_amount: 500000, late_fee_per_day: 25000, min_duration: 1, max_duration: 14, is_available: true, condition_on_listing: "new", metadata: { name: "Desert Camping Kit (Full)", seeded: true } },
        { tenant_id: TENANT_ID, product_id: "prod-rental-003", rental_type: "monthly", base_price: 350000, currency_code: "sar", deposit_amount: 700000, min_duration: 3, max_duration: 12, is_available: true, condition_on_listing: "like_new", metadata: { name: "Furnished Office Space – Al Olaya", seeded: true } },
        { tenant_id: TENANT_ID, product_id: "prod-rental-004", rental_type: "hourly", base_price: 50000, currency_code: "sar", deposit_amount: 100000, min_duration: 2, max_duration: 8, is_available: true, condition_on_listing: "new", metadata: { name: "Professional Camera Kit (RED Komodo)", seeded: true } },
      ])
      log("  ✓ Created 4 rental products")
      seededCount++
    }
  } catch (err: any) {
    logError("Rental", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 23. CLASSIFIED MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [23/48] CLASSIFIED ━━━")
  try {
    const svc = resolveService("classified")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listClassifiedListings({ tenant_id: TENANT_ID })
    const clList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (clList.length > 0 && clList[0]?.id) {
      log("  ✓ Classified listings already exist, skipping")
      skippedCount++
    } else {
      await svc.createClassifiedListings([
        { tenant_id: TENANT_ID, seller_id: "seller-001", title: "2023 Mercedes S-Class S500 – Mint Condition", description: "Low mileage S500 with full AMG package. Riyadh registered. Service history available.", listing_type: "sell", condition: "like_new", price: 650000, currency_code: "sar", is_negotiable: true, location_city: "Riyadh", location_country: "sa", status: "active", metadata: { seeded: true } },
        { tenant_id: TENANT_ID, seller_id: "seller-002", title: "3BR Villa for Rent – Al Malqa District", description: "Spacious 3-bedroom villa with private pool and garden. Modern finishes. Close to schools.", listing_type: "sell", condition: "good", price: 180000, currency_code: "sar", is_negotiable: true, location_city: "Riyadh", location_country: "sa", status: "active", metadata: { seeded: true, type: "real_estate_rent", per: "year" } },
        { tenant_id: TENANT_ID, seller_id: "seller-003", title: "iPhone 15 Pro Max 256GB – Brand New Sealed", description: "Factory sealed iPhone 15 Pro Max. Natural Titanium. Saudi warranty.", listing_type: "sell", condition: "new", price: 5500, currency_code: "sar", is_negotiable: false, location_city: "Jeddah", location_country: "sa", status: "active", metadata: { seeded: true } },
        { tenant_id: TENANT_ID, seller_id: "seller-004", title: "Handmade Persian Carpet – 3x5m", description: "Authentic handwoven Persian carpet from Isfahan. Silk and wool blend. Certificate of authenticity included.", listing_type: "sell", condition: "good", price: 45000, currency_code: "sar", is_negotiable: true, location_city: "Dammam", location_country: "sa", status: "active", metadata: { seeded: true } },
      ])
      log("  ✓ Created 4 classified listings")
      seededCount++
    }
  } catch (err: any) {
    logError("Classified", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 24. FREELANCE MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [24/48] FREELANCE ━━━")
  try {
    const svc = resolveService("freelance")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listGigListings({ tenant_id: TENANT_ID })
    const flList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (flList.length > 0 && flList[0]?.id) {
      log("  ✓ Gig listings already exist, skipping")
      skippedCount++
    } else {
      await svc.createGigListings([
        { tenant_id: TENANT_ID, freelancer_id: "freelancer-001", title: "Arabic & English Translation – Certified", description: "Professional certified translation services for legal, medical, and business documents. Native Arabic speaker with 10 years experience.", category: "translation", listing_type: "fixed_price", price: 15000, currency_code: "sar", delivery_time_days: 3, revisions_included: 2, status: "active", skill_tags: ["arabic", "english", "legal", "medical"], avg_rating: 4.9, total_orders: 350, metadata: { seeded: true } },
        { tenant_id: TENANT_ID, freelancer_id: "freelancer-002", title: "UI/UX Design for Arabic Apps", description: "I design beautiful, RTL-first mobile and web interfaces. Specializing in Arabic-first experiences for Saudi market.", category: "design", listing_type: "fixed_price", price: 50000, currency_code: "sar", delivery_time_days: 7, revisions_included: 3, status: "active", skill_tags: ["ui_design", "ux_design", "arabic", "figma"], avg_rating: 4.8, total_orders: 120, metadata: { seeded: true } },
        { tenant_id: TENANT_ID, freelancer_id: "freelancer-003", title: "Social Media Management – Saudi Market", description: "Full social media management for Instagram, TikTok, X, and Snapchat. Content creation in Arabic and English.", category: "marketing", listing_type: "hourly", hourly_rate: 20000, currency_code: "sar", status: "active", skill_tags: ["social_media", "marketing", "content_creation"], avg_rating: 4.7, total_orders: 80, metadata: { seeded: true } },
        { tenant_id: TENANT_ID, freelancer_id: "freelancer-004", title: "Video Production & Editing – Riyadh", description: "Professional video production for corporate, events, and social media. Drone footage available. Based in Riyadh.", category: "video", listing_type: "fixed_price", price: 100000, currency_code: "sar", delivery_time_days: 10, revisions_included: 2, status: "active", skill_tags: ["video_production", "editing", "drone", "corporate"], avg_rating: 4.6, total_orders: 45, metadata: { seeded: true } },
      ])
      log("  ✓ Created 4 gig listings")
      seededCount++
    }
  } catch (err: any) {
    logError("Freelance", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 25. TRAVEL MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [25/48] TRAVEL ━━━")
  try {
    const svc = resolveService("travel")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listTravelPropertys?.() || await svc.listTravelProperties?.() || []
    const tList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (tList.length > 0 && tList[0]?.id) {
      log("  ✓ Travel properties already exist, skipping")
      skippedCount++
    } else {
      const create = svc.createTravelPropertys?.bind(svc) || svc.createTravelProperties?.bind(svc)
      await create([
        {
          tenant_id: TENANT_ID, name: "The Ritz-Carlton Riyadh", description: "Luxury hotel in the heart of Riyadh's diplomatic quarter. World-class spa and dining.",
          property_type: "hotel", star_rating: 5, address_line1: "Al Hada District", city: "Riyadh", country_code: "sa", postal_code: "11564",
          latitude: 24.6712, longitude: 46.6248, check_in_time: "15:00", check_out_time: "12:00", phone: "+966114802888",
          email: "reservations@ritzcarlton-riyadh.com", amenities: ["pool", "spa", "gym", "restaurant", "valet"],
          is_active: true, avg_rating: 4.9, total_reviews: 1200,
          images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"],
          metadata: { seeded: true, price_per_night: 250000, currency: "sar" },
        },
        {
          tenant_id: TENANT_ID, name: "Habitas AlUla", description: "Luxury desert resort nestled in the AlUla valley. A unique blend of nature and heritage.",
          property_type: "resort", star_rating: 5, address_line1: "AlUla Heritage Valley", city: "AlUla", country_code: "sa",
          latitude: 26.6174, longitude: 37.9218, check_in_time: "14:00", check_out_time: "11:00",
          email: "alula@ourhabitas.com", amenities: ["pool", "spa", "restaurant", "desert_tours", "stargazing"],
          is_active: true, avg_rating: 4.8, total_reviews: 450,
          images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"],
          metadata: { seeded: true, price_per_night: 400000, currency: "sar" },
        },
        {
          tenant_id: TENANT_ID, name: "KAEC Marina Apartments", description: "Modern waterfront apartments in King Abdullah Economic City. Perfect for extended stays.",
          property_type: "apartment", star_rating: 4, address_line1: "Bay La Sun", city: "King Abdullah Economic City", country_code: "sa",
          latitude: 22.4047, longitude: 39.1056, check_in_time: "15:00", check_out_time: "11:00",
          amenities: ["kitchen", "pool", "gym", "parking", "beach_access"],
          is_active: true, avg_rating: 4.5, total_reviews: 320,
          images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"],
          metadata: { seeded: true, price_per_night: 80000, currency: "sar" },
        },
      ])
      log("  ✓ Created 3 travel properties")
      seededCount++
    }
  } catch (err: any) {
    logError("Travel", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 26. REAL ESTATE MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [26/48] REAL ESTATE ━━━")
  try {
    const svc = resolveService("realEstate")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listPropertyListings({ tenant_id: TENANT_ID })
    const reList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (reList.length > 0 && reList[0]?.id) {
      log("  ✓ Property listings already exist, skipping")
      skippedCount++
    } else {
      await svc.createPropertyListings([
        { tenant_id: TENANT_ID, title: "Luxury Villa – Al Malqa District", description: "Modern 5-bedroom villa with private pool, landscaped garden, and smart home system.", listing_type: "sale", property_type: "villa", status: "active", price: 8500000, currency_code: "sar", address_line1: "Al Malqa District", city: "Riyadh", postal_code: "13524", country_code: "sa", latitude: 24.8000, longitude: 46.6300, bedrooms: 5, bathrooms: 6, area_sqm: 650, year_built: 2023, features: ["pool", "smart_home", "garden", "maid_room", "driver_room"], images: ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"], metadata: { seeded: true } },
        { tenant_id: TENANT_ID, title: "Office Space – King Fahad Road", description: "Grade A office space in prime Riyadh business district. Fully fitted and ready to move in.", listing_type: "rent", property_type: "office", status: "active", price: 45000, currency_code: "sar", price_period: "monthly", address_line1: "King Fahad Road", city: "Riyadh", postal_code: "11564", country_code: "sa", area_sqm: 250, year_built: 2020, features: ["parking", "reception", "meeting_rooms", "fiber_internet"], images: ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"], metadata: { seeded: true } },
        { tenant_id: TENANT_ID, title: "Seafront Apartment – Jeddah Corniche", description: "3-bedroom apartment with stunning Red Sea views. Walking distance to Jeddah Corniche.", listing_type: "sale", property_type: "apartment", status: "active", price: 2800000, currency_code: "sar", address_line1: "Corniche Road", city: "Jeddah", postal_code: "21589", country_code: "sa", latitude: 21.5433, longitude: 39.1728, bedrooms: 3, bathrooms: 3, area_sqm: 180, year_built: 2022, features: ["sea_view", "gym", "pool", "concierge"], images: ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"], metadata: { seeded: true } },
        { tenant_id: TENANT_ID, title: "Development Land – NEOM", description: "5,000 sqm land plot in NEOM's commercial zone. Ideal for mixed-use development.", listing_type: "sale", property_type: "land", status: "active", price: 15000000, currency_code: "sar", address_line1: "NEOM Commercial Zone", city: "NEOM", country_code: "sa", latitude: 27.9500, longitude: 35.3000, area_sqm: 5000, images: ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"], metadata: { seeded: true } },
      ])
      log("  ✓ Created 4 property listings")
      seededCount++
    }
  } catch (err: any) {
    logError("Real Estate", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 27. EVENT TICKETING MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [27/48] EVENT TICKETING ━━━")
  try {
    const svc = resolveService("eventTicketing")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listEvents({ tenant_id: TENANT_ID })
    const evList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (evList.length > 0 && evList[0]?.id) {
      log("  ✓ Events already exist, skipping")
      skippedCount++
    } else {
      await svc.createEvents([
        { tenant_id: TENANT_ID, title: "Riyadh Season 2025 – Opening Night", description: "Grand opening ceremony of Riyadh Season 2025 featuring international performers and Saudi artists.", event_type: "festival", status: "published", starts_at: new Date("2025-10-15T19:00:00Z"), ends_at: new Date("2025-10-15T23:59:00Z"), timezone: "Asia/Riyadh", max_capacity: 50000, image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop", organizer_name: "General Entertainment Authority", tags: ["entertainment", "music", "riyadh_season"], metadata: { seeded: true } },
        { tenant_id: TENANT_ID, title: "LEAP 2025 – Tech Conference", description: "The largest tech event in MENA region. Featuring keynotes from global tech leaders and Saudi innovators.", event_type: "conference", status: "published", starts_at: new Date("2025-09-09T09:00:00Z"), ends_at: new Date("2025-09-12T18:00:00Z"), timezone: "Asia/Riyadh", max_capacity: 100000, image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop", organizer_name: "MCIT", tags: ["technology", "innovation", "startup"], metadata: { seeded: true } },
        { tenant_id: TENANT_ID, title: "Saudi Cup 2025 – Horse Racing", description: "The world's most valuable horse race with $35M in total purse. King Abdulaziz Racecourse, Riyadh.", event_type: "sports", status: "published", starts_at: new Date("2025-02-22T13:00:00Z"), ends_at: new Date("2025-02-22T19:00:00Z"), timezone: "Asia/Riyadh", max_capacity: 25000, image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop", organizer_name: "Jockey Club of Saudi Arabia", tags: ["horse_racing", "sports", "luxury"], metadata: { seeded: true } },
        { tenant_id: TENANT_ID, title: "Arabic Calligraphy Workshop – AlUla", description: "Weekend calligraphy workshop in the stunning AlUla heritage site. Learn from master calligraphers.", event_type: "workshop", status: "published", starts_at: new Date("2025-04-18T10:00:00Z"), ends_at: new Date("2025-04-19T16:00:00Z"), timezone: "Asia/Riyadh", max_capacity: 50, image_url: "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=800&h=600&fit=crop", organizer_name: "Royal Commission for AlUla", tags: ["calligraphy", "art", "culture"], metadata: { seeded: true } },
      ])
      log("  ✓ Created 4 events")
      seededCount++
    }
  } catch (err: any) {
    logError("Event Ticketing", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 28. LEGAL MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [28/48] LEGAL ━━━")
  try {
    const svc = resolveService("legal")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listAttorneyProfiles({ tenant_id: TENANT_ID })
    const lList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (lList.length > 0 && lList[0]?.id) {
      log("  ✓ Attorney profiles already exist, skipping")
      skippedCount++
    } else {
      await svc.createAttorneyProfiles([
        { tenant_id: TENANT_ID, name: "Adv. Salman Al-Jassim", bar_number: "SA-BAR-2010-1234", specializations: ["corporate_law", "mergers_acquisitions"], practice_areas: ["Commercial Disputes", "Joint Ventures"], bio: "Senior partner with 15 years experience in Saudi corporate law. Advised on major IPOs and M&A transactions.", experience_years: 15, hourly_rate: 150000, currency_code: "sar", is_accepting_cases: true, rating: 4.9, total_cases: 250, photo_url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200&h=200&fit=crop", languages: ["ar", "en"], metadata: { seeded: true } },
        { tenant_id: TENANT_ID, name: "Adv. Maha Al-Subaie", bar_number: "SA-BAR-2015-5678", specializations: ["real_estate", "construction"], practice_areas: ["Property Disputes", "Construction Contracts"], bio: "Expert in Saudi real estate law and construction regulations. Active in Riyadh and NEOM projects.", experience_years: 9, hourly_rate: 100000, currency_code: "sar", is_accepting_cases: true, rating: 4.7, total_cases: 150, photo_url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200&h=200&fit=crop", languages: ["ar", "en", "fr"], metadata: { seeded: true } },
        { tenant_id: TENANT_ID, name: "Adv. Ibrahim Al-Tamimi", bar_number: "SA-BAR-2008-9012", specializations: ["intellectual_property", "technology"], practice_areas: ["Patent Registration", "Tech Startups"], bio: "Leading IP attorney in Saudi Arabia. Helped over 100 startups protect their intellectual property.", experience_years: 17, hourly_rate: 120000, currency_code: "sar", is_accepting_cases: true, rating: 4.8, total_cases: 300, photo_url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200&h=200&fit=crop", languages: ["ar", "en"], metadata: { seeded: true } },
      ])
      log("  ✓ Created 3 attorney profiles")
      seededCount++
    }
  } catch (err: any) {
    logError("Legal", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 29. AUTOMOTIVE MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [29/48] AUTOMOTIVE ━━━")
  try {
    const svc = resolveService("automotive")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listVehicleListings({ tenant_id: TENANT_ID })
    const autoList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (autoList.length > 0 && autoList[0]?.id) {
      log("  ✓ Vehicle listings already exist, skipping")
      skippedCount++
    } else {
      await svc.createVehicleListings([
        { tenant_id: TENANT_ID, seller_id: "dealer-001", listing_type: "sale", title: "2024 Toyota Land Cruiser VXR", make: "Toyota", model_name: "Land Cruiser VXR", year: 2024, mileage_km: 5000, fuel_type: "petrol", transmission: "automatic", body_type: "suv", color: "Pearl White", condition: "certified_pre_owned", price: 380000, currency_code: "sar", description: "Low mileage VXR with full option package. GCC spec with comprehensive warranty.", features: ["sunroof", "leather", "360_camera", "adaptive_cruise"], images: ["https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=600&fit=crop"], location_city: "Riyadh", location_country: "sa", status: "active", metadata: { seeded: true } },
        { tenant_id: TENANT_ID, seller_id: "dealer-002", listing_type: "sale", title: "2024 Mercedes-Benz GLE 450 AMG", make: "Mercedes-Benz", model_name: "GLE 450 AMG", year: 2024, mileage_km: 12000, fuel_type: "petrol", transmission: "automatic", body_type: "suv", color: "Obsidian Black", condition: "used", price: 450000, currency_code: "sar", description: "AMG Line with premium package. Single owner. Full service history from authorized dealer.", features: ["amg_package", "panoramic_roof", "burmester_audio", "head_up_display"], images: ["https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=600&fit=crop"], location_city: "Jeddah", location_country: "sa", status: "active", metadata: { seeded: true } },
        { tenant_id: TENANT_ID, seller_id: "dealer-003", listing_type: "sale", title: "2025 Genesis GV80 – Brand New", make: "Genesis", model_name: "GV80", year: 2025, fuel_type: "petrol", transmission: "automatic", body_type: "suv", color: "Cardiff Green", condition: "new", price: 320000, currency_code: "sar", description: "Brand new Genesis GV80 3.5T. Luxury Korean SUV with 5-year warranty.", features: ["all_wheel_drive", "premium_audio", "advanced_safety", "ventilated_seats"], images: ["https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=600&fit=crop"], location_city: "Riyadh", location_country: "sa", status: "active", metadata: { seeded: true } },
      ])
      log("  ✓ Created 3 vehicle listings")
      seededCount++
    }
  } catch (err: any) {
    logError("Automotive", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 30. PARKING MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [30/48] PARKING ━━━")
  try {
    const svc = resolveService("parking")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listParkingZones({ tenant_id: TENANT_ID })
    const pkList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (pkList.length > 0 && pkList[0]?.id) {
      log("  ✓ Parking zones already exist, skipping")
      skippedCount++
    } else {
      await svc.createParkingZones([
        { tenant_id: TENANT_ID, name: "Kingdom Tower Parking", description: "Multi-level valet and self-parking at Kingdom Tower", zone_type: "garage", address: { line1: "Kingdom Tower", city: "Riyadh", country: "sa" }, latitude: 24.7113, longitude: 46.6742, total_spots: 2500, available_spots: 800, hourly_rate: 1500, daily_rate: 10000, currency_code: "sar", operating_hours: { weekday: "06:00-00:00", weekend: "06:00-02:00" }, is_active: true, has_ev_charging: true, has_disabled_spots: true, metadata: { seeded: true } },
        { tenant_id: TENANT_ID, name: "Al Olaya Street Parking", description: "Smart street parking along Al Olaya commercial strip", zone_type: "street", address: { line1: "Al Olaya Street", city: "Riyadh", country: "sa" }, latitude: 24.6911, longitude: 46.6853, total_spots: 500, available_spots: 120, hourly_rate: 500, currency_code: "sar", is_active: true, metadata: { seeded: true } },
        { tenant_id: TENANT_ID, name: "King Khalid Airport Parking", description: "Long-term and short-term parking at KKIA", zone_type: "airport", address: { line1: "King Khalid International Airport", city: "Riyadh", country: "sa" }, latitude: 24.9574, longitude: 46.6987, total_spots: 8000, available_spots: 3500, hourly_rate: 1000, daily_rate: 7500, monthly_rate: 100000, currency_code: "sar", is_active: true, has_ev_charging: true, has_disabled_spots: true, metadata: { seeded: true } },
      ])
      log("  ✓ Created 3 parking zones")
      seededCount++
    }
  } catch (err: any) {
    logError("Parking", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 31. PET SERVICE MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [31/48] PET SERVICE ━━━")
  try {
    const svc = resolveService("petService")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listPetProfiles({ tenant_id: TENANT_ID })
    const petList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (petList.length > 0 && petList[0]?.id) {
      log("  ✓ Pet profiles already exist, skipping")
      skippedCount++
    } else {
      await svc.createPetProfiles([
        { tenant_id: TENANT_ID, owner_id: "owner-001", name: "Saluki", species: "dog", breed: "Saluki (Arabian Greyhound)", date_of_birth: new Date("2022-03-15"), weight_kg: 25, color: "Golden", gender: "male", is_neutered: false, photo_url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop", metadata: { seeded: true } },
        { tenant_id: TENANT_ID, owner_id: "owner-002", name: "Misk", species: "cat", breed: "Arabian Mau", date_of_birth: new Date("2023-06-20"), weight_kg: 4, color: "Tabby", gender: "female", is_neutered: true, photo_url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop", metadata: { seeded: true } },
        { tenant_id: TENANT_ID, owner_id: "owner-003", name: "Shaheen", species: "bird", breed: "Peregrine Falcon", date_of_birth: new Date("2021-01-10"), weight_kg: 1.2, color: "Grey/Blue", gender: "male", photo_url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop", metadata: { seeded: true, note: "Registered with Saudi Falconry Club" } },
      ])
      log("  ✓ Created 3 pet profiles")
      seededCount++
    }
  } catch (err: any) {
    logError("Pet Service", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 32. CHARITY MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [32/48] CHARITY ━━━")
  try {
    const svc = resolveService("charity")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listCharityOrgs({ tenant_id: TENANT_ID })
    const chList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (chList.length > 0 && chList[0]?.id) {
      log("  ✓ Charity orgs already exist, skipping")
      skippedCount++
    } else {
      await svc.createCharityOrgs([
        { tenant_id: TENANT_ID, name: "Ehsan Platform", description: "Saudi Arabia's national charitable platform supporting verified charities across the Kingdom.", registration_number: "SA-CHAR-2020-001", category: "community", website: "https://ehsan.sa", email: "info@ehsan.sa", logo_url: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=200&h=200&fit=crop", is_verified: true, verified_at: new Date("2024-01-01"), tax_deductible: true, total_raised: 500000000, currency_code: "sar", is_active: true, metadata: { seeded: true } },
        { tenant_id: TENANT_ID, name: "Saudi Red Crescent Authority", description: "Providing emergency medical services and humanitarian aid across Saudi Arabia and the region.", registration_number: "SA-CHAR-1963-001", category: "health", website: "https://srca.org.sa", email: "info@srca.org.sa", logo_url: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=200&h=200&fit=crop", is_verified: true, verified_at: new Date("2023-01-01"), tax_deductible: true, total_raised: 200000000, currency_code: "sar", is_active: true, metadata: { seeded: true } },
        { tenant_id: TENANT_ID, name: "Takaful Charity Foundation", description: "Supporting orphans and underprivileged families with education, healthcare, and housing assistance.", registration_number: "SA-CHAR-2005-042", category: "poverty", email: "info@takaful.org.sa", logo_url: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=200&h=200&fit=crop", is_verified: true, verified_at: new Date("2024-06-01"), tax_deductible: true, total_raised: 75000000, currency_code: "sar", is_active: true, metadata: { seeded: true } },
      ])
      log("  ✓ Created 3 charity organizations")
      seededCount++
    }
  } catch (err: any) {
    logError("Charity", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 33. CROWDFUNDING MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [33/48] CROWDFUNDING ━━━")
  try {
    const svc = resolveService("crowdfunding")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listCrowdfundCampaigns({ tenant_id: TENANT_ID })
    const cfList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (cfList.length > 0 && cfList[0]?.id) {
      log("  ✓ Crowdfunding campaigns already exist, skipping")
      skippedCount++
    } else {
      await svc.createCrowdfundCampaigns([
        { tenant_id: TENANT_ID, creator_id: "creator-001", title: "Solar-Powered Desert Cooler", description: "Innovative portable cooler that runs entirely on solar energy. Perfect for desert camping and outdoor activities in Saudi Arabia.", short_description: "Solar cooler for desert camping", campaign_type: "reward", status: "active", goal_amount: 500000, raised_amount: 325000, currency_code: "sar", backer_count: 450, starts_at: new Date("2025-01-15"), ends_at: new Date("2025-04-15"), category: "technology", images: ["https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=600&fit=crop"], metadata: { seeded: true } },
        { tenant_id: TENANT_ID, creator_id: "creator-002", title: "Arabic Children's Book Series", description: "A series of 12 illustrated children's books celebrating Saudi culture and heritage. Written in Modern Standard Arabic.", short_description: "Saudi culture children's books", campaign_type: "reward", status: "active", goal_amount: 150000, raised_amount: 110000, currency_code: "sar", backer_count: 280, starts_at: new Date("2025-02-01"), ends_at: new Date("2025-05-01"), category: "publishing", metadata: { seeded: true } },
        { tenant_id: TENANT_ID, creator_id: "creator-003", title: "Community Garden – Al Diriyah", description: "Creating a sustainable community garden in historic Al Diriyah. Growing local produce and preserving agricultural heritage.", short_description: "Community garden project", campaign_type: "donation", status: "active", goal_amount: 200000, raised_amount: 85000, currency_code: "sar", backer_count: 120, starts_at: new Date("2025-03-01"), ends_at: new Date("2025-06-30"), category: "environment", metadata: { seeded: true } },
      ])
      log("  ✓ Created 3 crowdfunding campaigns")
      seededCount++
    }
  } catch (err: any) {
    logError("Crowdfunding", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 34. SOCIAL COMMERCE MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [34/48] SOCIAL COMMERCE ━━━")
  try {
    const svc = resolveService("socialCommerce")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listLiveStreams({ tenant_id: TENANT_ID })
    const scList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (scList.length > 0 && scList[0]?.id) {
      log("  ✓ Live streams already exist, skipping")
      skippedCount++
    } else {
      await svc.createLiveStreams([
        { tenant_id: TENANT_ID, host_id: "host-001", title: "Oud & Perfume Collection Launch", description: "Live showcase of our exclusive oud and perfume collection. Special launch prices!", status: "scheduled", platform: "internal", scheduled_at: new Date("2025-04-10T19:00:00Z"), thumbnail_url: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop", metadata: { seeded: true } },
        { tenant_id: TENANT_ID, host_id: "host-002", title: "Saudi Fashion Week Preview", description: "Exclusive preview of Saudi designers' new collections. Shop looks directly from the stream!", status: "scheduled", platform: "instagram", scheduled_at: new Date("2025-05-01T20:00:00Z"), thumbnail_url: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop", metadata: { seeded: true } },
        { tenant_id: TENANT_ID, host_id: "host-003", title: "Electronics Flash Sale – Live!", description: "Huge discounts on smartphones, laptops, and gadgets. Limited stock, live deals only.", status: "ended", platform: "internal", started_at: new Date("2025-02-15T18:00:00Z"), ended_at: new Date("2025-02-15T20:00:00Z"), viewer_count: 15000, peak_viewers: 22000, total_sales: 450000, total_orders: 320, thumbnail_url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop", metadata: { seeded: true } },
      ])
      log("  ✓ Created 3 live streams")
      seededCount++
    }
  } catch (err: any) {
    logError("Social Commerce", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 35. FINANCIAL PRODUCT MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [35/48] FINANCIAL PRODUCT ━━━")
  try {
    const svc = resolveService("financialProduct")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listLoanProducts({ tenant_id: TENANT_ID })
    const fpList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (fpList.length > 0 && fpList[0]?.id) {
      log("  ✓ Financial products already exist, skipping")
      skippedCount++
    } else {
      await svc.createLoanProducts([
        { tenant_id: TENANT_ID, name: "Murabaha Personal Finance", description: "Sharia-compliant personal financing with fixed profit rate. No interest charges.", loan_type: "personal", min_amount: 10000, max_amount: 500000, currency_code: "sar", interest_rate_min: 4.5, interest_rate_max: 8.0, interest_type: "fixed", min_term_months: 12, max_term_months: 60, processing_fee_pct: 1, is_active: true, metadata: { seeded: true, sharia_compliant: true } },
        { tenant_id: TENANT_ID, name: "SME Business Financing", description: "Islamic financing for small and medium enterprises. Supports Vision 2030 entrepreneurship goals.", loan_type: "business", min_amount: 100000, max_amount: 5000000, currency_code: "sar", interest_rate_min: 5.0, interest_rate_max: 10.0, interest_type: "reducing_balance", min_term_months: 24, max_term_months: 120, processing_fee_pct: 1.5, is_active: true, metadata: { seeded: true, sharia_compliant: true } },
        { tenant_id: TENANT_ID, name: "Home Ijara Financing", description: "Islamic mortgage (Ijara) for Saudi nationals. Own your dream home with Sharia-compliant payments.", loan_type: "mortgage", min_amount: 500000, max_amount: 5000000, currency_code: "sar", interest_rate_min: 3.5, interest_rate_max: 6.0, interest_type: "fixed", min_term_months: 60, max_term_months: 300, processing_fee_pct: 0.5, is_active: true, metadata: { seeded: true, sharia_compliant: true } },
      ])
      log("  ✓ Created 3 loan products")
      seededCount++
    }
  } catch (err: any) {
    logError("Financial Product", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 36. GOVERNMENT MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [36/48] GOVERNMENT ━━━")
  try {
    const svc = resolveService("government")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listCitizenProfiles({ tenant_id: TENANT_ID })
    const govList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (govList.length > 0 && govList[0]?.id) {
      log("  ✓ Citizen profiles already exist, skipping")
      skippedCount++
    } else {
      await svc.createCitizenProfiles([
        { tenant_id: TENANT_ID, customer_id: "cust-citizen-001", national_id: "1234567890", full_name: "Abdullah Mohammed Al-Rashid", date_of_birth: new Date("1985-06-15"), address: { city: "Riyadh", district: "Al Olaya" }, phone: "+966501234567", email: "abdullah@email.com", preferred_language: "ar", total_requests: 5, metadata: { seeded: true } },
        { tenant_id: TENANT_ID, customer_id: "cust-citizen-002", national_id: "0987654321", full_name: "Nora Khalid Al-Faisal", date_of_birth: new Date("1990-02-20"), address: { city: "Jeddah", district: "Al Rawdah" }, phone: "+966509876543", email: "nora@email.com", preferred_language: "ar", total_requests: 3, metadata: { seeded: true } },
        { tenant_id: TENANT_ID, customer_id: "cust-citizen-003", national_id: "1122334455", full_name: "Omar Hassan Al-Zahrani", date_of_birth: new Date("1978-11-08"), address: { city: "Dammam", district: "Al Faisaliyah" }, phone: "+966551122334", email: "omar@email.com", preferred_language: "en", total_requests: 8, metadata: { seeded: true } },
      ])
      log("  ✓ Created 3 citizen profiles")
      seededCount++
    }
  } catch (err: any) {
    logError("Government", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 37. UTILITIES MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [37/48] UTILITIES ━━━")
  try {
    const svc = resolveService("utilities")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listUtilityAccounts({ tenant_id: TENANT_ID })
    const utList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (utList.length > 0 && utList[0]?.id) {
      log("  ✓ Utility accounts already exist, skipping")
      skippedCount++
    } else {
      await svc.createUtilityAccounts([
        { tenant_id: TENANT_ID, customer_id: "cust-001", utility_type: "electricity", provider_name: "Saudi Electricity Company (SEC)", account_number: "SEC-2025-001234", meter_number: "MTR-RUH-56789", address: { city: "Riyadh", district: "Al Olaya" }, status: "active", auto_pay: true, metadata: { seeded: true } },
        { tenant_id: TENANT_ID, customer_id: "cust-002", utility_type: "water", provider_name: "National Water Company (NWC)", account_number: "NWC-2025-005678", meter_number: "MTR-JED-12345", address: { city: "Jeddah", district: "Al Rawdah" }, status: "active", auto_pay: false, metadata: { seeded: true } },
        { tenant_id: TENANT_ID, customer_id: "cust-003", utility_type: "internet", provider_name: "STC Fiber", account_number: "STC-FBR-2025-901", address: { city: "Riyadh", district: "Al Malqa" }, status: "active", auto_pay: true, metadata: { seeded: true } },
      ])
      log("  ✓ Created 3 utility accounts")
      seededCount++
    }
  } catch (err: any) {
    logError("Utilities", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 38. ADVERTISING MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [38/48] ADVERTISING ━━━")
  try {
    const svc = resolveService("advertising")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listAdAccounts({ tenant_id: TENANT_ID })
    const adList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (adList.length > 0 && adList[0]?.id) {
      log("  ✓ Ad accounts already exist, skipping")
      skippedCount++
    } else {
      await svc.createAdAccounts([
        { tenant_id: TENANT_ID, advertiser_id: "vendor-albaik", account_name: "Al Baik Advertising", balance: 50000, currency_code: "sar", total_spent: 120000, total_deposited: 170000, status: "active", auto_recharge: true, auto_recharge_amount: 25000, auto_recharge_threshold: 5000, metadata: { seeded: true } },
        { tenant_id: TENANT_ID, advertiser_id: "vendor-jarir", account_name: "Jarir Marketing Ads", balance: 80000, currency_code: "sar", total_spent: 250000, total_deposited: 330000, status: "active", auto_recharge: true, auto_recharge_amount: 50000, auto_recharge_threshold: 10000, metadata: { seeded: true } },
        { tenant_id: TENANT_ID, advertiser_id: "vendor-oud", account_name: "Arabian Oud Promotions", balance: 35000, currency_code: "sar", total_spent: 65000, total_deposited: 100000, status: "active", metadata: { seeded: true } },
      ])
      log("  ✓ Created 3 ad accounts")
      seededCount++
    }
  } catch (err: any) {
    logError("Advertising", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 39. AFFILIATE MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [39/48] AFFILIATE ━━━")
  try {
    const svc = resolveService("affiliate")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listAffiliates({ tenant_id: TENANT_ID })
    const affList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (affList.length > 0 && affList[0]?.id) {
      log("  ✓ Affiliates already exist, skipping")
      skippedCount++
    } else {
      await svc.createAffiliates([
        { tenant_id: TENANT_ID, name: "TechReview Arabia", email: "partners@techreviewarabia.com", affiliate_type: "influencer", status: "active", commission_rate: 8, commission_type: "percentage", payout_method: "bank_transfer", payout_minimum: 5000, total_earnings: 45000, total_clicks: 25000, total_conversions: 850, bio: "Top tech reviewer in Saudi Arabia with 500K+ followers on YouTube", social_links: { youtube: "https://youtube.com/techreviewarabia", instagram: "@techreviewarabia" }, metadata: { seeded: true } },
        { tenant_id: TENANT_ID, name: "Saudi Lifestyle Blog", email: "affiliate@saudilifestyle.com", affiliate_type: "partner", status: "active", commission_rate: 5, commission_type: "percentage", payout_method: "bank_transfer", payout_minimum: 3000, total_earnings: 28000, total_clicks: 18000, total_conversions: 620, bio: "Leading lifestyle and culture blog covering Saudi Arabia", metadata: { seeded: true } },
        { tenant_id: TENANT_ID, name: "Riyadh Food Guide", email: "collab@riyadhfoodguide.com", affiliate_type: "influencer", status: "active", commission_rate: 10, commission_type: "percentage", payout_method: "bank_transfer", payout_minimum: 2000, total_earnings: 15000, total_clicks: 12000, total_conversions: 450, bio: "The most popular food review account in Riyadh", social_links: { instagram: "@riyadhfoodguide", tiktok: "@riyadhfoodguide" }, metadata: { seeded: true } },
      ])
      log("  ✓ Created 3 affiliates")
      seededCount++
    }
  } catch (err: any) {
    logError("Affiliate", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 40. LOYALTY MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [40/48] LOYALTY ━━━")
  try {
    const svc = resolveService("loyalty")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listLoyaltyPrograms({ tenant_id: TENANT_ID })
    const loyList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (loyList.length > 0 && loyList[0]?.id) {
      log("  ✓ Loyalty programs already exist, skipping")
      skippedCount++
    } else {
      await svc.createLoyaltyPrograms([
        { tenant_id: TENANT_ID, name: "Dakkah Rewards", description: "Earn points on every purchase across all Dakkah CityOS services. Redeem for discounts, upgrades, and exclusive experiences.", points_per_currency: 1, currency_code: "sar", status: "active", tiers: [{ name: "Bronze", min_points: 0, multiplier: 1 }, { name: "Silver", min_points: 5000, multiplier: 1.5 }, { name: "Gold", min_points: 20000, multiplier: 2 }, { name: "Platinum", min_points: 50000, multiplier: 3 }], earn_rules: { purchase: 1, review: 50, referral: 500 }, metadata: { seeded: true } },
      ])
      log("  ✓ Created 1 loyalty program")
      seededCount++
    }
  } catch (err: any) {
    logError("Loyalty", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 41. MEMBERSHIP MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [41/48] MEMBERSHIP ━━━")
  try {
    const svc = resolveService("membership")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listMembershipTiers({ tenant_id: TENANT_ID })
    const memList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (memList.length > 0 && memList[0]?.id) {
      log("  ✓ Membership tiers already exist, skipping")
      skippedCount++
    } else {
      await svc.createMembershipTiers([
        { tenant_id: TENANT_ID, name: "Dakkah Explorer", tier_level: 1, min_points: 0, currency_code: "sar", benefits: ["Free shipping on orders over 200 SAR", "Birthday discount"], color_code: "#cd7f32", is_active: true, metadata: { seeded: true } },
        { tenant_id: TENANT_ID, name: "Dakkah Elite", tier_level: 2, min_points: 10000, annual_fee: 9900, currency_code: "sar", benefits: ["Free express shipping", "Priority customer support", "Early access to sales", "5% cashback"], color_code: "#c0c0c0", is_active: true, metadata: { seeded: true } },
        { tenant_id: TENANT_ID, name: "Dakkah VIP", tier_level: 3, min_points: 50000, annual_fee: 29900, currency_code: "sar", benefits: ["Free same-day delivery", "Personal shopping assistant", "Exclusive VIP events", "10% cashback", "Airport lounge access"], color_code: "#ffd700", is_active: true, metadata: { seeded: true } },
      ])
      log("  ✓ Created 3 membership tiers")
      seededCount++
    }
  } catch (err: any) {
    logError("Membership", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 42. DIGITAL PRODUCT MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [42/48] DIGITAL PRODUCT ━━━")
  try {
    const svc = resolveService("digitalProduct")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listDigitalAssets({ tenant_id: TENANT_ID })
    const dpList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (dpList.length > 0 && dpList[0]?.id) {
      log("  ✓ Digital assets already exist, skipping")
      skippedCount++
    } else {
      await svc.createDigitalAssets([
        { tenant_id: TENANT_ID, product_id: "prod-ebook-001", title: "Saudi Business Guide 2025", file_url: "https://example.com/files/saudi-business-guide-2025.pdf", file_type: "ebook", file_size_bytes: 15000000, preview_url: "https://example.com/previews/saudi-business-guide-preview.pdf", version: "2.0", max_downloads: 5, is_active: true, metadata: { seeded: true, price: 14900, currency: "sar" } },
        { tenant_id: TENANT_ID, product_id: "prod-template-001", title: "Arabic UI Kit for Figma", file_url: "https://example.com/files/arabic-ui-kit.fig", file_type: "archive", file_size_bytes: 85000000, preview_url: "https://example.com/previews/arabic-ui-kit-preview.png", version: "3.1", max_downloads: -1, is_active: true, metadata: { seeded: true, price: 29900, currency: "sar" } },
        { tenant_id: TENANT_ID, product_id: "prod-course-vid-001", title: "Arabic Calligraphy Video Course", file_url: "https://example.com/files/calligraphy-course.zip", file_type: "video", file_size_bytes: 2500000000, preview_url: "https://example.com/previews/calligraphy-preview.mp4", version: "1.0", max_downloads: 3, is_active: true, metadata: { seeded: true, price: 49900, currency: "sar" } },
      ])
      log("  ✓ Created 3 digital assets")
      seededCount++
    }
  } catch (err: any) {
    logError("Digital Product", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 43. WARRANTY MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [43/48] WARRANTY ━━━")
  try {
    const svc = resolveService("warranty")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listWarrantyPlans({ tenant_id: TENANT_ID })
    const wList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (wList.length > 0 && wList[0]?.id) {
      log("  ✓ Warranty plans already exist, skipping")
      skippedCount++
    } else {
      await svc.createWarrantyPlans([
        { tenant_id: TENANT_ID, name: "Standard Electronics Warranty", description: "1-year warranty covering manufacturing defects for electronics.", plan_type: "standard", duration_months: 12, price: 9900, currency_code: "sar", coverage: { defects: true, accidental: false, theft: false }, is_active: true, metadata: { seeded: true } },
        { tenant_id: TENANT_ID, name: "Extended Premium Warranty", description: "3-year extended warranty with accidental damage protection.", plan_type: "extended", duration_months: 36, price: 29900, currency_code: "sar", coverage: { defects: true, accidental: true, theft: false, screen_damage: true }, is_active: true, metadata: { seeded: true } },
        { tenant_id: TENANT_ID, name: "Complete Protection Plan", description: "Comprehensive 2-year plan covering accidental damage, theft, and all repairs.", plan_type: "premium", duration_months: 24, price: 49900, currency_code: "sar", coverage: { defects: true, accidental: true, theft: true, screen_damage: true, water_damage: true }, is_active: true, metadata: { seeded: true } },
      ])
      log("  ✓ Created 3 warranty plans")
      seededCount++
    }
  } catch (err: any) {
    logError("Warranty", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 44. PROMOTION EXT MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [44/48] PROMOTION EXT ━━━")
  try {
    const svc = resolveService("promotionExt")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listCustomerSegments({ tenant_id: TENANT_ID })
    const peList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (peList.length > 0 && peList[0]?.id) {
      log("  ✓ Promotion ext records already exist, skipping")
      skippedCount++
    } else {
      await svc.createCustomerSegments([
        { tenant_id: TENANT_ID, name: "VIP Shoppers", description: "Customers who spent over 10,000 SAR in the last 90 days", metadata: { criteria: { min_spend: 10000, period_days: 90 }, seeded: true } },
        { tenant_id: TENANT_ID, name: "New Customers", description: "Registered within the last 30 days", metadata: { criteria: { registered_within_days: 30 }, seeded: true } },
        { tenant_id: TENANT_ID, name: "Dormant Customers", description: "No purchase in 60+ days", metadata: { criteria: { no_purchase_days: 60 }, seeded: true } },
      ])
      log("  ✓ Created 3 customer segments")
      seededCount++
    }
  } catch (err: any) {
    logError("Promotion Ext", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 45. I18N MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [45/48] I18N ━━━")
  try {
    const svc = resolveService("i18n")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listTranslations({ tenant_id: TENANT_ID })
    const i18nList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (i18nList.length > 0 && i18nList[0]?.id) {
      log("  ✓ Translations already exist, skipping")
      skippedCount++
    } else {
      await svc.createTranslations([
        { tenant_id: TENANT_ID, locale: "ar", namespace: "common", key: "welcome", value: "أهلاً وسهلاً", metadata: { seeded: true } },
        { tenant_id: TENANT_ID, locale: "ar", namespace: "common", key: "shop_now", value: "تسوق الآن", metadata: { seeded: true } },
        { tenant_id: TENANT_ID, locale: "ar", namespace: "common", key: "add_to_cart", value: "أضف إلى السلة", metadata: { seeded: true } },
        { tenant_id: TENANT_ID, locale: "ar", namespace: "common", key: "checkout", value: "إتمام الشراء", metadata: { seeded: true } },
        { tenant_id: TENANT_ID, locale: "ar", namespace: "common", key: "my_account", value: "حسابي", metadata: { seeded: true } },
        { tenant_id: TENANT_ID, locale: "ar", namespace: "common", key: "search", value: "بحث", metadata: { seeded: true } },
      ])
      log("  ✓ Created 6 translations")
      seededCount++
    }
  } catch (err: any) {
    logError("I18N", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 46. CMS CONTENT MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [46/48] CMS CONTENT ━━━")
  try {
    const svc = resolveService("cmsContent")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listCmsPages({ tenant_id: TENANT_ID })
    const cmsList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (cmsList.length > 0 && cmsList[0]?.id) {
      log("  ✓ CMS pages already exist, skipping")
      skippedCount++
    } else {
      await svc.createCmsPages([
        { tenant_id: TENANT_ID, title: "About Dakkah CityOS", slug: "about", content: "Dakkah CityOS is Saudi Arabia's premier super-app platform, connecting residents and visitors with everything from dining and shopping to government services and real estate.", status: "published", metadata: { seeded: true } },
        { tenant_id: TENANT_ID, title: "Terms of Service", slug: "terms", content: "These Terms of Service govern your use of the Dakkah CityOS platform and all associated services.", status: "published", metadata: { seeded: true } },
        { tenant_id: TENANT_ID, title: "Privacy Policy", slug: "privacy", content: "Dakkah CityOS is committed to protecting your privacy in accordance with Saudi data protection regulations.", status: "published", metadata: { seeded: true } },
        { tenant_id: TENANT_ID, title: "Vendor Partnership", slug: "vendor-partnership", content: "Join Dakkah CityOS as a vendor and reach millions of customers across Saudi Arabia and the MENA region.", status: "published", metadata: { seeded: true } },
      ])
      log("  ✓ Created 4 CMS pages")
      seededCount++
    }
  } catch (err: any) {
    logError("CMS Content", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 47. ANALYTICS MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [47/48] ANALYTICS ━━━")
  try {
    const svc = resolveService("analytics")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listDashboards({ tenant_id: TENANT_ID })
    const anList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (anList.length > 0 && anList[0]?.id) {
      log("  ✓ Analytics dashboards already exist, skipping")
      skippedCount++
    } else {
      await svc.createDashboards([
        { tenant_id: TENANT_ID, name: "Platform Overview", description: "High-level KPIs for the Dakkah CityOS platform", config: { widgets: ["revenue", "orders", "active_users", "vendor_count"] }, metadata: { seeded: true } },
        { tenant_id: TENANT_ID, name: "Vendor Performance", description: "Track vendor sales, commission, and customer satisfaction", config: { widgets: ["vendor_sales", "commission_revenue", "vendor_ratings"] }, metadata: { seeded: true } },
        { tenant_id: TENANT_ID, name: "Customer Insights", description: "Customer acquisition, retention, and lifetime value analytics", config: { widgets: ["new_customers", "retention_rate", "ltv", "churn"] }, metadata: { seeded: true } },
      ])

      await svc.createReports([
        { tenant_id: TENANT_ID, name: "Monthly Revenue Report", description: "Detailed revenue breakdown by vertical and vendor", report_type: "revenue", schedule: "monthly", metadata: { seeded: true } },
        { tenant_id: TENANT_ID, name: "Weekly Operations Summary", description: "Operational metrics including orders, fulfillment, and support tickets", report_type: "operations", schedule: "weekly", metadata: { seeded: true } },
      ])
      log("  ✓ Created 3 dashboards and 2 reports")
      seededCount++
    }
  } catch (err: any) {
    logError("Analytics", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // 48. AUDIT MODULE
  // ════════════════════════════════════════════════════════════════
  log("━━━ [48/48] AUDIT ━━━")
  try {
    const svc = resolveService("audit")
    if (!svc) throw new Error("Service not found")

    const existing = await svc.listAuditLogs({ tenant_id: TENANT_ID })
    const auList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

    if (auList.length > 0 && auList[0]?.id) {
      log("  ✓ Audit logs already exist, skipping")
      skippedCount++
    } else {
      await svc.createAuditLogs([
        { tenant_id: TENANT_ID, actor_id: "admin-001", actor_type: "admin", action: "seed_started", resource_type: "platform", resource_id: "dakkah", description: "Platform seed initiated for Dakkah CityOS", metadata: { seeded: true, timestamp: new Date().toISOString() } },
      ])
      log("  ✓ Created 1 audit log entry")
      seededCount++
    }
  } catch (err: any) {
    logError("Audit", err)
    failedCount++
  }

  // ════════════════════════════════════════════════════════════════
  // REMAINING LIGHTWEIGHT MODULES (try/catch each)
  // ════════════════════════════════════════════════════════════════

  // TAX CONFIG
  log("━━━ [EXTRA] TAX CONFIG ━━━")
  try {
    const svc = resolveService("taxConfig")
    if (!svc) throw new Error("Service not found")
    const existing = await svc.listTaxRules({ tenant_id: TENANT_ID })
    const txList = Array.isArray(existing) ? existing : [existing].filter(Boolean)
    if (txList.length > 0 && txList[0]?.id) { log("  ✓ Tax rules exist, skipping"); skippedCount++ }
    else {
      await svc.createTaxRules([
        { tenant_id: TENANT_ID, name: "Saudi VAT", rate: 15, country_code: "sa", is_active: true, metadata: { seeded: true } },
        { tenant_id: TENANT_ID, name: "UAE VAT", rate: 5, country_code: "ae", is_active: true, metadata: { seeded: true } },
        { tenant_id: TENANT_ID, name: "Zero-Rated Export", rate: 0, is_active: true, metadata: { seeded: true, applies_to: "exports" } },
      ])
      log("  ✓ Created 3 tax rules"); seededCount++
    }
  } catch (err: any) { logError("Tax Config", err); failedCount++ }

  // WISHLIST
  log("━━━ [EXTRA] WISHLIST ━━━")
  try {
    const svc = resolveService("wishlist")
    if (!svc) throw new Error("Service not found")
    const existing = await svc.listWishlists({ tenant_id: TENANT_ID })
    const wlList = Array.isArray(existing) ? existing : [existing].filter(Boolean)
    if (wlList.length > 0 && wlList[0]?.id) { log("  ✓ Wishlists exist, skipping"); skippedCount++ }
    else {
      await svc.createWishlists([
        { tenant_id: TENANT_ID, customer_id: "cust-001", name: "My Wishlist", metadata: { seeded: true } },
        { tenant_id: TENANT_ID, customer_id: "cust-002", name: "Gift Ideas", metadata: { seeded: true } },
      ])
      log("  ✓ Created 2 wishlists"); seededCount++
    }
  } catch (err: any) { logError("Wishlist", err); failedCount++ }

  // CHANNEL
  log("━━━ [EXTRA] CHANNEL ━━━")
  try {
    const svc = resolveService("channel")
    if (!svc) throw new Error("Service not found")
    const existing = await svc.listSalesChannelMappings({ tenant_id: TENANT_ID })
    const chList = Array.isArray(existing) ? existing : [existing].filter(Boolean)
    if (chList.length > 0 && chList[0]?.id) { log("  ✓ Channel mappings exist, skipping"); skippedCount++ }
    else {
      await svc.createSalesChannelMappings([
        { tenant_id: TENANT_ID, sales_channel_id: "sc-web", store_id: "store-main", metadata: { seeded: true } },
        { tenant_id: TENANT_ID, sales_channel_id: "sc-mobile", store_id: "store-main", metadata: { seeded: true } },
      ])
      log("  ✓ Created 2 channel mappings"); seededCount++
    }
  } catch (err: any) { logError("Channel", err); failedCount++ }

  // REGION ZONE
  log("━━━ [EXTRA] REGION ZONE ━━━")
  try {
    const svc = resolveService("regionZone")
    if (!svc) throw new Error("Service not found")
    const existing = await svc.listRegionZoneMappings({ tenant_id: TENANT_ID })
    const rzList = Array.isArray(existing) ? existing : [existing].filter(Boolean)
    if (rzList.length > 0 && rzList[0]?.id) { log("  ✓ Region zone mappings exist, skipping"); skippedCount++ }
    else {
      await svc.createRegionZoneMappings([
        { tenant_id: TENANT_ID, region_id: "reg-mena", zone_id: "zone-sa", metadata: { seeded: true } },
      ])
      log("  ✓ Created 1 region zone mapping"); seededCount++
    }
  } catch (err: any) { logError("Region Zone", err); failedCount++ }

  // SHIPPING EXTENSION
  log("━━━ [EXTRA] SHIPPING EXTENSION ━━━")
  try {
    const svc = resolveService("shippingExtension")
    if (!svc) throw new Error("Service not found")
    const existing = await svc.listCarrierConfigs({ tenant_id: TENANT_ID })
    const shList = Array.isArray(existing) ? existing : [existing].filter(Boolean)
    if (shList.length > 0 && shList[0]?.id) { log("  ✓ Carrier configs exist, skipping"); skippedCount++ }
    else {
      await svc.createCarrierConfigs([
        { tenant_id: TENANT_ID, carrier_name: "SMSA Express", carrier_code: "smsa", api_key: "demo-key", is_active: true, metadata: { seeded: true } },
        { tenant_id: TENANT_ID, carrier_name: "Aramex", carrier_code: "aramex", api_key: "demo-key", is_active: true, metadata: { seeded: true } },
        { tenant_id: TENANT_ID, carrier_name: "Saudi Post (SPL)", carrier_code: "spl", api_key: "demo-key", is_active: true, metadata: { seeded: true } },
      ])
      log("  ✓ Created 3 carrier configs"); seededCount++
    }
  } catch (err: any) { logError("Shipping Extension", err); failedCount++ }

  // CART EXTENSION
  log("━━━ [EXTRA] CART EXTENSION ━━━")
  try {
    const svc = resolveService("cartExtension")
    if (!svc) throw new Error("Service not found")
    const existing = await svc.listCartMetadatas?.() || await svc.listCartMetadata?.() || []
    const ceList = Array.isArray(existing) ? existing : [existing].filter(Boolean)
    if (ceList.length > 0 && ceList[0]?.id) { log("  ✓ Cart metadata exist, skipping"); skippedCount++ }
    else {
      const create = svc.createCartMetadatas?.bind(svc) || svc.createCartMetadata?.bind(svc)
      if (create) {
        await create([
          { tenant_id: TENANT_ID, cart_id: "cart-demo-001", metadata: { source: "seed", gift_wrapping: true, message: "Eid Mubarak!" } },
        ])
        log("  ✓ Created 1 cart metadata"); seededCount++
      }
    }
  } catch (err: any) { logError("Cart Extension", err); failedCount++ }

  // NOTIFICATION PREFERENCES
  log("━━━ [EXTRA] NOTIFICATION PREFERENCES ━━━")
  try {
    const svc = resolveService("notificationPreferences")
    if (!svc) throw new Error("Service not found")
    const existing = await svc.listNotificationPreferences({ tenant_id: TENANT_ID })
    const npList = Array.isArray(existing) ? existing : [existing].filter(Boolean)
    if (npList.length > 0 && npList[0]?.id) { log("  ✓ Notification prefs exist, skipping"); skippedCount++ }
    else {
      await svc.createNotificationPreferences([
        { tenant_id: TENANT_ID, customer_id: "cust-001", channel: "email", enabled: true, categories: ["orders", "promotions", "updates"], metadata: { seeded: true } },
        { tenant_id: TENANT_ID, customer_id: "cust-001", channel: "sms", enabled: true, categories: ["orders"], metadata: { seeded: true } },
        { tenant_id: TENANT_ID, customer_id: "cust-001", channel: "push", enabled: true, categories: ["orders", "promotions"], metadata: { seeded: true } },
      ])
      log("  ✓ Created 3 notification preferences"); seededCount++
    }
  } catch (err: any) { logError("Notification Preferences", err); failedCount++ }

  // DISPUTE
  log("━━━ [EXTRA] DISPUTE ━━━")
  try {
    const svc = resolveService("dispute")
    if (!svc) throw new Error("Service not found")
    const existing = await svc.listDisputes({ tenant_id: TENANT_ID })
    const dList = Array.isArray(existing) ? existing : [existing].filter(Boolean)
    if (dList.length > 0 && dList[0]?.id) { log("  ✓ Disputes exist, skipping"); skippedCount++ }
    else {
      await svc.createDisputes([
        { tenant_id: TENANT_ID, order_id: "order-001", customer_id: "cust-001", vendor_id: "vendor-001", reason: "Item not as described", description: "The thobe color was different from the product images. Ordered cream white but received off-white.", status: "open", metadata: { seeded: true } },
        { tenant_id: TENANT_ID, order_id: "order-002", customer_id: "cust-002", vendor_id: "vendor-002", reason: "Late delivery", description: "Order was promised in 2 days but arrived after 7 days.", status: "resolved", resolution: "Partial refund issued", metadata: { seeded: true } },
      ])
      log("  ✓ Created 2 disputes"); seededCount++
    }
  } catch (err: any) { logError("Dispute", err); failedCount++ }

  // EVENT OUTBOX
  log("━━━ [EXTRA] EVENT OUTBOX ━━━")
  try {
    const svc = resolveService("eventOutbox")
    if (!svc) throw new Error("Service not found")
    const existing = await svc.listEventOutboxs?.() || await svc.listEventOutboxes?.() || []
    const eoList = Array.isArray(existing) ? existing : [existing].filter(Boolean)
    if (eoList.length > 0 && eoList[0]?.id) { log("  ✓ Event outbox entries exist, skipping"); skippedCount++ }
    else {
      const create = svc.createEventOutboxs?.bind(svc) || svc.createEventOutboxes?.bind(svc)
      if (create) {
        await create([
          { event_type: "platform.seed.completed", payload: { tenant_id: TENANT_ID, seeded_at: new Date().toISOString(), modules_count: 48 }, status: "pending", metadata: { seeded: true } },
        ])
        log("  ✓ Created 1 event outbox entry"); seededCount++
      }
    }
  } catch (err: any) { logError("Event Outbox", err); failedCount++ }

  // ════════════════════════════════════════════════════════════════
  // SUMMARY
  // ════════════════════════════════════════════════════════════════
  log("")
  log("╔══════════════════════════════════════════════════════════════╗")
  log("║              SEED ALL SERVICES — COMPLETE                   ║")
  log("╠══════════════════════════════════════════════════════════════╣")
  log(`║  ✅ Seeded:  ${String(seededCount).padStart(3)}                                         ║`)
  log(`║  ⏭️  Skipped: ${String(skippedCount).padStart(3)}                                         ║`)
  log(`║  ❌ Failed:  ${String(failedCount).padStart(3)}                                         ║`)
  log(`║  📊 Total:   ${String(seededCount + skippedCount + failedCount).padStart(3)}                                         ║`)
  log("╚══════════════════════════════════════════════════════════════╝")
}
