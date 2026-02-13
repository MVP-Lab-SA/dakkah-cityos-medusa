// @ts-nocheck
import { MedusaService } from "@medusajs/framework/utils"
import ShippingRate from "./models/shipping-rate"
import CarrierConfig from "./models/carrier-config"

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

  async calculateShippingRate(data: {
    originZone: string
    destinationZone: string
    weight: number
    dimensions?: { length: number; width: number; height: number }
    shippingMethod?: string
  }) {
    if (data.weight <= 0) {
      throw new Error("Weight must be a positive number")
    }

    const rates = await this.listShippingRates({
      origin_zone: data.originZone,
      destination_zone: data.destinationZone,
      is_active: true,
    })

    const rateList = Array.isArray(rates) ? rates : [rates].filter(Boolean)

    const applicableRates = rateList.filter((rate) => {
      if (data.weight < rate.min_weight || data.weight > rate.max_weight) {
        return false
      }
      if (data.shippingMethod && rate.service_type !== data.shippingMethod) {
        return false
      }
      return true
    })

    if (applicableRates.length === 0) {
      throw new Error("No shipping rates available for the given parameters")
    }

    let volumetricWeight = data.weight
    if (data.dimensions) {
      volumetricWeight = Math.max(
        data.weight,
        (data.dimensions.length * data.dimensions.width * data.dimensions.height) / 5000
      )
    }

    return applicableRates.map((rate) => ({
      rate_id: rate.id,
      carrier_name: rate.carrier_name,
      service_type: rate.service_type,
      total_cost: Number(rate.base_rate) + Number(rate.per_kg_rate) * volumetricWeight,
      estimated_days_min: rate.estimated_days_min,
      estimated_days_max: rate.estimated_days_max,
    }))
  }

  async createShipment(orderId: string, data: {
    carrierId: string
    trackingNumber: string
    items: Array<{ productId: string; quantity: number }>
    estimatedDelivery?: Date
  }) {
    if (!data.trackingNumber) {
      throw new Error("Tracking number is required")
    }

    if (!data.items || data.items.length === 0) {
      throw new Error("At least one item is required for a shipment")
    }

    const carrier = await this.retrieveCarrierConfig(data.carrierId)

    if (!carrier.is_active) {
      throw new Error("Selected carrier is not currently active")
    }

    const shipment = await (this as any).createShippingRates({
      order_id: orderId,
      carrier_id: data.carrierId,
      carrier_name: carrier.carrier_name,
      tracking_number: data.trackingNumber,
      items: JSON.stringify(data.items),
      estimated_delivery: data.estimatedDelivery || null,
      status: "created",
      created_at: new Date(),
    })

    return shipment
  }

  async updateTrackingStatus(shipmentId: string, status: string, location?: string, notes?: string) {
    const validStatuses = ["created", "picked_up", "in_transit", "out_for_delivery", "delivered", "failed", "returned"]
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(", ")}`)
    }

    const shipment = await this.retrieveShippingRate(shipmentId)

    const updated = await (this as any).updateShippingRates({
      id: shipmentId,
      status,
      current_location: location || null,
      last_update_notes: notes || null,
      last_updated_at: new Date(),
    })

    return updated
  }

  async getShipmentTimeline(shipmentId: string) {
    const shipment = await this.retrieveShippingRate(shipmentId)

    const timeline: Array<{ status: string; location?: string; notes?: string; timestamp: Date }> = []

    if (shipment.created_at) {
      timeline.push({ status: "created", timestamp: new Date(shipment.created_at) })
    }
    if (shipment.last_updated_at) {
      timeline.push({
        status: shipment.status || "updated",
        location: shipment.current_location || undefined,
        notes: shipment.last_update_notes || undefined,
        timestamp: new Date(shipment.last_updated_at),
      })
    }

    return {
      shipment_id: shipmentId,
      carrier_name: shipment.carrier_name,
      tracking_number: shipment.tracking_number,
      current_status: shipment.status,
      timeline,
    }
  }

  async estimateDeliveryDate(originZone: string, destinationZone: string, method: string) {
    const rates = await this.listShippingRates({
      origin_zone: originZone,
      destination_zone: destinationZone,
      service_type: method,
      is_active: true,
    })

    const rateList = Array.isArray(rates) ? rates : [rates].filter(Boolean)

    if (rateList.length === 0) {
      throw new Error("No shipping rates found for the given route and method")
    }

    const rate = rateList[0]
    const now = new Date()
    const minDate = new Date(now)
    minDate.setDate(minDate.getDate() + Number(rate.estimated_days_min || 1))
    const maxDate = new Date(now)
    maxDate.setDate(maxDate.getDate() + Number(rate.estimated_days_max || 7))

    return {
      origin_zone: originZone,
      destination_zone: destinationZone,
      method,
      estimated_min_date: minDate,
      estimated_max_date: maxDate,
      estimated_days_min: rate.estimated_days_min,
      estimated_days_max: rate.estimated_days_max,
    }
  }
}

export default ShippingExtensionModuleService
