import { MedusaService } from "@medusajs/framework/utils"
import SalesChannelMapping from "./models/sales-channel-mapping.js"

class ChannelModuleService extends MedusaService({
  SalesChannelMapping,
}) {
  async getChannelForRequest(tenantId: string, channelType: string, nodeId?: string) {
    const query: Record<string, any> = {
      tenant_id: tenantId,
      channel_type: channelType,
      is_active: true,
    }

    if (nodeId) {
      query.node_id = nodeId
    }

    const mappings = await this.listSalesChannelMappings(query) as any
    const list = Array.isArray(mappings) ? mappings : [mappings].filter(Boolean)

    if (list.length > 0) {
      return list[0]
    }

    if (nodeId) {
      const fallback = await this.listSalesChannelMappings({
        tenant_id: tenantId,
        channel_type: channelType,
        is_active: true,
      }) as any
      const fallbackList = Array.isArray(fallback) ? fallback : [fallback].filter(Boolean)
      return fallbackList.find((m: any) => !m.node_id) || fallbackList[0] || null
    }

    return null
  }

  async listChannels(tenantId: string) {
    const mappings = await this.listSalesChannelMappings({
      tenant_id: tenantId,
    }) as any
    return Array.isArray(mappings) ? mappings : [mappings].filter(Boolean)
  }

  async createMapping(data: {
    tenant_id: string
    channel_type: string
    name: string
    description?: string
    medusa_sales_channel_id?: string
    node_id?: string
    config?: Record<string, any>
    is_active?: boolean
    metadata?: Record<string, any>
  }) {
    return await (this as any).createSalesChannelMappings({
      tenant_id: data.tenant_id,
      channel_type: data.channel_type,
      name: data.name,
      description: data.description || null,
      medusa_sales_channel_id: data.medusa_sales_channel_id || null,
      node_id: data.node_id || null,
      config: data.config || null,
      is_active: data.is_active !== undefined ? data.is_active : true,
      metadata: data.metadata || null,
    })
  }
}

export default ChannelModuleService
