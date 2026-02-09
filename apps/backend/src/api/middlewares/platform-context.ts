import type { MedusaNextFunction, MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export interface PlatformContextData {
  correlationId?: string
  tenantId?: string
  nodeId?: string
  nodeType?: string
  locale?: string
  userId?: string
  channel?: string
  idempotencyKey?: string
}

declare module "@medusajs/framework/http" {
  interface MedusaRequest {
    platformContext?: PlatformContextData
  }
}

export async function platformContextMiddleware(
  req: MedusaRequest,
  _res: MedusaResponse,
  next: MedusaNextFunction
) {
  const platformContext: PlatformContextData = {
    correlationId: req.headers["x-cityos-correlation-id"] as string,
    tenantId: req.headers["x-cityos-tenant-id"] as string,
    nodeId: req.headers["x-cityos-node-id"] as string,
    nodeType: req.headers["x-cityos-node-type"] as string,
    locale: req.headers["x-cityos-locale"] as string,
    userId: req.headers["x-cityos-user-id"] as string,
    channel: req.headers["x-cityos-channel"] as string,
    idempotencyKey: req.headers["x-idempotency-key"] as string,
  }

  const hasValues = Object.values(platformContext).some(Boolean)
  if (hasValues) {
    req.platformContext = platformContext
  }

  return next()
}
