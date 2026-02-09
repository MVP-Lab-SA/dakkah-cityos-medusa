import { createFileRoute } from "@tanstack/react-router"
import { sdk } from "@/lib/utils/sdk"
import { queryKeys } from "@/lib/utils/query-keys"
import { NodeHierarchy } from "@/components/nodes/node-hierarchy"
import type { Node } from "@/lib/types/cityos"

export const Route = createFileRoute("/$tenant/$locale/nodes")({
  loader: async ({ params, context }) => {
    const { tenant } = params
    if (typeof window === "undefined") return { tenantId: "", rootNodes: [] as Node[] }
    const { queryClient } = context

    let tenantId = ""
    try {
      const data = await sdk.client.fetch<{ tenant: { id: string } }>(
        `/store/cityos/tenant?slug=${encodeURIComponent(tenant)}`
      )
      tenantId = data.tenant?.id || ""
    } catch (e) {
      console.warn("Failed to resolve tenant for nodes page")
    }

    let rootNodes: Node[] = []
    if (tenantId) {
      try {
        rootNodes = await queryClient.ensureQueryData({
          queryKey: queryKeys.nodes.root(tenantId),
          queryFn: async () => {
            const response = await sdk.client.fetch<{ nodes: Node[] }>(
              `/store/cityos/nodes?tenant_id=${encodeURIComponent(tenantId)}&type=CITY`,
              { credentials: "include" }
            )
            return response.nodes || []
          },
        })
      } catch (e) {
        console.warn("Failed to load root nodes:", e)
      }
    }

    return { tenantId, rootNodes }
  },
  head: () => ({
    meta: [
      { title: "Node Hierarchy" },
      {
        name: "description",
        content: "Browse the organizational node hierarchy: Cities, Districts, Zones, Facilities, and Assets.",
      },
    ],
  }),
  component: NodesPage,
})

function NodesPage() {
  const { tenantId, rootNodes } = Route.useLoaderData()

  return (
    <div className="py-8 md:py-12">
      <div className="content-container">
        <NodeHierarchy tenantId={tenantId} initialNodes={rootNodes} />
      </div>
    </div>
  )
}
