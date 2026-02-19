import Medusa from "@medusajs/js-sdk"
import { getServerBaseUrl } from "@/lib/utils/env"

const MEDUSA_BACKEND_URL = getServerBaseUrl()

console.log("[SDK Debug] Initializing Medusa SDK", {
  backendUrl: MEDUSA_BACKEND_URL,
  isServer: typeof window === "undefined",
  rawEnvEndpoint: import.meta.env.VITE_MEDUSA_BACKEND_URL,
})

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: false,
  publishableKey: import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY,
  auth: {
    type: "jwt",
  },
})

// Monkey-patch sdk.client.fetch to ensure headers are always present
// Monkey-patch sdk.client.fetch to ensure headers are always present
const originalFetch = sdk.client.fetch.bind(sdk.client)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
sdk.client.fetch = async (...args: any[]) => {
  const [path, options = {}] = args

  const headers = (options.headers || {}) as Record<string, string>
  const publishableKey = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY

  if (publishableKey && !headers["x-publishable-api-key"]) {
    headers["x-publishable-api-key"] = publishableKey
  }

  options.headers = headers
  return originalFetch(path, options)
}
