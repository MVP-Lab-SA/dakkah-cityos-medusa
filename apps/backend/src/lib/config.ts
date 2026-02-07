/**
 * Centralized configuration for Medusa backend
 * All environment variables and constants in one place
 */

export const config = {
  // URLs
  storefrontUrl: process.env.STOREFRONT_URL || "",
  backendUrl: process.env.MEDUSA_BACKEND_URL || "",
  
  // Email addresses
  emails: {
    support: process.env.SUPPORT_EMAIL || "support@yourdomain.com",
    admin: process.env.ADMIN_EMAIL || "admin@yourdomain.com",
    noreply: process.env.NOREPLY_EMAIL || "noreply@yourdomain.com",
  },
  
  // Business rules
  subscription: {
    maxPaymentRetries: parseInt(process.env.MAX_PAYMENT_RETRIES || "3", 10),
    gracePeriodDays: parseInt(process.env.GRACE_PERIOD_DAYS || "7", 10),
    trialDays: parseInt(process.env.DEFAULT_TRIAL_DAYS || "14", 10),
    renewalReminderDays: [7, 3, 1], // Days before renewal to send reminders
  },
  
  booking: {
    checkInWindowMinutes: parseInt(process.env.BOOKING_CHECKIN_WINDOW || "30", 10),
    noShowGracePeriodMinutes: parseInt(process.env.BOOKING_NOSHOW_GRACE || "15", 10),
    cancellationHoursNotice: parseInt(process.env.BOOKING_CANCEL_NOTICE_HOURS || "24", 10),
  },
  
  vendor: {
    inactiveDaysWarning: parseInt(process.env.VENDOR_INACTIVE_WARNING_DAYS || "30", 10),
    inactiveDaysDeactivate: parseInt(process.env.VENDOR_INACTIVE_DEACTIVATE_DAYS || "60", 10),
    commissionPercentDefault: parseFloat(process.env.DEFAULT_COMMISSION_PERCENT || "10"),
  },
  
  b2b: {
    quoteExpiryDays: parseInt(process.env.QUOTE_EXPIRY_DAYS || "30", 10),
    invoiceDueDays: parseInt(process.env.INVOICE_DUE_DAYS || "30", 10),
    defaultPaymentTerms: process.env.DEFAULT_PAYMENT_TERMS || "net_30",
  },
  
  // Feature flags
  features: {
    enableStripConnect: process.env.ENABLE_STRIPE_CONNECT === "true",
    enableEmailNotifications: process.env.ENABLE_EMAIL_NOTIFICATIONS !== "false",
    enableAdminNotifications: process.env.ENABLE_ADMIN_NOTIFICATIONS !== "false",
  },
  
  // Stripe
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  },
}

// Validation function to check required config at startup
export function validateConfig(): string[] {
  const errors: string[] = []
  
  if (!config.storefrontUrl && process.env.NODE_ENV === "production") {
    errors.push("STOREFRONT_URL is required in production")
  }
  
  if (config.features.enableStripConnect && !config.stripe.secretKey) {
    errors.push("STRIPE_SECRET_KEY is required when Stripe Connect is enabled")
  }
  
  return errors
}
