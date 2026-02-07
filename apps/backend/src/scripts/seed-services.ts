import { ExecArgs } from "@medusajs/framework/types"

const services = [
  {
    handle: "swedish-massage",
    name: "Swedish Relaxation Massage",
    description: "Classic Swedish massage techniques to promote relaxation, improve circulation, and relieve muscle tension. Perfect for stress relief and overall wellness.",
    service_type: "appointment",
    category: "massage",
    duration_minutes: 60,
    buffer_before_minutes: 10,
    buffer_after_minutes: 10,
    min_capacity: 1,
    max_capacity: 1,
    base_price: "120",
    pricing_type: "fixed",
    location_type: "in_person",
    is_active: true,
    is_bookable_online: true,
    requires_confirmation: false,
    min_advance_booking_hours: 24,
    max_advance_booking_days: 60,
    cancellation_policy_hours: 24,
  },
  {
    handle: "deep-tissue-massage",
    name: "Deep Tissue Therapy",
    description: "Intensive deep tissue massage targeting chronic muscle tension and knots. Ideal for athletes and those with persistent muscle pain.",
    service_type: "appointment",
    category: "massage",
    duration_minutes: 75,
    buffer_before_minutes: 10,
    buffer_after_minutes: 15,
    min_capacity: 1,
    max_capacity: 1,
    base_price: "150",
    pricing_type: "fixed",
    location_type: "in_person",
    is_active: true,
    is_bookable_online: true,
    requires_confirmation: false,
    min_advance_booking_hours: 24,
    max_advance_booking_days: 60,
    cancellation_policy_hours: 24,
  },
  {
    handle: "nordic-glow-facial",
    name: "Nordic Glow Facial",
    description: "Luxurious facial treatment using Arctic botanicals and Nordic skincare techniques. Includes cleansing, exfoliation, mask, and hydration.",
    service_type: "appointment",
    category: "facial",
    duration_minutes: 50,
    buffer_before_minutes: 5,
    buffer_after_minutes: 10,
    min_capacity: 1,
    max_capacity: 1,
    base_price: "95",
    pricing_type: "fixed",
    location_type: "in_person",
    is_active: true,
    is_bookable_online: true,
    requires_confirmation: false,
    min_advance_booking_hours: 12,
    max_advance_booking_days: 45,
    cancellation_policy_hours: 12,
  },
  {
    handle: "hot-stone-therapy",
    name: "Hot Stone Therapy",
    description: "Heated volcanic stones combined with massage therapy for deep relaxation and muscle relief. A truly indulgent experience.",
    service_type: "appointment",
    category: "massage",
    duration_minutes: 90,
    buffer_before_minutes: 15,
    buffer_after_minutes: 15,
    min_capacity: 1,
    max_capacity: 1,
    base_price: "180",
    pricing_type: "fixed",
    location_type: "in_person",
    is_active: true,
    is_bookable_online: true,
    requires_confirmation: false,
    min_advance_booking_hours: 48,
    max_advance_booking_days: 60,
    cancellation_policy_hours: 48,
  },
  {
    handle: "aromatherapy-session",
    name: "Aromatherapy Wellness Session",
    description: "Customized aromatherapy experience using essential oils selected for your needs. Includes consultation and take-home blend.",
    service_type: "consultation",
    category: "aromatherapy",
    duration_minutes: 45,
    buffer_before_minutes: 5,
    buffer_after_minutes: 5,
    min_capacity: 1,
    max_capacity: 1,
    base_price: "75",
    pricing_type: "fixed",
    location_type: "in_person",
    is_active: true,
    is_bookable_online: true,
    requires_confirmation: false,
    min_advance_booking_hours: 12,
    max_advance_booking_days: 30,
    cancellation_policy_hours: 12,
  },
  {
    handle: "group-meditation",
    name: "Group Meditation Class",
    description: "Guided group meditation session focusing on mindfulness and stress reduction. Suitable for all experience levels.",
    service_type: "class",
    category: "meditation",
    duration_minutes: 60,
    buffer_before_minutes: 10,
    buffer_after_minutes: 5,
    min_capacity: 3,
    max_capacity: 12,
    base_price: "25",
    pricing_type: "per_person",
    location_type: "in_person",
    is_active: true,
    is_bookable_online: true,
    requires_confirmation: false,
    min_advance_booking_hours: 2,
    max_advance_booking_days: 14,
    cancellation_policy_hours: 4,
  },
  {
    handle: "virtual-wellness-coaching",
    name: "Virtual Wellness Coaching",
    description: "One-on-one virtual consultation with a certified wellness coach. Personalized guidance for nutrition, fitness, and lifestyle.",
    service_type: "consultation",
    category: "coaching",
    duration_minutes: 45,
    buffer_before_minutes: 5,
    buffer_after_minutes: 5,
    min_capacity: 1,
    max_capacity: 1,
    base_price: "85",
    pricing_type: "fixed",
    location_type: "virtual",
    virtual_meeting_url: "https://meet.example.com/wellness",
    is_active: true,
    is_bookable_online: true,
    requires_confirmation: false,
    min_advance_booking_hours: 6,
    max_advance_booking_days: 30,
    cancellation_policy_hours: 6,
  },
  {
    handle: "couples-massage",
    name: "Couples Relaxation Experience",
    description: "Side-by-side Swedish massage for couples in a shared treatment room. Includes champagne and chocolates.",
    service_type: "appointment",
    category: "massage",
    duration_minutes: 75,
    buffer_before_minutes: 15,
    buffer_after_minutes: 15,
    min_capacity: 2,
    max_capacity: 2,
    base_price: "280",
    pricing_type: "fixed",
    location_type: "in_person",
    is_active: true,
    is_bookable_online: true,
    requires_confirmation: true,
    min_advance_booking_hours: 48,
    max_advance_booking_days: 60,
    cancellation_policy_hours: 48,
  },
]

