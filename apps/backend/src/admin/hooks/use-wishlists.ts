import { useQuery } from "@tanstack/react-query"
import { sdk } from "../lib/client.js"

export type WishlistItem = {
  id: string
  product_name: string
  product_sku: string
  wishlist_count: number
  conversion_pct: number
  avg_price: string
  category: string
}

export function useWishlists() {
  return useQuery({
    queryKey: ["wishlists"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/wishlists", { method: "GET" })
      return response as { items: WishlistItem[]; count: number }
    },
  })
}
