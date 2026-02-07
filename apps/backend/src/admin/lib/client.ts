import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: "/",
  auth: {
    type: "jwt",
  },
})

// Alias for backwards compatibility
export const client = sdk
