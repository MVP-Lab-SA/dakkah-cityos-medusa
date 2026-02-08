// @ts-nocheck
import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import {
  createApiKeysWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createCustomersWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"

export default async function seedComplete({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)
  const storeModuleService = container.resolve(Modules.STORE)

  console.log("========================================")
  console.log("Starting Complete Data Seed")
  console.log("========================================\n")

  // ============================================================
  // STEP 1: Admin User
  // ============================================================
  console.log("Step 1: Creating admin user...")
  try {
    const { data: existingUsers } = await query.graph({
      entity: "user",
      fields: ["id", "email"],
      filters: { email: "admin@dakkah.com" },
    })

    if (!existingUsers || existingUsers.length === 0) {
      const authModuleService = container.resolve(Modules.AUTH)
      const userModuleService = container.resolve(Modules.USER)

      const authIdentity = await authModuleService.createAuthIdentities({
        provider_identities: [
          {
            provider: "emailpass",
            entity_id: "admin@dakkah.com",
            provider_metadata: {
              password: "admin123456",
            },
          },
        ],
      })

      const user = await userModuleService.createUsers({
        email: "admin@dakkah.com",
        first_name: "Admin",
        last_name: "Dakkah",
      })

      await authModuleService.updateAuthIdentities({
        id: authIdentity.id,
        app_metadata: {
          user_id: user.id,
        },
      })

      console.log("  Created admin user: admin@dakkah.com (password: admin123456)")
    } else {
      console.log("  Admin user already exists")
    }
  } catch (error: any) {
    console.log(`  Admin user step skipped: ${error.message}`)
  }

  // ============================================================
  // STEP 2: Store Settings
  // ============================================================
  console.log("\nStep 2: Setting up store...")
  const [store] = await storeModuleService.listStores()

  // ============================================================
  // STEP 3: Sales Channels
  // ============================================================
  console.log("\nStep 3: Creating sales channels...")
  const channelConfigs = [
    { name: "Default Sales Channel", description: "Default sales channel" },
    { name: "Web Store", description: "Online web storefront" },
    { name: "Mobile App", description: "Mobile application storefront" },
  ]

  const allChannels: any[] = []
  for (const cfg of channelConfigs) {
    let existing = await salesChannelModuleService.listSalesChannels({ name: cfg.name })
    if (!existing.length) {
      const { result } = await createSalesChannelsWorkflow(container).run({
        input: { salesChannelsData: [cfg] },
      })
      existing = result
      console.log(`  Created: ${cfg.name}`)
    } else {
      console.log(`  Exists: ${cfg.name}`)
    }
    allChannels.push(existing[0])
  }

  const allChannelIds = allChannels.map((c) => c.id)

  // ============================================================
  // STEP 4: Update Store
  // ============================================================
  console.log("\nStep 4: Updating store settings...")
  const { data: pricePreferences } = await query.graph({
    entity: "price_preference",
    fields: ["id"],
  })
  if (pricePreferences.length > 0) {
    await container.resolve(Modules.PRICING).deletePricePreferences(pricePreferences.map((pp) => pp.id))
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        supported_currencies: [
          { currency_code: "sar", is_default: true },
          { currency_code: "usd" },
          { currency_code: "eur" },
        ],
        default_sales_channel_id: allChannels[0].id,
      },
    },
  })
  console.log("  Store updated with SAR default currency")

  // ============================================================
  // STEP 5: Regions
  // ============================================================
  console.log("\nStep 5: Creating regions...")
  let menaRegion: any = null
  let intlRegion: any = null

  const { data: existingRegions } = await query.graph({
    entity: "region",
    fields: ["id", "name"],
  })

  if (!existingRegions || existingRegions.length === 0) {
    const { result: regionResult } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "MENA",
            currency_code: "sar",
            countries: ["sa", "ae", "kw", "qa", "bh", "om"],
            payment_providers: ["pp_system_default"],
            automatic_taxes: false,
            is_tax_inclusive: true,
          },
          {
            name: "International",
            currency_code: "usd",
            countries: ["us", "gb"],
            payment_providers: ["pp_system_default"],
            automatic_taxes: false,
            is_tax_inclusive: false,
          },
        ],
      },
    })
    menaRegion = regionResult[0]
    intlRegion = regionResult[1]
    console.log(`  Created ${regionResult.length} regions`)
  } else {
    const foundMena = existingRegions.find((r: any) => r.name === "MENA")
    const foundIntl = existingRegions.find((r: any) => r.name === "International")
    if (foundMena) {
      menaRegion = foundMena
      console.log(`  MENA region found (${foundMena.id})`)
    } else {
      menaRegion = existingRegions[0]
      console.log(`  MENA region not found, using fallback: ${existingRegions[0].name} (${existingRegions[0].id})`)
    }
    if (foundIntl) {
      intlRegion = foundIntl
    }
    console.log(`  Regions already exist (${existingRegions.length})`)
  }

  // ============================================================
  // STEP 6: Stock Location
  // ============================================================
  console.log("\nStep 6: Creating stock location...")
  const stockLocationModule = container.resolve(Modules.STOCK_LOCATION)
  const existingLocations = await stockLocationModule.listStockLocations({ name: "Riyadh Warehouse" })
  let stockLocation: any

  if (existingLocations.length === 0) {
    const { result: stockLocationResult } = await createStockLocationsWorkflow(container).run({
      input: {
        locations: [
          {
            name: "Riyadh Warehouse",
            address: {
              city: "Riyadh",
              country_code: "SA",
              address_1: "King Fahad Road, Al Olaya District",
            },
          },
        ],
      },
    })
    stockLocation = stockLocationResult[0]
    console.log("  Created Riyadh Warehouse")

    try {
      await link.create({
        [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
        [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
      })
    } catch (linkError: any) {
      console.log(`  Fulfillment provider link already exists or failed: ${linkError.message}`)
    }
  } else {
    stockLocation = existingLocations[0]
    console.log("  Riyadh Warehouse already exists")
  }

  // ============================================================
  // STEP 7: Fulfillment
  // ============================================================
  console.log("\nStep 7: Setting up fulfillment...")
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({ type: "default" })
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null

  if (!shippingProfile) {
    const { result } = await createShippingProfilesWorkflow(container).run({
      input: { data: [{ name: "Default Shipping Profile", type: "default" }] },
    })
    shippingProfile = result[0]
  }

  const existingFulfillmentSets = await fulfillmentModuleService.listFulfillmentSets({ name: "Riyadh Warehouse Delivery" })
  let fulfillmentSet: any

  if (existingFulfillmentSets.length === 0) {
    fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
      name: "Riyadh Warehouse Delivery",
      type: "shipping",
      service_zones: [
        {
          name: "MENA Zone",
          geo_zones: ["sa", "ae", "kw", "qa", "bh", "om"].map((country_code) => ({
            country_code,
            type: "country" as const,
          })),
        },
      ],
    })

    try {
      await link.create({
        [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
        [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
      })
    } catch (linkError: any) {
      console.log(`  Fulfillment set link already exists or failed: ${linkError.message}`)
    }

    await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: "Standard Shipping",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: fulfillmentSet.service_zones[0].id,
          shipping_profile_id: shippingProfile.id,
          type: { label: "Standard", description: "Standard shipping (3-5 days)", code: "standard" },
          prices: [
            { currency_code: "sar", amount: 15 },
            { currency_code: "usd", amount: 10 },
          ],
          rules: [
            { attribute: "enabled_in_store", value: "true", operator: "eq" },
            { attribute: "is_return", value: "false", operator: "eq" },
          ],
        },
        {
          name: "Express Shipping",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: fulfillmentSet.service_zones[0].id,
          shipping_profile_id: shippingProfile.id,
          type: { label: "Express", description: "Express shipping (1-2 days)", code: "express" },
          prices: [
            { currency_code: "sar", amount: 35 },
            { currency_code: "usd", amount: 25 },
          ],
          rules: [
            { attribute: "enabled_in_store", value: "true", operator: "eq" },
            { attribute: "is_return", value: "false", operator: "eq" },
          ],
        },
      ],
    })
    console.log("  Fulfillment and shipping options created")
  } else {
    fulfillmentSet = existingFulfillmentSets[0]
    console.log("  Fulfillment set already exists")
  }

  // ============================================================
  // STEP 8: Link Sales Channels
  // ============================================================
  console.log("\nStep 8: Linking sales channels to stock location...")
  try {
    await linkSalesChannelsToStockLocationWorkflow(container).run({
      input: { id: stockLocation.id, add: allChannelIds },
    })
    console.log("  Sales channels linked")
  } catch (linkError: any) {
    console.log(`  Sales channel linking skipped (may already be linked): ${linkError.message}`)
  }

  // ============================================================
  // STEP 9: Publishable API Key
  // ============================================================
  console.log("\nStep 9: Creating publishable API key...")
  let publishableApiKey: any = null

  try {
    const { data: existingApiKeys } = await query.graph({
      entity: "api_key",
      fields: ["id", "token", "title", "type"],
      filters: { title: "Storefront API Key", type: "publishable" },
    })

    if (existingApiKeys && existingApiKeys.length > 0) {
      publishableApiKey = existingApiKeys[0]
      console.log(`  Publishable API key already exists: ${publishableApiKey.id}`)
    }
  } catch (checkError: any) {
    console.log(`  Could not check existing API keys: ${checkError.message}`)
  }

  if (!publishableApiKey) {
    const { result: apiKeyResult } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [{ title: "Storefront API Key", type: "publishable", created_by: "" }],
      },
    })
    publishableApiKey = apiKeyResult[0]
    console.log(`  API Key created: ${publishableApiKey.token}`)
  }

  try {
    await linkSalesChannelsToApiKeyWorkflow(container).run({
      input: { id: publishableApiKey.id, add: allChannelIds },
    })
  } catch (linkError: any) {
    console.log(`  Sales channel to API key linking skipped: ${linkError.message}`)
  }

  // ============================================================
  // STEP 10: Tenant (Dakkah)
  // ============================================================
  console.log("\nStep 10: Creating default tenant...")
  let tenantId: string | null = null
  try {
    const tenantService = container.resolve("tenant") as any

    const existingTenants = await tenantService.listTenants({ handle: "dakkah" })
    const tenantList = Array.isArray(existingTenants) ? existingTenants : [existingTenants].filter(Boolean)

    if (tenantList.length === 0 || !tenantList[0]?.id) {
      const tenant = await tenantService.createTenants({
        name: "Dakkah",
        handle: "dakkah",
        slug: "dakkah",
        domain: null,
        residency_zone: "MENA",
        default_locale: "ar",
        supported_locales: ["ar", "en"],
        timezone: "Asia/Riyadh",
        default_currency: "sar",
        date_format: "dd/MM/yyyy",
        status: "active",
        subscription_tier: "enterprise",
        billing_email: "billing@dakkah.com",
        primary_color: "#1a5f2a",
        accent_color: "#d4af37",
        settings: {
          features: {
            multi_vendor: true,
            bookings: true,
            subscriptions: true,
            b2b: true,
          },
        },
        metadata: { seeded: true },
      })
      tenantId = tenant.id
      console.log(`  Created tenant: Dakkah (${tenantId})`)
    } else {
      tenantId = tenantList[0].id
      console.log(`  Tenant already exists: ${tenantId}`)
    }
  } catch (error: any) {
    console.log(`  Tenant creation skipped: ${error.message}`)
  }

  // ============================================================
  // STEP 11: Governance Authority
  // ============================================================
  console.log("\nStep 11: Creating governance authority...")
  try {
    const governanceService = container.resolve("governance") as any

    let existingAuthorities: any[] = []
    try {
      const result = await governanceService.listGovernanceAuthoritys({ slug: "sa-mena" })
      existingAuthorities = Array.isArray(result) ? result : [result].filter(Boolean)
    } catch {
      try {
        const result = await governanceService.listGovernanceAuthorities({ slug: "sa-mena" })
        existingAuthorities = Array.isArray(result) ? result : [result].filter(Boolean)
      } catch { /* method not found, will create */ }
    }

    if (existingAuthorities.length === 0 || !existingAuthorities[0]?.id) {
      const createMethod = governanceService.createGovernanceAuthoritys || governanceService.createGovernanceAuthorities
      await createMethod.call(governanceService, {
        tenant_id: tenantId,
        name: "MENA Governance Authority",
        slug: "sa-mena",
        code: "MENA-GOV",
        type: "region",
        jurisdiction_level: 1,
        residency_zone: "MENA",
        country_id: "sa",
        policies: {
          commerce: {
            allow_cross_border: true,
            require_vat: true,
            vat_rate: 15,
            allowed_currencies: ["sar", "usd", "eur"],
          },
          data: {
            residency_required: true,
            classification: "confidential",
          },
        },
        status: "active",
      })
      console.log("  Created MENA Governance Authority")
    } else {
      console.log("  Governance authority already exists")
    }
  } catch (error: any) {
    console.log(`  Governance creation note: ${error.message}`)
  }

  // ============================================================
  // STEP 12: Node Hierarchy
  // ============================================================
  console.log("\nStep 12: Creating node hierarchy...")
  if (tenantId) {
    try {
      const nodeService = container.resolve("node") as any

      const existingNodes = await nodeService.listNodes({ tenant_id: tenantId, type: "CITY" })
      const nodeList = Array.isArray(existingNodes) ? existingNodes : [existingNodes].filter(Boolean)

      if (nodeList.length === 0 || !nodeList[0]?.id) {
        const city = await nodeService.createNodeWithValidation({
          tenant_id: tenantId,
          name: "Riyadh",
          slug: "riyadh",
          code: "RUH",
          type: "CITY",
          location: { lat: 24.7136, lng: 46.6753 },
          status: "active",
        })
        console.log(`  Created CITY: Riyadh (${city.id})`)

        const district = await nodeService.createNodeWithValidation({
          tenant_id: tenantId,
          name: "Al Olaya",
          slug: "al-olaya",
          code: "OLY",
          type: "DISTRICT",
          parent_id: city.id,
          location: { lat: 24.6911, lng: 46.6853 },
          status: "active",
        })
        console.log(`  Created DISTRICT: Al Olaya (${district.id})`)

        const zone = await nodeService.createNodeWithValidation({
          tenant_id: tenantId,
          name: "King Fahad Zone",
          slug: "king-fahad-zone",
          code: "KFZ",
          type: "ZONE",
          parent_id: district.id,
          location: { lat: 24.6900, lng: 46.6850 },
          status: "active",
        })
        console.log(`  Created ZONE: King Fahad Zone (${zone.id})`)

        const facility = await nodeService.createNodeWithValidation({
          tenant_id: tenantId,
          name: "Main Mall",
          slug: "main-mall",
          code: "MALL-01",
          type: "FACILITY",
          parent_id: zone.id,
          location: { lat: 24.6895, lng: 46.6845 },
          status: "active",
        })
        console.log(`  Created FACILITY: Main Mall (${facility.id})`)

        const asset = await nodeService.createNodeWithValidation({
          tenant_id: tenantId,
          name: "Shop 101",
          slug: "shop-101",
          code: "SH-101",
          type: "ASSET",
          parent_id: facility.id,
          location: { lat: 24.6895, lng: 46.6845, floor: 1, unit: "101" },
          status: "active",
        })
        console.log(`  Created ASSET: Shop 101 (${asset.id})`)
      } else {
        console.log("  Node hierarchy already exists")
      }
    } catch (error: any) {
      console.log(`  Node hierarchy creation error: ${error.message}`)
    }
  } else {
    console.log("  Skipped (no tenant)")
  }

  // ============================================================
  // STEP 13: Product Categories
  // ============================================================
  console.log("\nStep 13: Creating product categories...")
  const categoryHandles = ["electronics", "fashion", "food-beverages", "services", "real-estate"]
  try {
    const { data: existingCategories } = await query.graph({
      entity: "product_category",
      fields: ["id", "handle"],
    })

    const existingHandles = new Set((existingCategories || []).map((c: any) => c.handle))
    const categoriesToCreate = [
      { name: "Electronics", handle: "electronics", is_active: true, is_internal: false },
      { name: "Fashion", handle: "fashion", is_active: true, is_internal: false },
      { name: "Food & Beverages", handle: "food-beverages", is_active: true, is_internal: false },
      { name: "Services", handle: "services", is_active: true, is_internal: false },
      { name: "Real Estate", handle: "real-estate", is_active: true, is_internal: false },
    ].filter((c) => !existingHandles.has(c.handle))

    if (categoriesToCreate.length > 0) {
      const { result: catResult } = await createProductCategoriesWorkflow(container).run({
        input: { product_categories: categoriesToCreate },
      })
      console.log(`  Created ${catResult.length} categories`)
    } else {
      console.log("  Categories already exist")
    }
  } catch (error: any) {
    console.log(`  Category creation error: ${error.message}`)
  }

  // ============================================================
  // STEP 14: Products
  // ============================================================
  console.log("\nStep 14: Creating sample products...")

  const { data: allCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "handle"],
  })
  const getCategoryId = (handle: string) => {
    const cat = (allCategories || []).find((c: any) => c.handle === handle)
    return cat?.id
  }

  const products = [
    {
      title: "Samsung Galaxy S24 Ultra",
      handle: "samsung-galaxy-s24",
      description: "Latest Samsung flagship smartphone with S Pen, 200MP camera, and Titanium frame.",
      status: "published",
      thumbnail: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80",
      images: [
        { url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1200&q=80" },
        { url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80" },
        { url: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=1200&q=80" },
        { url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200&q=80" },
      ],
      category_ids: [getCategoryId("electronics")].filter(Boolean),
      sales_channels: [{ id: allChannels[0].id }],
      options: [
        { title: "Storage", values: ["256GB", "512GB"] },
      ],
      variants: [
        {
          title: "256GB - Titanium Black",
          sku: "SGS24-256-BK",
          options: { Storage: "256GB" },
          prices: [
            { amount: 4999, currency_code: "sar" },
            { amount: 1299, currency_code: "usd" },
          ],
          manage_inventory: false,
        },
        {
          title: "512GB - Titanium Gray",
          sku: "SGS24-512-GR",
          options: { Storage: "512GB" },
          prices: [
            { amount: 5699, currency_code: "sar" },
            { amount: 1499, currency_code: "usd" },
          ],
          manage_inventory: false,
        },
      ],
    },
    {
      title: "Classic White Thobe",
      handle: "classic-white-thobe",
      description: "Premium quality white thobe made from finest cotton. Traditional Saudi cut with modern comfort.",
      status: "published",
      thumbnail: "https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=800&q=80",
      images: [
        { url: "https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=1200&q=80" },
        { url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=80" },
        { url: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=1200&q=80" },
      ],
      category_ids: [getCategoryId("fashion")].filter(Boolean),
      sales_channels: [{ id: allChannels[0].id }],
      options: [
        { title: "Size", values: ["Small", "Medium", "Large"] },
      ],
      variants: [
        {
          title: "Small",
          sku: "THOBE-WH-SM",
          options: { Size: "Small" },
          prices: [
            { amount: 200, currency_code: "sar" },
            { amount: 55, currency_code: "usd" },
          ],
          manage_inventory: false,
        },
        {
          title: "Medium",
          sku: "THOBE-WH-MD",
          options: { Size: "Medium" },
          prices: [
            { amount: 200, currency_code: "sar" },
            { amount: 55, currency_code: "usd" },
          ],
          manage_inventory: false,
        },
        {
          title: "Large",
          sku: "THOBE-WH-LG",
          options: { Size: "Large" },
          prices: [
            { amount: 220, currency_code: "sar" },
            { amount: 60, currency_code: "usd" },
          ],
          manage_inventory: false,
        },
      ],
    },
    {
      title: "Ajwa Dates Premium Box",
      handle: "ajwa-dates-premium",
      description: "Authentic Ajwa dates from Al-Madinah. Known for health benefits. Premium gift packaging.",
      status: "published",
      thumbnail: "https://images.unsplash.com/photo-1563699743-35a41d15c232?w=800&q=80",
      images: [
        { url: "https://images.unsplash.com/photo-1563699743-35a41d15c232?w=1200&q=80" },
        { url: "https://images.unsplash.com/photo-1597714026720-8f74c62310ba?w=1200&q=80" },
        { url: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=1200&q=80" },
      ],
      category_ids: [getCategoryId("food-beverages")].filter(Boolean),
      sales_channels: [{ id: allChannels[0].id }],
      options: [
        { title: "Weight", values: ["500g", "1kg"] },
      ],
      variants: [
        {
          title: "500g",
          sku: "DATE-AJWA-500",
          options: { Weight: "500g" },
          prices: [
            { amount: 85, currency_code: "sar" },
            { amount: 23, currency_code: "usd" },
          ],
          manage_inventory: false,
        },
        {
          title: "1kg Gift Box",
          sku: "DATE-AJWA-1KG",
          options: { Weight: "1kg" },
          prices: [
            { amount: 160, currency_code: "sar" },
            { amount: 43, currency_code: "usd" },
          ],
          manage_inventory: false,
        },
      ],
    },
    {
      title: "Home Cleaning Service",
      handle: "home-cleaning-service",
      description: "Professional home cleaning service. Deep cleaning by trained professionals with eco-friendly products.",
      status: "published",
      thumbnail: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
      images: [
        { url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80" },
        { url: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=1200&q=80" },
        { url: "https://images.unsplash.com/photo-1527515545081-5db817172677?w=1200&q=80" },
      ],
      category_ids: [getCategoryId("services")].filter(Boolean),
      sales_channels: [{ id: allChannels[0].id }],
      options: [
        { title: "Type", values: ["Standard", "Deep Clean"] },
      ],
      variants: [
        {
          title: "Standard Clean (up to 150sqm)",
          sku: "SVC-CLEAN-STD",
          options: { Type: "Standard" },
          prices: [
            { amount: 350, currency_code: "sar" },
            { amount: 95, currency_code: "usd" },
          ],
          manage_inventory: false,
        },
        {
          title: "Deep Clean (up to 150sqm)",
          sku: "SVC-CLEAN-DEEP",
          options: { Type: "Deep Clean" },
          prices: [
            { amount: 550, currency_code: "sar" },
            { amount: 150, currency_code: "usd" },
          ],
          manage_inventory: false,
        },
      ],
    },
    {
      title: "Al Olaya Office Space",
      handle: "al-olaya-office-space",
      description: "Modern office space in Al Olaya district, Riyadh. Fully furnished with meeting rooms and parking.",
      status: "published",
      thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
      images: [
        { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80" },
        { url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80" },
        { url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80" },
        { url: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=1200&q=80" },
      ],
      category_ids: [getCategoryId("real-estate")].filter(Boolean),
      sales_channels: [{ id: allChannels[0].id }],
      options: [
        { title: "Size", values: ["50sqm", "100sqm"] },
      ],
      variants: [
        {
          title: "50sqm - Monthly Lease",
          sku: "RE-OLY-50-M",
          options: { Size: "50sqm" },
          prices: [
            { amount: 8000, currency_code: "sar" },
            { amount: 2133, currency_code: "usd" },
          ],
          manage_inventory: false,
        },
        {
          title: "100sqm - Monthly Lease",
          sku: "RE-OLY-100-M",
          options: { Size: "100sqm" },
          prices: [
            { amount: 15000, currency_code: "sar" },
            { amount: 4000, currency_code: "usd" },
          ],
          manage_inventory: false,
        },
      ],
    },
    {
      title: "Premium Oud Oil",
      handle: "premium-oud-oil",
      description: "Luxury aged Cambodian oud oil. Rich and complex aroma, aged 10 years. 10ml bottle.",
      status: "published",
      thumbnail: "https://images.unsplash.com/photo-1594035910387-fea081acb591?w=800&q=80",
      images: [
        { url: "https://images.unsplash.com/photo-1594035910387-fea081acb591?w=1200&q=80" },
        { url: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=1200&q=80" },
        { url: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=1200&q=80" },
      ],
      category_ids: [getCategoryId("fashion")].filter(Boolean),
      sales_channels: [{ id: allChannels[0].id }, { id: allChannels[1].id }],
      options: [
        { title: "Volume", values: ["10ml"] },
      ],
      variants: [
        {
          title: "10ml",
          sku: "OUD-PREM-10ML",
          options: { Volume: "10ml" },
          prices: [
            { amount: 1200, currency_code: "sar" },
            { amount: 320, currency_code: "usd" },
          ],
          manage_inventory: false,
        },
      ],
    },
    {
      title: "Saudi Khawlani Coffee",
      handle: "saudi-khawlani-coffee",
      description: "Finest Khawlani coffee beans from Saudi mountain regions. Ground with cardamom.",
      status: "published",
      thumbnail: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80",
      images: [
        { url: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&q=80" },
        { url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=1200&q=80" },
        { url: "https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=1200&q=80" },
        { url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80" },
      ],
      category_ids: [getCategoryId("food-beverages")].filter(Boolean),
      sales_channels: [{ id: allChannels[0].id }],
      options: [
        { title: "Weight", values: ["250g", "500g"] },
      ],
      variants: [
        {
          title: "250g",
          sku: "COFF-KHAW-250",
          options: { Weight: "250g" },
          prices: [
            { amount: 45, currency_code: "sar" },
            { amount: 12, currency_code: "usd" },
          ],
          manage_inventory: false,
        },
        {
          title: "500g",
          sku: "COFF-KHAW-500",
          options: { Weight: "500g" },
          prices: [
            { amount: 85, currency_code: "sar" },
            { amount: 23, currency_code: "usd" },
          ],
          manage_inventory: false,
        },
      ],
    },
  ]

  let productCount = 0
  for (const product of products) {
    try {
      const { data: existingProducts } = await query.graph({
        entity: "product",
        fields: ["id"],
        filters: { handle: product.handle },
      })

      if (!existingProducts || existingProducts.length === 0) {
        await createProductsWorkflow(container).run({
          input: { products: [product as any] },
        })
        productCount++
        console.log(`  Created: ${product.title}`)
      } else {
        console.log(`  Exists: ${product.title}`)
      }
    } catch (error: any) {
      console.log(`  Error creating ${product.title}: ${error.message}`)
    }
  }
  console.log(`  Total products created: ${productCount}`)

  // ============================================================
  // STEP 15: Customers
  // ============================================================
  console.log("\nStep 15: Creating sample customers...")
  const customers = [
    {
      first_name: "Mohammed",
      last_name: "Al-Rashid",
      email: "mohammed@example.com",
    },
    {
      first_name: "Fatima",
      last_name: "Al-Saud",
      email: "fatima@example.com",
    },
    {
      first_name: "Ahmed",
      last_name: "Hassan",
      email: "ahmed@example.com",
    },
  ]

  let customerCount = 0
  for (const customer of customers) {
    try {
      const { data: existingCustomers } = await query.graph({
        entity: "customer",
        fields: ["id"],
        filters: { email: customer.email },
      })

      if (!existingCustomers || existingCustomers.length === 0) {
        await createCustomersWorkflow(container).run({
          input: { customersData: [customer] },
        })
        customerCount++
        console.log(`  Created: ${customer.first_name} ${customer.last_name}`)
      } else {
        console.log(`  Exists: ${customer.first_name} ${customer.last_name}`)
      }
    } catch (error: any) {
      console.log(`  Error creating ${customer.email}: ${error.message}`)
    }
  }
  console.log(`  Total customers created: ${customerCount}`)

  // ============================================================
  // STEP 16: Vendors
  // ============================================================
  console.log("\nStep 16: Seeding vendors...")
  let vendorCount = 0
  try {
    const vendorService = container.resolve("vendor") as any

    const vendorData = [
      {
        handle: "riyadh-electronics",
        tenant_id: tenantId || "default",
        business_name: "Riyadh Electronics Hub",
        legal_name: "Riyadh Electronics Trading LLC",
        business_type: "llc",
        email: "info@riyadhelectronics.sa",
        phone: "+966-11-555-0101",
        address_line1: "King Fahad Road",
        city: "Riyadh",
        postal_code: "11564",
        country_code: "sa",
        verification_status: "approved",
        status: "active",
        commission_rate: 12,
        description: "Leading electronics retailer in Riyadh",
      },
      {
        handle: "jeddah-fashion",
        tenant_id: tenantId || "default",
        business_name: "Jeddah Fashion House",
        legal_name: "Jeddah Fashion Co.",
        business_type: "corporation",
        email: "hello@jeddahfashion.sa",
        phone: "+966-12-555-0201",
        address_line1: "Palestine Street",
        city: "Jeddah",
        postal_code: "21442",
        country_code: "sa",
        verification_status: "approved",
        status: "active",
        commission_rate: 15,
        description: "Premium fashion and traditional clothing",
      },
    ]

    for (const vendor of vendorData) {
      try {
        let existingVendor: any[] = []
        try {
          const { data: existing } = await query.graph({
            entity: "vendor",
            fields: ["id"],
            filters: { handle: vendor.handle },
          })
          existingVendor = existing || []
        } catch (queryError: any) {
          try {
            const result = await vendorService.listVendors({ handle: vendor.handle })
            existingVendor = Array.isArray(result) ? result : [result].filter(Boolean)
          } catch {
            existingVendor = []
          }
        }

        if (existingVendor.length === 0) {
          await vendorService.createVendors(vendor)
          vendorCount++
          console.log(`  Created vendor: ${vendor.business_name}`)
        } else {
          console.log(`  Exists: ${vendor.business_name}`)
        }
      } catch (error: any) {
        console.log(`  Error: ${vendor.business_name}: ${error.message}`)
      }
    }
  } catch (error: any) {
    console.log(`  Vendor service not available: ${error.message}`)
  }

  // ============================================================
  // SUMMARY
  // ============================================================
  console.log("\n========================================")
  console.log("Complete Seed Finished!")
  console.log("========================================")
  console.log(`
Summary:
  - Admin User: admin@dakkah.com
  - Publishable API Key: ${publishableApiKey?.token || publishableApiKey?.id || "N/A"}
  - Sales Channels: ${allChannels.length}
  - Regions: ${menaRegion ? "MENA + International" : "existing"}
  - Stock Location: Riyadh Warehouse
  - Tenant: Dakkah (${tenantId || "skipped"})
  - Node Hierarchy: CITY > DISTRICT > ZONE > FACILITY > ASSET
  - Categories: ${categoryHandles.join(", ")}
  - Products: ${productCount} created
  - Customers: ${customerCount} created
  - Vendors: ${vendorCount} created
  `)
}
