import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    throw redirect({
      to: "/$tenant/$locale",
      params: { tenant: "default", locale: "en" },
    })
  },
})
