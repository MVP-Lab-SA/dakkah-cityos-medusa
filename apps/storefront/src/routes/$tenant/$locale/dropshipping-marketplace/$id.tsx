// @ts-nocheck
import { createFileRoute, redirect } from "@tanstack/react-router"
import { getServerBaseUrl, fetchWithTimeout } from "@/lib/utils/env"

export const Route = createFileRoute("/$tenant/$locale/dropshipping-marketplace/$id")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/$tenant/$locale/dropshipping/$id", params })
  },
  component: () => null,
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title || loaderData?.name || "Dropshipping Details"} | Dakkah CityOS` },
      { name: "description", content: loaderData?.description || loaderData?.excerpt || "" },
    ],
  }),
  loader: async ({ params }) => {
    try {
      const baseUrl = getServerBaseUrl()
      const resp = await fetchWithTimeout(`${baseUrl}/store/dropshipping/products/${params.id}`, {
        headers: { "x-publishable-api-key": import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || "pk_56377e90449a39fc4585675802137b09577cd6e17f339eba6dc923eaf22e3445" },
      })
      if (!resp.ok) return { item: null }
      const data = await resp.json()
      return { item: data.item || data }
    } catch { return { item: null } }
  },
})
