// @ts-nocheck
import { createFileRoute, redirect } from "@tanstack/react-router"

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
})
