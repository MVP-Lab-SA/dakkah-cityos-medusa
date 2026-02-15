import { ExecArgs } from "@medusajs/framework/types"
import { createLogger } from "../lib/logger"
const logger = createLogger("scripts:seed-services")

const services = [
  {
    handle: "arabian-massage",
    name: "Arabian Relaxation Massage",
    description: "Traditional Arabian massage techniques to promote relaxation, improve circulation, and relieve muscle tension. Perfect for stress relief and overall wellness.",
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
    handle: "arabian-gold-facial",
    name: "Arabian Gold Facial",
    description: "Luxurious facial using argan oil and Arabian skincare techniques. Includes cleansing, exfoliation, mask, and hydration.",
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
    virtual_meeting_url: "https://meet.dakkah.sa/wellness",
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
      }
    }
  } catch (err: any) {
    logger.info(`Could not fetch tenants: ${err.message}. Using placeholder: ${tenantId}`)
  }

  logger.info("Seeding services...")

  for (const serviceData of services) {
    try {
      const existing = await bookingModule.listServiceProducts({ handle: serviceData.handle })
      const existingList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

      if (existingList.length > 0) {
        logger.info(`  - Service ${serviceData.handle} already exists, skipping`)
        continue
      }

      await bookingModule.createServiceProducts({ ...serviceData, tenant_id: tenantId })
      logger.info(`  - Created service: ${serviceData.name}`)
    } catch (error: any) {
      console.error(`  - Failed to create service ${serviceData.handle}: ${error.message}`)
    }
  }

  // Create availability for services
  logger.info("Creating service availability...")

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
        tenant_id: tenantId,
        schedule_type: "weekly_recurring",
        weekly_schedule: weeklySchedule,
        timezone: "Asia/Riyadh",
        is_active: true,
      })
      logger.info(`  - Created availability for: ${service.name}`)
    } catch (error: any) {
      console.error(`  - Failed to create availability for ${service.name}: ${error.message}`)
    }
  }

  logger.info(`Seeded ${services.length} services with availability`)
}
