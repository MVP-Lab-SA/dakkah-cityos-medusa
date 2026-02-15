import { createFileRoute, notFound } from "@tanstack/react-router"
import Cart from "@/pages/cart"
import { getRegion } from "@/lib/data/regions"

export const Route = createFileRoute("/$tenant/$locale/cart")({
  loader: async ({ params, context }) => {
    const { locale } = params
    if (typeof window === "undefined") return { region: null, locale }
    try {
      const { queryClient } = context

      const region = await queryClient.ensureQueryData({
        queryKey: ["region", locale],
        queryFn: () => getRegion({ country_code: locale }),
      })

      if (!region) {
        throw notFound()
      }

      return {
        region,
        locale,
      }
    } catch {
      return { region: null, locale }
    }
  },
  component: Cart,
})