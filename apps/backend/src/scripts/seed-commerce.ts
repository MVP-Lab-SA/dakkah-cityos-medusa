// @ts-nocheck
import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { createCustomersWorkflow } from "@medusajs/medusa/core-flows"
const { SeedContext, getImage, getThumb, saudiPhone, randomSaudiCity, sarPrice } = require("./seed-utils")

export default async function seedCommerce({ container }: ExecArgs, ctx: SeedContext): Promise<void> {
  const resolveService = (key: string) => {
    try { return container.resolve(key) as any }
    catch { return null }
  }

  // ── 1. Customers ──────────────────────────────────────────────────────
  try {
    console.log("[commerce] Seeding customers...")
    const customers = [
      { first_name: "Abdullah", last_name: "Al-Rashid", email: "abdullah@example.com" },
      { first_name: "Nora", last_name: "Al-Faisal", email: "nora@example.com" },
      { first_name: "Mohammed", last_name: "Al-Saud", email: "mohammed@example.com" },
      { first_name: "Fatima", last_name: "Al-Harbi", email: "fatima@example.com" },
      { first_name: "Khalid", last_name: "Al-Otaibi", email: "khalid@example.com" },
      { first_name: "Sara", last_name: "Al-Dosari", email: "sara@example.com" },
    ]

    const { result } = await createCustomersWorkflow(container).run({
      input: {
        customersData: customers.map((c) => ({
          ...c,
          phone: saudiPhone(),
          metadata: { city: randomSaudiCity(), seeded: true },
        })),
      },
    })

    if (result?.length) {
      ctx.customerIds = result.map((c: any) => c.id)
    }
    console.log(`[commerce]   Created ${customers.length} customers`)
  } catch (err: any) {
    console.warn(`[commerce] ⚠ Customers skipped: ${err.message}`)
  }

  // ── 2. Vendors ────────────────────────────────────────────────────────
  try {
    console.log("[commerce] Seeding vendors...")
    const vendorService = resolveService("vendor")
    if (!vendorService) {
      console.warn("[commerce] ⚠ Vendor service not available, skipping vendors")
    } else {
      const vendors = [
        {
          handle: "al-futtaim-electronics",
          business_name: "Al-Futtaim Electronics",
          legal_name: "Al-Futtaim Electronics Trading LLC",
          description: "Leading electronics retailer offering the latest gadgets, smartphones, and consumer electronics across Saudi Arabia.",
          logo_url: getImage("vendor", 0),
          status: "active",
          is_verified: true,
          commission_type: "percentage",
          commission_rate: "10",
          categories: ["electronics"],
          metadata: { seeded: true, city: "Riyadh" },
        },
        {
          handle: "jarir-bookstore",
          business_name: "Jarir Bookstore",
          legal_name: "Jarir Marketing Company",
          description: "Premier destination for books, stationery, office supplies, and educational materials in the Kingdom.",
          logo_url: getImage("vendor", 1),
          status: "active",
          is_verified: true,
          commission_type: "percentage",
          commission_rate: "8",
          categories: ["books", "office"],
          metadata: { seeded: true, city: "Riyadh" },
        },
        {
          handle: "abdul-samad-al-qurashi",
          business_name: "Abdul Samad Al Qurashi",
          legal_name: "Abdul Samad Al Qurashi Perfumes Co.",
          description: "Heritage perfume house specializing in authentic oud, bakhoor, and traditional Arabian fragrances since 1852.",
          logo_url: getImage("vendor", 2),
          status: "active",
          is_verified: true,
          commission_type: "percentage",
          commission_rate: "15",
          categories: ["fragrances", "oud", "luxury"],
          metadata: { seeded: true, city: "Jeddah" },
        },
        {
          handle: "saudi-farms-fresh",
          business_name: "Saudi Farms Fresh",
          legal_name: "Saudi Farms Fresh Produce LLC",
          description: "Organic produce farm delivering fresh fruits, vegetables, and dairy products sourced directly from Saudi farms.",
          logo_url: getImage("vendor", 3),
          status: "active",
          is_verified: true,
          commission_type: "percentage",
          commission_rate: "7",
          categories: ["food", "organic", "fresh-produce"],
          metadata: { seeded: true, city: "Tabuk" },
        },
        {
          handle: "riyadh-fashion-house",
          business_name: "Riyadh Fashion House",
          legal_name: "Riyadh Fashion House LLC",
          description: "Contemporary Saudi fashion brand offering modern abayas, thobes, and Western-fusion clothing for the modern Arabian lifestyle.",
          logo_url: getImage("vendor", 4),
          status: "active",
          is_verified: true,
          commission_type: "percentage",
          commission_rate: "12",
          categories: ["fashion", "clothing"],
          metadata: { seeded: true, city: "Riyadh" },
        },
        {
          handle: "desert-tech-solutions",
          business_name: "Desert Tech Solutions",
          legal_name: "Desert Tech Solutions Co.",
          description: "Enterprise IT equipment supplier providing servers, networking gear, and tech infrastructure solutions across the Gulf region.",
          logo_url: getImage("vendor", 5),
          status: "active",
          is_verified: true,
          commission_type: "percentage",
          commission_rate: "5",
          categories: ["electronics", "IT", "enterprise"],
          metadata: { seeded: true, city: "Dammam" },
        },
      ]

      for (const vendorData of vendors) {
        try {
          const existing = await vendorService.listVendors({ handle: vendorData.handle })
          const existingList = Array.isArray(existing) ? existing : [existing].filter(Boolean)
          if (existingList.length > 0) {
            ctx.vendorIds.push(existingList[0].id)
            continue
          }
          const created = await vendorService.createVendors(vendorData)
          if (created?.id) ctx.vendorIds.push(created.id)
        } catch (e: any) {
          console.warn(`[commerce]   ⚠ Vendor ${vendorData.handle}: ${e.message}`)
        }
      }
      console.log(`[commerce]   Created ${vendors.length} vendors`)
    }
  } catch (err: any) {
    console.warn(`[commerce] ⚠ Vendors skipped: ${err.message}`)
  }

  // ── 3. Companies (B2B) ───────────────────────────────────────────────
  try {
    console.log("[commerce] Seeding B2B companies...")
    const companyService = resolveService("company")
    if (!companyService) {
      console.warn("[commerce] ⚠ Company service not available, skipping companies")
    } else {
      const companies = [
        {
          name: "Saudi Aramco Supply Chain",
          legal_name: "Saudi Aramco Supply Chain Division",
          tax_id: "SA-3000000001",
          industry: "oil_gas",
          company_size: "enterprise",
          website: "https://aramco-supply.dakkah.sa",
          description: "Oil & gas supplies procurement division managing upstream and downstream equipment sourcing.",
          credit_limit: "500000",
          credit_used: "0",
          payment_terms: "net_60",
          status: "active",
          is_verified: true,
          currency_code: "sar",
          metadata: { seeded: true },
        },
        {
          name: "SABIC Industrial Solutions",
          legal_name: "SABIC Industrial Solutions Corp",
          tax_id: "SA-3000000002",
          industry: "chemicals",
          company_size: "enterprise",
          website: "https://sabic-solutions.dakkah.sa",
          description: "Chemical products and industrial raw materials for manufacturing and petrochemical operations.",
          credit_limit: "350000",
          credit_used: "0",
          payment_terms: "net_45",
          status: "active",
          is_verified: true,
          currency_code: "sar",
          metadata: { seeded: true },
        },
        {
          name: "STC Business Solutions",
          legal_name: "Saudi Telecom Company Business",
          tax_id: "SA-3000000003",
          industry: "telecom",
          company_size: "large",
          website: "https://stc-business.dakkah.sa",
          description: "Telecom equipment and enterprise connectivity solutions for businesses across the Kingdom.",
          credit_limit: "200000",
          credit_used: "0",
          payment_terms: "net_30",
          status: "active",
          is_verified: true,
          currency_code: "sar",
          metadata: { seeded: true },
        },
        {
          name: "Almarai Food Services",
          legal_name: "Almarai Food Services LLC",
          tax_id: "SA-3000000004",
          industry: "food_beverage",
          company_size: "large",
          website: "https://almarai-fs.dakkah.sa",
          description: "Food & dairy wholesale distribution serving restaurants, hotels, and retail chains across Saudi Arabia.",
          credit_limit: "150000",
          credit_used: "0",
          payment_terms: "net_30",
          status: "active",
          is_verified: true,
          currency_code: "sar",
          metadata: { seeded: true },
        },
      ]

      for (const companyData of companies) {
        try {
          const existing = await companyService.listCompanies({ name: companyData.name })
          const existingList = Array.isArray(existing) ? existing : [existing].filter(Boolean)
          if (existingList.length > 0) {
            ctx.companyIds.push(existingList[0].id)
            continue
          }
          const created = await companyService.createCompanies(companyData)
          if (created?.id) ctx.companyIds.push(created.id)
        } catch (e: any) {
          console.warn(`[commerce]   ⚠ Company ${companyData.name}: ${e.message}`)
        }
      }
      console.log(`[commerce]   Created ${companies.length} B2B companies`)
    }
  } catch (err: any) {
    console.warn(`[commerce] ⚠ Companies skipped: ${err.message}`)
  }

  // ── 4. Subscription Plans ─────────────────────────────────────────────
  try {
    console.log("[commerce] Seeding subscription plans...")
    const subscriptionService = resolveService("subscription")
    if (!subscriptionService) {
      console.warn("[commerce] ⚠ Subscription service not available, skipping plans")
    } else {
      const plans = [
        {
          handle: "dakkah-basic",
          name: "Dakkah Basic",
          description: "Essential membership with free shipping on orders over 200 SAR and access to member-only deals.",
          price: String(sarPrice(49)),
          currency_code: "sar",
          billing_interval: "month",
          billing_interval_count: 1,
          trial_period_days: 14,
          is_active: true,
          features: JSON.stringify([
            "Free shipping over 200 SAR",
            "Member-only deals",
            "Order tracking",
            "Cancel anytime",
          ]),
          metadata: { seeded: true, tier: "basic" },
        },
        {
          handle: "dakkah-plus",
          name: "Dakkah Plus",
          description: "Enhanced membership with free express shipping on all orders and 5% cashback on every purchase.",
          price: String(sarPrice(99)),
          currency_code: "sar",
          billing_interval: "month",
          billing_interval_count: 1,
          trial_period_days: 14,
          is_active: true,
          features: JSON.stringify([
            "Free express shipping",
            "5% cashback on purchases",
            "Early access to sales",
            "Priority customer support",
            "Cancel anytime",
          ]),
          metadata: { seeded: true, tier: "plus" },
        },
        {
          handle: "dakkah-premium",
          name: "Dakkah Premium",
          description: "Premium membership with same-day delivery, 10% cashback, and priority support for the ultimate shopping experience.",
          price: String(sarPrice(199)),
          currency_code: "sar",
          billing_interval: "month",
          billing_interval_count: 1,
          trial_period_days: 14,
          is_active: true,
          features: JSON.stringify([
            "Same-day delivery",
            "10% cashback on purchases",
            "Priority support",
            "Exclusive premium deals",
            "Free returns",
            "Personal shopping assistant",
          ]),
          metadata: { seeded: true, tier: "premium" },
        },
        {
          handle: "dakkah-business",
          name: "Dakkah Business",
          description: "Business-grade membership with bulk pricing, dedicated account manager, and invoice-based purchasing.",
          price: String(sarPrice(499)),
          currency_code: "sar",
          billing_interval: "month",
          billing_interval_count: 1,
          trial_period_days: 14,
          is_active: true,
          features: JSON.stringify([
            "Bulk pricing discounts",
            "Dedicated account manager",
            "Invoice-based purchasing",
            "Net-30 payment terms",
            "API access",
            "Custom reporting",
            "Priority B2B support",
          ]),
          metadata: { seeded: true, tier: "business" },
        },
      ]

      for (const planData of plans) {
        try {
          const existing = await subscriptionService.listSubscriptionPlans({ handle: planData.handle })
          const existingList = Array.isArray(existing) ? existing : [existing].filter(Boolean)
          if (existingList.length > 0) continue
          await subscriptionService.createSubscriptionPlans(planData)
        } catch (e: any) {
          console.warn(`[commerce]   ⚠ Plan ${planData.handle}: ${e.message}`)
        }
      }
      console.log(`[commerce]   Created ${plans.length} subscription plans`)
    }
  } catch (err: any) {
    console.warn(`[commerce] ⚠ Subscriptions skipped: ${err.message}`)
  }

  // ── 5. Booking Services ───────────────────────────────────────────────
  try {
    console.log("[commerce] Seeding booking services...")
    const bookingService = resolveService("booking")
    if (!bookingService) {
      console.warn("[commerce] ⚠ Booking service not available, skipping services")
    } else {
      const services = [
        {
          handle: "premium-car-wash",
          name: "Premium Car Wash",
          description: "Full interior and exterior car detailing with premium products. Includes wax coating, tire shine, and air freshener.",
          service_type: "appointment",
          category: "automotive",
          duration_minutes: 60,
          buffer_before_minutes: 10,
          buffer_after_minutes: 10,
          min_capacity: 1,
          max_capacity: 1,
          base_price: String(sarPrice(99)),
          pricing_type: "fixed",
          location_type: "in_person",
          is_active: true,
          is_bookable_online: true,
          requires_confirmation: false,
          min_advance_booking_hours: 2,
          max_advance_booking_days: 14,
          cancellation_policy_hours: 4,
          metadata: { seeded: true },
        },
        {
          handle: "home-cleaning-service",
          name: "Home Cleaning Service",
          description: "Professional deep cleaning for homes and apartments. Covers kitchen, bathrooms, bedrooms, and living areas.",
          service_type: "appointment",
          category: "home",
          duration_minutes: 180,
          buffer_before_minutes: 15,
          buffer_after_minutes: 15,
          min_capacity: 1,
          max_capacity: 1,
          base_price: String(sarPrice(249)),
          pricing_type: "fixed",
          location_type: "in_person",
          is_active: true,
          is_bookable_online: true,
          requires_confirmation: true,
          min_advance_booking_hours: 24,
          max_advance_booking_days: 30,
          cancellation_policy_hours: 12,
          metadata: { seeded: true },
        },
        {
          handle: "personal-fitness-training",
          name: "Personal Fitness Training",
          description: "One-on-one fitness session with a certified personal trainer. Customized workout plan based on your goals.",
          service_type: "appointment",
          category: "fitness",
          duration_minutes: 60,
          buffer_before_minutes: 10,
          buffer_after_minutes: 10,
          min_capacity: 1,
          max_capacity: 1,
          base_price: String(sarPrice(199)),
          pricing_type: "fixed",
          location_type: "in_person",
          is_active: true,
          is_bookable_online: true,
          requires_confirmation: false,
          min_advance_booking_hours: 6,
          max_advance_booking_days: 30,
          cancellation_policy_hours: 12,
          metadata: { seeded: true },
        },
        {
          handle: "spa-wellness-session",
          name: "Spa & Wellness Session",
          description: "Luxurious spa experience with aromatic oils, hot stones, and traditional Arabian relaxation techniques.",
          service_type: "appointment",
          category: "beauty",
          duration_minutes: 90,
          buffer_before_minutes: 15,
          buffer_after_minutes: 15,
          min_capacity: 1,
          max_capacity: 1,
          base_price: String(sarPrice(349)),
          pricing_type: "fixed",
          location_type: "in_person",
          is_active: true,
          is_bookable_online: true,
          requires_confirmation: false,
          min_advance_booking_hours: 24,
          max_advance_booking_days: 60,
          cancellation_policy_hours: 24,
          metadata: { seeded: true },
        },
        {
          handle: "photography-session",
          name: "Photography Session",
          description: "Professional photography session for events, portraits, or product shoots. Includes edited digital copies.",
          service_type: "appointment",
          category: "events",
          duration_minutes: 120,
          buffer_before_minutes: 30,
          buffer_after_minutes: 15,
          min_capacity: 1,
          max_capacity: 1,
          base_price: String(sarPrice(499)),
          pricing_type: "fixed",
          location_type: "in_person",
          is_active: true,
          is_bookable_online: true,
          requires_confirmation: true,
          min_advance_booking_hours: 48,
          max_advance_booking_days: 90,
          cancellation_policy_hours: 48,
          metadata: { seeded: true },
        },
        {
          handle: "legal-consultation",
          name: "Legal Consultation",
          description: "Professional legal consultation covering business law, contracts, real estate, and personal legal matters.",
          service_type: "consultation",
          category: "legal",
          duration_minutes: 60,
          buffer_before_minutes: 10,
          buffer_after_minutes: 10,
          min_capacity: 1,
          max_capacity: 1,
          base_price: String(sarPrice(599)),
          pricing_type: "fixed",
          location_type: "in_person",
          is_active: true,
          is_bookable_online: true,
          requires_confirmation: true,
          min_advance_booking_hours: 24,
          max_advance_booking_days: 30,
          cancellation_policy_hours: 24,
          metadata: { seeded: true },
        },
      ]

      for (const serviceData of services) {
        try {
          const existing = await bookingService.listServiceProducts({ handle: serviceData.handle })
          const existingList = Array.isArray(existing) ? existing : [existing].filter(Boolean)
          if (existingList.length > 0) continue
          await bookingService.createServiceProducts(serviceData)
        } catch (e: any) {
          console.warn(`[commerce]   ⚠ Service ${serviceData.handle}: ${e.message}`)
        }
      }
      console.log(`[commerce]   Created ${services.length} booking services`)
    }
  } catch (err: any) {
    console.warn(`[commerce] ⚠ Booking services skipped: ${err.message}`)
  }

  // ── 6. Volume Pricing ─────────────────────────────────────────────────
  try {
    console.log("[commerce] Seeding volume pricing...")
    const volumeService = resolveService("volumePricing") || resolveService("volume_pricing")
    if (!volumeService) {
      console.warn("[commerce] ⚠ Volume pricing service not available, skipping")
    } else {
      const query = container.resolve(ContainerRegistrationKeys.QUERY)
      const { data: products } = await query.graph({
        entity: "product",
        fields: ["id", "title", "handle"],
        filters: { status: "published" },
      })

      if (!products || products.length === 0) {
        console.log("[commerce]   No published products found, skipping volume pricing")
      } else {
        const tiers = [
          { min_quantity: 10, max_quantity: 24, discount_type: "percentage", discount_value: "10" },
          { min_quantity: 25, max_quantity: 49, discount_type: "percentage", discount_value: "15" },
          { min_quantity: 50, max_quantity: 99, discount_type: "percentage", discount_value: "20" },
          { min_quantity: 100, max_quantity: null, discount_type: "percentage", discount_value: "25" },
        ]

        const productsToPrice = products.slice(0, 3)
        let created = 0

        for (const product of productsToPrice) {
          try {
            const existing = await volumeService.listVolumePricingRules({ product_id: product.id })
            const existingList = Array.isArray(existing) ? existing : [existing].filter(Boolean)
            if (existingList.length > 0) continue

            const rule = await volumeService.createVolumePricingRules({
              product_id: product.id,
              name: `Volume pricing for ${product.title}`,
              is_active: true,
              priority: 1,
              metadata: { seeded: true },
            })

            for (const tier of tiers) {
              await volumeService.createVolumePricingTiers({
                rule_id: rule.id,
                min_quantity: tier.min_quantity,
                max_quantity: tier.max_quantity,
                discount_type: tier.discount_type,
                discount_value: tier.discount_value,
              })
            }
            created++
          } catch (e: any) {
            console.warn(`[commerce]   ⚠ Volume pricing for ${product.handle}: ${e.message}`)
          }
        }
        console.log(`[commerce]   Created volume pricing for ${created} products`)
      }
    }
  } catch (err: any) {
    console.warn(`[commerce] ⚠ Volume pricing skipped: ${err.message}`)
  }

  console.log("[commerce] Commerce seeding complete")
}
