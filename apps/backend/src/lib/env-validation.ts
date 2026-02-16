import { createLogger } from "./logger"
const logger = createLogger("env-validation")

interface EnvVarConfig {
  key: string
  required: boolean
  description: string
  fallbackBehavior?: string
}

const ENV_VARS: EnvVarConfig[] = [
  { key: "DATABASE_URL", required: true, description: "PostgreSQL connection string" },
  { key: "VITE_MEDUSA_PUBLISHABLE_KEY", required: true, description: "Medusa publishable API key" },
  { key: "STRIPE_API_KEY", required: false, description: "Stripe API key for payments", fallbackBehavior: "Payment processing disabled" },
  { key: "STRIPE_WEBHOOK_SECRET", required: false, description: "Stripe webhook signature verification", fallbackBehavior: "Webhook verification disabled" },
  { key: "SENDGRID_API_KEY", required: false, description: "SendGrid API key for email notifications", fallbackBehavior: "Email notifications disabled" },
  { key: "PAYLOAD_CMS_URL_DEV", required: false, description: "Payload CMS URL", fallbackBehavior: "CMS hierarchy sync disabled" },
  { key: "PAYLOAD_API_KEY", required: false, description: "Payload CMS API key", fallbackBehavior: "CMS hierarchy sync disabled" },
  { key: "ERPNEXT_URL_DEV", required: false, description: "ERPNext URL", fallbackBehavior: "ERPNext sync disabled" },
  { key: "ERPNEXT_API_KEY", required: false, description: "ERPNext API key", fallbackBehavior: "ERPNext sync disabled" },
  { key: "ERPNEXT_API_SECRET", required: false, description: "ERPNext API secret", fallbackBehavior: "ERPNext sync disabled" },
  { key: "TEMPORAL_ADDRESS", required: false, description: "Temporal Cloud address", fallbackBehavior: "Workflow orchestration disabled" },
  { key: "FLEETBASE_API_KEY", required: false, description: "Fleetbase API key", fallbackBehavior: "Logistics/geo features disabled" },
  { key: "WALTID_API_KEY", required: false, description: "Walt.id API key", fallbackBehavior: "Digital identity features disabled" },
  { key: "REDIS_URL", required: false, description: "Redis URL", fallbackBehavior: "Using in-memory fallback (not production-ready)" },
  { key: "MEILISEARCH_HOST", required: false, description: "Meilisearch host", fallbackBehavior: "Search functionality disabled" },
  { key: "SENTRY_DSN", required: false, description: "Sentry DSN for error monitoring", fallbackBehavior: "Error monitoring disabled" },
]

export function validateEnvironment(): { valid: boolean; missing: string[]; warnings: string[] } {
  const missing: string[] = []
  const warnings: string[] = []

  logger.info("[EnvValidation] Checking environment variables...")

  for (const envVar of ENV_VARS) {
    const value = process.env[envVar.key]
    
    if (!value || value.trim() === "") {
      if (envVar.required) {
        missing.push(envVar.key)
        logger.error(`[EnvValidation] MISSING REQUIRED: ${envVar.key} — ${envVar.description}`)
      } else {
        warnings.push(envVar.key)
        logger.warn(`[EnvValidation] Not set: ${envVar.key} — ${envVar.fallbackBehavior || "Feature may be limited"}`)
      }
    }
  }

  if (missing.length > 0) {
    logger.error(`[EnvValidation] ${missing.length} required variable(s) missing: ${missing.join(", ")}`)
  }
  
  if (warnings.length > 0) {
    logger.info(`[EnvValidation] ${warnings.length} optional variable(s) not set (features will be limited)`)
  }

  if (missing.length === 0 && warnings.length === 0) {
    logger.info("[EnvValidation] All environment variables configured")
  }

  return { valid: missing.length === 0, missing, warnings }
}
