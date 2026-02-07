// @ts-nocheck
import { ExecArgs } from "@medusajs/framework/types"

// Seed data definitions
const VENDORS = [
  {
    handle: "nordic-wellness-co",
    tenant_id: "default",
    business_name: "Nordic Wellness Co",
    legal_name: "Nordic Wellness Company LLC",
    business_type: "llc" as const,
    email: "contact@nordicwellness.co",
    phone: "+1-555-0101",
    address_line1: "123 Wellness Way",
    city: "Stockholm",
    postal_code: "11122",
    country_code: "se",
    verification_status: "approved" as const,
    status: "active" as const,
    commission_rate: 15,
    description: "Premium Scandinavian wellness products crafted with pure Arctic ingredients",
  },
  {
    handle: "arctic-botanicals",
    tenant_id: "default",
    business_name: "Arctic Botanicals",
    legal_name: "Arctic Botanicals Oy",
    business_type: "corporation" as const,
    email: "hello@arcticbotanicals.com",
    phone: "+1-555-0102",
    address_line1: "45 Arctic Circle Road",
    city: "Helsinki",
    postal_code: "00100",
    country_code: "fi",
    verification_status: "approved" as const,
    status: "active" as const,
    commission_rate: 12,
    description: "Wild-harvested botanical skincare from the Arctic Circle",
  },
  {
    handle: "fjord-essentials",
    tenant_id: "default",
    business_name: "Fjord Essentials",
    legal_name: "Fjord Essentials AS",
    business_type: "corporation" as const,
    email: "info@fjordessentials.no",
    phone: "+1-555-0103",
    address_line1: "78 Fjord Street",
    city: "Bergen",
    postal_code: "5003",
    country_code: "no",
    verification_status: "approved" as const,
    status: "active" as const,
    commission_rate: 18,
    description: "Essential oils and aromatherapy inspired by Norwegian fjords",
  },
  {
    handle: "hygge-home-spa",
    tenant_id: "default",
    business_name: "Hygge Home Spa",
    legal_name: "Hygge Home Spa ApS",
    business_type: "llc" as const,
    email: "care@hyggehomespa.dk",
    phone: "+1-555-0104",
    address_line1: "22 Cozy Lane",
    city: "Copenhagen",
    postal_code: "1000",
    country_code: "dk",
    verification_status: "approved" as const,
    status: "active" as const,
    commission_rate: 15,
    description: "Cozy self-care products for the perfect home spa experience",
  },
]

const SUBSCRIPTION_PLANS = [
  {
    handle: "wellness-essentials",
    name: "Wellness Essentials",
    description: "Monthly curated box with 3-5 premium wellness products",
    price: 4900, // in cents
    currency_code: "usd",
    billing_interval: "monthly" as const,
    status: "active" as const,
    trial_period_days: 7,
    features: [
      "3-5 full-size products monthly",
      "Free shipping",
      "10% member discount on store",
      "Early access to new products"
    ],
  },
  {
    handle: "premium-ritual",
    name: "Premium Ritual",
    description: "Quarterly luxury wellness experience with 8-10 premium products",
    price: 14900, // in cents
    currency_code: "usd",
    billing_interval: "quarterly" as const,
    status: "active" as const,
    trial_period_days: 0,
    features: [
      "8-10 premium products quarterly",
      "Exclusive limited-edition items",
      "Personal wellness consultation",
      "20% member discount on store",
      "Priority customer support"
    ],
  },
  {
    handle: "self-care-starter",
    name: "Self-Care Starter",
    description: "Perfect introduction to Nordic wellness with 2-3 products",
    price: 2900, // in cents
    currency_code: "usd",
    billing_interval: "monthly" as const,
    status: "active" as const,
    trial_period_days: 14,
    features: [
      "2-3 curated products monthly",
      "Free shipping on orders over $35",
      "5% member discount on store"
    ],
  },
  {
    handle: "annual-wellness",
    name: "Annual Wellness Membership",
    description: "Best value - full year of wellness with exclusive perks",
    price: 44900, // in cents
    currency_code: "usd",
    billing_interval: "yearly" as const,
    status: "active" as const,
    trial_period_days: 0,
    features: [
      "12 monthly boxes (save $139)",
      "Annual bonus box worth $100",
      "25% member discount on store",
      "Free expedited shipping",
      "Exclusive member events"
    ],
  },
]

