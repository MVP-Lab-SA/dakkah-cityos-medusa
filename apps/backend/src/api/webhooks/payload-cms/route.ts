// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import crypto from "crypto"

function verifyPayloadSignature(payload: string, signature: string, secret: string): boolean {
  const computed = crypto.createHmac("sha256", secret).update(payload).digest("hex")
  try {
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(signature))
  } catch {
    return false
  }
}

async function handleContentPublished(data: any, correlationId: string, req: MedusaRequest) {
  const contentId = data.id || data.doc?.id
  console.log(`[Webhook:PayloadCMS] content_published: ${contentId}, type=${data.collection || "unknown"}, correlation: ${correlationId}`)

  if (contentId) {
    try {
      const { PayloadToMedusaSync } = await import("../../../integrations/payload-sync/payload-to-medusa.js")
      const payloadUrl = process.env.PAYLOAD_CMS_URL || process.env.PAYLOAD_API_URL || ""
      const payloadApiKey = process.env.PAYLOAD_API_KEY || ""
      if (payloadUrl && payloadApiKey) {
        const sync = new PayloadToMedusaSync(req.scope, { payloadUrl, payloadApiKey })
        await sync.syncProductContent(contentId)
        console.log(`[Webhook:PayloadCMS] Content synced to Medusa: ${contentId}`)
      }
    } catch (err: any) {
      console.log(`[Webhook:PayloadCMS] Sync error: ${err.message}`)
    }
  }
}

async function handleContentUpdated(data: any, correlationId: string, req: MedusaRequest) {
  const contentId = data.id || data.doc?.id
  console.log(`[Webhook:PayloadCMS] content_updated: ${contentId}, type=${data.collection || "unknown"}, correlation: ${correlationId}`)

  if (contentId) {
    try {
      const { PayloadToMedusaSync } = await import("../../../integrations/payload-sync/payload-to-medusa.js")
      const payloadUrl = process.env.PAYLOAD_CMS_URL || process.env.PAYLOAD_API_URL || ""
      const payloadApiKey = process.env.PAYLOAD_API_KEY || ""
      if (payloadUrl && payloadApiKey) {
        const sync = new PayloadToMedusaSync(req.scope, { payloadUrl, payloadApiKey })
        await sync.syncProductContent(contentId)
        console.log(`[Webhook:PayloadCMS] Content update synced to Medusa: ${contentId}`)
      }
    } catch (err: any) {
      console.log(`[Webhook:PayloadCMS] Sync error: ${err.message}`)
    }
  }
}

async function handleContentDeleted(data: any, correlationId: string) {
  const contentId = data.id || data.doc?.id
  console.log(`[Webhook:PayloadCMS] content_deleted: ${contentId}, type=${data.collection || "unknown"}, correlation: ${correlationId}`)
}

async function handleNavigationUpdated(data: any, correlationId: string) {
  const navId = data.id || data.doc?.id
  console.log(`[Webhook:PayloadCMS] navigation_updated: ${navId}, correlation: ${correlationId}`)
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const correlationId = crypto.randomUUID()

  try {
    const secret = process.env.PAYLOAD_CMS_WEBHOOK_SECRET
    if (secret) {
      const signature = req.headers["x-payload-signature"] as string || req.headers["x-webhook-signature"] as string
      if (!signature) {
        console.log(`[Webhook:PayloadCMS] Missing signature header (correlation: ${correlationId})`)
        return res.status(400).json({ error: "Missing signature" })
      }

      const rawBody = typeof req.body === "string" ? req.body : JSON.stringify(req.body)
      if (!verifyPayloadSignature(rawBody, signature, secret)) {
        console.log(`[Webhook:PayloadCMS] Signature verification failed (correlation: ${correlationId})`)
        return res.status(400).json({ error: "Invalid signature" })
      }
    }

    const body = req.body as Record<string, any>
    const event = body.event || "unknown"
    const data = body.data || body

    console.log(`[Webhook:PayloadCMS] Received event: ${event} (correlation: ${correlationId})`)

    switch (event) {
      case "content_published":
        await handleContentPublished(data, correlationId, req)
        break
      case "content_updated":
        await handleContentUpdated(data, correlationId, req)
        break
      case "content_deleted":
        await handleContentDeleted(data, correlationId)
        break
      case "navigation_updated":
        await handleNavigationUpdated(data, correlationId)
        break
      default:
        console.log(`[Webhook:PayloadCMS] Unhandled event: ${event} (correlation: ${correlationId})`)
        break
    }

    return res.status(200).json({ received: true, event, correlation_id: correlationId })
  } catch (error: any) {
    console.error(`[Webhook:PayloadCMS] Error (correlation: ${correlationId}): ${error.message}`)
    return res.status(500).json({ error: "Internal server error" })
  }
}
