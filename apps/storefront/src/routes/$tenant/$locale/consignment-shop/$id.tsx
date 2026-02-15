// @ts-nocheck
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/$tenant/$locale/consignment-shop/$id")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/$tenant/$locale/consignment/$id", params })
  },
  component: () => null,
})
