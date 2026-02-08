import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { queryKeys } from "@/lib/utils/query-keys"
import type { Node } from "@/lib/types/cityos"

export function useNodes(tenantId: string) {
  return useQuery({
    queryKey: queryKeys.nodes.tree(tenantId),
    queryFn: async () => {
      const response = await sdk.client.fetch<{ nodes: Node[]; count: number }>(
        `/store/cityos/nodes?tenant_id=${tenantId}`,
        { credentials: "include" }
      )
      return response.nodes || []
    },
    enabled: !!tenantId,
  })
}

export function useNodeTree(tenantId: string) {
  const { data: nodes, ...rest } = useNodes(tenantId)

  const tree = nodes ? buildTree(nodes) : []

  return { data: tree, nodes, ...rest }
}

function buildTree(nodes: Node[]): Node[] {
  const map = new Map<string, Node>()
  const roots: Node[] = []

  nodes.forEach((node) => {
    map.set(node.id, { ...node, children: [] })
  })

  nodes.forEach((node) => {
    const current = map.get(node.id)!
    if (node.parent_id && map.has(node.parent_id)) {
      const parent = map.get(node.parent_id)!
      parent.children = parent.children || []
      parent.children.push(current)
    } else {
      roots.push(current)
    }
  })

  return roots
}
