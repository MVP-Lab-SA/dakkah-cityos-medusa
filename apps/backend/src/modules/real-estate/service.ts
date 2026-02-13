import { MedusaService } from "@medusajs/framework/utils"
import PropertyListing from "./models/property-listing"
import ViewingAppointment from "./models/viewing-appointment"
import LeaseAgreement from "./models/lease-agreement"
import PropertyDocument from "./models/property-document"
import PropertyValuation from "./models/property-valuation"
import AgentProfile from "./models/agent-profile"

class RealEstateModuleService extends MedusaService({
  PropertyListing,
  ViewingAppointment,
  LeaseAgreement,
  PropertyDocument,
  PropertyValuation,
  AgentProfile,
}) {
  /** Publish a property listing */
  async publishProperty(propertyId: string): Promise<any> {
    const property = await this.retrievePropertyListing(propertyId) as any

    if (property.status === "published") {
      throw new Error("Property is already published")
    }

    if (!property.price && !property.rent_price) {
      throw new Error("Property must have a price before publishing")
    }

    return await (this as any).updatePropertyListings({
      id: propertyId,
      status: "published",
      published_at: new Date(),
    })
  }

  /** Schedule a viewing appointment for a property */
  async scheduleViewing(propertyId: string, viewerId: string, date: Date, notes?: string): Promise<any> {
    if (date < new Date()) {
      throw new Error("Viewing date must be in the future")
    }

    const property = await this.retrievePropertyListing(propertyId) as any
    if (property.status !== "published") {
      throw new Error("Property is not available for viewings")
    }

    const existing = await this.listViewingAppointments({
      property_listing_id: propertyId,
      viewer_id: viewerId,
      status: "scheduled",
    }) as any
    const list = Array.isArray(existing) ? existing : [existing].filter(Boolean)
    if (list.length > 0) {
      throw new Error("You already have a scheduled viewing for this property")
    }

    return await (this as any).createViewingAppointments({
      property_listing_id: propertyId,
      viewer_id: viewerId,
      scheduled_date: date,
      status: "scheduled",
      notes: notes || null,
    })
  }

  /** Make an offer on a property */
  async makeOffer(propertyId: string, buyerId: string, amount: number, conditions?: string): Promise<any> {
    if (amount <= 0) {
      throw new Error("Offer amount must be greater than zero")
    }

    const property = await this.retrievePropertyListing(propertyId) as any
    if (property.status !== "published") {
      throw new Error("Property is not accepting offers")
    }

    const valuation = await (this as any).createPropertyValuations({
      property_listing_id: propertyId,
      buyer_id: buyerId,
      offered_amount: amount,
      asking_price: Number(property.price || property.rent_price || 0),
      difference_percentage: property.price
        ? Math.round(((amount - Number(property.price)) / Number(property.price)) * 10000) / 100
        : 0,
      conditions: conditions || null,
      status: "pending",
      submitted_at: new Date(),
    })

    return valuation
  }

  /** Calculate monthly mortgage payment */
  async calculateMortgage(price: number, downPayment: number, termYears: number, annualRate?: number): Promise<{
    monthlyPayment: number
    totalPayment: number
    totalInterest: number
    loanAmount: number
  }> {
    if (price <= 0 || downPayment < 0 || termYears <= 0) {
      throw new Error("Invalid mortgage parameters")
    }

    if (downPayment >= price) {
      throw new Error("Down payment cannot exceed or equal the price")
    }

    const loanAmount = price - downPayment
    const rate = (annualRate || 6.5) / 100 / 12
    const payments = termYears * 12

    const monthlyPayment = rate > 0
      ? (loanAmount * rate * Math.pow(1 + rate, payments)) / (Math.pow(1 + rate, payments) - 1)
      : loanAmount / payments

    const totalPayment = monthlyPayment * payments
    const totalInterest = totalPayment - loanAmount

    return {
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalPayment: Math.round(totalPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      loanAmount,
    }
  }
}

export default RealEstateModuleService
