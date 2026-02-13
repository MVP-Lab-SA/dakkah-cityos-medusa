import { MedusaService } from "@medusajs/framework/utils"
import ParkingZone from "./models/parking-zone"
import ParkingSession from "./models/parking-session"
import ShuttleRoute from "./models/shuttle-route"
import RideRequest from "./models/ride-request"

class ParkingModuleService extends MedusaService({
  ParkingZone,
  ParkingSession,
  ShuttleRoute,
  RideRequest,
}) {
  /**
   * Find available parking spots in a zone for a given vehicle type.
   */
  async findAvailableSpots(zoneId: string, vehicleType: string): Promise<any[]> {
    const zone = await this.retrieveParkingZone(zoneId)
    const activeSessions = await this.listParkingSessions({
      zone_id: zoneId,
      status: "active",
    }) as any
    const sessionList = Array.isArray(activeSessions) ? activeSessions : [activeSessions].filter(Boolean)
    const totalCapacity = Number(zone.total_spots || 0)
    const occupied = sessionList.length
    const availableCount = Math.max(0, totalCapacity - occupied)
    return Array.from({ length: availableCount }, (_, i) => ({
      zoneId,
      spotNumber: occupied + i + 1,
      vehicleType,
      available: true,
    }))
  }

  /**
   * Reserve a parking spot for a vehicle with a specified duration in hours.
   */
  async reserveSpot(spotId: string, vehicleId: string, duration: number): Promise<any> {
    const fee = await this.calculateFee(spotId, duration)
    const session = await (this as any).createParkingSessions({
      zone_id: spotId,
      vehicle_id: vehicleId,
      status: "active",
      started_at: new Date(),
      duration_hours: duration,
      fee: fee.totalFee,
    })
    return session
  }

  /**
   * Calculate the parking fee for a spot based on duration in hours.
   */
  async calculateFee(spotId: string, duration: number): Promise<{ hourlyRate: number; totalFee: number }> {
    const zone = await this.retrieveParkingZone(spotId)
    const hourlyRate = Number(zone.hourly_rate || 5)
    const totalFee = hourlyRate * duration
    return { hourlyRate, totalFee }
  }

  /**
   * Release a parking spot by ending the active session.
   */
  async releaseSpot(spotId: string): Promise<any> {
    const sessions = await this.listParkingSessions({
      zone_id: spotId,
      status: "active",
    }) as any
    const sessionList = Array.isArray(sessions) ? sessions : [sessions].filter(Boolean)
    if (sessionList.length === 0) {
      throw new Error("No active session found for this spot")
    }
    return await (this as any).updateParkingSessions({
      id: sessionList[0].id,
      status: "completed",
      ended_at: new Date(),
    })
  }
}

export default ParkingModuleService
