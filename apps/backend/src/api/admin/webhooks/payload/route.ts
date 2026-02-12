import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import crypto from "crypto"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const secret = process.env.PAYLOAD_WEBHOOK_SECRET
    if (secret) {
      const signature = req.headers["x-payload-signature"] as string
      const expectedSig = crypto.createHmac("sha256", secret).update(JSON.stringify(req.body)).digest("hex")
      if (signature !== expectedSig) {
        console.log("[Webhook:Payload] Invalid signature")
        return res.status(401).json({ error: "Invalid signature" })
      }
    }

    const body = req.body as Record<string, any>
    const event = body.event || (body.collection && body.operation ? `${body.collection}.${body.operation}` : "unknown")

    console.log(`[Webhook:Payload] Received event: ${event}`)

    let processed = false

    // Inbound webhook handlers: External system (Payload CMS) → Medusa local data.
    // These are intentionally direct calls (not routed through Temporal) because they
    // only update local Medusa data based on external system notifications.
    // Cross-system OUTBOUND calls (Medusa → external) must go through Temporal.
    switch (event) {
      case "product.published":
      case "product.updated": {
        const contentId = body.data?.id || body.doc?.id
        if (contentId) {
          try {
            const { PayloadToMedusaSync } = await import("../../../../integrations/payload-sync/payload-to-medusa")
            const payloadUrl = process.env.PAYLOAD_API_URL || ""
            const payloadApiKey = process.env.PAYLOAD_API_KEY || ""
            if (payloadUrl && payloadApiKey) {
              const sync = new PayloadToMedusaSync(req.scope, { payloadUrl, payloadApiKey })
              await sync.syncProductContent(contentId)
              processed = true
              console.log(`[Webhook:Payload] Product content synced: ${contentId}`)
            } else {
              console.log("[Webhook:Payload] Missing PAYLOAD_API_URL or PAYLOAD_API_KEY, skipping sync")
            }
          } catch (err) {
            console.log(`[Webhook:Payload] Error syncing product content: ${err instanceof Error ? err.message : err}`)
          }
        }
        break
      }

      case "page.published": {
        const pageId = body.data?.id || body.doc?.id
        if (pageId) {
          try {
            const { PayloadToMedusaSync } = await import("../../../../integrations/payload-sync/payload-to-medusa")
            const payloadUrl = process.env.PAYLOAD_API_URL || ""
            const payloadApiKey = process.env.PAYLOAD_API_KEY || ""
            if (payloadUrl && payloadApiKey) {
              const sync = new PayloadToMedusaSync(req.scope, { payloadUrl, payloadApiKey })
              await sync.syncPage(pageId)
              processed = true
              console.log(`[Webhook:Payload] Page synced: ${pageId}`)
            }
          } catch (err) {
            console.log(`[Webhook:Payload] Error syncing page: ${err instanceof Error ? err.message : err}`)
          }
        }
        break
      }

      case "navigation.create":
      case "navigation.update": {
        const navId = body.data?.id || body.doc?.id
        console.log(`[Webhook:Payload] Navigation updated: ${navId}`)
        processed = true
        break
      }

      case "vertical.create":
      case "vertical.update": {
        const verticalId = body.data?.id || body.doc?.id
        console.log(`[Webhook:Payload] Vertical updated: ${verticalId}`)
        processed = true
        break
      }

      case "page.create":
      case "page.update":
      case "page.delete": {
        const pageId = body.data?.id || body.doc?.id
        const pagePath = body.data?.path || body.doc?.path
        console.log(`[Webhook:Payload] Page ${event}: ${pageId} (path: ${pagePath || "unknown"})`)
        processed = true
        break
      }

      case "media.uploaded": {
        const mediaId = body.data?.id || body.doc?.id
        if (mediaId) {
          try {
            const { PayloadToMedusaSync } = await import("../../../../integrations/payload-sync/payload-to-medusa")
            const payloadUrl = process.env.PAYLOAD_API_URL || ""
            const payloadApiKey = process.env.PAYLOAD_API_KEY || ""
            if (payloadUrl && payloadApiKey) {
              const sync = new PayloadToMedusaSync(req.scope, { payloadUrl, payloadApiKey })
              await sync.syncMedia(mediaId)
              processed = true
              console.log(`[Webhook:Payload] Media synced: ${mediaId}`)
            }
          } catch (err) {
            console.log(`[Webhook:Payload] Error syncing media: ${err instanceof Error ? err.message : err}`)
          }
        }
        break
      }

      case "tenant.updated": {
        const tenantId = body.data?.medusaTenantId || body.doc?.medusaTenantId
        console.log(`[Webhook:Payload] Tenant updated notification received: ${tenantId || "unknown"}`)
        processed = true
        break
      }

      case "store.updated": {
        const storeId = body.data?.medusaStoreId || body.doc?.medusaStoreId
        console.log(`[Webhook:Payload] Store updated notification received: ${storeId || "unknown"}`)
        processed = true
        break
      }

      default:
        console.log(`[Webhook:Payload] Unhandled event: ${event}`)
        break
    }

    return res.status(200).json({ received: true, event, processed })
  } catch (error) {
    console.log(`[Webhook:Payload] Error: ${error instanceof Error ? error.message : error}`)
    return res.status(500).json({ error: "Internal server error" })
  }
}
