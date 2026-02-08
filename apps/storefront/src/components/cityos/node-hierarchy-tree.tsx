import { useNodeTree } from "@/lib/hooks/use-nodes"
import type { Node, NodeType } from "@/lib/types/cityos"

interface NodeHierarchyTreeProps {
  tenantId: string
}

export function NodeHierarchyTree({ tenantId }: NodeHierarchyTreeProps) {
  const { data: tree, isLoading } = useNodeTree(tenantId)

  if (isLoading) {
    return (
      <div className="border rounded-lg p-6 animate-pulse">
        <div className="h-5 bg-muted rounded w-1/3 mb-4"></div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-muted rounded" style={{ marginLeft: `${i * 20}px` }}></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="border rounded-lg p-6">
      <h3 className="font-semibold text-lg mb-4">Node Hierarchy</h3>
      {tree.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No nodes configured</p>
      ) : (
        <div className="space-y-1">
          {tree.map((node) => (
            <NodeItem key={node.id} node={node} depth={0} />
          ))}
        </div>
      )}
    </div>
  )
}

function NodeItem({ node, depth }: { node: Node; depth: number }) {
  const typeColors: Record<NodeType, string> = {
    CITY: "bg-purple-100 text-purple-800",
    DISTRICT: "bg-blue-100 text-blue-800",
    ZONE: "bg-green-100 text-green-800",
    FACILITY: "bg-orange-100 text-orange-800",
    ASSET: "bg-gray-100 text-gray-800",
  }

  return (
    <>
      <div
        className="flex items-center gap-3 p-2 rounded hover:bg-muted/50"
        style={{ paddingLeft: `${depth * 24 + 8}px` }}
      >
        {depth > 0 && <span className="text-muted-foreground">└</span>}
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[node.type]}`}>
          {node.type}
        </span>
        <span className="font-medium">{node.name}</span>
        <span className="text-xs text-muted-foreground">{node.code}</span>
        {!node.is_active && (
          <span className="px-1.5 py-0.5 bg-red-100 text-red-800 text-xs rounded">Inactive</span>
        )}
      </div>
      {node.children?.map((child) => (
        <NodeItem key={child.id} node={child} depth={depth + 1} />
      ))}
    </>
  )
}
