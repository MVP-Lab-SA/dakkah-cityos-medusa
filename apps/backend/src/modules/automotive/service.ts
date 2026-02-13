import { MedusaService } from "@medusajs/framework/utils"
import VehicleListing from "./models/vehicle-listing"
import TestDrive from "./models/test-drive"
import VehicleService from "./models/vehicle-service"
import PartCatalog from "./models/part-catalog"
import TradeIn from "./models/trade-in"

class AutomotiveModuleService extends MedusaService({
  VehicleListing,
  TestDrive,
  VehicleService,
  PartCatalog,
  TradeIn,
}) {
  /** Submit a vehicle for trade-in evaluation */
  async submitTradeIn(vehicleId: string, customerId: string, description?: string): Promise<any> {
    if (!vehicleId || !customerId) {
      throw new Error("Vehicle ID and customer ID are required")
    }

    const existing = await this.listTradeIns({
      vehicle_listing_id: vehicleId,
      customer_id: customerId,
      status: ["pending", "evaluating"],
    }) as any
    const list = Array.isArray(existing) ? existing : [existing].filter(Boolean)
    if (list.length > 0) {
      throw new Error("A trade-in request already exists for this vehicle")
    }

    return await (this as any).createTradeIns({
      vehicle_listing_id: vehicleId,
      customer_id: customerId,
      description: description || null,
      status: "pending",
      submitted_at: new Date(),
    })
  }

  /** Evaluate a trade-in vehicle and provide an offer */
  async evaluateVehicle(tradeInId: string, evaluatedValue?: number): Promise<any> {
    const tradeIn = await this.retrieveTradeIn(tradeInId) as any

    if (tradeIn.status !== "pending") {
      throw new Error("Trade-in is not pending evaluation")
    }

    let value = evaluatedValue
    if (!value && tradeIn.vehicle_listing_id) {
      const vehicle = await this.retrieveVehicleListing(tradeIn.vehicle_listing_id) as any
      const basePrice = Number(vehicle.price || 0)
      const year = Number(vehicle.year || new Date().getFullYear())
      const age = new Date().getFullYear() - year
      const depreciation = Math.max(0.3, 1 - (age * 0.1))
      value = Math.round(basePrice * depreciation * 0.85)
    }

    return await (this as any).updateTradeIns({
      id: tradeInId,
      status: "evaluated",
      evaluated_value: value || 0,
      evaluated_at: new Date(),
    })
  }

  /** Publish a vehicle listing */
  async publishListing(vehicleId: string): Promise<any> {
    const vehicle = await this.retrieveVehicleListing(vehicleId) as any

    if (vehicle.status === "published") {
      throw new Error("Vehicle listing is already published")
    }

    if (!vehicle.price) {
      throw new Error("Vehicle must have a price before publishing")
    }

    return await (this as any).updateVehicleListings({
      id: vehicleId,
      status: "published",
      published_at: new Date(),
    })
  }

  /** Calculate monthly financing payment for a vehicle */
  async calculateFinancing(price: number, downPayment: number, termMonths: number, annualRate?: number): Promise<{
    monthlyPayment: number
    totalPayment: number
    totalInterest: number
    loanAmount: number
  }> {
    if (price <= 0 || downPayment < 0 || termMonths <= 0) {
      throw new Error("Invalid financing parameters")
    }

    if (downPayment >= price) {
      throw new Error("Down payment cannot exceed or equal the price")
    }

    const loanAmount = price - downPayment
    const rate = (annualRate || 5.9) / 100 / 12

    const monthlyPayment = rate > 0
      ? (loanAmount * rate * Math.pow(1 + rate, termMonths)) / (Math.pow(1 + rate, termMonths) - 1)
      : loanAmount / termMonths

    const totalPayment = monthlyPayment * termMonths
    const totalInterest = totalPayment - loanAmount

    return {
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalPayment: Math.round(totalPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      loanAmount,
    }
  }
}

export default AutomotiveModuleService
