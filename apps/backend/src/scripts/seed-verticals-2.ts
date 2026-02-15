// @ts-nocheck
import { ExecArgs } from "@medusajs/framework/types"
import { createLogger } from "../lib/logger"
const logger = createLogger("scripts:seed-verticals-2")

export default async function seedVerticals2({ container }: ExecArgs) {
  logger.info("========================================")
  logger.info("Seeding Vertical Modules – Batch 2")
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
      const allTenants = await tenantService.listTenants()
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
  // 1. CLASSIFIED – 3 listings
  // ============================================================
  logger.info("Step 1: Seeding Classified Listings...")
  try {
    const classifiedService = container.resolve("classified") as any
    const existingListings = await classifiedService.listClassifiedListings()
    const listings = Array.isArray(existingListings) ? existingListings : [existingListings].filter(Boolean)

    if (listings.length > 0) {
      logger.info(`  Skipped – ${listings.length} classified listings already exist`)
    } else {
      await classifiedService.createClassifiedListings([
        {
          tenant_id: tenantId,
          seller_id: "seller_furniture_01",
          title: "طقم كنب فاخر L شكل – جلد إيطالي",
          description: "طقم كنب L-shape من الجلد الإيطالي الأصلي، لون بني غامق، مستخدم سنة واحدة فقط، حالة ممتازة. يتسع لـ 7 أشخاص.",
          listing_type: "sell",
          condition: "like_new",
          price: 4500,
          currency_code: "sar",
          is_negotiable: true,
          location_city: "Riyadh",
          location_state: "Riyadh",
          location_country: "SA",
          status: "active",
          metadata: {
            images: [
              "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
              "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800",
            ],
          },
        },
        {
          tenant_id: tenantId,
          seller_id: "seller_electronics_01",
          title: "MacBook Pro 16\" M3 Max – 36GB RAM",
          description: "ماك بوك برو 16 إنش موديل 2024، معالج M3 Max، رام 36 جيجا، تخزين 1 تيرا. ضمان Apple Care+ ساري حتى 2026.",
          listing_type: "sell",
          condition: "like_new",
          price: 12500,
          currency_code: "sar",
          is_negotiable: false,
          location_city: "Jeddah",
          location_state: "Makkah",
          location_country: "SA",
          status: "active",
          metadata: {
            images: [
              "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
            ],
          },
        },
        {
          tenant_id: tenantId,
          seller_id: "seller_vehicles_01",
          title: "تويوتا كامري 2023 – فل كامل",
          description: "تويوتا كامري GLE 2023 فل كامل، لون أبيض لؤلؤي، ممشى 18,000 كم فقط، وكالة، ضمان ساري. بدون حوادث.",
          listing_type: "sell",
          condition: "like_new",
          price: 115000,
          currency_code: "sar",
          is_negotiable: true,
          location_city: "Dammam",
          location_state: "Eastern Province",
          location_country: "SA",
          status: "active",
          metadata: {
            images: [
              "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800",
            ],
          },
        },
      ])
      logger.info("  Created 3 classified listings (furniture, electronics, vehicle)")
    }
  } catch (error: any) {
    logger.error(`  Classified seed error: ${error.message}`)
  }

  // ============================================================
  // 2. DIGITAL PRODUCT – 3 digital assets
  // ============================================================
  logger.info("\nStep 2: Seeding Digital Assets...")
  try {
    const digitalProductService = container.resolve("digitalProduct") as any
    const existingAssets = await digitalProductService.listDigitalAssets()
    const assets = Array.isArray(existingAssets) ? existingAssets : [existingAssets].filter(Boolean)

    if (assets.length > 0) {
      logger.info(`  Skipped – ${assets.length} digital assets already exist`)
    } else {
      await digitalProductService.createDigitalAssets([
        {
          tenant_id: tenantId,
          product_id: "prod_ebook_01",
          title: "دليل ريادة الأعمال في المملكة العربية السعودية",
          file_url: "https://cdn.dakkah.sa/assets/entrepreneurship-guide-ksa.pdf",
          file_type: "ebook",
          file_size_bytes: 15728640,
          preview_url: "https://cdn.dakkah.sa/previews/entrepreneurship-guide-preview.pdf",
          version: "2.0",
          max_downloads: 5,
          is_active: true,
          metadata: {
            price_sar: 149,
            author: "د. سارة الشمري",
            pages: 320,
            language: "ar",
            cover_image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800",
          },
        },
        {
          tenant_id: tenantId,
          product_id: "prod_course_01",
          title: "دورة تطوير تطبيقات الويب الشاملة – 40 ساعة",
          file_url: "https://cdn.dakkah.sa/assets/web-dev-course.zip",
          file_type: "video",
          file_size_bytes: 536870912,
          preview_url: "https://cdn.dakkah.sa/previews/web-dev-intro.mp4",
          version: "3.1",
          max_downloads: 3,
          is_active: true,
          metadata: {
            price_sar: 599,
            instructor: "م. خالد العتيبي",
            duration_hours: 40,
            language: "ar",
            cover_image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
          },
        },
        {
          tenant_id: tenantId,
          product_id: "prod_software_01",
          title: "رخصة برنامج إدارة المخزون – SmartStock Pro",
          file_url: "https://cdn.dakkah.sa/assets/smartstock-pro-setup.exe",
          file_type: "software",
          file_size_bytes: 104857600,
          preview_url: null,
          version: "5.2.1",
          max_downloads: 2,
          is_active: true,
          metadata: {
            price_sar: 1200,
            license_type: "annual",
            platform: "Windows / macOS",
            cover_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
          },
        },
      ])
      logger.info("  Created 3 digital assets (ebook, course video, software license)")
    }
  } catch (error: any) {
    logger.error(`  Digital product seed error: ${error.message}`)
  }

  // ============================================================
  // 3. FREELANCE – 3 gig listings
  // ============================================================
  logger.info("\nStep 3: Seeding Freelance Gig Listings...")
  try {
    const freelanceService = container.resolve("freelance") as any
    const existingGigs = await freelanceService.listGigListings()
    const gigs = Array.isArray(existingGigs) ? existingGigs : [existingGigs].filter(Boolean)

    if (gigs.length > 0) {
      logger.info(`  Skipped – ${gigs.length} gig listings already exist`)
    } else {
      await freelanceService.createGigListings([
        {
          tenant_id: tenantId,
          freelancer_id: "freelancer_design_01",
          title: "تصميم موقع إلكتروني احترافي متجاوب",
          description: "تصميم وتطوير موقع إلكتروني حديث ومتجاوب مع جميع الأجهزة باستخدام React و Next.js. يشمل التصميم، البرمجة، وتحسين SEO.",
          category: "web_design",
          subcategory: "full_stack",
          listing_type: "fixed_price",
          price: 3500,
          currency_code: "sar",
          delivery_time_days: 14,
          revisions_included: 3,
          status: "active",
          skill_tags: ["React", "Next.js", "Tailwind CSS", "TypeScript", "SEO"],
          portfolio_urls: [
            "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800",
            "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800",
          ],
          avg_rating: 4.9,
          total_orders: 47,
          metadata: { languages: ["ar", "en"] },
        },
        {
          tenant_id: tenantId,
          freelancer_id: "freelancer_translation_01",
          title: "ترجمة احترافية عربي – إنجليزي والعكس",
          description: "ترجمة متخصصة في المجالات القانونية والتجارية والتقنية. حاصل على شهادة ترجمة معتمدة. دقة عالية وتسليم سريع.",
          category: "translation",
          subcategory: "legal_translation",
          listing_type: "hourly",
          hourly_rate: 150,
          currency_code: "sar",
          delivery_time_days: 3,
          revisions_included: 2,
          status: "active",
          skill_tags: ["Arabic", "English", "Legal Translation", "Technical Translation", "Certified"],
          portfolio_urls: [],
          avg_rating: 4.8,
          total_orders: 128,
          metadata: { languages: ["ar", "en"], certified: true },
        },
        {
          tenant_id: tenantId,
          freelancer_id: "freelancer_photo_01",
          title: "تصوير فوتوغرافي احترافي – منتجات وفعاليات",
          description: "تصوير احترافي للمنتجات التجارية والفعاليات والمناسبات. تصوير استوديو وخارجي مع تعديل وتحرير كامل. معدات Canon احترافية.",
          category: "photography",
          subcategory: "product_photography",
          listing_type: "fixed_price",
          price: 2000,
          currency_code: "sar",
          delivery_time_days: 5,
          revisions_included: 2,
          status: "active",
          skill_tags: ["Product Photography", "Event Photography", "Photo Editing", "Lightroom", "Photoshop"],
          portfolio_urls: [
            "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800",
            "https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=800",
          ],
          avg_rating: 4.7,
          total_orders: 63,
          metadata: { languages: ["ar"], equipment: "Canon EOS R5" },
        },
      ])
      logger.info("  Created 3 gig listings (web design, translation, photography)")
    }
  } catch (error: any) {
    logger.error(`  Freelance seed error: ${error.message}`)
  }

  // ============================================================
  // 4. TRAVEL – 2 properties with room types & rate plans
  // ============================================================
  logger.info("\nStep 4: Seeding Travel Properties...")
  try {
    const travelService = container.resolve("travel") as any
    const existingProperties = await travelService.listTravelProperties()
    const properties = Array.isArray(existingProperties) ? existingProperties : [existingProperties].filter(Boolean)

    if (properties.length > 0) {
      logger.info(`  Skipped – ${properties.length} travel properties already exist`)
    } else {
      const prop1 = await travelService.createTravelProperties({
        tenant_id: tenantId,
        name: "فندق البوليفارد الرياض",
        description: "فندق فاخر 5 نجوم يقع في قلب حي البوليفارد بالرياض، يوفر إطلالات بانورامية وخدمة استثنائية.",
        property_type: "hotel",
        star_rating: 5,
        address_line1: "طريق الأمير محمد بن سلمان، حي البوليفارد",
        city: "Riyadh",
        state: "Riyadh",
        country_code: "SA",
        postal_code: "12345",
        latitude: 24.7136,
        longitude: 46.6753,
        check_in_time: "15:00",
        check_out_time: "12:00",
        phone: "+966112345678",
        email: "info@boulevard-hotel.sa",
        website: "https://boulevard-hotel.sa",
        amenities: ["wifi", "pool", "spa", "gym", "restaurant", "valet_parking", "concierge"],
        policies: { cancellation: "free_48h", pets: false, smoking: false },
        images: [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
          "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
        ],
        is_active: true,
        avg_rating: 4.8,
        total_reviews: 342,
      })

      const prop2 = await travelService.createTravelProperties({
        tenant_id: tenantId,
        name: "منتجع شاطئ جدة",
        description: "منتجع ساحلي فاخر على كورنيش جدة مع شاطئ خاص وأنشطة مائية متنوعة.",
        property_type: "resort",
        star_rating: 5,
        address_line1: "كورنيش جدة، شمال أبحر",
        city: "Jeddah",
        state: "Makkah",
        country_code: "SA",
        postal_code: "23511",
        latitude: 21.5433,
        longitude: 39.1728,
        check_in_time: "14:00",
        check_out_time: "11:00",
        phone: "+966126789012",
        email: "reservations@jeddah-beach-resort.sa",
        amenities: ["wifi", "private_beach", "pool", "spa", "water_sports", "kids_club", "restaurant", "bar"],
        policies: { cancellation: "free_72h", pets: false, smoking: false },
        images: [
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
        ],
        is_active: true,
        avg_rating: 4.6,
        total_reviews: 215,
      })

      logger.info("  Created 2 travel properties")

      const rt1 = await travelService.createRoomTypes({
        tenant_id: tenantId,
        property_id: prop1.id,
        name: "جناح ملكي",
        description: "جناح فسيح بإطلالة على المدينة مع غرفة معيشة منفصلة وحمام رخامي.",
        base_price: 2800,
        currency_code: "sar",
        max_occupancy: 4,
        bed_configuration: { king: 1, sofa_bed: 1 },
        room_size_sqm: 85,
        amenities: ["minibar", "bathrobe", "nespresso", "smart_tv", "balcony"],
        images: ["https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800"],
        total_rooms: 12,
        is_active: true,
      })

      const rt2 = await travelService.createRoomTypes({
        tenant_id: tenantId,
        property_id: prop2.id,
        name: "فيلا شاطئية",
        description: "فيلا خاصة على الشاطئ مع مسبح خاص وتراس واسع.",
        base_price: 5500,
        currency_code: "sar",
        max_occupancy: 6,
        bed_configuration: { king: 1, twin: 2 },
        room_size_sqm: 150,
        amenities: ["private_pool", "beach_access", "butler_service", "outdoor_shower", "kitchenette"],
        images: ["https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800"],
        total_rooms: 8,
        is_active: true,
      })

      logger.info("  Created 2 room types")

      const validFrom = new Date()
      const validTo = new Date()
      validTo.setFullYear(validTo.getFullYear() + 1)

      await travelService.createRatePlans([
        {
          tenant_id: tenantId,
          property_id: prop1.id,
          room_type_id: rt1.id,
          name: "سعر قياسي – جناح ملكي",
          description: "السعر القياسي مع وجبة إفطار مجانية",
          rate_type: "standard",
          price: 2800,
          currency_code: "sar",
          valid_from: validFrom,
          valid_to: validTo,
          min_stay: 1,
          cancellation_policy: "moderate",
          includes_breakfast: true,
          is_active: true,
        },
        {
          tenant_id: tenantId,
          property_id: prop2.id,
          room_type_id: rt2.id,
          name: "باقة صيفية – فيلا شاطئية",
          description: "باقة صيفية شاملة مع أنشطة مائية وإفطار وعشاء",
          rate_type: "package",
          price: 4800,
          currency_code: "sar",
          valid_from: validFrom,
          valid_to: validTo,
          min_stay: 2,
          cancellation_policy: "moderate",
          includes_breakfast: true,
          is_active: true,
        },
      ])

      logger.info("  Created 2 rate plans")
    }
  } catch (error: any) {
    logger.error(`  Travel seed error: ${error.message}`)
  }

  // ============================================================
  // 5. FITNESS – 2 class schedules, 2 trainers, 1 membership
  // ============================================================
  logger.info("\nStep 5: Seeding Fitness Data...")
  try {
    const fitnessService = container.resolve("fitness") as any

    const existingSchedules = await fitnessService.listClassSchedules()
    const schedules = Array.isArray(existingSchedules) ? existingSchedules : [existingSchedules].filter(Boolean)

    if (schedules.length > 0) {
      logger.info(`  Skipped – ${schedules.length} class schedules already exist`)
    } else {
      await fitnessService.createClassSchedules([
        {
          tenant_id: tenantId,
          class_name: "يوغا صباحية",
          description: "حصة يوغا هاثا للاسترخاء وتقوية الجسم، مناسبة لجميع المستويات.",
          class_type: "yoga",
          day_of_week: "sunday",
          start_time: "07:00",
          end_time: "08:00",
          duration_minutes: 60,
          max_capacity: 20,
          current_enrollment: 12,
          room: "Studio A",
          difficulty: "all_levels",
          is_recurring: true,
          is_active: true,
        },
        {
          tenant_id: tenantId,
          class_name: "تمارين HIIT مكثفة",
          description: "تدريب متقطع عالي الكثافة لحرق الدهون وبناء اللياقة. تجربة تحدي مكثفة.",
          class_type: "hiit",
          day_of_week: "tuesday",
          start_time: "18:00",
          end_time: "18:45",
          duration_minutes: 45,
          max_capacity: 15,
          current_enrollment: 14,
          room: "Studio B",
          difficulty: "advanced",
          is_recurring: true,
          is_active: true,
        },
      ])
      logger.info("  Created 2 class schedules (yoga, HIIT)")

      await fitnessService.createTrainerProfiles([
        {
          tenant_id: tenantId,
          name: "أحمد الحربي",
          specializations: ["HIIT", "CrossFit", "Strength Training"],
          certifications: ["ACE Certified Personal Trainer", "CrossFit Level 2", "NASM-CPT"],
          bio: "مدرب لياقة بدنية معتمد بخبرة 8 سنوات في التدريب الشخصي وتدريبات القوة والتحمل.",
          experience_years: 8,
          hourly_rate: 250,
          currency_code: "sar",
          is_accepting_clients: true,
          rating: 4.9,
          total_sessions: 1250,
          photo_url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
          availability: { days: ["sunday", "monday", "tuesday", "wednesday", "thursday"], hours: "06:00-22:00" },
        },
        {
          tenant_id: tenantId,
          name: "نورة القحطاني",
          specializations: ["Yoga", "Pilates", "Meditation"],
          certifications: ["RYT-500 Yoga Alliance", "Pilates Method Alliance", "Mindfulness Instructor"],
          bio: "معلمة يوغا وبيلاتس معتمدة دولياً، متخصصة في اليوغا العلاجية والتأمل الواعي.",
          experience_years: 6,
          hourly_rate: 200,
          currency_code: "sar",
          is_accepting_clients: true,
          rating: 4.8,
          total_sessions: 890,
          photo_url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800",
          availability: { days: ["sunday", "tuesday", "thursday"], hours: "07:00-20:00" },
        },
      ])
      logger.info("  Created 2 trainer profiles")

      await fitnessService.createGymMemberships({
        tenant_id: tenantId,
        customer_id: "customer_fitness_01",
        membership_type: "premium",
        status: "active",
        start_date: new Date(),
        end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        monthly_fee: 450,
        currency_code: "sar",
        auto_renew: true,
        freeze_count: 0,
        max_freezes: 3,
        access_hours: { weekdays: "05:00-23:00", weekends: "07:00-22:00" },
        includes: ["pool", "sauna", "group_classes", "towel_service", "locker"],
      })
      logger.info("  Created 1 gym membership tier (premium)")
    }
  } catch (error: any) {
    logger.error(`  Fitness seed error: ${error.message}`)
  }

  // ============================================================
  // 6. LEGAL – 2 attorney profiles
  // ============================================================
  logger.info("\nStep 6: Seeding Legal Attorney Profiles...")
  try {
    const legalService = container.resolve("legal") as any
    const existingAttorneys = await legalService.listAttorneyProfiles()
    const attorneys = Array.isArray(existingAttorneys) ? existingAttorneys : [existingAttorneys].filter(Boolean)

    if (attorneys.length > 0) {
      logger.info(`  Skipped – ${attorneys.length} attorney profiles already exist`)
    } else {
      await legalService.createAttorneyProfiles([
        {
          tenant_id: tenantId,
          name: "المحامي عبدالله الراشد",
          bar_number: "SA-BAR-2015-4821",
          specializations: ["Commercial Law", "Corporate Governance", "Mergers & Acquisitions"],
          practice_areas: ["Business Formation", "Contract Disputes", "Intellectual Property"],
          bio: "محامٍ تجاري معتمد بخبرة 12 عاماً في القضايا التجارية وحوكمة الشركات. عضو هيئة المحامين السعوديين.",
          education: [
            { degree: "ماجستير القانون التجاري", institution: "جامعة الملك سعود", year: 2013 },
            { degree: "بكالوريوس الشريعة والقانون", institution: "جامعة الإمام", year: 2010 },
          ],
          experience_years: 12,
          hourly_rate: 800,
          currency_code: "sar",
          is_accepting_cases: true,
          rating: 4.9,
          total_cases: 230,
          photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
          languages: ["ar", "en"],
        },
        {
          tenant_id: tenantId,
          name: "المحامية لمياء السبيعي",
          bar_number: "SA-BAR-2017-6103",
          specializations: ["Family Law", "Personal Status", "Labor Law"],
          practice_areas: ["Divorce & Custody", "Employment Disputes", "Women's Rights"],
          bio: "محامية متخصصة في الأحوال الشخصية وقانون العمل بخبرة 9 سنوات. ناشطة في مجال حقوق المرأة القانونية.",
          education: [
            { degree: "ماجستير القانون الدولي", institution: "جامعة الأميرة نورة", year: 2016 },
            { degree: "بكالوريوس القانون", institution: "جامعة الملك عبدالعزيز", year: 2013 },
          ],
          experience_years: 9,
          hourly_rate: 600,
          currency_code: "sar",
          is_accepting_cases: true,
          rating: 4.7,
          total_cases: 185,
          photo_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800",
          languages: ["ar", "en", "fr"],
        },
      ])
      logger.info("  Created 2 attorney profiles")
    }
  } catch (error: any) {
    logger.error(`  Legal seed error: ${error.message}`)
  }

  // ============================================================
  // 7. CHARITY – 2 orgs with donation campaigns
  // ============================================================
  logger.info("\nStep 7: Seeding Charity Organizations & Campaigns...")
  try {
    const charityService = container.resolve("charity") as any
    const existingOrgs = await charityService.listCharityOrgs()
    const orgs = Array.isArray(existingOrgs) ? existingOrgs : [existingOrgs].filter(Boolean)

    if (orgs.length > 0) {
      logger.info(`  Skipped – ${orgs.length} charity organizations already exist`)
    } else {
      const org1 = await charityService.createCharityOrgs({
        tenant_id: tenantId,
        name: "جمعية إحسان للتنمية الاجتماعية",
        description: "جمعية خيرية سعودية مرخصة متخصصة في دعم الأسر المحتاجة وبرامج التعليم والتدريب المهني.",
        registration_number: "SA-CHARITY-2018-1245",
        category: "poverty",
        website: "https://ihsan-charity.sa",
        email: "info@ihsan-charity.sa",
        phone: "+966115551234",
        address: { street: "شارع الملك فيصل", city: "Riyadh", country: "SA" },
        logo_url: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800",
        is_verified: true,
        verified_at: new Date(),
        tax_deductible: true,
        total_raised: 2500000,
        currency_code: "sar",
        is_active: true,
      })

      const org2 = await charityService.createCharityOrgs({
        tenant_id: tenantId,
        name: "مؤسسة أجيال للتعليم",
        description: "مؤسسة تعليمية غير ربحية تهدف إلى توفير فرص تعليمية للأطفال الأيتام وذوي الدخل المحدود.",
        registration_number: "SA-CHARITY-2020-3678",
        category: "education",
        website: "https://ajyal-education.sa",
        email: "contact@ajyal-education.sa",
        phone: "+966126667890",
        address: { street: "شارع التحلية", city: "Jeddah", country: "SA" },
        logo_url: "https://images.unsplash.com/photo-1497375638960-ca368c7231e4?w=800",
        is_verified: true,
        verified_at: new Date(),
        tax_deductible: true,
        total_raised: 1800000,
        currency_code: "sar",
        is_active: true,
      })

      logger.info("  Created 2 charity organizations")

      const campaignStart = new Date()
      const campaignEnd = new Date()
      campaignEnd.setMonth(campaignEnd.getMonth() + 3)

      await charityService.createDonationCampaigns([
        {
          tenant_id: tenantId,
          charity_id: org1.id,
          title: "حملة كسوة الشتاء 2026",
          description: "توفير ملابس شتوية للأسر المحتاجة في مناطق المملكة الباردة. تشمل الحملة توزيع 5000 حقيبة شتوية.",
          goal_amount: 500000,
          raised_amount: 125000,
          currency_code: "sar",
          donor_count: 340,
          status: "active",
          campaign_type: "one_time",
          starts_at: campaignStart,
          ends_at: campaignEnd,
          images: ["https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800"],
          is_featured: true,
        },
        {
          tenant_id: tenantId,
          charity_id: org2.id,
          title: "كفالة طالب – العام الدراسي 2026",
          description: "برنامج كفالة شامل يغطي الرسوم الدراسية والكتب والزي المدرسي لـ 200 طالب يتيم.",
          goal_amount: 750000,
          raised_amount: 310000,
          currency_code: "sar",
          donor_count: 520,
          status: "active",
          campaign_type: "recurring",
          starts_at: campaignStart,
          ends_at: campaignEnd,
          images: ["https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800"],
          is_featured: true,
        },
      ])
      logger.info("  Created 2 donation campaigns")
    }
  } catch (error: any) {
    logger.error(`  Charity seed error: ${error.message}`)
  }

  logger.info("\n========================================")
  logger.info("Vertical Modules Batch 2 Seed Complete!")
  logger.info("========================================")
}
