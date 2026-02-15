// @ts-nocheck
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/$tenant/$locale/consignment-shop/")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/$tenant/$locale/consignment", params })
  },
  component: () => null,
  head: () => ({
    meta: [
      { title: "Consignment | Dakkah CityOS" },
      { name: "description", content: "Browse consignment shop on Dakkah CityOS" },
    ],
  }),
})
