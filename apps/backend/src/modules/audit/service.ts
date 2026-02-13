import { MedusaService } from "@medusajs/framework/utils"
import AuditLog from "./models/audit-log.js"

class AuditModuleService extends MedusaService({
  AuditLog,
}) {
  async logAction(data: {
    tenantId: string
    action: string
    resourceType: string
    resourceId: string
    actorId?: string
    actorRole?: string
    actorEmail?: string
    nodeId?: string
    changes?: Record<string, any>
    previousValues?: Record<string, any>
    newValues?: Record<string, any>
    ipAddress?: string
    userAgent?: string
    dataClassification?: "public" | "internal" | "confidential" | "restricted"
    metadata?: Record<string, any>
  }) {
    return await (this as any).createAuditLogs({
      tenant_id: data.tenantId,
      action: data.action,
      resource_type: data.resourceType,
      resource_id: data.resourceId,
      actor_id: data.actorId || null,
      actor_role: data.actorRole || null,
      actor_email: data.actorEmail || null,
      node_id: data.nodeId || null,
      changes: data.changes || null,
      previous_values: data.previousValues || null,
      new_values: data.newValues || null,
      ip_address: data.ipAddress || null,
      user_agent: data.userAgent || null,
      data_classification: data.dataClassification || "internal",
      metadata: data.metadata || null,
    })
  }

  async getAuditTrail(
    tenantId: string,
    filters: {
      resourceType?: string
      resourceId?: string
      actorId?: string
      action?: string
      from?: Date
      to?: Date
      dataClassification?: string
    } = {}
  ) {
    const query: Record<string, any> = { tenant_id: tenantId }

    if (filters.resourceType) {
      query.resource_type = filters.resourceType
    }
    if (filters.resourceId) {
      query.resource_id = filters.resourceId
    }
    if (filters.actorId) {
      query.actor_id = filters.actorId
    }
    if (filters.action) {
      query.action = filters.action
    }
    if (filters.dataClassification) {
      query.data_classification = filters.dataClassification
    }

    const logs = await this.listAuditLogs(query) as any
    let result = Array.isArray(logs) ? logs : [logs].filter(Boolean)

    if (filters.from || filters.to) {
      result = result.filter((log: any) => {
        const createdAt = new Date(log.created_at)
        if (filters.from && createdAt < filters.from) return false
        if (filters.to && createdAt > filters.to) return false
        return true
      })
    }

    return result
  }

  async getResourceHistory(tenantId: string, resourceType: string, resourceId: string) {
    const logs = await this.listAuditLogs({
      tenant_id: tenantId,
      resource_type: resourceType,
      resource_id: resourceId,
    }) as any

    return Array.isArray(logs) ? logs : [logs].filter(Boolean)
  }
}

export default AuditModuleService
