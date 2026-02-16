// @ts-nocheck
import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { SeedContext, getImage, sarPrice } from "./seed-utils.js"

export default async function seedPlatform({ container }: ExecArgs, ctx: SeedContext): Promise<void> {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  const log = (msg: string) => {
    logger.info(String(msg))
  }

  const logError = (section: string, err: any) => {
    logger.warn(`  ❌ ${section} failed: ${err.message}`)
  }

  const resolveService = (key: string) => {
    try {
      return container.resolve(key) as any
    } catch {
      return null
    }
  }

  const resolveAny = (...keys: string[]) => {
    for (const key of keys) {
      const svc = resolveService(key)
      if (svc) return svc
    }
    return null
  }

  log("╔══════════════════════════════════════════════════════════════╗")
  log("║        DAKKAH CITYOS — PLATFORM SEED                       ║")
  log("╚══════════════════════════════════════════════════════════════╝")
  log("")

  // ════════════════════════════════════════════════════════════════
  // 1. TENANT
  // ════════════════════════════════════════════════════════════════
  log("━━━ [1/12] TENANT ━━━")
  try {
    const svc = resolveService("tenant")
    if (!svc) {
      log("  ⚠ tenant service not found, skipping")
    } else {
      const existing = await svc.listTenants({ slug: "dakkah" })
      const list = Array.isArray(existing) ? existing : [existing].filter(Boolean)

      if (list.length > 0 && list[0]?.id) {
        log("  ✓ Tenant already exists, skipping")
      } else {
        await svc.createTenants({
          name: "Dakkah",
          slug: "dakkah",
          domain: "dakkah.sa",
          is_active: true,
          settings: {
            currency_code: "sar",
            default_locale: "ar",
            supported_locales: ["ar", "en", "fr"],
            timezone: "Asia/Riyadh",
            primary_color: "#1a5f2a",
            accent_color: "#d4af37",
          },
          metadata: { seeded: true },
        })
        log("  ✓ Created Dakkah tenant")
      }
    }
  } catch (err: any) {
    logError("Tenant", err)
  }

  // ════════════════════════════════════════════════════════════════
  // 2. NODES (5-level hierarchy)
  // ════════════════════════════════════════════════════════════════
  log("━━━ [2/12] NODES ━━━")
  try {
    const svc = resolveService("node")
    if (!svc) {
      log("  ⚠ node service not found, skipping")
    } else {
      const existing = await svc.listNodes({ tenant_id: ctx.tenantId })
      const nodeList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

      if (nodeList.length > 0 && nodeList[0]?.id) {
        log("  ✓ Nodes already exist, skipping")
      } else {
        const createNode = svc.createNodeWithValidation?.bind(svc) || svc.createNodes?.bind(svc)

        const riyadh = await createNode({
          tenant_id: ctx.tenantId,
          name: "Riyadh",
          slug: "riyadh",
          code: "RUH",
          type: "CITY",
          parent_id: null,
          location: { lat: 24.7136, lng: 46.6753 },
          status: "active",
          metadata: { seeded: true },
        })

        const alOlaya = await createNode({
          tenant_id: ctx.tenantId,
          name: "Al Olaya",
          slug: "al-olaya",
          code: "OLY",
          type: "DISTRICT",
          parent_id: riyadh.id,
          location: { lat: 24.6911, lng: 46.6853 },
          status: "active",
          metadata: { seeded: true },
        })

        const alOlayaCommercial = await createNode({
          tenant_id: ctx.tenantId,
          name: "Al Olaya Commercial",
          slug: "al-olaya-commercial",
          code: "OLC",
          type: "ZONE",
          parent_id: alOlaya.id,
          location: { lat: 24.6900, lng: 46.6850 },
          status: "active",
          metadata: { seeded: true },
        })

        const dakkahMall = await createNode({
          tenant_id: ctx.tenantId,
          name: "Dakkah Mall",
          slug: "dakkah-mall",
          code: "DKM",
          type: "FACILITY",
          parent_id: alOlayaCommercial.id,
          location: { lat: 24.6895, lng: 46.6845 },
          status: "active",
          metadata: { seeded: true },
        })

        await createNode({
          tenant_id: ctx.tenantId,
          name: "Main Warehouse",
          slug: "main-warehouse",
          code: "MWH",
          type: "ASSET",
          parent_id: dakkahMall.id,
          location: { lat: 24.6890, lng: 46.6840 },
          status: "active",
          metadata: { seeded: true },
        })

        const jeddah = await createNode({
          tenant_id: ctx.tenantId,
          name: "Jeddah",
          slug: "jeddah",
          code: "JED",
          type: "CITY",
          parent_id: null,
          location: { lat: 21.4858, lng: 39.1925 },
          status: "active",
          metadata: { seeded: true },
        })

        await createNode({
          tenant_id: ctx.tenantId,
          name: "Al Rawdah",
          slug: "al-rawdah",
          code: "RWD",
          type: "DISTRICT",
          parent_id: jeddah.id,
          location: { lat: 21.5200, lng: 39.1700 },
          status: "active",
          metadata: { seeded: true },
        })

        log("  ✓ Created 7 nodes (2 cities, 2 districts, 1 zone, 1 facility, 1 asset)")
      }
    }
  } catch (err: any) {
    logError("Node", err)
  }

  // ════════════════════════════════════════════════════════════════
  // 3. GOVERNANCE POLICIES
  // ════════════════════════════════════════════════════════════════
  log("━━━ [3/12] GOVERNANCE ━━━")
  try {
    const svc = resolveService("governance")
    if (!svc) {
      log("  ⚠ governance service not found, skipping")
    } else {
      const existing = await svc.listGovernanceAuthoritys?.() || await svc.listGovernanceAuthorities?.() || []
      const govList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

      if (govList.length > 0 && govList[0]?.id) {
        log("  ✓ Governance policies already exist, skipping")
      } else {
        const create = svc.createGovernanceAuthoritys?.bind(svc) || svc.createGovernanceAuthorities?.bind(svc)

        await create({
          tenant_id: ctx.tenantId,
          name: "Return Policy",
          slug: "return-policy",
          description: "14 day return window for most products",
          type: "commerce",
          rules: {
            return_window_days: 14,
            requires_original_packaging: true,
            excludes: ["perishables", "digital-products", "custom-orders"],
            refund_method: "original_payment",
          },
          is_active: true,
          status: "active",
          metadata: { seeded: true },
        })

        await create({
          tenant_id: ctx.tenantId,
          name: "Vendor Commission Policy",
          slug: "vendor-commission-policy",
          description: "Default 10% commission on all vendor sales",
          type: "financial",
          rules: {
            default_rate: 10,
            currency: "sar",
            payout_frequency: "bi-weekly",
            minimum_payout: 500,
          },
          is_active: true,
          status: "active",
          metadata: { seeded: true },
        })

        await create({
          tenant_id: ctx.tenantId,
          name: "Content Moderation Policy",
          slug: "content-moderation-policy",
          description: "All listings require approval before going live",
          type: "content",
          rules: {
            requires_approval: true,
            auto_reject_keywords: ["prohibited", "counterfeit"],
            image_moderation: true,
            review_sla_hours: 24,
          },
          is_active: true,
          status: "active",
          metadata: { seeded: true },
        })

        await create({
          tenant_id: ctx.tenantId,
          name: "Data Privacy Policy",
          slug: "data-privacy-policy",
          description: "GDPR/PDPL compliance for data handling",
          type: "data",
          rules: {
            compliance_frameworks: ["GDPR", "PDPL"],
            data_retention_days: 730,
            right_to_deletion: true,
            consent_required: true,
            encryption_at_rest: true,
          },
          is_active: true,
          status: "active",
          metadata: { seeded: true },
        })

        log("  ✓ Created 4 governance policies")
      }
    }
  } catch (err: any) {
    logError("Governance", err)
  }

  // ════════════════════════════════════════════════════════════════
  // 4. PERSONAS
  // ════════════════════════════════════════════════════════════════
  log("━━━ [4/12] PERSONAS ━━━")
  try {
    const svc = resolveService("persona")
    if (!svc) {
      log("  ⚠ persona service not found, skipping")
    } else {
      const existing = await svc.listPersonas({ tenant_id: ctx.tenantId })
      const pList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

      if (pList.length > 0 && pList[0]?.id) {
        log("  ✓ Personas already exist, skipping")
      } else {
        await svc.createPersonas([
          {
            tenant_id: ctx.tenantId,
            name: "Consumer",
            slug: "consumer",
            description: "Standard buyer persona for retail customers",
            weight: 1,
            is_active: true,
            status: "active",
            metadata: { seeded: true },
          },
          {
            tenant_id: ctx.tenantId,
            name: "Vendor",
            slug: "vendor",
            description: "Marketplace seller managing products and orders",
            weight: 2,
            is_active: true,
            status: "active",
            metadata: { seeded: true },
          },
          {
            tenant_id: ctx.tenantId,
            name: "Enterprise",
            slug: "enterprise",
            description: "B2B buyer with bulk purchasing and credit terms",
            weight: 3,
            is_active: true,
            status: "active",
            metadata: { seeded: true },
          },
          {
            tenant_id: ctx.tenantId,
            name: "Government",
            slug: "government",
            description: "Government entity with procurement workflows",
            weight: 4,
            is_active: true,
            status: "active",
            metadata: { seeded: true },
          },
          {
            tenant_id: ctx.tenantId,
            name: "Community",
            slug: "community",
            description: "Community organizer for events and local initiatives",
            weight: 5,
            is_active: true,
            status: "active",
            metadata: { seeded: true },
          },
          {
            tenant_id: ctx.tenantId,
            name: "Admin",
            slug: "admin",
            description: "Platform administrator with full system access",
            weight: 6,
            is_active: true,
            status: "active",
            metadata: { seeded: true },
          },
        ])
        log("  ✓ Created 6 personas")
      }
    }
  } catch (err: any) {
    logError("Persona", err)
  }

  // ════════════════════════════════════════════════════════════════
  // 5. CHANNELS (Regional)
  // ════════════════════════════════════════════════════════════════
  log("━━━ [5/12] CHANNELS ━━━")
  try {
    const svc = resolveService("channel")
    if (!svc) {
      log("  ⚠ channel service not found, skipping")
    } else {
      const existing = await svc.listChannels({ tenant_id: ctx.tenantId })
      const chList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

      if (chList.length > 0 && chList[0]?.id) {
        log("  ✓ Channels already exist, skipping")
      } else {
        const create = svc.createChannels?.bind(svc)
        await create([
          {
            tenant_id: ctx.tenantId,
            name: "Saudi Arabia",
            slug: "saudi-arabia",
            type: "regional",
            region: "SA",
            is_active: true,
            status: "active",
            metadata: { seeded: true },
          },
          {
            tenant_id: ctx.tenantId,
            name: "UAE",
            slug: "uae",
            type: "regional",
            region: "AE",
            is_active: true,
            status: "active",
            metadata: { seeded: true },
          },
          {
            tenant_id: ctx.tenantId,
            name: "GCC",
            slug: "gcc",
            type: "regional",
            region: "GCC",
            is_active: true,
            status: "active",
            metadata: { seeded: true },
          },
        ])
        log("  ✓ Created 3 regional channels")
      }
    }
  } catch (err: any) {
    logError("Channel", err)
  }

  // ════════════════════════════════════════════════════════════════
  // 6. REGION ZONES
  // ════════════════════════════════════════════════════════════════
  log("━━━ [6/12] REGION ZONES ━━━")
  try {
    const svc = resolveAny("regionZone", "region_zone", "region-zone")
    if (!svc) {
      log("  ⚠ regionZone service not found, skipping")
    } else {
      const existing = await svc.listRegionZones({ tenant_id: ctx.tenantId })
      const rzList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

      if (rzList.length > 0 && rzList[0]?.id) {
        log("  ✓ Region zones already exist, skipping")
      } else {
        const create = svc.createRegionZones?.bind(svc)
        await create([
          {
            tenant_id: ctx.tenantId,
            name: "Central Region",
            slug: "central-region",
            cities: ["Riyadh", "Qassim"],
            is_active: true,
            status: "active",
            metadata: { seeded: true },
          },
          {
            tenant_id: ctx.tenantId,
            name: "Western Region",
            slug: "western-region",
            cities: ["Jeddah", "Mecca", "Medina"],
            is_active: true,
            status: "active",
            metadata: { seeded: true },
          },
          {
            tenant_id: ctx.tenantId,
            name: "Eastern Region",
            slug: "eastern-region",
            cities: ["Dammam", "Khobar", "Dhahran"],
            is_active: true,
            status: "active",
            metadata: { seeded: true },
          },
        ])
        log("  ✓ Created 3 region zones")
      }
    }
  } catch (err: any) {
    logError("Region Zone", err)
  }

  // ════════════════════════════════════════════════════════════════
  // 7. CMS CONTENT (Navigation & Verticals)
  // ════════════════════════════════════════════════════════════════
  log("━━━ [7/12] CMS CONTENT ━━━")
  try {
    const svc = resolveAny("cmsContent", "cms_content", "cms-content")
    if (!svc) {
      log("  ⚠ cmsContent service not found, skipping")
    } else {
      const create = svc.createCmsContents?.bind(svc) || svc.createCmsContent?.bind(svc)

      await create({
        tenant_id: ctx.tenantId,
        type: "navigation",
        slug: "header",
        title: "Header Navigation",
        data: {
          location: "header",
          items: [
            { title: "Shop", url: "/store" },
            { title: "Bookings", url: "/bookings" },
            { title: "Restaurants", url: "/restaurants" },
            { title: "Travel", url: "/travel" },
            { title: "Deals", url: "/flash-deals" },
          ],
        },
        is_active: true,
        status: "active",
        metadata: { seeded: true },
      })

      await create({
        tenant_id: ctx.tenantId,
        type: "navigation",
        slug: "footer",
        title: "Footer Navigation",
        data: {
          location: "footer",
          items: [
            { title: "About Us", url: "/about" },
            { title: "Contact", url: "/contact" },
            { title: "Privacy Policy", url: "/privacy" },
            { title: "Terms of Service", url: "/terms" },
            { title: "Careers", url: "/careers" },
            { title: "Help Center", url: "/help" },
          ],
        },
        is_active: true,
        status: "active",
        metadata: { seeded: true },
      })

      await create({
        tenant_id: ctx.tenantId,
        type: "verticals",
        slug: "verticals",
        title: "Platform Verticals",
        data: {
          verticals: [
            { name: "Products", slug: "products", icon: "shopping-bag" },
            { name: "Restaurants", slug: "restaurants", icon: "utensils" },
            { name: "Bookings", slug: "bookings", icon: "calendar" },
            { name: "Travel", slug: "travel", icon: "plane" },
            { name: "Grocery", slug: "grocery", icon: "shopping-cart" },
            { name: "Events", slug: "events", icon: "ticket" },
            { name: "Real Estate", slug: "real-estate", icon: "building" },
            { name: "Automotive", slug: "automotive", icon: "car" },
            { name: "Healthcare", slug: "healthcare", icon: "heart" },
            { name: "Education", slug: "education", icon: "book" },
          ],
        },
        is_active: true,
        status: "active",
        metadata: { seeded: true },
      })

      log("  ✓ Created 3 CMS content entries (header nav, footer nav, verticals)")
    }
  } catch (err: any) {
    logError("CMS Content", err)
  }

  // ════════════════════════════════════════════════════════════════
  // 8. LOYALTY TIERS
  // ════════════════════════════════════════════════════════════════
  log("━━━ [8/12] LOYALTY ━━━")
  try {
    const svc = resolveService("loyalty")
    if (!svc) {
      log("  ⚠ loyalty service not found, skipping")
    } else {
      const existing = await svc.listLoyaltyPrograms?.({ tenant_id: ctx.tenantId }) ||
        await svc.listLoyaltyTiers?.({ tenant_id: ctx.tenantId }) || []
      const lList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

      if (lList.length > 0 && lList[0]?.id) {
        log("  ✓ Loyalty tiers already exist, skipping")
      } else {
        const createTier = svc.createLoyaltyPrograms?.bind(svc) || svc.createLoyaltyTiers?.bind(svc)

        await createTier([
          {
            tenant_id: ctx.tenantId,
            name: "Dakkah Explorer",
            slug: "dakkah-explorer",
            tier: "bronze",
            points_threshold: 0,
            benefits: {
              free_shipping_over: sarPrice(200),
              discount_percentage: 0,
              priority_support: false,
            },
            is_active: true,
            status: "active",
            metadata: { seeded: true },
          },
          {
            tenant_id: ctx.tenantId,
            name: "Dakkah Elite",
            slug: "dakkah-elite",
            tier: "silver",
            points_threshold: 10000,
            benefits: {
              free_express_shipping: true,
              cashback_percentage: 5,
              priority_support: true,
              early_access: true,
            },
            is_active: true,
            status: "active",
            metadata: { seeded: true },
          },
          {
            tenant_id: ctx.tenantId,
            name: "Dakkah VIP",
            slug: "dakkah-vip",
            tier: "gold",
            points_threshold: 50000,
            benefits: {
              same_day_delivery: true,
              cashback_percentage: 10,
              priority_support: true,
              early_access: true,
              dedicated_account_manager: true,
              exclusive_events: true,
            },
            is_active: true,
            status: "active",
            metadata: { seeded: true },
          },
        ])
        log("  ✓ Created 3 loyalty tiers")
      }
    }
  } catch (err: any) {
    logError("Loyalty", err)
  }

  // ════════════════════════════════════════════════════════════════
  // 9. REVIEWS
  // ════════════════════════════════════════════════════════════════
  log("━━━ [9/12] REVIEWS ━━━")
  try {
    const svc = resolveService("review")
    if (!svc) {
      log("  ⚠ review service not found, skipping")
    } else {
      const productIds = ctx.productIds || []
      if (productIds.length === 0) {
        log("  ⚠ No products in context, skipping reviews")
      } else {
        const existing = await svc.listReviews?.({ product_id: productIds[0] }) || []
        const rList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

        if (rList.length > 0 && rList[0]?.id) {
          log("  ✓ Reviews already exist, skipping")
        } else {
          const create = svc.createReviews?.bind(svc)
          const reviews = [
            {
              tenant_id: ctx.tenantId,
              product_id: productIds[0],
              customer_id: ctx.customerIds?.[0] || null,
              reviewer_name: "Ahmed Al-Rashid",
              rating: 5,
              title: "Excellent quality",
              content: "Outstanding product, exactly as described. Fast delivery to Riyadh.",
              is_verified: true,
              status: "approved",
              metadata: { seeded: true },
            },
            {
              tenant_id: ctx.tenantId,
              product_id: productIds[0],
              customer_id: ctx.customerIds?.[1] || null,
              reviewer_name: "Fatima Al-Zahra",
              rating: 4,
              title: "Very good value",
              content: "Great product for the price. Packaging was excellent and arrived in perfect condition.",
              is_verified: true,
              status: "approved",
              metadata: { seeded: true },
            },
            {
              tenant_id: ctx.tenantId,
              product_id: productIds[Math.min(1, productIds.length - 1)],
              customer_id: ctx.customerIds?.[0] || null,
              reviewer_name: "Mohammed Al-Saud",
              rating: 5,
              title: "Highly recommended",
              content: "This exceeded my expectations. The quality is superb and customer service was very helpful.",
              is_verified: true,
              status: "approved",
              metadata: { seeded: true },
            },
            {
              tenant_id: ctx.tenantId,
              product_id: productIds[Math.min(1, productIds.length - 1)],
              customer_id: ctx.customerIds?.[2] || null,
              reviewer_name: "Sara Al-Otaibi",
              rating: 4,
              title: "Good purchase",
              content: "Satisfied with the quality. Shipping to Jeddah was quick. Would buy again.",
              is_verified: true,
              status: "approved",
              metadata: { seeded: true },
            },
            {
              tenant_id: ctx.tenantId,
              product_id: productIds[Math.min(2, productIds.length - 1)],
              customer_id: ctx.customerIds?.[1] || null,
              reviewer_name: "Khalid Al-Dosari",
              rating: 5,
              title: "Perfect gift",
              content: "Bought this as a gift and it was a hit. Beautiful packaging and premium feel.",
              is_verified: true,
              status: "approved",
              metadata: { seeded: true },
            },
            {
              tenant_id: ctx.tenantId,
              product_id: productIds[Math.min(2, productIds.length - 1)],
              customer_id: ctx.customerIds?.[0] || null,
              reviewer_name: "Noura Al-Harbi",
              rating: 4,
              title: "Solid quality",
              content: "Good build quality and value for money. Delivery was prompt to my address in Dammam.",
              is_verified: true,
              status: "approved",
              metadata: { seeded: true },
            },
            {
              tenant_id: ctx.tenantId,
              product_id: productIds[Math.min(3, productIds.length - 1)],
              customer_id: ctx.customerIds?.[2] || null,
              reviewer_name: "Abdullah Al-Qahtani",
              rating: 5,
              title: "Amazing product",
              content: "Best purchase I've made this year. The Dakkah platform made it so easy to order.",
              is_verified: true,
              status: "approved",
              metadata: { seeded: true },
            },
            {
              tenant_id: ctx.tenantId,
              product_id: productIds[Math.min(3, productIds.length - 1)],
              customer_id: ctx.customerIds?.[1] || null,
              reviewer_name: "Hessa Al-Mutairi",
              rating: 4,
              title: "Great experience",
              content: "Smooth ordering process and the product arrived well-packaged. Very happy with it.",
              is_verified: true,
              status: "approved",
              metadata: { seeded: true },
            },
          ]

          await create(reviews)
          log("  ✓ Created 8 product reviews")
        }
      }
    }
  } catch (err: any) {
    logError("Review", err)
  }

  // ════════════════════════════════════════════════════════════════
  // 10. WISHLIST
  // ════════════════════════════════════════════════════════════════
  log("━━━ [10/12] WISHLIST ━━━")
  try {
    const svc = resolveService("wishlist")
    if (!svc) {
      log("  ⚠ wishlist service not found, skipping")
    } else {
      const customerId = ctx.customerIds?.[0]
      const productIds = ctx.productIds || []

      if (!customerId || productIds.length === 0) {
        log("  ⚠ No customers or products in context, skipping wishlist")
      } else {
        const existing = await svc.listWishlists?.({ customer_id: customerId }) || []
        const wList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

        if (wList.length > 0 && wList[0]?.id) {
          log("  ✓ Wishlist already exists, skipping")
        } else {
          const create = svc.createWishlists?.bind(svc)
          const itemsToAdd = productIds.slice(0, 3)

          await create({
            tenant_id: ctx.tenantId,
            customer_id: customerId,
            name: "My Wishlist",
            items: itemsToAdd.map((pid) => ({
              product_id: pid,
              added_at: new Date().toISOString(),
            })),
            is_active: true,
            metadata: { seeded: true },
          })
          log(`  ✓ Created wishlist with ${itemsToAdd.length} products`)
        }
      }
    }
  } catch (err: any) {
    logError("Wishlist", err)
  }

  // ════════════════════════════════════════════════════════════════
  // 11. WALLET
  // ════════════════════════════════════════════════════════════════
  log("━━━ [11/12] WALLET ━━━")
  try {
    const svc = resolveService("wallet")
    if (!svc) {
      log("  ⚠ wallet service not found, skipping")
    } else {
      const customerIds = ctx.customerIds || []
      if (customerIds.length === 0) {
        log("  ⚠ No customers in context, skipping wallets")
      } else {
        const existing = await svc.listWallets?.({ customer_id: customerIds[0] }) || []
        const walletList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

        if (walletList.length > 0 && walletList[0]?.id) {
          log("  ✓ Wallets already exist, skipping")
        } else {
          const create = svc.createWallets?.bind(svc)
          const balances = [
            { customerId: customerIds[0], balance: sarPrice(500) },
            { customerId: customerIds[Math.min(1, customerIds.length - 1)], balance: sarPrice(250) },
            { customerId: customerIds[Math.min(2, customerIds.length - 1)], balance: sarPrice(100) },
          ]

          for (const { customerId, balance } of balances) {
            await create({
              tenant_id: ctx.tenantId,
              customer_id: customerId,
              currency_code: "sar",
              balance,
              is_active: true,
              status: "active",
              metadata: { seeded: true },
            })
          }
          log("  ✓ Created wallets for 3 customers")
        }
      }
    }
  } catch (err: any) {
    logError("Wallet", err)
  }

  // ════════════════════════════════════════════════════════════════
  // 12. AUDIT LOG
  // ════════════════════════════════════════════════════════════════
  log("━━━ [12/12] AUDIT ━━━")
  try {
    const svc = resolveService("audit")
    if (!svc) {
      log("  ⚠ audit service not found, skipping")
    } else {
      const create = svc.createAuditLogs?.bind(svc) || svc.createAuditEntries?.bind(svc) || svc.createAuditEntrys?.bind(svc)

      await create({
        tenant_id: ctx.tenantId,
        action: "SEED",
        entity_type: "system",
        entity_id: ctx.tenantId,
        description: "Initial platform data seed completed",
        actor: "system",
        ip_address: "127.0.0.1",
        metadata: { seeded: true, seeded_at: new Date().toISOString() },
      })
      log("  ✓ Created initial audit log entry")
    }
  } catch (err: any) {
    logError("Audit", err)
  }

  log("")
  log("╔══════════════════════════════════════════════════════════════╗")
  log("║        PLATFORM SEED COMPLETE                               ║")
  log("╚══════════════════════════════════════════════════════════════╝")
}
