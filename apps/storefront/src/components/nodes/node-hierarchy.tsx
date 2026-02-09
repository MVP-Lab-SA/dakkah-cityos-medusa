import { useState, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { queryKeys } from "@/lib/utils/query-keys"
import type { Node, NodeType } from "@/lib/types/cityos"

interface NodeHierarchyProps {
  tenantId: string
  initialNodes: Node[]
}

const NODE_ICONS: Record<NodeType, string> = {
  CITY: "🏙️",
  DISTRICT: "🏘️",
  ZONE: "📍",
  FACILITY: "🏢",
  ASSET: "📦",
}

const NODE_COLORS: Record<NodeType, { bg: string; text: string; border: string }> = {
  CITY: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  DISTRICT: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  ZONE: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  FACILITY: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  ASSET: { bg: "bg-zinc-50", text: "text-zinc-700", border: "border-zinc-200" },
}

const STATUS_COLORS: Record<string, { dot: string; text: string }> = {
  active: { dot: "bg-green-500", text: "text-green-700" },
  inactive: { dot: "bg-red-400", text: "text-red-600" },
  maintenance: { dot: "bg-amber-400", text: "text-amber-600" },
  archived: { dot: "bg-zinc-400", text: "text-zinc-500" },
}

const HIERARCHY_ORDER: NodeType[] = ["CITY", "DISTRICT", "ZONE", "FACILITY", "ASSET"]

function useNodeChildren(tenantId: string, parentId: string | null) {
  return useQuery({
    queryKey: queryKeys.nodes.children(tenantId, parentId || ""),
    queryFn: async () => {
      const response = await sdk.client.fetch<{ nodes: Node[] }>(
        `/store/cityos/nodes?tenant_id=${encodeURIComponent(tenantId)}&parent_id=${encodeURIComponent(parentId || "")}`,
        { credentials: "include" }
      )
      return response.nodes || []
    },
    enabled: !!tenantId && !!parentId,
    staleTime: 2 * 60 * 1000,
  })
}

function NodeBreadcrumbs({ breadcrumbs }: { breadcrumbs?: Array<{ id?: string; name: string; slug: string; type?: string; depth?: number }> }) {
  if (!breadcrumbs || breadcrumbs.length === 0) return null

  return (
    <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1.5 flex-wrap">
      {breadcrumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span className="text-zinc-300">›</span>}
          <span>{crumb.name}</span>
        </span>
      ))}
    </div>
  )
}

