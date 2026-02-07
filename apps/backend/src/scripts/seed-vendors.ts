import { ExecArgs } from "@medusajs/framework/types"

const vendors = [
  {
    handle: "nordic-wellness-co",
    business_name: "Nordic Wellness Co",
    legal_name: "Nordic Wellness Company LLC",
    description: "Premium Scandinavian wellness products inspired by Nordic traditions. We specialize in natural skincare, aromatherapy, and holistic health products.",
    logo_url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop",
    banner_url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&h=400&fit=crop",
    business_type: "llc",
    status: "active",
    is_verified: true,
    commission_type: "percentage",
    commission_rate: "15",
    payout_schedule: "weekly",
    total_products: 24,
    total_orders: 156,
    total_sales: "45600",
    rating: 4.8,
    review_count: 89,
    categories: ["wellness", "skincare", "aromatherapy"],
  },
  {
    handle: "arctic-botanicals",
    business_name: "Arctic Botanicals",
    legal_name: "Arctic Botanicals Inc",
    description: "Wild-harvested botanical ingredients from the pristine Arctic regions. Sustainable sourcing and traditional extraction methods.",
    logo_url: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=200&h=200&fit=crop",
    banner_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=400&fit=crop",
    business_type: "corporation",
    status: "active",
    is_verified: true,
    commission_type: "percentage",
    commission_rate: "12",
    payout_schedule: "biweekly",
    total_products: 18,
    total_orders: 98,
    total_sales: "28900",
    rating: 4.9,
    review_count: 67,
    categories: ["botanicals", "supplements", "natural"],
  },
  {
    handle: "fjord-essentials",
    business_name: "Fjord Essentials",
    legal_name: "Fjord Essentials AS",
    description: "Essential oils and natural fragrances inspired by Norwegian fjords. Pure, therapeutic-grade products for mind and body.",
    logo_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop",
    banner_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=400&fit=crop",
    business_type: "llc",
    status: "active",
    is_verified: true,
    commission_type: "percentage",
    commission_rate: "15",
    payout_schedule: "weekly",
    total_products: 32,
    total_orders: 234,
    total_sales: "67800",
    rating: 4.7,
    review_count: 145,
    categories: ["essential-oils", "aromatherapy", "fragrance"],
  },
  {
    handle: "hygge-home",
    business_name: "Hygge Home",
    legal_name: "Hygge Home Goods LLC",
    description: "Cozy Danish-inspired home goods that bring comfort and warmth. Candles, textiles, and wellness products for mindful living.",
    logo_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=200&h=200&fit=crop",
    banner_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=400&fit=crop",
    business_type: "llc",
    status: "active",
    is_verified: false,
    commission_type: "percentage",
    commission_rate: "18",
    payout_schedule: "monthly",
    total_products: 45,
    total_orders: 312,
    total_sales: "89400",
    rating: 4.6,
    review_count: 198,
    categories: ["home", "candles", "textiles"],
  },
  {
    handle: "sauna-ritual",
    business_name: "Sauna Ritual",
    legal_name: "Sauna Ritual Oy",
    description: "Authentic Finnish sauna products and accessories. From traditional birch whisks to modern sauna aromatherapy.",
    logo_url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200&h=200&fit=crop",
    banner_url: "https://images.unsplash.com/photo-1515362655824-9a74989f318e?w=1200&h=400&fit=crop",
    business_type: "corporation",
    status: "active",
    is_verified: true,
    commission_type: "percentage",
    commission_rate: "14",
    payout_schedule: "biweekly",
    total_products: 28,
    total_orders: 178,
    total_sales: "52300",
    rating: 4.9,
    review_count: 112,
    categories: ["sauna", "wellness", "accessories"],
  },
]

export default async function seedVendors({ container }: ExecArgs) {
  const vendorModule = container.resolve("vendor") as any

  console.log("Seeding vendors...")

  for (const vendorData of vendors) {
    try {
      // Check if vendor already exists
      const existing = await vendorModule.listVendors({ handle: vendorData.handle })
      const existingList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

      if (existingList.length > 0) {
        console.log(`  - Vendor ${vendorData.handle} already exists, skipping`)
        continue
      }

      await vendorModule.createVendors(vendorData)
      console.log(`  - Created vendor: ${vendorData.business_name}`)
    } catch (error: any) {
      console.error(`  - Failed to create vendor ${vendorData.handle}: ${error.message}`)
    }
  }

  console.log(`Seeded ${vendors.length} vendors`)
}
