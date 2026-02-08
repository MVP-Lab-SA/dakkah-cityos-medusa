import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/products/$handle")({
  beforeLoad: async ({ params }) => {
    throw redirect({
      to: "/$tenant/$locale/products/$handle",
      params: { tenant: "default", locale: "en", handle: params.handle },
    });
  },
});
