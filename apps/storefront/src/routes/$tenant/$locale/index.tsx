import Home from "@/pages/home"
import { createFileRoute } from "@tanstack/react-router"
import { getRegion } from "@/lib/data/regions"
import { listProducts } from "@/lib/data/products"
import { queryKeys } from "@/lib/utils/query-keys"

export const Route = createFileRoute("/$tenant/$locale/")({
  loader: async ({ params, context }) => {
    const { locale } = params
    if (typeof window === "undefined") return { locale, region: null }
    try {
      const { queryClient } = context

      const region = await queryClient.ensureQueryData({
        queryKey: ["region", locale],
        queryFn: () => getRegion({ country_code: locale }),
      })

      if (!region) {
        return { countryCode: locale, region: null }
      }

      queryClient.prefetchQuery({
        queryKey: queryKeys.products.latest(4, region.id),
        queryFn: () =>
          listProducts({
            query_params: {
              limit: 4,
              order: "-created_at",
            },
            region_id: region.id,
          }),
      })

      return {
        locale,
        region,
      }
    } catch {
      return { locale, region: null }
    }
  },
  head: () => {
    const title = `Dakkah CityOS Commerce`
    const description = `Explore the Dakkah CityOS Commerce marketplace. Browse our latest featured items and shop with confidence.`

    return {
      meta: [
        {
          title,
        },
        {
          name: "description",
          content: description,
        },
        {
          property: "og:title",
          content: title,
        },
        {
          property: "og:description",
          content: description,
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          property: "twitter:card",
          content: "summary_large_image",
        },
        {
          property: "twitter:title",
          content: title,
        },
        {
          property: "twitter:description",
          content: description,
        },
      ]
    }
  },
  component: Home,
})
