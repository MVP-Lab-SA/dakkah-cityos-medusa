// @ts-nocheck
import { ExecArgs } from "@medusajs/framework/types"
import { createLogger } from "../lib/logger"
const logger = createLogger("scripts:seed-verticals-3")

export default async function seedVerticals3({ container }: ExecArgs) {
  logger.info("========================================")
  logger.info("Seeding Vertical Modules - Batch 3")
  logger.info("========================================\n")

  const tenantService = container.resolve("tenant") as any

  let tenantId = "ten_default"
  try {
    const tenants = await tenantService.listTenants({ handle: "dakkah" })
    const list = Array.isArray(tenants) ? tenants : [tenants].filter(Boolean)
    if (list.length > 0 && list[0]?.id) {
      tenantId = list[0].id
      logger.info(`Using Dakkah tenant: ${tenantId}`)
    } else {
      const allTenants = await tenantService.listTenants({}, { take: 1 })
      const allList = Array.isArray(allTenants) ? allTenants : [allTenants].filter(Boolean)
      if (allList.length > 0 && allList[0]?.id) {
        tenantId = allList[0].id
        logger.info(`Dakkah not found, using first tenant: ${tenantId}`)
      } else {
        logger.info(`No tenants found, using placeholder: ${tenantId}`)
      }
    }
  } catch (err: any) {
    logger.info(`Could not fetch tenants: ${err.message}. Using placeholder: ${tenantId}`)
  }

  // ============================================================
  // 1. GOVERNMENT
  // ============================================================
  logger.info("\n--- 1. Seeding Government Module ---")
  try {
    const governmentService = container.resolve("government")

    const existingRequests = await governmentService.listServiceRequests({ tenant_id: tenantId }, { take: 1 })
    const existingReqList = Array.isArray(existingRequests) ? existingRequests : [existingRequests].filter(Boolean)

    if (existingReqList.length > 0) {
      logger.info("  Government data already seeded, skipping...")
    } else {
      const req1 = await governmentService.createServiceRequests({
        tenant_id: tenantId,
        citizen_id: "citizen_001",
        request_type: "maintenance",
        category: "Roads & Infrastructure",
        title: "Pothole repair on King Fahad Road",
        description: "Large pothole near the intersection of King Fahad Road and Olaya Street causing traffic hazards. Requires immediate attention.",
        location: { lat: 24.7136, lng: 46.6753, address: "King Fahad Road, Al Olaya, Riyadh" },
        status: "in_progress",
        priority: "high",
        department: "Public Works",
        reference_number: "GOV-SR-2026-0001",
        metadata: { estimated_cost_sar: 15000 },
      })

      const req2 = await governmentService.createServiceRequests({
        tenant_id: tenantId,
        citizen_id: "citizen_002",
        request_type: "complaint",
        category: "Sanitation",
        title: "Waste collection missed in Al Malaz district",
        description: "Waste collection has not been performed for 3 consecutive days in Al Malaz Block 7. Residents are reporting overflowing bins.",
        location: { lat: 24.6588, lng: 46.7230, address: "Al Malaz, Block 7, Riyadh" },
        status: "acknowledged",
        priority: "medium",
        department: "Environmental Services",
        reference_number: "GOV-SR-2026-0002",
        metadata: { affected_households: 45 },
      })

      logger.info(`  Created 2 service requests`)

      const permit1 = await governmentService.createPermits({
        tenant_id: tenantId,
        applicant_id: "citizen_001",
        permit_type: "building",
        permit_number: "GOV-PRM-2026-0001",
        status: "approved",
        description: "Construction permit for residential villa expansion in Al Nakheel district",
        property_address: { street: "Prince Sultan Road", district: "Al Nakheel", city: "Riyadh", country: "SA" },
        fee: 5000,
        currency_code: "sar",
        submitted_at: new Date("2026-01-10"),
        approved_at: new Date("2026-01-25"),
        approved_by: "inspector_ahmed",
        expires_at: new Date("2027-01-25"),
        conditions: ["Must comply with building code 2025", "Maximum height 12 meters"],
      })

      const permit2 = await governmentService.createPermits({
        tenant_id: tenantId,
        applicant_id: "citizen_002",
        permit_type: "event",
        permit_number: "GOV-PRM-2026-0002",
        status: "under_review",
        description: "Outdoor cultural festival permit for Al Diriyah heritage site",
        property_address: { street: "Al Diriyah Gate", district: "Al Diriyah", city: "Riyadh", country: "SA" },
        fee: 12000,
        currency_code: "sar",
        submitted_at: new Date("2026-02-01"),
        conditions: ["Noise restrictions after 10 PM", "Maximum capacity 5000 attendees"],
      })

      logger.info(`  Created 2 permits`)
    }
  } catch (error: any) {
    logger.error(`  Government seeding failed: ${error.message}`)
  }

  // ============================================================
  // 2. PARKING
  // ============================================================
  logger.info("\n--- 2. Seeding Parking Module ---")
  try {
    const parkingService = container.resolve("parking")

    const existingZones = await parkingService.listParkingZones({ tenant_id: tenantId }, { take: 1 })
    const existingZoneList = Array.isArray(existingZones) ? existingZones : [existingZones].filter(Boolean)

    if (existingZoneList.length > 0) {
      logger.info("  Parking data already seeded, skipping...")
    } else {
      await Promise.all([
        parkingService.createParkingZones({
          tenant_id: tenantId,
          name: "Kingdom Tower Garage",
          description: "Premium underground parking at Kingdom Centre with valet service and EV charging stations",
          zone_type: "garage",
          address: { street: "King Fahad Road", district: "Al Olaya", city: "Riyadh" },
          latitude: 24.7113,
          longitude: 46.6741,
          total_spots: 500,
          available_spots: 120,
          hourly_rate: 15,
          daily_rate: 80,
          monthly_rate: 1500,
          currency_code: "sar",
          operating_hours: { open: "06:00", close: "00:00" },
          is_active: true,
          has_ev_charging: true,
          has_disabled_spots: true,
        }),
        parkingService.createParkingZones({
          tenant_id: tenantId,
          name: "Olaya Street Public Lot",
          description: "Open-air parking lot in the heart of the Olaya commercial district",
          zone_type: "lot",
          address: { street: "Olaya Street", district: "Al Olaya", city: "Riyadh" },
          latitude: 24.6908,
          longitude: 46.6855,
          total_spots: 200,
          available_spots: 85,
          hourly_rate: 8,
          daily_rate: 50,
          currency_code: "sar",
          operating_hours: { open: "00:00", close: "23:59" },
          is_active: true,
          has_ev_charging: false,
          has_disabled_spots: true,
        }),
        parkingService.createParkingZones({
          tenant_id: tenantId,
          name: "King Khalid Airport Valet",
          description: "Premium valet parking service at King Khalid International Airport Terminal 1",
          zone_type: "valet",
          address: { street: "Airport Road", district: "King Khalid Airport", city: "Riyadh" },
          latitude: 24.9576,
          longitude: 46.6988,
          total_spots: 300,
          available_spots: 50,
          hourly_rate: 25,
          daily_rate: 150,
          monthly_rate: 3000,
          currency_code: "sar",
          operating_hours: { open: "00:00", close: "23:59" },
          is_active: true,
          has_ev_charging: true,
          has_disabled_spots: true,
        }),
      ])
      logger.info(`  Created 3 parking zones`)
    }
  } catch (error: any) {
    logger.error(`  Parking seeding failed: ${error.message}`)
  }

  // ============================================================
  // 3. UTILITIES
  // ============================================================
  logger.info("\n--- 3. Seeding Utilities Module ---")
  try {
    const utilitiesService = container.resolve("utilities")

    const existingAccounts = await utilitiesService.listUtilityAccounts({ tenant_id: tenantId }, { take: 1 })
    const existingAcctList = Array.isArray(existingAccounts) ? existingAccounts : [existingAccounts].filter(Boolean)

    if (existingAcctList.length > 0) {
      logger.info("  Utilities data already seeded, skipping...")
    } else {
      const elecAccount = await utilitiesService.createUtilityAccounts({
        tenant_id: tenantId,
        customer_id: "cust_001",
        utility_type: "electricity",
        provider_name: "Saudi Electricity Company (SEC)",
        account_number: "SEC-2026-100001",
        meter_number: "MTR-EL-50001",
        address: { street: "Prince Sultan Road", district: "Al Nakheel", city: "Riyadh", country: "SA" },
        status: "active",
        auto_pay: true,
      })

      const waterAccount = await utilitiesService.createUtilityAccounts({
        tenant_id: tenantId,
        customer_id: "cust_002",
        utility_type: "water",
        provider_name: "National Water Company (NWC)",
        account_number: "NWC-2026-200001",
        meter_number: "MTR-WA-60001",
        address: { street: "King Abdullah Road", district: "Al Malaz", city: "Riyadh", country: "SA" },
        status: "active",
        auto_pay: false,
      })

      logger.info(`  Created 2 utility accounts`)

      await Promise.all([
        utilitiesService.createUtilityBills({
          tenant_id: tenantId,
          account_id: elecAccount.id,
          bill_number: "BILL-SEC-2026-01",
          billing_period_start: new Date("2026-01-01"),
          billing_period_end: new Date("2026-01-31"),
          due_date: new Date("2026-02-15"),
          amount: 450,
          currency_code: "sar",
          consumption: 1200,
          consumption_unit: "kWh",
          status: "paid",
          paid_at: new Date("2026-02-10"),
          payment_reference: "PAY-SEC-2026-0001",
        }),
        utilitiesService.createUtilityBills({
          tenant_id: tenantId,
          account_id: waterAccount.id,
          bill_number: "BILL-NWC-2026-01",
          billing_period_start: new Date("2026-01-01"),
          billing_period_end: new Date("2026-01-31"),
          due_date: new Date("2026-02-20"),
          amount: 180,
          currency_code: "sar",
          consumption: 35,
          consumption_unit: "m³",
          status: "sent",
        }),
      ])

      logger.info(`  Created 2 utility bills`)
    }
  } catch (error: any) {
    logger.error(`  Utilities seeding failed: ${error.message}`)
  }

  // ============================================================
  // 4. PET SERVICE
  // ============================================================
  logger.info("\n--- 4. Seeding Pet Service Module ---")
  try {
    const petService = container.resolve("petService")

    const existingPets = await petService.listPetProfiles({ tenant_id: tenantId }, { take: 1 })
    const existingPetList = Array.isArray(existingPets) ? existingPets : [existingPets].filter(Boolean)

    if (existingPetList.length > 0) {
      logger.info("  Pet service data already seeded, skipping...")
    } else {
      const pet1 = await petService.createPetProfiles({
        tenant_id: tenantId,
        owner_id: "cust_001",
        name: "Simba",
        species: "cat",
        breed: "Persian",
        photo_url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80",
        date_of_birth: new Date("2023-03-15"),
        weight_kg: 5.2,
        color: "White",
        gender: "male",
        is_neutered: true,
        microchip_id: "SA-PET-900001",
        medical_notes: "Indoor cat, regular checkups every 6 months",
        vaccinations: [
          { name: "Rabies", date: "2025-06-01", next_due: "2026-06-01" },
          { name: "FVRCP", date: "2025-06-01", next_due: "2026-06-01" },
        ],
      })

      const pet2 = await petService.createPetProfiles({
        tenant_id: tenantId,
        owner_id: "cust_002",
        name: "Rex",
        species: "dog",
        breed: "German Shepherd",
        photo_url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80",
        date_of_birth: new Date("2022-08-20"),
        weight_kg: 35,
        color: "Black and Tan",
        gender: "male",
        is_neutered: false,
        microchip_id: "SA-PET-900002",
        medical_notes: "Active working dog, needs joint supplements",
        allergies: ["chicken"],
        vaccinations: [
          { name: "Rabies", date: "2025-08-20", next_due: "2026-08-20" },
          { name: "DHPP", date: "2025-08-20", next_due: "2026-08-20" },
        ],
      })

      logger.info(`  Created 2 pet profiles`)

      await Promise.all([
        petService.createGroomingBookings({
          tenant_id: tenantId,
          pet_id: pet1.id,
          owner_id: "cust_001",
          service_type: "full_grooming",
          status: "scheduled",
          scheduled_at: new Date("2026-02-15T10:00:00"),
          duration_minutes: 90,
          price: 200,
          currency_code: "sar",
          special_instructions: "Use hypoallergenic shampoo, Persian coat requires extra detangling",
        }),
        petService.createGroomingBookings({
          tenant_id: tenantId,
          pet_id: pet2.id,
          owner_id: "cust_002",
          service_type: "bath",
          status: "scheduled",
          scheduled_at: new Date("2026-02-16T14:00:00"),
          duration_minutes: 60,
          price: 120,
          currency_code: "sar",
          special_instructions: "Large dog, use deshedding treatment",
        }),
      ])

      logger.info(`  Created 2 grooming bookings`)
    }
  } catch (error: any) {
    logger.error(`  Pet service seeding failed: ${error.message}`)
  }

  // ============================================================
  // 5. FINANCIAL PRODUCT
  // ============================================================
  logger.info("\n--- 5. Seeding Financial Product Module ---")
  try {
    const financialService = container.resolve("financialProduct")

    const existingLoans = await financialService.listLoanProducts({ tenant_id: tenantId }, { take: 1 })
    const existingLoanList = Array.isArray(existingLoans) ? existingLoans : [existingLoans].filter(Boolean)

    if (existingLoanList.length > 0) {
      logger.info("  Financial product data already seeded, skipping...")
    } else {
      await Promise.all([
        financialService.createLoanProducts({
          tenant_id: tenantId,
          name: "Personal Finance - Tayseer",
          description: "Sharia-compliant personal financing for Saudi nationals and residents. Competitive profit rates with flexible repayment terms up to 60 months.",
          loan_type: "personal",
          min_amount: 5000,
          max_amount: 500000,
          currency_code: "sar",
          interest_rate_min: 4.5,
          interest_rate_max: 8.9,
          interest_type: "reducing_balance",
          min_term_months: 6,
          max_term_months: 60,
          processing_fee_pct: 1,
          requirements: ["Saudi ID or Iqama", "Minimum salary SAR 4000", "Employment letter"],
          is_active: true,
        }),
        financialService.createLoanProducts({
          tenant_id: tenantId,
          name: "Home Mortgage - Baiti",
          description: "Islamic home financing solution for purchasing or building your dream home. Up to 90% financing with terms up to 25 years.",
          loan_type: "mortgage",
          min_amount: 200000,
          max_amount: 5000000,
          currency_code: "sar",
          interest_rate_min: 3.5,
          interest_rate_max: 5.9,
          interest_type: "fixed",
          min_term_months: 60,
          max_term_months: 300,
          processing_fee_pct: 0.5,
          requirements: ["Saudi ID", "Minimum salary SAR 8000", "Property valuation report", "Down payment 10%"],
          is_active: true,
        }),
      ])

      logger.info(`  Created 2 loan products`)

      await Promise.all([
        financialService.createInsuranceProducts({
          tenant_id: tenantId,
          name: "Comprehensive Auto Insurance - Shamil",
          description: "Full coverage auto insurance for vehicles in Saudi Arabia including accident, theft, natural disaster, and third-party liability.",
          insurance_type: "auto",
          coverage_details: {
            accident_damage: true,
            theft: true,
            natural_disaster: true,
            third_party_liability: "up to SAR 10,000,000",
            personal_accident: "up to SAR 500,000",
            towing: "included",
          },
          min_premium: 1200,
          max_premium: 8000,
          currency_code: "sar",
          deductible_options: [500, 1000, 2000],
          term_options: ["6_months", "12_months"],
          claim_process: "File claim online or via app within 48 hours. Provide photos, police report for accidents.",
          exclusions: ["Racing", "Commercial use without endorsement", "Intentional damage"],
          is_active: true,
        }),
        financialService.createInsuranceProducts({
          tenant_id: tenantId,
          name: "Family Health Insurance - Afiya",
          description: "Comprehensive health insurance for families covering hospitalization, outpatient, dental, and optical care across Saudi Arabia and GCC.",
          insurance_type: "health",
          coverage_details: {
            hospitalization: "up to SAR 1,000,000",
            outpatient: "included",
            dental: "up to SAR 5,000",
            optical: "up to SAR 2,000",
            maternity: "up to SAR 30,000",
            emergency: "worldwide coverage",
          },
          min_premium: 3500,
          max_premium: 25000,
          currency_code: "sar",
          deductible_options: [0, 500, 1000],
          term_options: ["12_months"],
          claim_process: "Cashless at network hospitals. Reimbursement claims within 90 days with original receipts.",
          exclusions: ["Pre-existing conditions (first 6 months)", "Cosmetic surgery", "Self-inflicted injuries"],
          is_active: true,
        }),
      ])

      logger.info(`  Created 2 insurance products`)
    }
  } catch (error: any) {
    logger.error(`  Financial product seeding failed: ${error.message}`)
  }

  // ============================================================
  // 6. CROWDFUNDING
  // ============================================================
  logger.info("\n--- 6. Seeding Crowdfunding Module ---")
  try {
    const crowdfundingService = container.resolve("crowdfunding")

    const existingCampaigns = await crowdfundingService.listCrowdfundCampaigns({ tenant_id: tenantId }, { take: 1 })
    const existingCampList = Array.isArray(existingCampaigns) ? existingCampaigns : [existingCampaigns].filter(Boolean)

    if (existingCampList.length > 0) {
      logger.info("  Crowdfunding data already seeded, skipping...")
    } else {
      const campaign1 = await crowdfundingService.createCrowdfundCampaigns({
        tenant_id: tenantId,
        creator_id: "creator_001",
        title: "SolarBag - Portable Solar-Powered Backpack",
        description: "A stylish backpack with integrated solar panels that can charge your devices on the go. Perfect for outdoor enthusiasts and daily commuters in Saudi Arabia's sunny climate.",
        short_description: "Charge your devices with the power of the sun",
        campaign_type: "reward",
        status: "active",
        goal_amount: 150000,
        raised_amount: 87500,
        currency_code: "sar",
        backer_count: 342,
        starts_at: new Date("2026-01-15"),
        ends_at: new Date("2026-03-15"),
        is_flexible_funding: false,
        category: "Technology",
        risks_and_challenges: "Manufacturing timeline may extend by 2-4 weeks due to solar panel supply chain. We have backup suppliers arranged.",
      })

      const campaign2 = await crowdfundingService.createCrowdfundCampaigns({
        tenant_id: tenantId,
        creator_id: "creator_002",
        title: "Riyadh Community Urban Garden",
        description: "Transform an unused lot in Al Malaz into a thriving community garden with sustainable farming practices, workshops, and fresh produce for local families.",
        short_description: "Green spaces for a sustainable Riyadh",
        campaign_type: "donation",
        status: "active",
        goal_amount: 75000,
        raised_amount: 52000,
        currency_code: "sar",
        backer_count: 189,
        starts_at: new Date("2026-01-20"),
        ends_at: new Date("2026-04-20"),
        is_flexible_funding: true,
        category: "Community",
        risks_and_challenges: "Weather conditions and municipality permits may affect timeline. We have pre-approval from the local council.",
      })

      logger.info(`  Created 2 campaigns`)

      await Promise.all([
        crowdfundingService.createRewardTiers({
          tenant_id: tenantId,
          campaign_id: campaign1.id,
          title: "Early Bird Backer",
          description: "Get the SolarBag at a special early bird price with free shipping within Saudi Arabia",
          pledge_amount: 350,
          currency_code: "sar",
          quantity_available: 200,
          quantity_claimed: 156,
          estimated_delivery: new Date("2026-06-01"),
          includes: ["1x SolarBag", "USB-C cable", "Thank you card"],
          shipping_type: "domestic",
          is_active: true,
        }),
        crowdfundingService.createRewardTiers({
          tenant_id: tenantId,
          campaign_id: campaign1.id,
          title: "Premium Bundle",
          description: "SolarBag with additional power bank and premium accessories kit",
          pledge_amount: 600,
          currency_code: "sar",
          quantity_available: 100,
          quantity_claimed: 42,
          estimated_delivery: new Date("2026-06-01"),
          includes: ["1x SolarBag", "10000mAh Power Bank", "Premium cable set", "Carry pouch"],
          shipping_type: "domestic",
          is_active: true,
        }),
        crowdfundingService.createRewardTiers({
          tenant_id: tenantId,
          campaign_id: campaign2.id,
          title: "Garden Supporter",
          description: "Your name on the community wall and a monthly box of fresh produce for 3 months",
          pledge_amount: 200,
          currency_code: "sar",
          quantity_available: 150,
          quantity_claimed: 89,
          estimated_delivery: new Date("2026-05-01"),
          includes: ["Name on community wall", "3 months fresh produce box"],
          shipping_type: "none",
          is_active: true,
        }),
      ])

      logger.info(`  Created 3 reward tiers`)
    }
  } catch (error: any) {
    logger.error(`  Crowdfunding seeding failed: ${error.message}`)
  }

  // ============================================================
  // 7. SOCIAL COMMERCE
  // ============================================================
  logger.info("\n--- 7. Seeding Social Commerce Module ---")
  try {
    const socialCommerceService = container.resolve("socialCommerce")

    const existingStreams = await socialCommerceService.listLiveStreams({ tenant_id: tenantId }, { take: 1 })
    const existingStreamList = Array.isArray(existingStreams) ? existingStreams : [existingStreams].filter(Boolean)

    if (existingStreamList.length > 0) {
      logger.info("  Social commerce data already seeded, skipping...")
    } else {
      await Promise.all([
        socialCommerceService.createLiveStreams({
          tenant_id: tenantId,
          host_id: "host_001",
          title: "Ramadan Fashion Showcase - Modest Wear Collection",
          description: "Live shopping event featuring the latest modest fashion collection for Ramadan. Exclusive discounts for live viewers!",
          status: "scheduled",
          platform: "internal",
          scheduled_at: new Date("2026-02-25T20:00:00"),
          viewer_count: 0,
          peak_viewers: 0,
          total_sales: 0,
          total_orders: 0,
          thumbnail_url: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",
        }),
        socialCommerceService.createLiveStreams({
          tenant_id: tenantId,
          host_id: "host_002",
          title: "Tech Gadgets Unboxing & Flash Sale",
          description: "Unboxing the hottest tech gadgets with exclusive flash sale prices. Limited stock available!",
          status: "ended",
          platform: "internal",
          scheduled_at: new Date("2026-02-01T19:00:00"),
          started_at: new Date("2026-02-01T19:02:00"),
          ended_at: new Date("2026-02-01T20:30:00"),
          viewer_count: 1250,
          peak_viewers: 890,
          total_sales: 45000,
          total_orders: 67,
          thumbnail_url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
        }),
      ])

      logger.info(`  Created 2 live streams`)

      await socialCommerceService.createGroupBuys({
        tenant_id: tenantId,
        product_id: "prod_group_001",
        organizer_id: "cust_001",
        title: "Bulk Order - Premium Arabic Coffee Beans (5kg)",
        description: "Join this group buy for premium Khawlani Arabic coffee beans direct from Jazan farmers. The more people join, the better the price!",
        status: "active",
        target_quantity: 50,
        current_quantity: 28,
        original_price: 180,
        group_price: 120,
        currency_code: "sar",
        min_participants: 10,
        max_participants: 50,
        starts_at: new Date("2026-02-01"),
        ends_at: new Date("2026-02-28"),
      })

      logger.info(`  Created 1 group buy`)
    }
  } catch (error: any) {
    logger.error(`  Social commerce seeding failed: ${error.message}`)
  }

  // ============================================================
  // 8. GROCERY
  // ============================================================
  logger.info("\n--- 8. Seeding Grocery Module ---")
  try {
    const groceryService = container.resolve("grocery")

    const existingFresh = await groceryService.listFreshProducts({ tenant_id: tenantId }, { take: 1 })
    const existingFreshList = Array.isArray(existingFresh) ? existingFresh : [existingFresh].filter(Boolean)

    if (existingFreshList.length > 0) {
      logger.info("  Grocery data already seeded, skipping...")
    } else {
      const fresh1 = await groceryService.createFreshProducts({
        tenant_id: tenantId,
        product_id: "prod_fresh_001",
        storage_type: "chilled",
        shelf_life_days: 7,
        optimal_temp_min: 2,
        optimal_temp_max: 6,
        origin_country: "SA",
        organic: true,
        unit_type: "kg",
        min_order_quantity: 1,
        is_seasonal: false,
        nutrition_info: { calories_per_100g: 23, protein: 2.9, fiber: 2.2, vitamin_c: "28mg" },
      })

      const fresh2 = await groceryService.createFreshProducts({
        tenant_id: tenantId,
        product_id: "prod_fresh_002",
        storage_type: "ambient",
        shelf_life_days: 14,
        origin_country: "SA",
        organic: false,
        unit_type: "kg",
        min_order_quantity: 1,
        is_seasonal: true,
        season_start: "June",
        season_end: "September",
        nutrition_info: { calories_per_100g: 47, protein: 0.9, fiber: 1.4, vitamin_a: "169mcg" },
      })

      const fresh3 = await groceryService.createFreshProducts({
        tenant_id: tenantId,
        product_id: "prod_fresh_003",
        storage_type: "frozen",
        shelf_life_days: 180,
        optimal_temp_min: -25,
        optimal_temp_max: -18,
        origin_country: "SA",
        organic: false,
        unit_type: "pack",
        min_order_quantity: 1,
        is_seasonal: false,
        nutrition_info: { calories_per_100g: 210, protein: 20, fat: 12, omega3: "1.5g" },
      })

      logger.info(`  Created 3 fresh products`)

      await Promise.all([
        groceryService.createBatchTrackings({
          tenant_id: tenantId,
          product_id: fresh1.id,
          batch_number: "BATCH-GRO-2026-001",
          supplier: "Al Watania Organic Farms",
          received_date: new Date("2026-02-05"),
          expiry_date: new Date("2026-02-12"),
          quantity_received: 200,
          quantity_remaining: 145,
          unit_cost: 8,
          currency_code: "sar",
          status: "active",
          storage_location: "Cold Room A-3",
        }),
        groceryService.createBatchTrackings({
          tenant_id: tenantId,
          product_id: fresh2.id,
          batch_number: "BATCH-GRO-2026-002",
          supplier: "Taif Mountain Farms",
          received_date: new Date("2026-02-03"),
          expiry_date: new Date("2026-02-17"),
          quantity_received: 500,
          quantity_remaining: 320,
          unit_cost: 5,
          currency_code: "sar",
          status: "active",
          storage_location: "Ambient Storage B-1",
        }),
        groceryService.createBatchTrackings({
          tenant_id: tenantId,
          product_id: fresh3.id,
          batch_number: "BATCH-GRO-2026-003",
          supplier: "Gulf Seafood Company",
          received_date: new Date("2026-01-20"),
          expiry_date: new Date("2026-07-20"),
          quantity_received: 300,
          quantity_remaining: 280,
          unit_cost: 35,
          currency_code: "sar",
          status: "active",
          storage_location: "Freezer Unit F-2",
        }),
      ])

      logger.info(`  Created 3 batch tracking records`)
    }
  } catch (error: any) {
    logger.error(`  Grocery seeding failed: ${error.message}`)
  }

  // ============================================================
  // 9. AUTOMOTIVE
  // ============================================================
  logger.info("\n--- 9. Seeding Automotive Module ---")
  try {
    const automotiveService = container.resolve("automotive")

    const existingVehicles = await automotiveService.listVehicleListings({ tenant_id: tenantId }, { take: 1 })
    const existingVehicleList = Array.isArray(existingVehicles) ? existingVehicles : [existingVehicles].filter(Boolean)

    if (existingVehicleList.length > 0) {
      logger.info("  Automotive data already seeded, skipping...")
    } else {
      await Promise.all([
        automotiveService.createVehicleListings({
          tenant_id: tenantId,
          seller_id: "seller_001",
          listing_type: "sale",
          title: "2025 Toyota Land Cruiser VXR - Full Option",
          make: "Toyota",
          model_name: "Land Cruiser VXR",
          year: 2025,
          mileage_km: 12000,
          fuel_type: "petrol",
          transmission: "automatic",
          body_type: "suv",
          color: "Pearl White",
          vin: "JTMHY7AJ5PA000001",
          condition: "certified_pre_owned",
          price: 320000,
          currency_code: "sar",
          description: "Pristine condition 2025 Land Cruiser VXR with full Toyota service history. Features include premium leather interior, JBL sound system, adaptive cruise control, and 360-degree camera.",
          features: ["Leather seats", "JBL audio", "Adaptive cruise", "360 camera", "Sunroof", "Cooled seats"],
          location_city: "Riyadh",
          location_country: "SA",
          status: "active",
          view_count: 245,
        }),
        automotiveService.createVehicleListings({
          tenant_id: tenantId,
          seller_id: "seller_002",
          listing_type: "sale",
          title: "2026 Hyundai Tucson Hybrid - Brand New",
          make: "Hyundai",
          model_name: "Tucson Hybrid",
          year: 2026,
          mileage_km: 0,
          fuel_type: "hybrid",
          transmission: "automatic",
          body_type: "suv",
          color: "Amazon Gray",
          condition: "new",
          price: 135000,
          currency_code: "sar",
          description: "Brand new 2026 Hyundai Tucson Hybrid with factory warranty. Excellent fuel efficiency at 5.2L/100km. Smart tech package included.",
          features: ["Smart key", "Apple CarPlay", "Android Auto", "Blind spot monitor", "Lane assist"],
          location_city: "Jeddah",
          location_country: "SA",
          status: "active",
          view_count: 89,
        }),
        automotiveService.createVehicleListings({
          tenant_id: tenantId,
          seller_id: "seller_003",
          listing_type: "sale",
          title: "2024 GMC Sierra 1500 AT4 - Desert Ready",
          make: "GMC",
          model_name: "Sierra 1500 AT4",
          year: 2024,
          mileage_km: 28000,
          fuel_type: "petrol",
          transmission: "automatic",
          body_type: "truck",
          color: "Onyx Black",
          vin: "1GTU9FEL5RZ000003",
          condition: "used",
          price: 245000,
          currency_code: "sar",
          description: "Powerful GMC Sierra AT4 with off-road package. Perfect for desert adventures. Upgraded suspension and all-terrain tires. Well maintained with full service records.",
          features: ["Off-road package", "Bose audio", "Heated steering", "MultiPro tailgate", "Trailering package"],
          location_city: "Dammam",
          location_country: "SA",
          status: "active",
          view_count: 167,
        }),
      ])
      logger.info(`  Created 3 vehicle listings`)
    }
  } catch (error: any) {
    logger.error(`  Automotive seeding failed: ${error.message}`)
  }

  // ============================================================
  // 10. MEMBERSHIP
  // ============================================================
  logger.info("\n--- 10. Seeding Membership Module ---")
  try {
    const membershipService = container.resolve("membership")

    const existingTiers = await membershipService.listMembershipTiers({ tenant_id: tenantId }, { take: 1 })
    const existingTierList = Array.isArray(existingTiers) ? existingTiers : [existingTiers].filter(Boolean)

    if (existingTierList.length > 0) {
      logger.info("  Membership data already seeded, skipping...")
    } else {
      await Promise.all([
        membershipService.createMembershipTiers({
          tenant_id: tenantId,
          name: "Silver",
          description: "Entry-level membership with basic rewards and benefits",
          tier_level: 1,
          min_points: 0,
          annual_fee: 0,
          currency_code: "sar",
          benefits: [
            "Earn 1 point per SAR spent",
            "Birthday discount 10%",
            "Early access to sales",
          ],
          perks: { points_multiplier: 1, free_shipping_threshold: 200 },
          upgrade_threshold: 5000,
          color_code: "#C0C0C0",
          icon_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
          is_active: true,
        }),
        membershipService.createMembershipTiers({
          tenant_id: tenantId,
          name: "Gold",
          description: "Premium membership with enhanced rewards, priority support, and exclusive offers",
          tier_level: 2,
          min_points: 5000,
          annual_fee: 199,
          currency_code: "sar",
          benefits: [
            "Earn 2 points per SAR spent",
            "Birthday discount 20%",
            "Free standard shipping",
            "Priority customer support",
            "Exclusive member-only sales",
          ],
          perks: { points_multiplier: 2, free_shipping: true, priority_support: true },
          upgrade_threshold: 15000,
          downgrade_threshold: 3000,
          color_code: "#FFD700",
          icon_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
          is_active: true,
        }),
        membershipService.createMembershipTiers({
          tenant_id: tenantId,
          name: "Platinum",
          description: "Elite membership with maximum rewards, personal concierge, and VIP experiences",
          tier_level: 3,
          min_points: 15000,
          annual_fee: 499,
          currency_code: "sar",
          benefits: [
            "Earn 3 points per SAR spent",
            "Birthday discount 30%",
            "Free express shipping",
            "Personal concierge service",
            "VIP event invitations",
            "Exclusive Platinum lounges",
            "Annual gift box",
          ],
          perks: { points_multiplier: 3, free_shipping: true, express_shipping: true, concierge: true },
          downgrade_threshold: 10000,
          color_code: "#E5E4E2",
          icon_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
          is_active: true,
        }),
      ])
      logger.info(`  Created 3 membership tiers`)
    }
  } catch (error: any) {
    logger.error(`  Membership seeding failed: ${error.message}`)
  }

  // ============================================================
  // 11. WARRANTY
  // ============================================================
  logger.info("\n--- 11. Seeding Warranty Module ---")
  try {
    const warrantyService = container.resolve("warranty")

    const existingPlans = await warrantyService.listWarrantyPlans({ tenant_id: tenantId }, { take: 1 })
    const existingPlanList = Array.isArray(existingPlans) ? existingPlans : [existingPlans].filter(Boolean)

    if (existingPlanList.length > 0) {
      logger.info("  Warranty data already seeded, skipping...")
    } else {
      await Promise.all([
        warrantyService.createWarrantyPlans({
          tenant_id: tenantId,
          name: "Electronics Extended Protection",
          description: "Extended warranty covering manufacturing defects, power surge damage, and mechanical failures for electronics and home appliances",
          plan_type: "extended",
          duration_months: 24,
          price: 299,
          currency_code: "sar",
          coverage: {
            manufacturing_defects: true,
            power_surge: true,
            mechanical_failure: true,
            battery_replacement: true,
            free_diagnostics: true,
            in_home_service: true,
          },
          exclusions: ["Physical damage", "Water damage", "Unauthorized modifications", "Cosmetic defects"],
          is_active: true,
        }),
        warrantyService.createWarrantyPlans({
          tenant_id: tenantId,
          name: "Premium Accidental Protection Plus",
          description: "Comprehensive coverage including accidental damage, drops, spills, and cracked screens for smartphones and laptops",
          plan_type: "accidental",
          duration_months: 12,
          price: 499,
          currency_code: "sar",
          coverage: {
            accidental_damage: true,
            drops_and_spills: true,
            cracked_screen: true,
            theft_protection: true,
            worldwide_coverage: true,
            express_replacement: "within 48 hours",
          },
          exclusions: ["Intentional damage", "Loss without police report", "Wear and tear"],
          is_active: true,
        }),
      ])
      logger.info(`  Created 2 warranty plans`)
    }
  } catch (error: any) {
    logger.error(`  Warranty seeding failed: ${error.message}`)
  }

  // ============================================================
  // 12. ADVERTISING
  // ============================================================
  logger.info("\n--- 12. Seeding Advertising Module ---")
  try {
    const advertisingService = container.resolve("advertising")

    const existingCampaigns = await advertisingService.listAdCampaigns({ tenant_id: tenantId }, { take: 1 })
    const existingAdList = Array.isArray(existingCampaigns) ? existingCampaigns : [existingCampaigns].filter(Boolean)

    if (existingAdList.length > 0) {
      logger.info("  Advertising data already seeded, skipping...")
    } else {
      await Promise.all([
        advertisingService.createAdCampaigns({
          tenant_id: tenantId,
          advertiser_id: "vendor_001",
          name: "Ramadan Special - Home Appliances",
          description: "Promotional campaign for home appliances during Ramadan season with exclusive discounts up to 40%",
          campaign_type: "banner",
          status: "active",
          budget: 25000,
          spent: 8500,
          currency_code: "sar",
          daily_budget: 1000,
          bid_type: "cpm",
          bid_amount: 15,
          targeting: { regions: ["Riyadh", "Jeddah", "Dammam"], categories: ["Home Appliances"], age_range: "25-55" },
          starts_at: new Date("2026-02-01"),
          ends_at: new Date("2026-03-15"),
          total_impressions: 56000,
          total_clicks: 2800,
          total_conversions: 145,
        }),
        advertisingService.createAdCampaigns({
          tenant_id: tenantId,
          advertiser_id: "vendor_002",
          name: "Back to School Electronics Sale",
          description: "Targeted search and banner campaign for laptops and tablets for the back-to-school season",
          campaign_type: "search",
          status: "active",
          budget: 15000,
          spent: 3200,
          currency_code: "sar",
          daily_budget: 500,
          bid_type: "cpc",
          bid_amount: 2,
          targeting: { regions: ["All Saudi Arabia"], categories: ["Electronics", "Laptops", "Tablets"], keywords: ["student laptop", "back to school"] },
          starts_at: new Date("2026-02-10"),
          ends_at: new Date("2026-03-10"),
          total_impressions: 32000,
          total_clicks: 1600,
          total_conversions: 89,
        }),
      ])

      logger.info(`  Created 2 ad campaigns`)

      await Promise.all([
        advertisingService.createAdPlacements({
          tenant_id: tenantId,
          name: "Homepage Hero Banner",
          placement_type: "homepage_banner",
          dimensions: { width: 1200, height: 400, format: "jpg/png/webp" },
          max_ads: 3,
          price_per_day: 500,
          currency_code: "sar",
          is_active: true,
        }),
        advertisingService.createAdPlacements({
          tenant_id: tenantId,
          name: "Search Results Sponsored",
          placement_type: "search_results",
          dimensions: { width: 728, height: 90, format: "jpg/png" },
          max_ads: 5,
          price_per_day: 200,
          currency_code: "sar",
          is_active: true,
        }),
        advertisingService.createAdPlacements({
          tenant_id: tenantId,
          name: "Category Page Sidebar",
          placement_type: "sidebar",
          dimensions: { width: 300, height: 600, format: "jpg/png/webp" },
          max_ads: 2,
          price_per_day: 150,
          currency_code: "sar",
          is_active: true,
        }),
      ])

      logger.info(`  Created 3 ad placements`)
    }
  } catch (error: any) {
    logger.error(`  Advertising seeding failed: ${error.message}`)
  }

  // ============================================================
  // 13. AFFILIATE
  // ============================================================
  logger.info("\n--- 13. Seeding Affiliate Module ---")
  try {
    const affiliateService = container.resolve("affiliate")

    const existingAffiliates = await affiliateService.listAffiliates({ tenant_id: tenantId }, { take: 1 })
    const existingAffList = Array.isArray(existingAffiliates) ? existingAffiliates : [existingAffiliates].filter(Boolean)

    if (existingAffList.length > 0) {
      logger.info("  Affiliate data already seeded, skipping...")
    } else {
      const affiliate1 = await affiliateService.createAffiliates({
        tenant_id: tenantId,
        customer_id: "cust_aff_001",
        name: "Noura Al-Rashid",
        email: "noura@techreview.sa",
        affiliate_type: "influencer",
        status: "active",
        commission_rate: 8,
        commission_type: "percentage",
        payout_method: "bank_transfer",
        payout_minimum: 500,
        total_earnings: 12500,
        total_paid: 10000,
        total_clicks: 15600,
        total_conversions: 234,
        bio: "Tech reviewer and lifestyle influencer with 500K+ followers across social platforms. Specializing in electronics and smart home products.",
        social_links: { instagram: "@noura_tech", twitter: "@nourareview", youtube: "NouraTechReview" },
      })

      const affiliate2 = await affiliateService.createAffiliates({
        tenant_id: tenantId,
        customer_id: "cust_aff_002",
        name: "Mohammed Al-Harbi",
        email: "mohammed@fitnessarabia.com",
        affiliate_type: "partner",
        status: "active",
        commission_rate: 5,
        commission_type: "percentage",
        payout_method: "bank_transfer",
        payout_minimum: 1000,
        total_earnings: 8700,
        total_paid: 7000,
        total_clicks: 9800,
        total_conversions: 156,
        bio: "Fitness coach and wellness advocate running FitnessArabia.com, a leading fitness blog in the GCC region.",
        social_links: { instagram: "@fit_mohammed", website: "fitnessarabia.com" },
      })

      logger.info(`  Created 2 affiliates`)

      await Promise.all([
        affiliateService.createReferralLinks({
          tenant_id: tenantId,
          affiliate_id: affiliate1.id,
          code: "NOURA-TECH-2026",
          target_url: "/collections/electronics",
          campaign_name: "Spring Electronics Campaign",
          is_active: true,
          total_clicks: 4500,
          total_conversions: 87,
          total_revenue: 43500,
        }),
        affiliateService.createReferralLinks({
          tenant_id: tenantId,
          affiliate_id: affiliate1.id,
          code: "NOURA-HOME-2026",
          target_url: "/collections/smart-home",
          campaign_name: "Smart Home Collection",
          is_active: true,
          total_clicks: 2100,
          total_conversions: 45,
          total_revenue: 22500,
        }),
        affiliateService.createReferralLinks({
          tenant_id: tenantId,
          affiliate_id: affiliate2.id,
          code: "FITMO-GEAR-2026",
          target_url: "/collections/fitness-equipment",
          campaign_name: "Fitness Gear Partnership",
          is_active: true,
          total_clicks: 3200,
          total_conversions: 68,
          total_revenue: 34000,
        }),
      ])

      logger.info(`  Created 3 referral links`)
    }
  } catch (error: any) {
    logger.error(`  Affiliate seeding failed: ${error.message}`)
  }

  logger.info("\n========================================")
  logger.info("Vertical Modules Batch 3 Seeding Complete!")
  logger.info("========================================\n")
}