export default async function seedServices({ container }: ExecArgs) {
  const bookingModule = container.resolve("booking") as any

  console.log("Seeding services...")

  for (const serviceData of services) {
    try {
      // Check if service already exists
      const existing = await bookingModule.listServiceProducts({ handle: serviceData.handle })
      const existingList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

      if (existingList.length > 0) {
        console.log(`  - Service ${serviceData.handle} already exists, skipping`)
        continue
      }

      await bookingModule.createServiceProducts(serviceData)
      console.log(`  - Created service: ${serviceData.name}`)
    } catch (error: any) {
      console.error(`  - Failed to create service ${serviceData.handle}: ${error.message}`)
    }
  }

  // Create availability for services
  console.log("Creating service availability...")

  const weeklySchedule = {
    monday: [{ start: "09:00", end: "18:00" }],
    tuesday: [{ start: "09:00", end: "18:00" }],
    wednesday: [{ start: "09:00", end: "18:00" }],
    thursday: [{ start: "09:00", end: "20:00" }],
    friday: [{ start: "09:00", end: "18:00" }],
    saturday: [{ start: "10:00", end: "16:00" }],
    sunday: [],
  }

  const allServices = await bookingModule.listServiceProducts({})
  const serviceList = Array.isArray(allServices) ? allServices : [allServices].filter(Boolean)

  for (const service of serviceList) {
    try {
      const existingAvail = await bookingModule.listAvailabilities({ 
        owner_type: "service", 
        owner_id: service.id 
      })
      const availList = Array.isArray(existingAvail) ? existingAvail : [existingAvail].filter(Boolean)

      if (availList.length > 0) {
        continue
      }

      await bookingModule.createAvailabilities({
        owner_type: "service",
        owner_id: service.id,
        schedule_type: "weekly_recurring",
        weekly_schedule: weeklySchedule,
        timezone: "America/New_York",
        is_active: true,
      })
      console.log(`  - Created availability for: ${service.name}`)
    } catch (error: any) {
      console.error(`  - Failed to create availability for ${service.name}: ${error.message}`)
    }
  }

  console.log(`Seeded ${services.length} services with availability`)
}
