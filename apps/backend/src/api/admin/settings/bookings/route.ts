import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// In a real implementation, this would be stored in the database
// For now, we'll use a simple in-memory store or metadata on a system entity

const DEFAULT_CONFIG = {
  reminder_enabled: true,
  reminder_hours_before: 24,
  cancellation_window_hours: 24,
  cancellation_fee_percent: 0,
  allow_reschedule: true,
  reschedule_window_hours: 24,
  buffer_minutes_before: 0,
  buffer_minutes_after: 15,
  no_show_fee_percent: 100,
  mark_no_show_after_minutes: 15,
  allow_same_day_booking: true,
  min_advance_booking_hours: 2,
  max_advance_booking_days: 60,
  allow_self_checkin: false,
  checkin_window_minutes: 30,
}

// Simple in-memory storage (would be database in production)
let bookingConfig = { ...DEFAULT_CONFIG }

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  // In production, fetch from database or store settings
  res.json({ config: bookingConfig })
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const { config } = req.body as { config: typeof DEFAULT_CONFIG }
  
  if (!config) {
    return res.status(400).json({ message: "Config is required" })
  }
  
  // Validate and merge with defaults
  bookingConfig = {
    ...DEFAULT_CONFIG,
    ...config,
  }
  
  // In production, save to database
  
  res.json({ config: bookingConfig, message: "Configuration saved" })
}
