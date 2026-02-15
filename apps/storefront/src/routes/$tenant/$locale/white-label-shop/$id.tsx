// @ts-nocheck
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/$tenant/$locale/white-label-shop/$id")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/$tenant/$locale/white-label/$id", params })
  },
  component: () => null,
})
