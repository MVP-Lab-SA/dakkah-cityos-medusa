// @ts-nocheck
import { ExecArgs } from "@medusajs/framework/types"

export default async function seedVerticals1({ container }: ExecArgs) {
  console.log("========================================")
  console.log("Seeding Vertical Modules - Batch 1")
  console.log("========================================\n")

  const tenantService = container.resolve("tenant") as any

  let tenantId = "ten_default"
  try {
    const tenants = await tenantService.listTenants({ handle: "dakkah" })
    const list = Array.isArray(tenants) ? tenants : [tenants].filter(Boolean)
    if (list.length > 0 && list[0]?.id) {
      tenantId = list[0].id
      console.log(`Using Dakkah tenant: ${tenantId}`)
    } else {
      const allTenants = await tenantService.listTenants({}, { take: 1 })
      const allList = Array.isArray(allTenants) ? allTenants : [allTenants].filter(Boolean)
      if (allList.length > 0 && allList[0]?.id) {
        tenantId = allList[0].id
        console.log(`Dakkah not found, using first tenant: ${tenantId}`)
      } else {
        console.log(`No tenants found, using placeholder: ${tenantId}`)
      }
    }
  } catch (err: any) {
    console.log(`Could not fetch tenants: ${err.message}. Using placeholder: ${tenantId}`)
  }

  // ============================================================
  // 1. RESTAURANT
  // ============================================================
  console.log("\n--- 1. Seeding Restaurant Module ---")
  try {
    const restaurantService = container.resolve("restaurant")

    const existingRestaurants = await restaurantService.listRestaurants({ tenant_id: tenantId }, { take: 1 })
    const existingList = Array.isArray(existingRestaurants) ? existingRestaurants : [existingRestaurants].filter(Boolean)

    if (existingList.length > 0) {
      console.log("  Restaurants already seeded, skipping...")
    } else {
      const restaurant1 = await restaurantService.createRestaurants({
        tenant_id: tenantId,
        name: "Al Baik Express",
        handle: "al-baik-express",
        description: "Authentic Saudi fast-food chain serving the best broasted chicken and seafood in Riyadh.",
        cuisine_types: ["saudi", "fast_food", "chicken"],
        address_line1: "King Fahd Road, Al Olaya",
        city: "Riyadh",
        state: "Riyadh Province",
        postal_code: "11564",
        country_code: "sa",
        latitude: 24.7136,
        longitude: 46.6753,
        phone: "+966112345678",
        email: "info@albaik-express.sa",
        operating_hours: {
          sunday: { open: "10:00", close: "23:00" },
          monday: { open: "10:00", close: "23:00" },
          tuesday: { open: "10:00", close: "23:00" },
          wednesday: { open: "10:00", close: "23:00" },
          thursday: { open: "10:00", close: "00:00" },
          friday: { open: "13:00", close: "00:00" },
          saturday: { open: "10:00", close: "00:00" },
        },
        is_active: true,
        is_accepting_orders: true,
        avg_prep_time_minutes: 15,
        delivery_radius_km: 10,
        min_order_amount: 25,
        delivery_fee: 10,
        rating: 4.7,
        total_reviews: 1240,
        logo_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200",
        banner_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
        metadata: { featured: true },
      })

      const restaurant2 = await restaurantService.createRestaurants({
        tenant_id: tenantId,
        name: "Najd Village",
        handle: "najd-village",
        description: "Traditional Najdi cuisine with an elegant dining experience in the heart of Riyadh.",
        cuisine_types: ["saudi", "traditional", "middle_eastern"],
        address_line1: "Tahlia Street, Sulaimaniyah",
        city: "Riyadh",
        state: "Riyadh Province",
        postal_code: "12241",
        country_code: "sa",
        latitude: 24.6938,
        longitude: 46.6850,
        phone: "+966114567890",
        email: "reservations@najdvillage.sa",
        operating_hours: {
          sunday: { open: "12:00", close: "23:30" },
          monday: { open: "12:00", close: "23:30" },
          tuesday: { open: "12:00", close: "23:30" },
          wednesday: { open: "12:00", close: "23:30" },
          thursday: { open: "12:00", close: "00:30" },
          friday: { open: "13:00", close: "00:30" },
          saturday: { open: "12:00", close: "00:30" },
        },
        is_active: true,
        is_accepting_orders: true,
        avg_prep_time_minutes: 35,
        delivery_radius_km: 15,
        min_order_amount: 50,
        delivery_fee: 15,
        rating: 4.5,
        total_reviews: 890,
        logo_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200",
        banner_url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
        metadata: { featured: true },
      })

      console.log(`  Created restaurants: ${restaurant1.id}, ${restaurant2.id}`)

      const menu1 = await restaurantService.createMenus({
        tenant_id: tenantId,
        restaurant_id: restaurant1.id,
        name: "Main Menu",
        description: "Our full selection of broasted chicken and seafood",
        menu_type: "regular",
        is_active: true,
        display_order: 1,
      })

      const menu2 = await restaurantService.createMenus({
        tenant_id: tenantId,
        restaurant_id: restaurant2.id,
        name: "Traditional Dinner Menu",
        description: "Authentic Najdi dishes served family-style",
        menu_type: "dinner",
        is_active: true,
        display_order: 1,
      })

      console.log(`  Created menus: ${menu1.id}, ${menu2.id}`)

      const menuItems = await Promise.all([
        restaurantService.createMenuItems({
          tenant_id: tenantId,
          menu_id: menu1.id,
          name: "Broasted Chicken Meal",
          description: "Crispy broasted chicken served with garlic sauce, coleslaw, and fries",
          price: 35,
          currency_code: "sar",
          category: "chicken",
          image_url: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400",
          is_available: true,
          is_featured: true,
          calories: 850,
          allergens: ["gluten"],
          dietary_tags: ["halal"],
          prep_time_minutes: 12,
          display_order: 1,
        }),
        restaurantService.createMenuItems({
          tenant_id: tenantId,
          menu_id: menu1.id,
          name: "Shrimp Meal",
          description: "Golden fried shrimp with tartar sauce and seasoned rice",
          price: 45,
          currency_code: "sar",
          category: "seafood",
          image_url: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400",
          is_available: true,
          is_featured: false,
          calories: 720,
          allergens: ["shellfish", "gluten"],
          dietary_tags: ["halal"],
          prep_time_minutes: 15,
          display_order: 2,
        }),
        restaurantService.createMenuItems({
          tenant_id: tenantId,
          menu_id: menu2.id,
          name: "Kabsa Laham",
          description: "Slow-cooked lamb with fragrant spiced rice, raisins, and almonds",
          price: 85,
          currency_code: "sar",
          category: "main_course",
          image_url: "https://images.unsplash.com/photo-1642821373181-203fb135ce16?w=400",
          is_available: true,
          is_featured: true,
          calories: 1100,
          allergens: ["nuts"],
          dietary_tags: ["halal", "gluten_free"],
          prep_time_minutes: 30,
          display_order: 1,
        }),
        restaurantService.createMenuItems({
          tenant_id: tenantId,
          menu_id: menu2.id,
          name: "Jareesh",
          description: "Traditional crushed wheat porridge with tender meat and aromatic spices",
          price: 55,
          currency_code: "sar",
          category: "main_course",
          image_url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
          is_available: true,
          is_featured: false,
          calories: 680,
          allergens: ["gluten"],
          dietary_tags: ["halal"],
          prep_time_minutes: 25,
          display_order: 2,
        }),
      ])

      console.log(`  Created ${menuItems.length} menu items`)

      const modifierGroup = await restaurantService.createModifierGroups({
        tenant_id: tenantId,
        restaurant_id: restaurant1.id,
        name: "Spice Level",
        description: "Choose your preferred spice level",
        selection_type: "single",
        min_selections: 1,
        max_selections: 1,
        is_required: true,
        display_order: 1,
      })

      console.log(`  Created modifier group: ${modifierGroup.id}`)
    }
  } catch (err: any) {
    console.log(`  Error seeding restaurants: ${err.message}`)
  }

  // ============================================================
  // 2. HEALTHCARE
  // ============================================================
  console.log("\n--- 2. Seeding Healthcare Module ---")
  try {
    const healthcareService = container.resolve("healthcare")

    const existingPractitioners = await healthcareService.listPractitioners({ tenant_id: tenantId }, { take: 1 })
    const existingPractList = Array.isArray(existingPractitioners) ? existingPractitioners : [existingPractitioners].filter(Boolean)

    if (existingPractList.length > 0) {
      console.log("  Healthcare data already seeded, skipping...")
    } else {
      const practitioners = await Promise.all([
        healthcareService.createPractitioners({
          tenant_id: tenantId,
          name: "Dr. Ahmed Al-Rashidi",
          title: "Consultant Cardiologist",
          specialization: "Cardiology",
          license_number: "MOH-SA-2024-78451",
          license_verified: true,
          bio: "Board-certified cardiologist with over 15 years of experience in interventional cardiology. Fellowship trained at King Faisal Specialist Hospital.",
          education: [
            { degree: "MBBS", institution: "King Saud University", year: 2005 },
            { degree: "MD Cardiology", institution: "Johns Hopkins University", year: 2010 },
            { degree: "Fellowship", institution: "King Faisal Specialist Hospital", year: 2013 },
          ],
          experience_years: 15,
          languages: ["ar", "en"],
          consultation_fee: 500,
          currency_code: "sar",
          consultation_duration_minutes: 30,
          is_accepting_patients: true,
          rating: 4.9,
          total_reviews: 342,
          photo_url: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300",
          availability: {
            sunday: ["09:00-13:00", "16:00-20:00"],
            monday: ["09:00-13:00", "16:00-20:00"],
            tuesday: ["09:00-13:00"],
            wednesday: ["09:00-13:00", "16:00-20:00"],
            thursday: ["09:00-13:00"],
          },
          metadata: { department: "cardiac_center" },
        }),
        healthcareService.createPractitioners({
          tenant_id: tenantId,
          name: "Dr. Fatima Al-Zahrani",
          title: "Consultant Dermatologist",
          specialization: "Dermatology",
          license_number: "MOH-SA-2024-92103",
          license_verified: true,
          bio: "Expert dermatologist specializing in cosmetic dermatology and skin cancer treatment. Published researcher with focus on skin conditions in arid climates.",
          education: [
            { degree: "MBBS", institution: "King Abdulaziz University", year: 2008 },
            { degree: "MD Dermatology", institution: "University of Melbourne", year: 2013 },
          ],
          experience_years: 11,
          languages: ["ar", "en", "fr"],
          consultation_fee: 400,
          currency_code: "sar",
          consultation_duration_minutes: 25,
          is_accepting_patients: true,
          rating: 4.8,
          total_reviews: 218,
          photo_url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300",
          availability: {
            sunday: ["10:00-14:00"],
            monday: ["10:00-14:00", "17:00-21:00"],
            tuesday: ["10:00-14:00", "17:00-21:00"],
            wednesday: ["10:00-14:00"],
            thursday: ["10:00-14:00", "17:00-21:00"],
          },
          metadata: { department: "dermatology_center" },
        }),
      ])

      console.log(`  Created ${practitioners.length} practitioners`)

      const pharmacyProducts = await Promise.all([
        healthcareService.createPharmacyProducts({
          tenant_id: tenantId,
          name: "Amoxicillin 500mg",
          generic_name: "Amoxicillin Trihydrate",
          manufacturer: "Saudi Pharmaceutical Industries",
          dosage_form: "capsule",
          strength: "500mg",
          requires_prescription: true,
          storage_instructions: "Store below 25°C in a dry place. Keep away from children.",
          side_effects: ["nausea", "diarrhea", "skin rash", "headache"],
          contraindications: ["penicillin allergy", "severe renal impairment"],
          price: 28,
          currency_code: "sar",
          stock_quantity: 500,
          is_active: true,
          metadata: { category: "antibiotics" },
        }),
        healthcareService.createPharmacyProducts({
          tenant_id: tenantId,
          name: "Panadol Extra",
          generic_name: "Paracetamol + Caffeine",
          manufacturer: "GlaxoSmithKline",
          dosage_form: "tablet",
          strength: "500mg/65mg",
          requires_prescription: false,
          storage_instructions: "Store below 30°C. Protect from moisture.",
          side_effects: ["rare allergic reactions"],
          contraindications: ["liver disease", "alcohol dependency"],
          price: 12,
          currency_code: "sar",
          stock_quantity: 1200,
          is_active: true,
          metadata: { category: "pain_relief" },
        }),
        healthcareService.createPharmacyProducts({
          tenant_id: tenantId,
          name: "Ventolin Inhaler",
          generic_name: "Salbutamol Sulfate",
          manufacturer: "GlaxoSmithKline",
          dosage_form: "inhaler",
          strength: "100mcg/dose",
          requires_prescription: true,
          storage_instructions: "Store below 30°C. Do not puncture or burn the canister.",
          side_effects: ["tremor", "headache", "tachycardia", "muscle cramps"],
          contraindications: ["hypersensitivity to salbutamol"],
          price: 45,
          currency_code: "sar",
          stock_quantity: 300,
          is_active: true,
          metadata: { category: "respiratory" },
        }),
      ])

      console.log(`  Created ${pharmacyProducts.length} pharmacy products`)
    }
  } catch (err: any) {
    console.log(`  Error seeding healthcare: ${err.message}`)
  }

  // ============================================================
  // 3. EDUCATION
  // ============================================================
  console.log("\n--- 3. Seeding Education Module ---")
  try {
    const educationService = container.resolve("education")

    const existingCourses = await educationService.listCourses({ tenant_id: tenantId }, { take: 1 })
    const existingCourseList = Array.isArray(existingCourses) ? existingCourses : [existingCourses].filter(Boolean)

    if (existingCourseList.length > 0) {
      console.log("  Education data already seeded, skipping...")
    } else {
      const course1 = await educationService.createCourses({
        tenant_id: tenantId,
        title: "Full-Stack Web Development with React & Node.js",
        description: "Master modern web development from front to back. Build real-world applications using React, Node.js, Express, and PostgreSQL. Includes deployment and best practices.",
        short_description: "Complete full-stack development course with hands-on projects",
        category: "Technology",
        subcategory: "Web Development",
        level: "intermediate",
        format: "self_paced",
        language: "ar",
        price: 799,
        currency_code: "sar",
        duration_hours: 48,
        total_lessons: 36,
        total_enrollments: 1580,
        avg_rating: 4.7,
        total_reviews: 312,
        thumbnail_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400",
        syllabus: [
          { week: 1, topic: "HTML, CSS & JavaScript Fundamentals" },
          { week: 2, topic: "React Components & State Management" },
          { week: 3, topic: "Node.js & Express API Development" },
          { week: 4, topic: "Database Design with PostgreSQL" },
          { week: 5, topic: "Authentication & Authorization" },
          { week: 6, topic: "Deployment & DevOps" },
        ],
        prerequisites: ["Basic programming knowledge", "Familiarity with HTML/CSS"],
        tags: ["react", "nodejs", "javascript", "fullstack", "web"],
        status: "published",
        is_free: false,
        certificate_offered: true,
        metadata: { featured: true },
      })

      const course2 = await educationService.createCourses({
        tenant_id: tenantId,
        title: "Arabic Calligraphy: From Basics to Mastery",
        description: "Learn the beautiful art of Arabic calligraphy from master calligrapher. Covers Naskh, Thuluth, and Diwani scripts with step-by-step video tutorials and practice exercises.",
        short_description: "Traditional Arabic calligraphy techniques and styles",
        category: "Arts & Design",
        subcategory: "Calligraphy",
        level: "beginner",
        format: "self_paced",
        language: "ar",
        price: 299,
        currency_code: "sar",
        duration_hours: 24,
        total_lessons: 18,
        total_enrollments: 2340,
        avg_rating: 4.9,
        total_reviews: 567,
        thumbnail_url: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400",
        syllabus: [
          { week: 1, topic: "Tools & Materials Introduction" },
          { week: 2, topic: "Naskh Script Fundamentals" },
          { week: 3, topic: "Thuluth Script Techniques" },
          { week: 4, topic: "Diwani Script & Composition" },
        ],
        prerequisites: [],
        tags: ["calligraphy", "arabic", "art", "design"],
        status: "published",
        is_free: false,
        certificate_offered: true,
        metadata: { featured: true },
      })

      console.log(`  Created courses: ${course1.id}, ${course2.id}`)

      const lessons = await Promise.all([
        educationService.createLessons({
          tenant_id: tenantId,
          course_id: course1.id,
          title: "Setting Up Your Development Environment",
          description: "Install Node.js, VS Code, and configure your workspace for modern web development.",
          content_type: "video",
          content_url: "https://example.com/lessons/dev-setup",
          duration_minutes: 25,
          display_order: 1,
          is_free_preview: true,
          is_mandatory: true,
        }),
        educationService.createLessons({
          tenant_id: tenantId,
          course_id: course1.id,
          title: "React Fundamentals: Components & JSX",
          description: "Understand React components, JSX syntax, and how to build reusable UI elements.",
          content_type: "video",
          content_url: "https://example.com/lessons/react-fundamentals",
          duration_minutes: 45,
          display_order: 2,
          is_free_preview: false,
          is_mandatory: true,
        }),
        educationService.createLessons({
          tenant_id: tenantId,
          course_id: course1.id,
          title: "Building REST APIs with Express",
          description: "Create robust REST APIs using Express.js with proper routing, middleware, and error handling.",
          content_type: "video",
          content_url: "https://example.com/lessons/express-apis",
          duration_minutes: 55,
          display_order: 3,
          is_free_preview: false,
          is_mandatory: true,
        }),
        educationService.createLessons({
          tenant_id: tenantId,
          course_id: course2.id,
          title: "Introduction to Arabic Calligraphy Tools",
          description: "Learn about reed pens (qalam), ink types, and paper selection for Arabic calligraphy.",
          content_type: "video",
          content_url: "https://example.com/lessons/calligraphy-tools",
          duration_minutes: 20,
          display_order: 1,
          is_free_preview: true,
          is_mandatory: true,
        }),
        educationService.createLessons({
          tenant_id: tenantId,
          course_id: course2.id,
          title: "Naskh Script: Letter Forms & Connections",
          description: "Master the foundational Naskh script used in everyday Arabic writing.",
          content_type: "video",
          content_url: "https://example.com/lessons/naskh-letters",
          duration_minutes: 40,
          display_order: 2,
          is_free_preview: false,
          is_mandatory: true,
        }),
        educationService.createLessons({
          tenant_id: tenantId,
          course_id: course2.id,
          title: "Practice Session: Writing Bismillah",
          description: "Step-by-step practice writing Bismillah in Naskh script with instructor guidance.",
          content_type: "assignment",
          content_body: "Practice writing Bismillah al-Rahman al-Rahim in Naskh script. Submit a photo of your best three attempts.",
          duration_minutes: 60,
          display_order: 3,
          is_free_preview: false,
          is_mandatory: true,
        }),
      ])

      console.log(`  Created ${lessons.length} lessons`)

      const quiz = await educationService.createQuizs({
        tenant_id: tenantId,
        course_id: course1.id,
        lesson_id: lessons[1].id,
        title: "React Fundamentals Quiz",
        description: "Test your understanding of React components, JSX, and state management basics.",
        quiz_type: "multiple_choice",
        questions: [
          {
            question: "What does JSX stand for?",
            options: ["JavaScript XML", "Java Syntax Extension", "JSON XML", "JavaScript Extension"],
            correct_answer: 0,
          },
          {
            question: "Which hook is used to manage state in a functional component?",
            options: ["useEffect", "useState", "useRef", "useMemo"],
            correct_answer: 1,
          },
          {
            question: "What is the virtual DOM?",
            options: [
              "A copy of the real DOM kept in memory",
              "A browser extension",
              "A CSS framework",
              "A database",
            ],
            correct_answer: 0,
          },
        ],
        passing_score: 70,
        time_limit_minutes: 15,
        max_attempts: 3,
        is_randomized: true,
        is_active: true,
      })

      console.log(`  Created quiz: ${quiz.id}`)
    }
  } catch (err: any) {
    console.log(`  Error seeding education: ${err.message}`)
  }

  // ============================================================
  // 4. REAL ESTATE
  // ============================================================
  console.log("\n--- 4. Seeding Real Estate Module ---")
  try {
    const realEstateService = container.resolve("realEstate")

    const existingListings = await realEstateService.listPropertyListings({ tenant_id: tenantId }, { take: 1 })
    const existingListingList = Array.isArray(existingListings) ? existingListings : [existingListings].filter(Boolean)

    if (existingListingList.length > 0) {
      console.log("  Real estate data already seeded, skipping...")
    } else {
      const listings = await Promise.all([
        realEstateService.createPropertyListings({
          tenant_id: tenantId,
          title: "Luxury 3-Bedroom Apartment in Al Olaya",
          description: "Stunning modern apartment with panoramic city views in the prestigious Al Olaya district. Features premium finishes, smart home system, underground parking, and access to rooftop pool and gym.",
          listing_type: "rent",
          property_type: "apartment",
          status: "active",
          price: 120000,
          currency_code: "sar",
          price_period: "yearly",
          address_line1: "King Fahd Road, Al Olaya Tower",
          city: "Riyadh",
          state: "Riyadh Province",
          postal_code: "11564",
          country_code: "sa",
          latitude: 24.7136,
          longitude: 46.6753,
          bedrooms: 3,
          bathrooms: 3,
          area_sqm: 185,
          year_built: 2022,
          features: ["smart_home", "parking", "gym", "pool", "concierge", "balcony", "central_ac"],
          images: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600",
          ],
          view_count: 342,
          favorite_count: 45,
          metadata: { featured: true, furnished: true },
        }),
        realEstateService.createPropertyListings({
          tenant_id: tenantId,
          title: "Spacious Family Villa in Al Narjis",
          description: "Beautiful 5-bedroom villa with private garden and pool. Located in the family-friendly Al Narjis neighborhood with easy access to schools and shopping centers. Includes driver's room and maid's quarters.",
          listing_type: "sale",
          property_type: "villa",
          status: "active",
          price: 3500000,
          currency_code: "sar",
          price_period: "total",
          address_line1: "Al Narjis District, Street 15",
          city: "Riyadh",
          state: "Riyadh Province",
          postal_code: "13764",
          country_code: "sa",
          latitude: 24.8204,
          longitude: 46.6268,
          bedrooms: 5,
          bathrooms: 6,
          area_sqm: 450,
          year_built: 2020,
          features: ["private_pool", "garden", "garage", "maid_room", "driver_room", "central_ac", "security"],
          images: [
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600",
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
          ],
          view_count: 567,
          favorite_count: 89,
          metadata: { featured: true },
        }),
        realEstateService.createPropertyListings({
          tenant_id: tenantId,
          title: "Premium Office Space in KAFD",
          description: "Grade A office space in King Abdullah Financial District. Open-plan layout with floor-to-ceiling windows, dedicated meeting rooms, and premium lobby. Ideal for financial services and tech companies.",
          listing_type: "lease",
          property_type: "office",
          status: "active",
          price: 250000,
          currency_code: "sar",
          price_period: "yearly",
          address_line1: "King Abdullah Financial District, Tower 3",
          city: "Riyadh",
          state: "Riyadh Province",
          postal_code: "13519",
          country_code: "sa",
          latitude: 24.7648,
          longitude: 46.6425,
          bathrooms: 4,
          area_sqm: 320,
          year_built: 2023,
          features: ["reception", "meeting_rooms", "parking", "security", "fiber_internet", "backup_power"],
          images: [
            "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600",
            "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600",
          ],
          view_count: 234,
          favorite_count: 28,
          metadata: { featured: false },
        }),
      ])

      console.log(`  Created ${listings.length} property listings`)
    }
  } catch (err: any) {
    console.log(`  Error seeding real estate: ${err.message}`)
  }

  // ============================================================
  // 5. EVENT TICKETING
  // ============================================================
  console.log("\n--- 5. Seeding Event Ticketing Module ---")
  try {
    const eventTicketingService = container.resolve("eventTicketing")

    const existingEvents = await eventTicketingService.listEvents({ tenant_id: tenantId }, { take: 1 })
    const existingEventList = Array.isArray(existingEvents) ? existingEvents : [existingEvents].filter(Boolean)

    if (existingEventList.length > 0) {
      console.log("  Event ticketing data already seeded, skipping...")
    } else {
      const venue1 = await eventTicketingService.createVenues({
        tenant_id: tenantId,
        name: "Riyadh Boulevard Arena",
        description: "State-of-the-art entertainment venue in Riyadh Season Boulevard with world-class sound and lighting systems.",
        address_line1: "Riyadh Boulevard, Prince Mohammed Bin Salman Road",
        city: "Riyadh",
        state: "Riyadh Province",
        postal_code: "12382",
        country_code: "sa",
        latitude: 24.7580,
        longitude: 46.6491,
        capacity: 15000,
        venue_type: "indoor",
        amenities: ["parking", "food_court", "vip_lounges", "wheelchair_access", "prayer_room"],
        contact_phone: "+966112223344",
        contact_email: "events@riyadhboulevard.sa",
        image_url: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=600",
      })

      const venue2 = await eventTicketingService.createVenues({
        tenant_id: tenantId,
        name: "KAEC Conference Center",
        description: "Modern conference and convention center in King Abdullah Economic City, perfect for business events and tech conferences.",
        address_line1: "King Abdullah Economic City",
        city: "KAEC",
        state: "Makkah Province",
        postal_code: "23964",
        country_code: "sa",
        latitude: 22.4541,
        longitude: 39.1077,
        capacity: 3000,
        venue_type: "indoor",
        amenities: ["parking", "wifi", "translation_booths", "exhibition_hall", "business_center"],
        contact_phone: "+966126778899",
        contact_email: "conferences@kaec.sa",
        image_url: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600",
      })

      console.log(`  Created venues: ${venue1.id}, ${venue2.id}`)

      const futureDate1 = new Date()
      futureDate1.setMonth(futureDate1.getMonth() + 2)
      const futureDate1End = new Date(futureDate1)
      futureDate1End.setHours(futureDate1End.getHours() + 4)

      const futureDate2 = new Date()
      futureDate2.setMonth(futureDate2.getMonth() + 3)
      const futureDate2End = new Date(futureDate2)
      futureDate2End.setDate(futureDate2End.getDate() + 2)

      const event1 = await eventTicketingService.createEvents({
        tenant_id: tenantId,
        title: "Saudi Tech Summit 2026",
        description: "The largest technology conference in the Kingdom bringing together industry leaders, startups, and innovators. Featuring keynotes from global tech executives, startup pitch competitions, and hands-on workshops.",
        event_type: "conference",
        status: "published",
        venue_id: venue2.id,
        address: {
          line1: "King Abdullah Economic City",
          city: "KAEC",
          country: "SA",
        },
        latitude: 22.4541,
        longitude: 39.1077,
        starts_at: futureDate2,
        ends_at: futureDate2End,
        timezone: "Asia/Riyadh",
        is_online: false,
        max_capacity: 3000,
        current_attendees: 0,
        image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600",
        organizer_name: "Saudi Technology Forum",
        organizer_email: "info@sauditechsummit.sa",
        tags: ["technology", "conference", "startups", "innovation"],
        metadata: { featured: true },
      })

      const event2 = await eventTicketingService.createEvents({
        tenant_id: tenantId,
        title: "Riyadh Music Festival",
        description: "An unforgettable night of live music performances featuring top regional and international artists. Part of the Riyadh Season entertainment program.",
        event_type: "concert",
        status: "published",
        venue_id: venue1.id,
        address: {
          line1: "Riyadh Boulevard",
          city: "Riyadh",
          country: "SA",
        },
        latitude: 24.7580,
        longitude: 46.6491,
        starts_at: futureDate1,
        ends_at: futureDate1End,
        timezone: "Asia/Riyadh",
        is_online: false,
        max_capacity: 15000,
        current_attendees: 0,
        image_url: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600",
        organizer_name: "Riyadh Season Entertainment",
        organizer_email: "tickets@riyadhseason.sa",
        tags: ["music", "concert", "entertainment", "live"],
        metadata: { featured: true },
      })

      console.log(`  Created events: ${event1.id}, ${event2.id}`)

      const ticketTypes = await Promise.all([
        eventTicketingService.createTicketTypes({
          tenant_id: tenantId,
          event_id: event1.id,
          name: "General Admission",
          description: "Access to all conference sessions and exhibition area",
          price: 500,
          currency_code: "sar",
          quantity_total: 2000,
          quantity_sold: 0,
          max_per_order: 5,
          is_active: true,
          includes: ["conference_sessions", "exhibition", "lunch", "coffee"],
        }),
        eventTicketingService.createTicketTypes({
          tenant_id: tenantId,
          event_id: event1.id,
          name: "VIP Pass",
          description: "Premium access with VIP lounge, networking dinner, and priority seating",
          price: 2000,
          currency_code: "sar",
          quantity_total: 500,
          quantity_sold: 0,
          max_per_order: 3,
          is_active: true,
          includes: ["conference_sessions", "exhibition", "vip_lounge", "networking_dinner", "priority_seating", "gift_bag"],
        }),
        eventTicketingService.createTicketTypes({
          tenant_id: tenantId,
          event_id: event2.id,
          name: "Standard Ticket",
          description: "General standing area access",
          price: 350,
          currency_code: "sar",
          quantity_total: 10000,
          quantity_sold: 0,
          max_per_order: 6,
          is_active: true,
          includes: ["general_standing"],
        }),
        eventTicketingService.createTicketTypes({
          tenant_id: tenantId,
          event_id: event2.id,
          name: "Golden Circle",
          description: "Front-row standing with premium view and dedicated bar area",
          price: 1200,
          currency_code: "sar",
          quantity_total: 2000,
          quantity_sold: 0,
          max_per_order: 4,
          is_active: true,
          includes: ["golden_circle", "premium_view", "dedicated_bar"],
        }),
      ])

      console.log(`  Created ${ticketTypes.length} ticket types`)
    }
  } catch (err: any) {
    console.log(`  Error seeding event ticketing: ${err.message}`)
  }

  // ============================================================
  // 6. AUCTION
  // ============================================================
  console.log("\n--- 6. Seeding Auction Module ---")
  try {
    const auctionService = container.resolve("auction")

    const existingAuctions = await auctionService.listAuctionListings({ tenant_id: tenantId }, { take: 1 })
    const existingAuctionList = Array.isArray(existingAuctions) ? existingAuctions : [existingAuctions].filter(Boolean)

    if (existingAuctionList.length > 0) {
      console.log("  Auction data already seeded, skipping...")
    } else {
      const auctionStart = new Date()
      const auctionEnd1 = new Date()
      auctionEnd1.setDate(auctionEnd1.getDate() + 7)
      const auctionEnd2 = new Date()
      auctionEnd2.setDate(auctionEnd2.getDate() + 5)
      const auctionEnd3 = new Date()
      auctionEnd3.setDate(auctionEnd3.getDate() + 10)

      const auctions = await Promise.all([
        auctionService.createAuctionListings({
          tenant_id: tenantId,
          product_id: "prod_auction_001",
          title: "Vintage Arabian Dallah Coffee Pot - 18th Century",
          description: "Rare antique brass Dallah coffee pot dating back to the 18th century. Intricately engraved with traditional Najdi patterns. Authenticated by the Saudi Heritage Authority. A collector's masterpiece.",
          auction_type: "english",
          status: "active",
          starting_price: 5000,
          reserve_price: 15000,
          buy_now_price: 50000,
          current_price: 5000,
          currency_code: "sar",
          bid_increment: 500,
          starts_at: auctionStart,
          ends_at: auctionEnd1,
          auto_extend: true,
          extend_minutes: 5,
          total_bids: 0,
          metadata: { category: "antiques", condition: "excellent", authenticated: true },
        }),
        auctionService.createAuctionListings({
          tenant_id: tenantId,
          product_id: "prod_auction_002",
          title: "2024 Toyota Land Cruiser GR Sport - Limited Edition",
          description: "Brand new 2024 Toyota Land Cruiser GR Sport in Pearl White. Full option with twin-turbo V6, adaptive suspension, and premium JBL sound system. Factory warranty included.",
          auction_type: "english",
          status: "active",
          starting_price: 280000,
          reserve_price: 350000,
          current_price: 280000,
          currency_code: "sar",
          bid_increment: 5000,
          starts_at: auctionStart,
          ends_at: auctionEnd2,
          auto_extend: true,
          extend_minutes: 10,
          total_bids: 0,
          metadata: { category: "vehicles", condition: "new", year: 2024 },
        }),
        auctionService.createAuctionListings({
          tenant_id: tenantId,
          product_id: "prod_auction_003",
          title: "Original Arabic Calligraphy Artwork by Master Hassan",
          description: "Stunning original gold-leaf Arabic calligraphy on handmade paper. Features Surah Al-Fatiha in Thuluth script. Framed in premium walnut wood. Certificate of authenticity included. Size: 120cm x 80cm.",
          auction_type: "english",
          status: "active",
          starting_price: 8000,
          reserve_price: 20000,
          buy_now_price: 45000,
          current_price: 8000,
          currency_code: "sar",
          bid_increment: 1000,
          starts_at: auctionStart,
          ends_at: auctionEnd3,
          auto_extend: true,
          extend_minutes: 5,
          total_bids: 0,
          metadata: { category: "art", medium: "gold_leaf_on_paper", authenticated: true },
        }),
      ])

      console.log(`  Created ${auctions.length} auction listings`)
    }
  } catch (err: any) {
    console.log(`  Error seeding auctions: ${err.message}`)
  }

  // ============================================================
  // 7. RENTAL
  // ============================================================
  console.log("\n--- 7. Seeding Rental Module ---")
  try {
    const rentalService = container.resolve("rental")

    const existingRentals = await rentalService.listRentalProducts({ tenant_id: tenantId }, { take: 1 })
    const existingRentalList = Array.isArray(existingRentals) ? existingRentals : [existingRentals].filter(Boolean)

    if (existingRentalList.length > 0) {
      console.log("  Rental data already seeded, skipping...")
    } else {
      const rentals = await Promise.all([
        rentalService.createRentalProducts({
          tenant_id: tenantId,
          product_id: "prod_rental_001",
          rental_type: "daily",
          base_price: 200,
          currency_code: "sar",
          deposit_amount: 1000,
          late_fee_per_day: 50,
          min_duration: 1,
          max_duration: 30,
          is_available: true,
          condition_on_listing: "new",
          total_rentals: 47,
          metadata: {
            name: "Canon EOS R5 Camera Kit",
            description: "Professional mirrorless camera with 24-70mm f/2.8 lens, 2 batteries, 128GB CF Express card, and carrying case",
            category: "electronics",
            image_url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400",
          },
        }),
        rentalService.createRentalProducts({
          tenant_id: tenantId,
          product_id: "prod_rental_002",
          rental_type: "daily",
          base_price: 500,
          currency_code: "sar",
          deposit_amount: 5000,
          late_fee_per_day: 150,
          min_duration: 1,
          max_duration: 14,
          is_available: true,
          condition_on_listing: "like_new",
          total_rentals: 23,
          metadata: {
            name: "DJI Mavic 3 Pro Drone",
            description: "Professional drone with Hasselblad camera, 3 batteries, ND filter set, and hard case. Licensed operation area guide included.",
            category: "electronics",
            image_url: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400",
          },
        }),
        rentalService.createRentalProducts({
          tenant_id: tenantId,
          product_id: "prod_rental_003",
          rental_type: "weekly",
          base_price: 1500,
          currency_code: "sar",
          deposit_amount: 3000,
          late_fee_per_day: 300,
          min_duration: 1,
          max_duration: 8,
          is_available: true,
          condition_on_listing: "good",
          total_rentals: 65,
          metadata: {
            name: "Camping & Desert Safari Kit",
            description: "Complete desert camping package: 4-person tent, sleeping bags, portable stove, cooler, lanterns, folding chairs, and first aid kit",
            category: "outdoor",
            image_url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400",
          },
        }),
      ])

      console.log(`  Created ${rentals.length} rental products`)
    }
  } catch (err: any) {
    console.log(`  Error seeding rentals: ${err.message}`)
  }

  console.log("\n========================================")
  console.log("Vertical Modules Batch 1 Seeding Complete!")
  console.log("========================================")
}
