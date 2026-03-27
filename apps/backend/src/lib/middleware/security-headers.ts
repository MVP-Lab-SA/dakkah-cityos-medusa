import type { MedusaNextFunction, MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

function requestPathname(req: MedusaRequest): string {
  const raw = typeof req.url === "string" ? req.url : ""
  return raw.split("?")[0] || ""
}

export function securityHeadersMiddleware(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  const pathname = requestPathname(req)
  // Medusa Admin SPA (custom path) is sensitive to restrictive CSP; dashboard assets
  // and auth flows expect browser-default behavior for that subtree.
  if (pathname === "/commerce/admin" || pathname.startsWith("/commerce/admin/")) {
    return next()
  }

  res.setHeader("X-Content-Type-Options", "nosniff")

  res.setHeader("X-Frame-Options", "DENY")

  res.setHeader("X-XSS-Protection", "1; mode=block")

  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin")

  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(self), payment=(self)"
  )

  const xfProto = req.headers["x-forwarded-proto"]
  const forwarded = Array.isArray(xfProto) ? xfProto[0] : xfProto
  const isHttpsRequest =
    forwarded?.split(",")[0]?.trim() === "https" ||
    (req as { secure?: boolean }).secure === true

  if (process.env.NODE_ENV === "production" && isHttpsRequest) {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    )
  }

  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.stripe.com https://*.temporal.io wss:",
      "frame-src 'self' https://js.stripe.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ")
  )

  res.removeHeader("X-Powered-By")

  return next()
}
