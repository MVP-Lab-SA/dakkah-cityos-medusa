// @ts-nocheck
import { MedusaService } from "@medusajs/framework/utils"
import ReservationHold from "./models/reservation-hold"
import StockAlert from "./models/stock-alert"
import WarehouseTransfer from "./models/warehouse-transfer"

class InventoryExtensionModuleService extends MedusaService({
  ReservationHold,
  StockAlert,
  WarehouseTransfer,
}) {
  async createReservation(data: {
    tenant_id: string
    variant_id: string
    quantity: number
    reason: "cart" | "checkout" | "order" | "manual"
    reference_id?: string
    expires_at?: Date
    metadata?: Record<string, unknown>
  }) {
    return await (this as any).createReservationHolds({
      tenant_id: data.tenant_id,
      variant_id: data.variant_id,
      quantity: data.quantity,
      reason: data.reason,
      reference_id: data.reference_id || null,
      expires_at: data.expires_at || null,
      status: "active",
      metadata: data.metadata || null,
    })
  }

  async releaseReservation(reservationId: string) {
    const reservation = await this.retrieveReservationHold(reservationId)

    if (reservation.status !== "active") {
      throw new Error("Reservation is not active")
    }

    await (this as any).updateReservationHolds({
      id: reservationId,
      status: "released",
    })

    return await this.retrieveReservationHold(reservationId)
  }

  async expireReservations() {
    const reservations = await this.listReservationHolds({
      status: "active",
    })

    const list = Array.isArray(reservations) ? reservations : [reservations].filter(Boolean)
    const now = new Date()
    const expired = []

    for (const reservation of list) {
      if (reservation.expires_at && new Date(reservation.expires_at) <= now) {
        await (this as any).updateReservationHolds({
          id: reservation.id,
          status: "expired",
        })
        expired.push(reservation.id)
      }
    }

    return { expired_count: expired.length, expired_ids: expired }
  }

  async checkStockAlerts(
    tenantId: string,
    variantId: string,
    currentQty: number
  ) {
    const existingAlerts = await this.listStockAlerts({
      tenant_id: tenantId,
      variant_id: variantId,
      is_resolved: false,
    })

    const alertList = Array.isArray(existingAlerts) ? existingAlerts : [existingAlerts].filter(Boolean)

    for (const alert of alertList) {
      await (this as any).updateStockAlerts({
        id: alert.id,
        current_quantity: currentQty,
      })
    }

    const createdAlerts = []

    if (currentQty === 0) {
      const hasOosAlert = alertList.some((a) => a.alert_type === "out_of_stock")
      if (!hasOosAlert) {
        const alert = await (this as any).createStockAlerts({
          tenant_id: tenantId,
          variant_id: variantId,
          product_id: "",
          alert_type: "out_of_stock",
          threshold: 0,
          current_quantity: currentQty,
          is_resolved: false,
        })
        createdAlerts.push(alert)
      }
    }

    return createdAlerts
  }

  async getActiveAlerts(
    tenantId: string,
    options?: { alertType?: string; resolved?: boolean }
  ) {
    const filters: Record<string, any> = { tenant_id: tenantId }

    if (options?.alertType) {
      filters.alert_type = options.alertType
    }
    if (options?.resolved !== undefined) {
      filters.is_resolved = options.resolved
    } else {
      filters.is_resolved = false
    }

    const alerts = await this.listStockAlerts(filters)
    return Array.isArray(alerts) ? alerts : [alerts].filter(Boolean)
  }

  async initiateTransfer(data: {
    tenant_id: string
    source_location_id: string
    destination_location_id: string
    transfer_number: string
    items?: any[]
    notes?: string
    initiated_by?: string
    metadata?: Record<string, unknown>
  }) {
    return await (this as any).createWarehouseTransfers({
      tenant_id: data.tenant_id,
      source_location_id: data.source_location_id,
      destination_location_id: data.destination_location_id,
      transfer_number: data.transfer_number,
      status: "draft",
      items: data.items || [],
      notes: data.notes || null,
      initiated_by: data.initiated_by || null,
      metadata: data.metadata || null,
    })
  }

  async updateTransferStatus(
    transferId: string,
    status: "draft" | "pending" | "in_transit" | "received" | "cancelled"
  ) {
    const transfer = await this.retrieveWarehouseTransfer(transferId)

    const updateData: Record<string, any> = {
      id: transferId,
      status,
    }

    if (status === "in_transit") {
      updateData.shipped_at = new Date()
    }
    if (status === "received") {
      updateData.received_at = new Date()
    }

    await (this as any).updateWarehouseTransfers(updateData)

    return await this.retrieveWarehouseTransfer(transferId)
  }
}

export default InventoryExtensionModuleService