const B2B_COMPANIES = [
  {
    handle: "serenity-spa",
    name: "Serenity Spa & Resort",
    tenant_id: "default",
    email: "procurement@serenityresort.com",
    phone: "+1-555-1001",
    tax_id: "12-3456789",
    industry: "hospitality",
    credit_limit: 5000000, // in cents
    payment_terms_days: 30,
    tier: "gold" as const,
    status: "active" as const,
  },
  {
    handle: "wellness-first",
    name: "Wellness First Clinics",
    tenant_id: "default",
    email: "orders@wellnessfirst.com",
    phone: "+1-555-1002",
    tax_id: "23-4567890",
    industry: "healthcare",
    credit_limit: 10000000, // in cents
    payment_terms_days: 45,
    tier: "platinum" as const,
    status: "active" as const,
  },
  {
    handle: "harmony-yoga",
    name: "Harmony Yoga Studios",
    tenant_id: "default",
    email: "supplies@harmonyyoga.com",
    phone: "+1-555-1003",
    tax_id: "34-5678901",
    industry: "fitness",
    credit_limit: 1500000, // in cents
    payment_terms_days: 15,
    tier: "silver" as const,
    status: "active" as const,
  },
]

const VOLUME_PRICING_TIERS = [
  { min_quantity: 10, max_quantity: 24, discount_percentage: 10 },
  { min_quantity: 25, max_quantity: 49, discount_percentage: 15 },
  { min_quantity: 50, max_quantity: 99, discount_percentage: 20 },
  { min_quantity: 100, max_quantity: null, discount_percentage: 25 },
]

const SAMPLE_REVIEWS = [
  { rating: 5, title: "Absolutely love this!", content: "The quality exceeded my expectations. Amazing product!", is_verified: true },
  { rating: 4, title: "Great product", content: "Really effective. Only reason not 5 stars is the price.", is_verified: true },
  { rating: 5, title: "My new favorite!", content: "Best product I've tried in years. Highly recommend.", is_verified: true },
  { rating: 3, title: "Good but not great", content: "Nice product overall but didn't see dramatic results.", is_verified: false },
  { rating: 5, title: "Perfect gift!", content: "Bought as a gift and they loved it. Beautiful packaging.", is_verified: true },
]

