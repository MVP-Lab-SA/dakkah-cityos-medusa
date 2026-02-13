import { MedusaService } from "@medusajs/framework/utils"
import Node from "./models/node.js"

const HIERARCHY_RULES: Record<string, { depth: number; parent: string | null; children: string | null }> = {
  CITY: { depth: 0, parent: null, children: "DISTRICT" },
  DISTRICT: { depth: 1, parent: "CITY", children: "ZONE" },
  ZONE: { depth: 2, parent: "DISTRICT", children: "FACILITY" },
  FACILITY: { depth: 3, parent: "ZONE", children: "ASSET" },
  ASSET: { depth: 4, parent: "FACILITY", children: null },
}

class NodeModuleService extends MedusaService({
  Node,
}) {
  async listNodesByTenant(tenantId: string, filters?: Record<string, any>) {
    const query: Record<string, any> = { tenant_id: tenantId, ...filters }
    const nodes = await this.listNodes(query) as any
    return Array.isArray(nodes) ? nodes : [nodes].filter(Boolean)
  }

  async listChildren(nodeId: string) {
    const nodes = await this.listNodes({ parent_id: nodeId }) as any
    return Array.isArray(nodes) ? nodes : [nodes].filter(Boolean)
  }

  async getAncestors(nodeId: string) {
    const ancestors: any[] = []
    let currentId: string | null = nodeId

    while (currentId) {
      const node = await this.retrieveNode(currentId) as any
      if (!node) break

      ancestors.unshift(node)
      currentId = node.parent_id || null
    }

    ancestors.pop()

    return ancestors
  }

  async getDescendants(nodeId: string) {
    const descendants: any[] = []
    const queue: string[] = [nodeId]

    while (queue.length > 0) {
      const currentId = queue.shift()!
      const children = await this.listChildren(currentId)

      for (const child of children) {
        descendants.push(child)
        queue.push(child.id)
      }
    }

    return descendants
  }

  async getBreadcrumbs(nodeId: string) {
    const ancestors = await this.getAncestors(nodeId)
    const node = await this.retrieveNode(nodeId) as any

    if (node) {
      ancestors.push(node)
    }

    return ancestors.map((n: any) => ({
      id: n.id,
      name: n.name,
      slug: n.slug,
      type: n.type,
      depth: n.depth,
    }))
  }

  validateParentChild(parentType: string, childType: string): boolean {
    const parentRule = HIERARCHY_RULES[parentType]
    if (!parentRule) return false

    return parentRule.children === childType
  }

  async createNodeWithValidation(data: {
    tenant_id: string
    name: string
    slug: string
    code?: string
    type: string
    parent_id?: string | null
    location?: Record<string, any> | null
    status?: string
    metadata?: Record<string, any> | null
  }) {
    const rule = HIERARCHY_RULES[data.type]
    if (!rule) {
      throw new Error(`Invalid node type: ${data.type}`)
    }

    if (rule.parent && !data.parent_id) {
      throw new Error(`Node type ${data.type} requires a parent of type ${rule.parent}`)
    }

    if (!rule.parent && data.parent_id) {
      throw new Error(`Node type ${data.type} cannot have a parent`)
    }

    let breadcrumbs: any[] | null = null

    if (data.parent_id) {
      const parent = await this.retrieveNode(data.parent_id) as any
      if (!parent) {
        throw new Error(`Parent node ${data.parent_id} not found`)
      }

      if (!this.validateParentChild(parent.type, data.type)) {
        throw new Error(
          `Invalid hierarchy: ${parent.type} cannot be parent of ${data.type}. ` +
          `Expected parent type: ${rule.parent}`
        )
      }

      if (parent.tenant_id !== data.tenant_id) {
        throw new Error("Parent node belongs to a different tenant")
      }

      const parentBreadcrumbs = await this.getBreadcrumbs(data.parent_id)
      breadcrumbs = [
        ...parentBreadcrumbs,
        { name: data.name, slug: data.slug, type: data.type, depth: rule.depth },
      ]
    } else {
      breadcrumbs = [{ name: data.name, slug: data.slug, type: data.type, depth: rule.depth }]
    }

    return await (this as any).createNodes({
      tenant_id: data.tenant_id,
      name: data.name,
      slug: data.slug,
      code: data.code || null,
      type: data.type,
      depth: rule.depth,
      parent_id: data.parent_id || null,
      breadcrumbs,
      location: data.location || null,
      status: data.status || "active",
      metadata: data.metadata || null,
    })
  }
}

export default NodeModuleService
