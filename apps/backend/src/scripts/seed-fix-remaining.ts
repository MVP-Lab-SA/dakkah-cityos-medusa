// @ts-nocheck
import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function seedFixRemaining({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  let TENANT_ID = "ten_default"
  try {
    const tenantSvc = container.resolve("tenant") as any
    const tenants = await tenantSvc.listTenants({ handle: "dakkah" })
    const list = Array.isArray(tenants) ? tenants : [tenants].filter(Boolean)
    if (list.length > 0 && list[0]?.id) {
      TENANT_ID = list[0].id
    } else {
      const allTenants = await tenantSvc.listTenants()
      const allList = Array.isArray(allTenants) ? allTenants : [allTenants].filter(Boolean)
      if (allList.length > 0 && allList[0]?.id) {
        TENANT_ID = allList[0].id
      }
    }
  } catch (err: any) {
    logger.warn(`Could not fetch tenants: ${err.message}`)
  }
  logger.info(`Using tenant ID: ${TENANT_ID}`)

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
    try { return container.resolve(`${key}ModuleService`) as any } catch {}
    try { return container.resolve(key) as any } catch {}
    return null
  }

  let seededCount = 0
  let skippedCount = 0
  let failedCount = 0

  log("╔════════════════════════════════════════════╗")
  log("║  DAKKAH CITYOS — FIX REMAINING SEEDS      ║")
  log("╚════════════════════════════════════════════╝")

  // 1. PERSONA
  log("━━━ [1] PERSONA ━━━")
  try {
    const svc = resolveService("persona")
    if (!svc) throw new Error("Service not found")
    const existing = await svc.listPersonas({ tenant_id: TENANT_ID })
    const list = Array.isArray(existing) ? existing : [existing].filter(Boolean)
    if (list.length > 0 && list[0]?.id) {
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
          category: "cityops",
          axes: { sector: "public", clearance: "standard" },
          priority: 4,
          status: "active",
        },
      ])
      log("  ✓ Created 4 personas")
      seededCount++
    }
  } catch (err: any) { logError("Persona", err); failedCount++ }

  // 2. CITYOS STORE
  log("━━━ [2] CITYOS STORE ━━━")
  try {
    const svc = resolveService("store")
    if (!svc) throw new Error("Service not found")
    const existing = await svc.listStores({ tenant_id: TENANT_ID })
    const list = Array.isArray(existing) ? existing : [existing].filter(Boolean)
    if (list.length > 0 && list[0]?.id) {
      log("  ✓ CityOS Stores already exist, skipping")
      skippedCount++
    } else {
      let salesChannelId = "sc-default"
      try {
        const scService = container.resolve(Modules.SALES_CHANNEL) as any
        const channels = await scService.listSalesChannels()
        const chArr = Array.isArray(channels) ? channels : [channels].filter(Boolean)
        if (chArr.length > 0 && chArr[0]?.id) {
          salesChannelId = chArr[0].id
        }
      } catch {}

      await svc.createStores([
        {
          tenant_id: TENANT_ID,
          handle: "dakkah-main",
          name: "Dakkah Main Store",
          sales_channel_id: salesChannelId,
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
          sales_channel_id: salesChannelId,
          store_type: "retail",
          status: "active",
          logo_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=200&fit=crop",
          theme_config: { primaryColor: "#c0392b", accentColor: "#e67e22" },
          metadata: { vertical: "food" },
        },
        {
          tenant_id: TENANT_ID,
          handle: "dakkah-b2b",
          name: "Dakkah Business",
          sales_channel_id: salesChannelId,
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
  } catch (err: any) { logError("CityOS Store", err); failedCount++ }

  // 3. VENDOR
  log("━━━ [3] VENDOR ━━━")
  try {
    const svc = resolveService("vendor")
    if (!svc) throw new Error("Service not found")
    const existing = await svc.listVendors({ tenant_id: TENANT_ID })
    const list = Array.isArray(existing) ? existing : [existing].filter(Boolean)
    if (list.length > 0 && list[0]?.id) {
      log("  ✓ Vendors already exist, skipping")
      skippedCount++
    } else {
      await svc.createVendors([
        {
          tenant_id: TENANT_ID,
          handle: "al-baik",
          business_name: "Al Baik",
          legal_name: "Al Baik Food Systems Company",
          business_type: "corporation",
          email: "info@albaik.com",
          phone: "+966112345678",
          address_line1: "King Fahad Road",
          city: "Riyadh",
          postal_code: "11564",
          country_code: "sa",
          commission_type: "percentage",
          commission_rate: 12,
          status: "active",
          verification_status: "approved",
          logo_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop",
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          handle: "jarir-bookstore",
          business_name: "Jarir Bookstore",
          legal_name: "Jarir Marketing Company",
          business_type: "corporation",
          email: "info@jarir.com",
          phone: "+966114611111",
          address_line1: "Olaya Street",
          city: "Riyadh",
          postal_code: "11321",
          country_code: "sa",
          commission_type: "percentage",
          commission_rate: 8,
          status: "active",
          verification_status: "approved",
          logo_url: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=200&h=200&fit=crop",
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          handle: "saudi-oud",
          business_name: "Arabian Oud",
          legal_name: "Arabian Oud Company",
          business_type: "llc",
          email: "info@arabianoud.com",
          phone: "+966114780000",
          address_line1: "Tahlia Street",
          city: "Riyadh",
          postal_code: "11452",
          country_code: "sa",
          commission_type: "percentage",
          commission_rate: 10,
          status: "active",
          verification_status: "approved",
          logo_url: "https://images.unsplash.com/photo-1594035910387-fea081de461b?w=200&h=200&fit=crop",
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          handle: "tamimi-markets",
          business_name: "Tamimi Markets",
          legal_name: "Abdullah Al Othaim Markets Company",
          business_type: "corporation",
          email: "info@tamimimarkets.com",
          phone: "+966112345000",
          address_line1: "Al Malaz District",
          city: "Riyadh",
          postal_code: "11441",
          country_code: "sa",
          commission_type: "percentage",
          commission_rate: 6,
          status: "active",
          verification_status: "approved",
          logo_url: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=200&h=200&fit=crop",
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          handle: "camel-fashion",
          business_name: "Camel Fashion House",
          legal_name: "Camel Fashion Trading LLC",
          business_type: "llc",
          email: "info@camelfashion.sa",
          phone: "+966112340000",
          address_line1: "Kingdom Tower",
          city: "Riyadh",
          postal_code: "11564",
          country_code: "sa",
          commission_type: "percentage",
          commission_rate: 15,
          status: "active",
          verification_status: "approved",
          logo_url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=200&h=200&fit=crop",
          metadata: { seeded: true },
        },
      ])
      log("  ✓ Created 5 vendors")
      seededCount++
    }
  } catch (err: any) { logError("Vendor", err); failedCount++ }

  // 4. COMMISSION
  log("━━━ [4] COMMISSION ━━━")
  try {
    const svc = resolveService("commission")
    if (!svc) throw new Error("Service not found")
    const existing = await svc.listCommissionRules({ tenant_id: TENANT_ID })
    const list = Array.isArray(existing) ? existing : [existing].filter(Boolean)
    if (list.length > 0 && list[0]?.id) {
      log("  ✓ Commission rules already exist, skipping")
      skippedCount++
    } else {
      await svc.createCommissionRules([
        {
          tenant_id: TENANT_ID,
          name: "Default Platform Commission",
          description: "Standard 15% commission for all vendors",
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
          description: "10% commission for food and beverage vendors",
          commission_type: "percentage",
          commission_percentage: 10,
          priority: 2,
          status: "active",
          applies_to: "specific_categories",
          conditions: { category: "food-beverages" },
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          name: "Premium Vendor Discount",
          description: "8% commission for high-volume vendors",
          commission_type: "percentage",
          commission_percentage: 8,
          priority: 3,
          status: "active",
          applies_to: "all_products",
          conditions: { min_monthly_sales: 500000 },
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          name: "Electronics Flat Fee",
          description: "SAR 25 flat fee per electronics sale",
          commission_type: "flat",
          commission_flat_amount: 25,
          priority: 4,
          status: "active",
          applies_to: "specific_categories",
          conditions: { category: "electronics" },
          metadata: { seeded: true },
        },
      ])
      log("  ✓ Created 4 commission rules")
      seededCount++
    }
  } catch (err: any) { logError("Commission", err); failedCount++ }

  // 5. PAYOUT
  log("━━━ [5] PAYOUT ━━━")
  try {
    const svc = resolveService("payout")
    if (!svc) throw new Error("Service not found")
    const existing = await svc.listPayouts({ tenant_id: TENANT_ID })
    const list = Array.isArray(existing) ? existing : [existing].filter(Boolean)
    if (list.length > 0 && list[0]?.id) {
      log("  ✓ Payouts already exist, skipping")
      skippedCount++
    } else {
      await svc.createPayouts([
        {
          tenant_id: TENANT_ID,
          vendor_id: "vendor-albaik",
          payout_number: "PO-2025-001",
          gross_amount: 150000,
          commission_amount: 18000,
          net_amount: 132000,
          period_start: new Date("2025-01-01"),
          period_end: new Date("2025-01-31"),
          transaction_count: 3200,
          status: "completed",
          payment_method: "bank_transfer",
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          vendor_id: "vendor-jarir",
          payout_number: "PO-2025-002",
          gross_amount: 280000,
          commission_amount: 22400,
          net_amount: 257600,
          period_start: new Date("2025-01-01"),
          period_end: new Date("2025-01-31"),
          transaction_count: 4500,
          status: "pending",
          payment_method: "stripe_connect",
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          vendor_id: "vendor-oud",
          payout_number: "PO-2025-003",
          gross_amount: 95000,
          commission_amount: 9500,
          net_amount: 85500,
          period_start: new Date("2025-02-01"),
          period_end: new Date("2025-02-28"),
          transaction_count: 5000,
          status: "processing",
          payment_method: "stripe_connect",
          metadata: { seeded: true },
        },
      ])
      log("  ✓ Created 3 payouts")
      seededCount++
    }
  } catch (err: any) { logError("Payout", err); failedCount++ }

  // 6. BOOKING (SERVICE PRODUCT)
  log("━━━ [6] BOOKING ━━━")
  try {
    const svc = resolveService("booking")
    if (!svc) throw new Error("Service not found")
    const existing = await svc.listServiceProducts({ tenant_id: TENANT_ID })
    const list = Array.isArray(existing) ? existing : [existing].filter(Boolean)
    if (list.length > 0 && list[0]?.id) {
      log("  ✓ Service products already exist, skipping")
      skippedCount++
    } else {
      await svc.createServiceProducts([
        {
          tenant_id: TENANT_ID,
          product_id: "prod-spa-001",
          service_type: "appointment",
          duration_minutes: 90,
          buffer_before_minutes: 15,
          buffer_after_minutes: 15,
          max_capacity: 1,
          min_advance_booking_hours: 24,
          max_advance_booking_days: 30,
          cancellation_policy_hours: 12,
          location_type: "in_person",
          pricing_type: "fixed",
          is_active: true,
          metadata: { name: "Premium Hammam Spa Experience", price: 45000 },
        },
        {
          tenant_id: TENANT_ID,
          product_id: "prod-consult-001",
          service_type: "consultation",
          duration_minutes: 60,
          buffer_before_minutes: 10,
          buffer_after_minutes: 10,
          max_capacity: 1,
          min_advance_booking_hours: 2,
          max_advance_booking_days: 14,
          cancellation_policy_hours: 4,
          location_type: "virtual",
          pricing_type: "fixed",
          is_active: true,
          virtual_meeting_provider: "zoom",
          metadata: { name: "Business Setup Consultation", price: 30000 },
        },
        {
          tenant_id: TENANT_ID,
          product_id: "prod-calligraphy-001",
          service_type: "class",
          duration_minutes: 120,
          buffer_before_minutes: 30,
          buffer_after_minutes: 15,
          max_capacity: 15,
          min_capacity: 5,
          min_advance_booking_hours: 48,
          max_advance_booking_days: 60,
          cancellation_policy_hours: 24,
          location_type: "in_person",
          pricing_type: "fixed",
          is_active: true,
          metadata: { name: "Arabic Calligraphy Workshop", price: 15000 },
        },
        {
          tenant_id: TENANT_ID,
          product_id: "prod-photo-001",
          service_type: "custom",
          duration_minutes: 180,
          buffer_before_minutes: 30,
          buffer_after_minutes: 30,
          max_capacity: 1,
          min_advance_booking_hours: 48,
          max_advance_booking_days: 90,
          cancellation_policy_hours: 48,
          location_type: "in_person",
          pricing_type: "fixed",
          is_active: true,
          metadata: { name: "Desert Safari Photography Session", price: 85000 },
        },
      ])
      log("  ✓ Created 4 service products")
      seededCount++
    }
  } catch (err: any) { logError("Booking", err); failedCount++ }

  // 7. INVOICE
  log("━━━ [7] INVOICE ━━━")
  try {
    const svc = resolveService("invoice")
    if (!svc) throw new Error("Service not found")
    const existing = await svc.listInvoices()
    const list = Array.isArray(existing) ? existing : [existing].filter(Boolean)
    if (list.length > 0 && list[0]?.id) {
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
          subtotal: 5000000,
          tax_total: 750000,
          total: 5750000,
          amount_paid: 5750000,
          amount_due: 0,
          currency_code: "sar",
          payment_terms: "Net 60",
          payment_terms_days: 60,
          notes: "Q1 2025 bulk office supplies order",
          metadata: { seeded: true },
        },
        {
          invoice_number: "INV-2025-00002",
          company_id: "comp-sabic",
          customer_id: "cust-b2b-002",
          status: "sent",
          issue_date: new Date("2025-02-01"),
          due_date: new Date("2025-03-03"),
          subtotal: 1200000,
          tax_total: 180000,
          total: 1380000,
          amount_paid: 0,
          amount_due: 1380000,
          currency_code: "sar",
          payment_terms: "Net 30",
          payment_terms_days: 30,
          metadata: { seeded: true },
        },
        {
          invoice_number: "INV-2025-00003",
          company_id: "comp-stc",
          customer_id: "cust-b2b-003",
          status: "overdue",
          issue_date: new Date("2024-11-15"),
          due_date: new Date("2024-12-15"),
          subtotal: 800000,
          tax_total: 120000,
          total: 920000,
          amount_paid: 460000,
          amount_due: 460000,
          currency_code: "sar",
          payment_terms: "Net 30",
          payment_terms_days: 30,
          notes: "Partial payment received",
          metadata: { seeded: true },
        },
      ])
      log("  ✓ Created 3 invoices")
      seededCount++
    }
  } catch (err: any) { logError("Invoice", err); failedCount++ }

  // 8. VOLUME PRICING
  log("━━━ [8] VOLUME PRICING ━━━")
  try {
    const svc = resolveService("volumePricing")
    if (!svc) throw new Error("Service not found")
    const existing = await svc.listVolumePricings({ tenant_id: TENANT_ID })
    const list = Array.isArray(existing) ? existing : [existing].filter(Boolean)
    if (list.length > 0 && list[0]?.id) {
      log("  ✓ Volume pricing rules already exist, skipping")
      skippedCount++
    } else {
      await svc.createVolumePricings([
        {
          tenant_id: TENANT_ID,
          name: "Bulk Electronics Discount",
          description: "Tiered pricing for bulk electronics purchases",
          applies_to: "category",
          target_id: "cat-electronics",
          pricing_type: "percentage",
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
          pricing_type: "fixed",
          priority: 2,
          status: "active",
          starts_at: new Date("2025-01-01"),
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          name: "VIP Customer Pricing",
          description: "Special pricing for VIP B2B customers",
          applies_to: "all",
          pricing_type: "percentage",
          company_tier: "platinum",
          priority: 3,
          status: "active",
          starts_at: new Date("2025-01-01"),
          metadata: { seeded: true },
        },
      ])
      log("  ✓ Created 3 volume pricing rules")
      seededCount++
    }
  } catch (err: any) { logError("Volume Pricing", err); failedCount++ }

  // 9. REAL ESTATE
  log("━━━ [9] REAL ESTATE ━━━")
  try {
    const svc = resolveService("realEstate")
    if (!svc) throw new Error("Service not found")
    const existing = await svc.listPropertyListings({ tenant_id: TENANT_ID })
    const list = Array.isArray(existing) ? existing : [existing].filter(Boolean)
    if (list.length > 0 && list[0]?.id) {
      log("  ✓ Property listings already exist, skipping")
      skippedCount++
    } else {
      await svc.createPropertyListings([
        {
          tenant_id: TENANT_ID,
          title: "Luxury Villa – Al Malqa District",
          description: "Modern 5-bedroom villa with private pool, landscaped garden, and smart home system.",
          listing_type: "sale",
          property_type: "villa",
          status: "active",
          price: 8500000,
          currency_code: "sar",
          address_line1: "Al Malqa District",
          city: "Riyadh",
          postal_code: "13524",
          country_code: "sa",
          latitude: 24.8000,
          longitude: 46.6300,
          bedrooms: 5,
          bathrooms: 6,
          area_sqm: 650,
          year_built: 2023,
          features: ["pool", "smart_home", "garden", "maid_room", "driver_room"],
          images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop"],
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          title: "Office Space – King Fahad Road",
          description: "Grade A office space in prime Riyadh business district. Fully fitted and ready to move in.",
          listing_type: "rent",
          property_type: "office",
          status: "active",
          price: 45000,
          currency_code: "sar",
          price_period: "monthly",
          address_line1: "King Fahad Road",
          city: "Riyadh",
          postal_code: "11564",
          country_code: "sa",
          area_sqm: 250,
          year_built: 2020,
          features: ["parking", "reception", "meeting_rooms", "fiber_internet"],
          images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop"],
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          title: "Seafront Apartment – Jeddah Corniche",
          description: "3-bedroom apartment with stunning Red Sea views. Walking distance to Jeddah Corniche.",
          listing_type: "sale",
          property_type: "apartment",
          status: "active",
          price: 2800000,
          currency_code: "sar",
          address_line1: "Corniche Road",
          city: "Jeddah",
          postal_code: "21589",
          country_code: "sa",
          latitude: 21.5433,
          longitude: 39.1728,
          bedrooms: 3,
          bathrooms: 3,
          area_sqm: 180,
          year_built: 2022,
          features: ["sea_view", "gym", "pool", "concierge"],
          images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop"],
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          title: "Development Land – NEOM",
          description: "5,000 sqm land plot in NEOM's commercial zone. Ideal for mixed-use development.",
          listing_type: "sale",
          property_type: "land",
          status: "active",
          price: 15000000,
          currency_code: "sar",
          address_line1: "NEOM Commercial Zone",
          city: "NEOM",
          postal_code: "49643",
          country_code: "sa",
          latitude: 27.9500,
          longitude: 35.3000,
          area_sqm: 5000,
          images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop"],
          metadata: { seeded: true },
        },
      ])
      log("  ✓ Created 4 property listings")
      seededCount++
    }
  } catch (err: any) { logError("Real Estate", err); failedCount++ }

  // 10. CHANNEL
  log("━━━ [10] CHANNEL ━━━")
  try {
    const svc = resolveService("channel")
    if (!svc) throw new Error("Service not found")
    const existing = await svc.listSalesChannelMappings({ tenant_id: TENANT_ID })
    const list = Array.isArray(existing) ? existing : [existing].filter(Boolean)
    if (list.length > 0 && list[0]?.id) {
      log("  ✓ Channel mappings already exist, skipping")
      skippedCount++
    } else {
      await svc.createSalesChannelMappings([
        {
          tenant_id: TENANT_ID,
          channel_type: "web",
          name: "Dakkah Web Store",
          description: "Main web storefront for Dakkah CityOS",
          is_active: true,
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          channel_type: "mobile",
          name: "Dakkah Mobile App",
          description: "iOS and Android mobile application",
          is_active: true,
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          channel_type: "api",
          name: "Dakkah Partner API",
          description: "REST API for third-party integrations",
          is_active: true,
          metadata: { seeded: true },
        },
      ])
      log("  ✓ Created 3 channel mappings")
      seededCount++
    }
  } catch (err: any) { logError("Channel", err); failedCount++ }

  // 11. REGION ZONE
  log("━━━ [11] REGION ZONE ━━━")
  try {
    const svc = resolveService("regionZone")
    if (!svc) throw new Error("Service not found")
    const existing = await svc.listRegionZoneMappings()
    const list = Array.isArray(existing) ? existing : [existing].filter(Boolean)
    if (list.length > 0 && list[0]?.id) {
      log("  ✓ Region zone mappings already exist, skipping")
      skippedCount++
    } else {
      await svc.createRegionZoneMappings([
        {
          residency_zone: "MENA",
          medusa_region_id: "reg-mena",
          country_codes: ["sa", "ae", "bh", "kw", "om", "qa", "eg", "jo", "lb"],
          metadata: { seeded: true },
        },
        {
          residency_zone: "GCC",
          medusa_region_id: "reg-gcc",
          country_codes: ["sa", "ae", "bh", "kw", "om", "qa"],
          metadata: { seeded: true },
        },
      ])
      log("  ✓ Created 2 region zone mappings")
      seededCount++
    }
  } catch (err: any) { logError("Region Zone", err); failedCount++ }

  // 12. WISHLIST
  log("━━━ [12] WISHLIST ━━━")
  try {
    const svc = resolveService("wishlist")
    if (!svc) throw new Error("Service not found")
    const existing = await svc.listWishlists({ tenant_id: TENANT_ID })
    const list = Array.isArray(existing) ? existing : [existing].filter(Boolean)
    if (list.length > 0 && list[0]?.id) {
      log("  ✓ Wishlists already exist, skipping")
      skippedCount++
    } else {
      await svc.createWishlists([
        {
          tenant_id: TENANT_ID,
          customer_id: "cust-001",
          metadata: { seeded: true },
        },
        {
          tenant_id: TENANT_ID,
          customer_id: "cust-002",
          metadata: { seeded: true },
        },
      ])
      log("  ✓ Created 2 wishlists")
      seededCount++
    }
  } catch (err: any) { logError("Wishlist", err); failedCount++ }

  log("")
  log("╔════════════════════════════════════════════╗")
  log(`║  FIX COMPLETE                              ║`)
  log(`║  Seeded: ${seededCount}  Skipped: ${skippedCount}  Failed: ${failedCount}     ║`)
  log("╚════════════════════════════════════════════╝")
}
