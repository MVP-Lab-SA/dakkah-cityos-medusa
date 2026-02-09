import { createFileRoute } from "@tanstack/react-router"
import { sdk } from "@/lib/utils/sdk"
import { NodeHierarchy } from "@/components/nodes/node-hierarchy"
import type { Node } from "@/lib/types/cityos"

const DEFAULT_TENANT_ID = "01KGZ2JRYX607FWMMYQNQRKVWS"

const TENANT_SLUG_TO_ID: Record<string, string> = {
  dakkah: DEFAULT_TENANT_ID,
}

export const Route = createFileRoute("/$tenant/$locale/nodes")({
  loader: async ({ params }) => {
    if (typeof window === "undefined") {
      const tenantId = TENANT_SLUG_TO_ID[params.tenant] || DEFAULT_TENANT_ID
      return { tenantId, rootNodes: [] as Node[] }
    }

    let tenantId = TENANT_SLUG_TO_ID[params.tenant] || ""
    if (!tenantId) {
      try {
        const data = await sdk.client.fetch<{ tenant: { id: string } }>(
          `/store/cityos/tenant?slug=${encodeURIComponent(params.tenant)}`
        )
        tenantId = data.tenant?.id || DEFAULT_TENANT_ID
      } catch {
        tenantId = DEFAULT_TENANT_ID
      }
    }

    return { tenantId, rootNodes: [] as Node[] }
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
  const { tenantId } = Route.useLoaderData()

  return (
    <div className="py-8 md:py-12">
      <div className="content-container">
        <NodeHierarchy tenantId={tenantId} initialNodes={[]} />
      </div>
    </div>
  )
}
