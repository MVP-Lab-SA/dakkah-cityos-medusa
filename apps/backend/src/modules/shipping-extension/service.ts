// @ts-nocheck
import { MedusaService } from "@medusajs/framework/utils"
import ShippingRate from "./models/shipping-rate.js"
import CarrierConfig from "./models/carrier-config.js"

class ShippingExtensionModuleService extends MedusaService({
  ShippingRate,
  CarrierConfig,
}) {
  async getRatesForShipment(
    tenantId: string,
    data: { weight: number; originZone?: string; destZone?: string }
  ) {
    const rates = await this.listShippingRates({
      tenant_id: tenantId,
      is_active: true,
    })

    const rateList = Array.isArray(rates) ? rates : [rates].filter(Boolean)

    return rateList.filter((rate) => {
      if (data.weight < rate.min_weight || data.weight > rate.max_weight) {
        return false
      }
      if (data.originZone && rate.origin_zone && rate.origin_zone !== data.originZone) {
        return false
      }
      if (data.destZone && rate.destination_zone && rate.destination_zone !== data.destZone) {
        return false
      }
      return true
    })
  }

  async getActiveCarriers(tenantId: string) {
    const carriers = await this.listCarrierConfigs({
      tenant_id: tenantId,
      is_active: true,
    })

    return Array.isArray(carriers) ? carriers : [carriers].filter(Boolean)
  }

  async calculateShippingCost(rateId: string, weight: number) {
    const rate = await this.retrieveShippingRate(rateId)

    const baseRate = Number(rate.base_rate)
    const perKgRate = Number(rate.per_kg_rate)
    const totalCost = baseRate + perKgRate * weight

    return {
      rate_id: rateId,
      carrier_name: rate.carrier_name,
      service_type: rate.service_type,
      weight,
      base_rate: baseRate,
      per_kg_rate: perKgRate,
      total_cost: totalCost,
      estimated_days_min: rate.estimated_days_min,
      estimated_days_max: rate.estimated_days_max,
    }
  }

  async getTrackingUrl(carrierCode: string, trackingNumber: string) {
    const carriers = await this.listCarrierConfigs({
      carrier_code: carrierCode,
    })

    const list = Array.isArray(carriers) ? carriers : [carriers].filter(Boolean)
    if (list.length === 0) {
      throw new Error(`Carrier with code "${carrierCode}" not found`)
    }

    const carrier = list[0]
    if (!carrier.tracking_url_template) {
      return null
    }

    return carrier.tracking_url_template.replace("{{tracking_number}}", trackingNumber)
  }
}

export default ShippingExtensionModuleService
