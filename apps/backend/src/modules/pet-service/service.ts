import { MedusaService } from "@medusajs/framework/utils"
import PetProfile from "./models/pet-profile"
import GroomingBooking from "./models/grooming-booking"
import VetAppointment from "./models/vet-appointment"
import PetProduct from "./models/pet-product"

class PetServiceModuleService extends MedusaService({
  PetProfile,
  GroomingBooking,
  VetAppointment,
  PetProduct,
}) {
  /**
   * Book a grooming session for a pet with a specific service type and date.
   */
  async bookGrooming(petId: string, serviceType: string, date: Date): Promise<any> {
    const pet = await this.retrievePetProfile(petId)
    const booking = await (this as any).createGroomingBookings({
      pet_id: petId,
      service_type: serviceType,
      scheduled_date: date,
      status: "scheduled",
      pet_name: pet.name,
      owner_id: pet.owner_id,
    })
    return booking
  }

  /**
   * Check veterinarian availability on a specific date.
   */
  async getVetAvailability(vetId: string, date: Date): Promise<{ available: boolean; slots: any[] }> {
    const appointments = await this.listVetAppointments({
      vet_id: vetId,
      status: ["scheduled", "confirmed"],
    }) as any
    const list = Array.isArray(appointments) ? appointments : [appointments].filter(Boolean)
    const targetDate = new Date(date).toDateString()
    const dayAppointments = list.filter((a: any) =>
      new Date(a.appointment_date).toDateString() === targetDate
    )
    const maxDaily = 8
    return {
      available: dayAppointments.length < maxDaily,
      slots: dayAppointments,
    }
  }

  /**
   * Get a comprehensive pet profile including grooming history and vet appointments.
   */
  async getPetProfile(petId: string): Promise<any> {
    const pet = await this.retrievePetProfile(petId)
    const groomings = await this.listGroomingBookings({ pet_id: petId }) as any
    const vetVisits = await this.listVetAppointments({ pet_id: petId }) as any
    return {
      ...pet,
      groomingHistory: Array.isArray(groomings) ? groomings : [groomings].filter(Boolean),
      vetHistory: Array.isArray(vetVisits) ? vetVisits : [vetVisits].filter(Boolean),
    }
  }

  /**
   * Track vaccination records for a pet from their vet appointment history.
   */
  async trackVaccinations(petId: string): Promise<any[]> {
    const appointments = await this.listVetAppointments({
      pet_id: petId,
      visit_type: "vaccination",
    }) as any
    const list = Array.isArray(appointments) ? appointments : [appointments].filter(Boolean)
    return list.map((a: any) => ({
      id: a.id,
      vaccine: a.notes || a.treatment,
      date: a.appointment_date,
      nextDue: a.next_due_date,
    }))
  }
}

export default PetServiceModuleService
