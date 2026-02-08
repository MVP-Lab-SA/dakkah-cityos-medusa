import { createFileRoute, notFound } from "@tanstack/react-router"
import { retrieveCategory } from "@/lib/data/categories"
import { getRegion } from "@/lib/data/regions"
import Category from "@/pages/category"
import { HttpTypes } from "@medusajs/types"

export const Route = createFileRoute("/$tenant/$locale/categories/$handle")({
  loader: async ({ params, context }) => {
    const { locale, handle } = params
    const { queryClient } = context

    // Pre-fetch region data
    const region = await queryClient.ensureQueryData({
      queryKey: ["region", locale],
      queryFn: () => getRegion({ country_code: locale }),
    })

    if (!region || !handle) {
      throw notFound()
    }

    // Fetch category by handle
    const category = await queryClient.ensureQueryData({
      queryKey: ["category", handle],
      queryFn: async () => {
        try {
          return await retrieveCategory({ handle })
        } catch {
          throw notFound()
        }
      },
    })

    return {
      locale,
      region,
      category: category as HttpTypes.StoreProductCategory,
    }
  },
  head: ({ loaderData }) => {
    const { region, locale, category } =
      loaderData || {}
    const regionName = region?.name || locale?.toUpperCase()
    const categoryName = category?.name || "Category"
    const title = `${categoryName} - ${regionName} | Medusa Store`
    const description = `Shop our ${categoryName.toLowerCase()} category available in ${regionName}. Free shipping and easy returns.`

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
  component: Category,
})
