import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/categories/$handle")({
  beforeLoad: async ({ params }) => {
    throw redirect({
      to: "/$tenant/$locale/categories/$handle",
      params: { tenant: "default", locale: "en", handle: params.handle },
    });
  },
});