export default async function seedComplete({ container }: ExecArgs) {
  const query = container.resolve("query")
  
  console.log("========================================")
  console.log("Starting Complete Data Seed")
  console.log("========================================\n")
  
  // 1. Seed Vendors
  console.log("1. Seeding Vendors...")
  let vendorCount = 0
  try {
    const vendorService = container.resolve("vendor")
    
    for (const vendorData of VENDORS) {
      try {
        const { data: existing } = await query.graph({
          entity: "vendor",
          fields: ["id"],
          filters: { handle: vendorData.handle }
        })
        
        if (!existing || existing.length === 0) {
          await vendorService.createVendors(vendorData)
          vendorCount++
          console.log(`   Created vendor: ${vendorData.business_name}`)
        } else {
          console.log(`   Skipped (exists): ${vendorData.business_name}`)
        }
      } catch (error: any) {
        console.log(`   Error with vendor ${vendorData.business_name}: ${error.message}`)
      }
    }
  } catch (error: any) {
    console.log(`   Vendor service not available: ${error.message}`)
  }
  
  // 2. Seed Subscription Plans
  console.log("\n2. Seeding Subscription Plans...")
  let planCount = 0
  try {
    const subscriptionService = container.resolve("subscription")
    
    for (const planData of SUBSCRIPTION_PLANS) {
      try {
        const { data: existing } = await query.graph({
          entity: "subscription_plan",
          fields: ["id"],
          filters: { handle: planData.handle }
        })
        
        if (!existing || existing.length === 0) {
          await subscriptionService.createSubscriptionPlans(planData)
          planCount++
          console.log(`   Created plan: ${planData.name}`)
        } else {
          console.log(`   Skipped (exists): ${planData.name}`)
        }
      } catch (error: any) {
        console.log(`   Error with plan ${planData.name}: ${error.message}`)
      }
    }
  } catch (error: any) {
    console.log(`   Subscription service not available: ${error.message}`)
  }
  
  // 3. Seed B2B Companies
  console.log("\n3. Seeding B2B Companies...")
  let companyCount = 0
  try {
    const companyService = container.resolve("company")
    
    for (const companyData of B2B_COMPANIES) {
      try {
        const { data: existing } = await query.graph({
          entity: "company",
          fields: ["id"],
          filters: { email: companyData.email }
        })
        
        if (!existing || existing.length === 0) {
          await companyService.createCompanies(companyData)
          companyCount++
          console.log(`   Created company: ${companyData.name}`)
        } else {
          console.log(`   Skipped (exists): ${companyData.name}`)
        }
      } catch (error: any) {
        console.log(`   Error with company ${companyData.name}: ${error.message}`)
      }
    }
  } catch (error: any) {
    console.log(`   Company service not available: ${error.message}`)
  }
  
  // 4. Seed Volume Pricing
  console.log("\n4. Seeding Volume Pricing Tiers...")
  let volumePricingCount = 0
  try {
    const volumePricingService = container.resolve("volumePricing")
    
    // Get first 5 products
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id", "title"],
      pagination: { take: 5 }
    })
    
    if (products && products.length > 0) {
      for (const product of products) {
        for (const tier of VOLUME_PRICING_TIERS) {
          try {
            await volumePricingService.createVolumePricingTiers({
              product_id: product.id,
              ...tier,
              is_active: true
            })
          } catch {
            // Ignore duplicates
          }
        }
        volumePricingCount++
        console.log(`   Added tiers to: ${product.title}`)
      }
    } else {
      console.log("   No products found to add volume pricing")
    }
  } catch (error: any) {
    console.log(`   Volume pricing service not available: ${error.message}`)
  }
  
  // 5. Seed Sample Reviews
  console.log("\n5. Seeding Sample Reviews...")
  let reviewCount = 0
  try {
    const reviewService = container.resolve("review")
    
    // Get first 10 products
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id", "title"],
      pagination: { take: 10 }
    })
    
    if (products && products.length > 0) {
      for (const product of products) {
        // Add 2-4 random reviews per product
        const numReviews = Math.floor(Math.random() * 3) + 2
        for (let i = 0; i < numReviews; i++) {
          const reviewData = SAMPLE_REVIEWS[Math.floor(Math.random() * SAMPLE_REVIEWS.length)]
          try {
            await reviewService.createReviews({
              ...reviewData,
              product_id: product.id,
              is_approved: true,
              helpful_count: Math.floor(Math.random() * 30)
            })
            reviewCount++
          } catch {
            // Ignore errors
          }
        }
        console.log(`   Added reviews to: ${product.title}`)
      }
    } else {
      console.log("   No products found to add reviews")
    }
  } catch (error: any) {
    console.log(`   Review service not available: ${error.message}`)
  }
  
  console.log("\n========================================")
  console.log("Seed Complete!")
  console.log("========================================")
  console.log(`
Summary:
- Vendors: ${vendorCount} created
- Subscription Plans: ${planCount} created
- B2B Companies: ${companyCount} created
- Volume Pricing: ${volumePricingCount} products updated
- Reviews: ${reviewCount} created
  `)
}
