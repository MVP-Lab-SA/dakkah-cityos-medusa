import { MedusaService } from "@medusajs/framework/utils"
import TravelProperty from "./models/property"
import RoomType from "./models/room-type"
import Room from "./models/room"
import TravelReservation from "./models/reservation"
import RatePlan from "./models/rate-plan"
import GuestProfile from "./models/guest-profile"
import Amenity from "./models/amenity"

class TravelModuleService extends MedusaService({
  TravelProperty,
  RoomType,
  Room,
  TravelReservation,
  RatePlan,
  GuestProfile,
  Amenity,
}) {
  /**
   * Search available travel packages by destination, date range, and number of travelers.
   */
  async searchPackages(destination: string, dates: { checkIn: Date; checkOut: Date }, travelers: number): Promise<any[]> {
    const properties = await this.listTravelProperties({ location: destination }) as any
    const list = Array.isArray(properties) ? properties : [properties].filter(Boolean)
    const results: any[] = []
    for (const property of list) {
      const rooms = await this.listRoomTypes({ property_id: property.id }) as any
      const roomList = Array.isArray(rooms) ? rooms : [rooms].filter(Boolean)
      const available = roomList.filter((r: any) => (r.max_occupancy || 2) >= travelers)
      if (available.length > 0) {
        results.push({ property, availableRoomTypes: available })
      }
    }
    return results
  }

  /**
   * Book a travel package (property/room) for a customer. Creates a reservation record.
   */
  async bookPackage(packageId: string, customerId: string): Promise<any> {
    const roomType = await this.retrieveRoomType(packageId)
    const available = await this.checkAvailability(packageId, new Date())
    if (!available) {
      throw new Error("Package is not available for the selected dates")
    }
    const reservation = await (this as any).createTravelReservations({
      room_type_id: packageId,
      guest_id: customerId,
      status: "confirmed",
      booked_at: new Date(),
    })
    return reservation
  }

  /**
   * Calculate the total price for a package based on travelers count and optional add-ons.
   */
  async calculatePrice(packageId: string, travelers: number, addons: string[] = []): Promise<{ basePrice: number; addonTotal: number; total: number }> {
    const roomType = await this.retrieveRoomType(packageId)
    const basePrice = Number(roomType.base_price || 0) * travelers
    let addonTotal = 0
    for (const addonId of addons) {
      const amenity = await this.retrieveAmenity(addonId)
      addonTotal += Number(amenity.price || 0)
    }
    return { basePrice, addonTotal, total: basePrice + addonTotal }
  }

  /**
   * Check if a specific room type / package is available on a given date.
   */
  async checkAvailability(packageId: string, date: Date): Promise<boolean> {
    const rooms = await this.listRooms({ room_type_id: packageId, status: "available" }) as any
    const roomList = Array.isArray(rooms) ? rooms : [rooms].filter(Boolean)
    return roomList.length > 0
  }
}

export default TravelModuleService