function NodeCard({
  node,
  tenantId,
  depth,
}: {
  node: Node
  tenantId: string
  depth: number
}) {
  const [expanded, setExpanded] = useState(false)
  const [selected, setSelected] = useState(false)
  const isLeaf = node.type === "ASSET"

  const { data: children, isLoading: childrenLoading } = useNodeChildren(
    tenantId,
    expanded ? node.id : null
  )

  const colors = NODE_COLORS[node.type] || NODE_COLORS.ASSET
  const icon = NODE_ICONS[node.type] || "📄"
  const statusStyle = STATUS_COLORS[node.status] || STATUS_COLORS.active

  const handleToggle = useCallback(() => {
    if (!isLeaf) {
      setExpanded((prev) => !prev)
    }
    setSelected((prev) => !prev)
  }, [isLeaf])

  return (
    <div style={{ marginLeft: `${depth * 16}px` }}>
      <button
        onClick={handleToggle}
        className={`w-full text-left group rounded-lg border transition-all duration-200 ${
          selected
            ? `${colors.bg} ${colors.border}`
            : "bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-sm"
        } ${depth === 0 ? "mb-2" : "mb-1.5"}`}
      >
        <div className="flex items-center gap-3 p-3 sm:p-4">
          {!isLeaf && (
            <span
              className={`text-zinc-400 transition-transform duration-200 text-sm flex-shrink-0 ${
                expanded ? "rotate-90" : ""
              }`}
            >
              ▶
            </span>
          )}
          {isLeaf && <span className="w-[14px] flex-shrink-0" />}

          <span className="text-xl flex-shrink-0">{icon}</span>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-zinc-900 truncate">{node.name}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${colors.bg} ${colors.text}`}
              >
                {node.type}
              </span>
              <span className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                <span className={`text-[11px] ${statusStyle.text} capitalize`}>{node.status}</span>
              </span>
            </div>

            {node.code && (
              <span className="text-xs text-zinc-400 font-mono">{node.code}</span>
            )}

            {selected && node.breadcrumbs && (
              <NodeBreadcrumbs breadcrumbs={node.breadcrumbs} />
            )}

            {selected && node.location && (
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
                <span>📌</span>
                <span>
                  {[node.location.address, node.location.city, node.location.country]
                    .filter(Boolean)
                    .join(", ")}
                </span>
                {node.location.lat && node.location.lng && (
                  <span className="text-zinc-400">
                    ({node.location.lat.toFixed(4)}, {node.location.lng.toFixed(4)})
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="transition-all duration-200">
          {childrenLoading ? (
            <div style={{ marginLeft: `${(depth + 1) * 16}px` }} className="py-3">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <span className="animate-spin">⏳</span>
                <span>Loading children...</span>
              </div>
            </div>
          ) : children && children.length > 0 ? (
            children.map((child) => (
              <NodeCard
                key={child.id}
                node={child}
                tenantId={tenantId}
                depth={depth + 1}
              />
            ))
          ) : (
            <div
              style={{ marginLeft: `${(depth + 1) * 16}px` }}
              className="py-2 text-sm text-zinc-400 italic"
            >
              No child nodes
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function NodeHierarchy({ tenantId, initialNodes }: NodeHierarchyProps) {
  const { data: fetchedNodes, isLoading } = useQuery({
    queryKey: queryKeys.nodes.root(tenantId),
    queryFn: async () => {
      const response = await sdk.client.fetch<{ nodes: Node[] }>(
        `/store/cityos/nodes?tenant_id=${encodeURIComponent(tenantId)}&type=CITY`,
        { credentials: "include" }
      )
      return response.nodes || []
    },
    enabled: !!tenantId,
    initialData: initialNodes.length > 0 ? initialNodes : undefined,
    staleTime: 2 * 60 * 1000,
  })

  const nodes = fetchedNodes || initialNodes
  const typeCounts = nodes.reduce<Record<string, number>>((acc, node) => {
    acc[node.type] = (acc[node.type] || 0) + 1
    return acc
  }, {})

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-zinc-900">Node Hierarchy</h1>
        <p className="mt-2 text-zinc-500">
          Explore the organizational structure: City → District → Zone → Facility → Asset
        </p>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-6">
        {HIERARCHY_ORDER.map((type) => {
          const colors = NODE_COLORS[type]
          return (
            <div
              key={type}
              className={`flex flex-col items-center p-2 sm:p-3 rounded-lg border ${colors.bg} ${colors.border}`}
            >
              <span className="text-lg sm:text-xl">{NODE_ICONS[type]}</span>
              <span className={`text-[10px] sm:text-xs font-semibold mt-1 ${colors.text}`}>
                {type}
              </span>
              {typeCounts[type] !== undefined && (
                <span className="text-xs text-zinc-500 mt-0.5">{typeCounts[type]}</span>
              )}
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 p-4 sm:p-6">
        {isLoading ? (
          <div className="text-center py-12">
            <span className="text-4xl mb-4 block animate-spin">⏳</span>
            <h3 className="text-lg font-medium text-zinc-700">Loading nodes...</h3>
          </div>
        ) : nodes.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-4xl mb-4 block">🏙️</span>
            <h3 className="text-lg font-medium text-zinc-700">No nodes configured</h3>
            <p className="text-sm text-zinc-400 mt-1">
              This tenant does not have any nodes in its hierarchy yet.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {nodes.map((node) => (
              <NodeCard key={node.id} node={node} tenantId={tenantId} depth={0} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
