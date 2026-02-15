import Medusa from "@medusajs/js-sdk"
import { getServerBaseUrl } from "@/lib/utils/env"

const MEDUSA_BACKEND_URL = getServerBaseUrl()

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: false,
  publishableKey: import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY,
  auth: {
    type: "jwt",
  }
})
