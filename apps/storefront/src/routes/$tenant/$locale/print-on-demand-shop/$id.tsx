// @ts-nocheck
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/$tenant/$locale/print-on-demand-shop/$id")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/$tenant/$locale/print-on-demand/$id", params })
  },
  component: () => null,
})
