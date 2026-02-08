export const NODE_TYPES = ["CITY", "DISTRICT", "ZONE", "FACILITY", "ASSET"] as const
export type NodeType = typeof NODE_TYPES[number]

export const NODE_HIERARCHY_RULES: Record<NodeType, {
  depth: number
  allowedParents: NodeType[]
  allowedChildren: NodeType[]
  isRoot: boolean
  isLeaf: boolean
}> = {
  CITY: { depth: 0, allowedParents: [], allowedChildren: ["DISTRICT"], isRoot: true, isLeaf: false },
  DISTRICT: { depth: 1, allowedParents: ["CITY"], allowedChildren: ["ZONE"], isRoot: false, isLeaf: false },
  ZONE: { depth: 2, allowedParents: ["DISTRICT"], allowedChildren: ["FACILITY"], isRoot: false, isLeaf: false },
  FACILITY: { depth: 3, allowedParents: ["ZONE"], allowedChildren: ["ASSET"], isRoot: false, isLeaf: false },
  ASSET: { depth: 4, allowedParents: ["FACILITY"], allowedChildren: [], isRoot: false, isLeaf: true },
}

export function isValidParentType(parentType: NodeType, childType: NodeType): boolean {
  return NODE_HIERARCHY_RULES[childType].allowedParents.includes(parentType)
}

export function getValidParentTypes(nodeType: NodeType): NodeType[] {
  return NODE_HIERARCHY_RULES[nodeType].allowedParents
}

export function canBeRoot(nodeType: NodeType): boolean {
  return NODE_HIERARCHY_RULES[nodeType].isRoot
}

export function getNodeTypeDepth(nodeType: NodeType): number {
  return NODE_HIERARCHY_RULES[nodeType].depth
}

export function getAncestorTypes(nodeType: NodeType): NodeType[] {
  const depth = getNodeTypeDepth(nodeType)
  return NODE_TYPES.filter(t => NODE_HIERARCHY_RULES[t].depth < depth)
}

export function getDescendantTypes(nodeType: NodeType): NodeType[] {
  const depth = getNodeTypeDepth(nodeType)
  return NODE_TYPES.filter(t => NODE_HIERARCHY_RULES[t].depth > depth)
}
