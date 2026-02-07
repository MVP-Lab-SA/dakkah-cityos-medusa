import { ExecArgs } from "@medusajs/framework/types"

// Seed data definitions
const VENDORS = [
  {
    handle: "nordic-wellness-co",
    name: "Nordic Wellness Co",
    description: "Premium Scandinavian wellness products crafted with pure Arctic ingredients",
    contact_email: "contact@nordicwellness.co",
    contact_phone: "+1-555-0101",
    is_verified: true,
    is_featured: true,
    commission_rate: 15,
    status: "active",
  },
  {
    handle: "arctic-botanicals",
    name: "Arctic Botanicals",
    description: "Wild-harvested botanical skincare from the Arctic Circle",
    contact_email: "hello@arcticbotanicals.com",
    contact_phone: "+1-555-0102",
    is_verified: true,
    is_featured: true,
    commission_rate: 12,
    status: "active",
  },
  {
    handle: "fjord-essentials",
    name: "Fjord Essentials",
    description: "Essential oils and aromatherapy inspired by Norwegian fjords",
    contact_email: "info@fjordessentials.no",
    contact_phone: "+1-555-0103",
    is_verified: true,
    is_featured: false,
    commission_rate: 18,
    status: "active",
  },
  {
    handle: "hygge-home-spa",
    name: "Hygge Home Spa",
    description: "Cozy self-care products for the perfect home spa experience",
    contact_email: "care@hyggehomespa.dk",
    contact_phone: "+1-555-0104",
    is_verified: true,
    is_featured: false,
    commission_rate: 15,
    status: "active",
  },
]

const SERVICES = [
  {
    handle: "swedish-massage-60",
    name: "Swedish Massage",
    description: "Classic relaxation massage using long, flowing strokes to ease tension and promote circulation",
    duration_minutes: 60,
    price: 120,
    category: "massage",
    is_active: true,
    max_capacity: 1,
    buffer_time_minutes: 15,
  },
  {
    handle: "deep-tissue-massage-90",
    name: "Deep Tissue Massage",
    description: "Intensive massage targeting deep muscle layers to release chronic tension",
    duration_minutes: 90,
    price: 160,
    category: "massage",
    is_active: true,
    max_capacity: 1,
    buffer_time_minutes: 15,
  },
  {
    handle: "nordic-glow-facial",
    name: "Nordic Glow Facial",
    description: "Rejuvenating facial treatment using Arctic berry extracts and birch sap",
    duration_minutes: 75,
    price: 145,
    category: "facial",
    is_active: true,
    max_capacity: 1,
    buffer_time_minutes: 10,
  },
  {
    handle: "hot-stone-therapy",
    name: "Hot Stone Therapy",
    description: "Heated basalt stones combined with massage for deep muscle relaxation",
    duration_minutes: 90,
    price: 175,
    category: "massage",
    is_active: true,
    max_capacity: 1,
    buffer_time_minutes: 20,
  },
  {
    handle: "aromatherapy-session",
    name: "Aromatherapy Session",
    description: "Custom essential oil blend session with relaxation techniques",
    duration_minutes: 45,
    price: 85,
    category: "wellness",
    is_active: true,
    max_capacity: 2,
    buffer_time_minutes: 10,
  },
]

const SUBSCRIPTION_PLANS = [
  {
    handle: "wellness-essentials",
    name: "Wellness Essentials",
    description: "Monthly curated box with 3-5 premium wellness products",
    price: 49,
    billing_interval: "month",
    is_active: true,
    is_featured: true,
    trial_days: 7,
  },
  {
    handle: "premium-ritual",
    name: "Premium Ritual",
    description: "Quarterly luxury wellness experience with 8-10 premium products",
    price: 149,
    billing_interval: "quarter",
    is_active: true,
    is_featured: true,
    trial_days: 0,
  },
  {
    handle: "self-care-starter",
    name: "Self-Care Starter",
    description: "Perfect introduction to Nordic wellness with 2-3 products",
    price: 29,
    billing_interval: "month",
    is_active: true,
    is_featured: false,
    trial_days: 14,
  },
]

const B2B_COMPANIES = [
  {
    name: "Serenity Spa & Resort",
    handle: "serenity-spa",
    email: "procurement@serenityresort.com",
    phone: "+1-555-1001",
    tax_id: "12-3456789",
    industry: "hospitality",
    company_size: "medium",
    credit_limit: 50000,
    payment_terms: "net_30",
    tier: "gold",
    is_verified: true,
  },
  {
    name: "Wellness First Clinics",
    handle: "wellness-first",
    email: "orders@wellnessfirst.com",
    phone: "+1-555-1002",
    tax_id: "23-4567890",
    industry: "healthcare",
    company_size: "large",
    credit_limit: 100000,
    payment_terms: "net_45",
    tier: "platinum",
    is_verified: true,
  },
  {
    name: "Harmony Yoga Studios",
    handle: "harmony-yoga",
    email: "supplies@harmonyyoga.com",
    phone: "+1-555-1003",
    tax_id: "34-5678901",
    industry: "fitness",
    company_size: "small",
    credit_limit: 15000,
    payment_terms: "net_15",
    tier: "silver",
    is_verified: true,
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
          console.log(`   Created vendor: ${vendorData.name}`)
        } else {
          console.log(`   Skipped (exists): ${vendorData.name}`)
        }
      } catch (error: any) {
        console.log(`   Error with vendor ${vendorData.name}: ${error.message}`)
      }
    }
  } catch (error: any) {
    console.log(`   Vendor service not available: ${error.message}`)
  }
  
  // 2. Seed Services
  console.log("\n2. Seeding Bookable Services...")
  let serviceCount = 0
  try {
    const bookingService = container.resolve("booking")
    
    for (const serviceData of SERVICES) {
      try {
        const { data: existing } = await query.graph({
          entity: "service",
          fields: ["id"],
          filters: { handle: serviceData.handle }
        })
        
        if (!existing || existing.length === 0) {
          await bookingService.createServices(serviceData)
          serviceCount++
          console.log(`   Created service: ${serviceData.name}`)
        } else {
          console.log(`   Skipped (exists): ${serviceData.name}`)
        }
      } catch (error: any) {
        console.log(`   Error with service ${serviceData.name}: ${error.message}`)
      }
    }
  } catch (error: any) {
    console.log(`   Booking service not available: ${error.message}`)
  }
  
  // 3. Seed Subscription Plans
  console.log("\n3. Seeding Subscription Plans...")
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
  
  // 4. Seed B2B Companies
  console.log("\n4. Seeding B2B Companies...")
  let companyCount = 0
  try {
    const companyService = container.resolve("company")
    
    for (const companyData of B2B_COMPANIES) {
      try {
        const { data: existing } = await query.graph({
          entity: "company",
          fields: ["id"],
          filters: { handle: companyData.handle }
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
  
  // 5. Seed Volume Pricing
  console.log("\n5. Seeding Volume Pricing Tiers...")
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
  
  // 6. Seed Sample Reviews
  console.log("\n6. Seeding Sample Reviews...")
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
- Services: ${serviceCount} created
- Subscription Plans: ${planCount} created
- B2B Companies: ${companyCount} created
- Volume Pricing: ${volumePricingCount} products updated
- Reviews: ${reviewCount} created
  `)
}
