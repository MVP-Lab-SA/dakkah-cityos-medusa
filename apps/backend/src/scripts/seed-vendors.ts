import { ExecArgs } from "@medusajs/framework/types"

const vendors = [
  {
    handle: "al-baik-fresh",
    business_name: "Al Baik Fresh",
    legal_name: "Al Baik Fresh Trading LLC",
    description: "Saudi fast food and fresh produce chain offering authentic Arabian cuisine and premium fresh produce. Quality ingredients sourced directly from local suppliers.",
    logo_url: "https://images.unsplash.com/photo-1585521537689-cc6dce77ffc6?w=200&h=200&fit=crop",
    banner_url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&h=400&fit=crop",
    business_type: "llc",
    status: "active",
    is_verified: true,
    commission_type: "percentage",
    commission_rate: "15",
    payout_schedule: "weekly",
    total_products: 52,
    total_orders: 428,
    total_sales: "156800",
    rating: 4.8,
    review_count: 237,
    categories: ["food", "restaurants", "fresh-produce"],
  },
  {
    handle: "jarir-bookstore",
    business_name: "Jarir Bookstore",
    legal_name: "Jarir Books & Electronics Corporation",
    description: "Leading Saudi retail destination for books, electronics, and office supplies. Over 40 years of excellence in providing quality products and exceptional service.",
    logo_url: "https://images.unsplash.com/photo-1507842217343-583f20270319?w=200&h=200&fit=crop",
    banner_url: "https://images.unsplash.com/photo-1491841573634-28fb1df537d1?w=1200&h=400&fit=crop",
    business_type: "corporation",
    status: "active",
    is_verified: true,
    commission_type: "percentage",
    commission_rate: "14",
    payout_schedule: "biweekly",
    total_products: 1240,
    total_orders: 892,
    total_sales: "445600",
    rating: 4.9,
    review_count: 514,
    categories: ["electronics", "books", "office"],
  },
  {
    handle: "saudi-luxury-perfumes",
    business_name: "Saudi Luxury Perfumes",
    legal_name: "Saudi Luxury Fragrances LLC",
    description: "Premium oud and traditional Arabic fragrances crafted with the finest ingredients. Authentic scents that capture the essence of Arabian heritage and luxury.",
    logo_url: "https://images.unsplash.com/photo-1594997643862-8f5e2ba89ef8?w=200&h=200&fit=crop",
    banner_url: "https://images.unsplash.com/photo-1548287700-b6221d01ae49?w=1200&h=400&fit=crop",
    business_type: "llc",
    status: "active",
    is_verified: true,
    commission_type: "percentage",
    commission_rate: "16",
    payout_schedule: "weekly",
    total_products: 87,
    total_orders: 612,
    total_sales: "267900",
    rating: 4.9,
    review_count: 341,
    categories: ["fragrances", "oud", "luxury"],
  },
  {
    handle: "madinah-dates-co",
    business_name: "Madinah Dates Co",
    legal_name: "Madinah Premium Dates Corporation",
    description: "Premium dates from Al-Madinah region, carefully selected and packaged for export. Sourced from heritage date palm groves with rich traditions spanning generations.",
    logo_url: "https://images.unsplash.com/photo-1599599810694-e0e96e07e36f?w=200&h=200&fit=crop",
    banner_url: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=1200&h=400&fit=crop",
    business_type: "corporation",
    status: "active",
    is_verified: true,
    commission_type: "percentage",
    commission_rate: "12",
    payout_schedule: "biweekly",
    total_products: 34,
    total_orders: 289,
    total_sales: "98500",
    rating: 4.8,
    review_count: 167,
    categories: ["dates", "food", "gifts"],
  },
  {
    handle: "riyadh-home-decor",
    business_name: "Riyadh Home Décor",
    legal_name: "Riyadh Home Décor Designs LLC",
    description: "Saudi-inspired home furnishings and décor celebrating authentic Arabian design. Handcrafted pieces and contemporary collections for the modern Arabian home.",
    logo_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop",
    banner_url: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1200&h=400&fit=crop",
    business_type: "llc",
    status: "active",
    is_verified: true,
    commission_type: "percentage",
    commission_rate: "13",
    payout_schedule: "weekly",
    total_products: 156,
    total_orders: 324,
    total_sales: "187400",
    rating: 4.7,
    review_count: 189,
    categories: ["home", "decor", "furniture"],
  },
]

export default async function seedVendors({ container }: ExecArgs) {
  const vendorModule = container.resolve("vendor") as any
  const tenantService = container.resolve("tenant") as any

  let tenantId = "ten_default"
  try {
    const tenants = await tenantService.listTenants({ handle: "dakkah" })
    const list = Array.isArray(tenants) ? tenants : [tenants].filter(Boolean)
    if (list.length > 0 && list[0]?.id) {
      tenantId = list[0].id
      console.log(`Using Dakkah tenant: ${tenantId}`)
    } else {
      const allTenants = await tenantService.listTenants()
      const allList = Array.isArray(allTenants) ? allTenants : [allTenants].filter(Boolean)
      if (allList.length > 0 && allList[0]?.id) {
        tenantId = allList[0].id
        console.log(`Dakkah not found, using first tenant: ${tenantId}`)
      }
    }
  } catch (err: any) {
    console.log(`Could not fetch tenants: ${err.message}. Using placeholder: ${tenantId}`)
  }

  console.log("Seeding vendors...")

  for (const vendorData of vendors) {
    try {
      const existing = await vendorModule.listVendors({ handle: vendorData.handle })
      const existingList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

      if (existingList.length > 0) {
        console.log(`  - Vendor ${vendorData.handle} already exists, skipping`)
        continue
      }

      await vendorModule.createVendors({ ...vendorData, tenant_id: tenantId })
      console.log(`  - Created vendor: ${vendorData.business_name}`)
    } catch (error: any) {
      console.error(`  - Failed to create vendor ${vendorData.handle}: ${error.message}`)
    }
  }

  console.log(`Seeded ${vendors.length} vendors`)
}
