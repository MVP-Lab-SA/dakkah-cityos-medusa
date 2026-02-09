import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { createRegionsWorkflow } from "@medusajs/medusa/core-flows"

export default async function seedDefaultTenant({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const tenantModuleService = container.resolve("tenant") as any
  const governanceModuleService = container.resolve("governance") as any
  const nodeModuleService = container.resolve("node") as any

  console.log("========================================")
  console.log("  Seed Default Tenant (Dakkah)")
  console.log("========================================\n")

  // ============================================================
  // STEP 1: Update Tenant Record
  // ============================================================
  console.log("Step 1: Updating tenant record...")
  try {
    const tenant = await tenantModuleService.retrieveTenantByHandle("dakkah")
    if (!tenant) {
      console.log("  ✗ Tenant with handle 'dakkah' not found. Aborting.")
      return
    }

    console.log(`  Found tenant: ${tenant.name} (${tenant.id})`)

    const existingSettings = tenant.settings || {}
    const updatedSettings = {
      ...existingSettings,
      features: {
        ...(existingSettings.features || {}),
        b2b: true,
        bookings: true,
        multi_vendor: true,
        subscriptions: true,
        digital_products: true,
        classifieds: true,
        auctions: true,
        rentals: true,
      },
    }

    await tenantModuleService.updateTenants({
      id: tenant.id,
      supported_locales: ["en", "ar", "fr"],
      residency_zone: "MENA",
      country_id: "sa",
      logo_url: null,
      settings: updatedSettings,
    })

    console.log("  ✓ Tenant updated: supported_locales, residency_zone, country_id, settings")
  } catch (error: any) {
    console.log(`  ✗ Tenant update failed: ${error.message}`)
  }

  // ============================================================
  // STEP 2: Update Governance Authority Policies
  // ============================================================
  console.log("\nStep 2: Updating governance authority policies...")
  try {
    const tenant = await tenantModuleService.retrieveTenantByHandle("dakkah")
    const authorities = await governanceModuleService.listGovernanceAuthorities({
      tenant_id: tenant.id,
    })
    const authorityList = Array.isArray(authorities) ? authorities : [authorities].filter(Boolean)

    if (authorityList.length === 0) {
      console.log("  ✗ No governance authority found for tenant. Skipping.")
    } else {
      const authority = authorityList[0]
      console.log(`  Found authority: ${authority.name} (${authority.id})`)

      const comprehensivePolicies = {
        data: {
          classification: "confidential",
          residency_required: true,
        },
        commerce: {
          vat_rate: 15,
          require_vat: true,
          allow_cross_border: true,
          allowed_currencies: ["sar", "usd", "eur"],
          marketplace: true,
          subscriptions: true,
          bookings: true,
          b2b: true,
          digital_products: true,
          auctions: true,
          rentals: true,
          classifieds: true,
          crowdfunding: true,
          social_commerce: true,
        },
        content_moderation: {
          prohibited_categories: [],
          require_approval: false,
          auto_moderate: true,
        },
        verticals: {
          enabled: [
            "store", "vendors", "auctions", "rentals", "classifieds", "digital-products",
            "restaurants", "grocery",
            "healthcare", "fitness", "pet-services",
            "real-estate", "parking", "automotive", "travel",
            "education", "legal", "freelance",
            "financial-products", "memberships", "crowdfunding", "charity",
            "events", "social-commerce", "advertising",
            "bookings", "government", "utilities", "warranties",
          ],
        },
      }

      await governanceModuleService.updateGovernanceAuthorities({
        id: authority.id,
        policies: comprehensivePolicies,
      })

      console.log("  ✓ Governance authority policies updated with all verticals")
    }
  } catch (error: any) {
    console.log(`  ✗ Governance update failed: ${error.message}`)
  }

  // ============================================================
  // STEP 3: Create SAR Region (if not exists)
  // ============================================================
  console.log("\nStep 3: Ensuring SAR region exists...")
  try {
    const { data: existingRegions } = await query.graph({
      entity: "region",
      fields: ["id", "name", "currency_code"],
      filters: { currency_code: "sar" },
    })

    if (existingRegions.length > 0) {
      console.log(`  ✓ SAR region already exists: ${existingRegions[0].name} (${existingRegions[0].id})`)
    } else {
      const { result: regions } = await createRegionsWorkflow(container).run({
        input: {
          regions: [
            {
              name: "Saudi Arabia",
              currency_code: "sar",
              countries: ["sa"],
              is_tax_inclusive: true,
              automatic_taxes: true,
            },
          ],
        },
      })
      console.log(`  ✓ Created SAR region: ${regions[0].name} (${regions[0].id})`)
    }
  } catch (error: any) {
    console.log(`  ✗ SAR region creation failed: ${error.message}`)
  }

  // ============================================================
  // STEP 4: Ensure Node Hierarchy
  // ============================================================
  console.log("\nStep 4: Ensuring node hierarchy...")
  try {
    const tenant = await tenantModuleService.retrieveTenantByHandle("dakkah")
    const existingNodes = await nodeModuleService.listNodesByTenant(tenant.id)

    if (existingNodes.length >= 5) {
      const types = existingNodes.map((n: any) => n.type)
      const hasAll = ["CITY", "DISTRICT", "ZONE", "FACILITY", "ASSET"].every((t) => types.includes(t))
      if (hasAll) {
        console.log(`  ✓ Node hierarchy already exists (${existingNodes.length} nodes)`)
        console.log("    Hierarchy:")
        const sorted = existingNodes.sort((a: any, b: any) => a.depth - b.depth)
        for (const node of sorted) {
          const indent = "  ".repeat(node.depth + 2)
          console.log(`${indent}${node.type}: ${node.name} (${node.id})`)
        }
      } else {
        console.log(`  ⚠ Found ${existingNodes.length} nodes but missing some types. Skipping to avoid duplicates.`)
      }
    } else if (existingNodes.length > 0) {
      console.log(`  ⚠ Found ${existingNodes.length} nodes (incomplete hierarchy). Skipping to avoid duplicates.`)
    } else {
      console.log("  Creating 5-level node hierarchy...")

      const city = await nodeModuleService.createNodeWithValidation({
        tenant_id: tenant.id,
        name: "Riyadh",
        slug: "riyadh",
        code: "RUH",
        type: "CITY",
        parent_id: null,
        location: { lat: 24.7136, lng: 46.6753 },
      })
      console.log(`    ✓ CITY: Riyadh (${city.id})`)

      const district = await nodeModuleService.createNodeWithValidation({
        tenant_id: tenant.id,
        name: "Al Olaya",
        slug: "al-olaya",
        code: "OLY",
        type: "DISTRICT",
        parent_id: city.id,
      })
      console.log(`    ✓ DISTRICT: Al Olaya (${district.id})`)

      const zone = await nodeModuleService.createNodeWithValidation({
        tenant_id: tenant.id,
        name: "King Fahad Zone",
        slug: "king-fahad-zone",
        code: "KFZ",
        type: "ZONE",
        parent_id: district.id,
      })
      console.log(`    ✓ ZONE: King Fahad Zone (${zone.id})`)

      const facility = await nodeModuleService.createNodeWithValidation({
        tenant_id: tenant.id,
        name: "Main Mall",
        slug: "main-mall",
        code: "MM1",
        type: "FACILITY",
        parent_id: zone.id,
      })
      console.log(`    ✓ FACILITY: Main Mall (${facility.id})`)

      const asset = await nodeModuleService.createNodeWithValidation({
        tenant_id: tenant.id,
        name: "Shop 101",
        slug: "shop-101",
        code: "S101",
        type: "ASSET",
        parent_id: facility.id,
      })
      console.log(`    ✓ ASSET: Shop 101 (${asset.id})`)

      console.log("  ✓ Node hierarchy created successfully")
    }
  } catch (error: any) {
    console.log(`  ✗ Node hierarchy creation failed: ${error.message}`)
  }

  console.log("\n========================================")
  console.log("  Default Tenant Seed Complete")
  console.log("========================================\n")
}
